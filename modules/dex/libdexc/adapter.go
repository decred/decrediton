// This code is available on the terms of the project LICENSE.md file,
// also available online at https://blueoakcouncil.org/license/1.0.0.

package main

import "C"
import (
	"context"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sync"
	"sync/atomic"

	"decred.org/dcrdex/client/core"
	"decred.org/dcrdex/client/webserver"
	"decred.org/dcrdex/dex"
	"github.com/decred/slog"

	// Register the supported assets.
	_ "decred.org/dcrdex/client/asset/bch"
	_ "decred.org/dcrdex/client/asset/btc"
	_ "decred.org/dcrdex/client/asset/dcr"
	_ "decred.org/dcrdex/client/asset/doge"
	_ "decred.org/dcrdex/client/asset/ltc"
	_ "decred.org/dcrdex/client/asset/zec"
)

type callHandler func(json.RawMessage) (string, error)

func reply(thing interface{}) (string, error) {
	b, err := json.Marshal(thing)
	if err != nil {
		return "", err
	}
	return string(b), nil
}

func replyWithErrorCheck(thing interface{}, err error) (string, error) {
	if err != nil {
		return "", err
	}
	return reply(thing)
}

// CoreAdapter manages a Core instance and possibly a Server instance for
// a library user.
type CoreAdapter struct {
	ctx           context.Context
	kill          context.CancelFunc
	inited        uint32
	serverRunning uint32
	core          *core.Core
	webServer     *dex.ConnectionMaster
	wg            *sync.WaitGroup
	logMaker      *dex.LoggerMaker

	preInitMethods map[string]callHandler
	directMethods  map[string]callHandler
}

func NewCoreAdapter() *CoreAdapter {
	c := &CoreAdapter{}

	c.preInitMethods = map[string]callHandler{
		"IsInitialized": c.isInitialized,
	}

	c.directMethods = map[string]callHandler{
		// Some control functions.
		"startServer": c.startServer,
		"shutdown":    c.shutdown,
		// Pass-throughs to Core
		"Init":         c.init,
		"ExportSeed":   c.exportSeed,
		"CreateWallet": c.createWallet,
		"UpdateWallet": c.updateWallet,
		"User":         c.user,
		"PreRegister":  c.discoverAcct,
		"Register":     c.register,
		"Login":        c.login,
		"Logout":       c.logout,
		"DexConfig":    c.getDexConfig,
	}
	c.wg = new(sync.WaitGroup)

	return c
}

func (c *CoreAdapter) startCore(raw json.RawMessage) error {
	if !atomic.CompareAndSwapUint32(&c.inited, 0, 1) {
		return fmt.Errorf("already initialized")
	}

	form := new(struct {
		LogFilename string      `json:"logFilename"`
		DBPath      string      `json:"dbPath"`
		Net         dex.Network `json:"net"`
		LogLevel    slog.Level  `json:"logLevel"`
		Language    string      `json:"lang"`
	})
	if err := json.Unmarshal(raw, form); err != nil {
		return err
	}
	err := os.MkdirAll(filepath.Dir(form.DBPath), 0700)
	if err != nil {
		return err
	}

	fmt.Println(form.LogFilename, filepath.Dir(form.LogFilename))
	err = os.MkdirAll(filepath.Dir(form.LogFilename), 0700)
	if err != nil {
		return err
	}

	c.logMaker = initLogging(filepath.Dir(form.LogFilename), form.LogFilename, form.LogLevel.String(), false)
	logger := c.logMaker.Logger("DEXC")

	c.ctx, c.kill = context.WithCancel(context.Background())
	ccore, err := core.New(&core.Config{
		DBPath: form.DBPath,
		Net:    form.Net,
		Logger: logger,
		// Onion applies ONLY to .onion addresses, unlike TorProxy, which is
		// used for connections to all servers regardless of hostname. TODO:
		// expose an option for the user to set this and TorProxy.
		Onion:    "127.0.0.1:9050",
		Language: form.Language,
	})
	if err != nil {
		return fmt.Errorf("error creating client core: %v", err)
	}
	c.core = ccore

	c.wg.Add(1)
	go func() {
		defer c.wg.Done()
		ccore.Run(c.ctx)
	}()
	<-ccore.Ready()

	return nil
}

func (c *CoreAdapter) startServer(raw json.RawMessage) (string, error) {
	if !atomic.CompareAndSwapUint32(&c.serverRunning, 0, 1) {
		return "", fmt.Errorf("already initialized")
	}
	form := new(struct {
		WebAddr  string `json:"webaddr"`
		SiteDir  string `json:"sitedir"`
		Language string `json:"lang"`
	})
	if err := json.Unmarshal(raw, form); err != nil {
		return "", err
	}
	webSrv, err := webserver.New(&webserver.Config{
		Core:          c.core,
		Addr:          form.WebAddr,
		CustomSiteDir: form.SiteDir,
		Language:      form.Language,
		Logger:        c.logMaker.Logger("SRVR"),
		HttpProf:      false,
	})
	if err != nil {
		return "", fmt.Errorf("Error creating web server: %v", err)
	}
	cm := dex.NewConnectionMaster(webSrv)
	err = cm.Connect(c.ctx)
	if err != nil {
		return "", fmt.Errorf("Error starting web server: %v", err)
	}
	c.webServer = cm
	go func() {
		cm.Wait()
		atomic.StoreUint32(&c.serverRunning, 0)
	}()
	return "", nil
}

func (c *CoreAdapter) shutdown(json.RawMessage) (string, error) {
	c.kill()
	c.wg.Wait()
	c.webServer.Wait()
	closeFileLogger()
	atomic.SwapUint32(&c.inited, 0)
	return "", nil
}

func (c *CoreAdapter) handlers(funcName string) (callHandler, callHandler) {
	return c.preInitMethods[funcName], c.directMethods[funcName]
}

func (c *CoreAdapter) run(callData *CallData) (string, error) {
	if callData == nil {
		return "", fmt.Errorf("malformed call data")
	}
	switch preInitHandler, coreHandler := c.handlers(callData.Function); {
	case callData.Function == "__ping":
		res, err := json.Marshal(callData)
		return string(res), err
	case callData.Function == "startCore":
		return "", c.startCore(callData.Params)
	case preInitHandler != nil:
		return preInitHandler(callData.Params)
	case atomic.LoadUint32(&c.inited) == 0:
		return "", fmt.Errorf("not initialized")
	case c.core == nil:
		return "", fmt.Errorf("core not constructed. probably an initialization error")
	case coreHandler != nil:
		return coreHandler(callData.Params)
	}
	return "", fmt.Errorf("no method %q", callData.Function)
}

func (c *CoreAdapter) init(raw json.RawMessage) (string, error) {
	form := new(struct {
		Pass string `json:"pass"`
		Seed string `json:"seed"`
	})
	if err := json.Unmarshal(raw, form); err != nil {
		return "", err
	}
	if form.Seed != "" {
		seed, err := hex.DecodeString(form.Seed)
		if err != nil {
			return "", err
		}
		return "", c.core.InitializeClient([]byte(form.Pass), seed)
	}
	return "", c.core.InitializeClient([]byte(form.Pass), nil)

}

func (c *CoreAdapter) exportSeed(raw json.RawMessage) (string, error) {
	form := new(struct {
		Pass string `json:"pass"`
	})
	if err := json.Unmarshal(raw, form); err != nil {
		return "", err
	}
	return replyWithErrorCheck(c.core.ExportSeed([]byte(form.Pass)))

}

func (c *CoreAdapter) isInitialized(json.RawMessage) (string, error) {
	return reply(c.core.IsInitialized())
}

func (c *CoreAdapter) updateWallet(raw json.RawMessage) (string, error) {
	form := new(struct {
		AssetID uint32            `json:"assetID"`
		Config  map[string]string `json:"config"`
		Type    string            `json:"type"`
		Pass    string            `json:"pass"`
		AppPW   string            `json:"appPass"`
	})
	if err := json.Unmarshal(raw, form); err != nil {
		return "", err
	}
	return "", c.core.ReconfigureWallet([]byte(form.AppPW),
		[]byte(form.Pass),
		&core.WalletForm{
			AssetID: form.AssetID,
			Config:  form.Config,
			Type:    form.Type,
		},
	)
}

func (c *CoreAdapter) createWallet(raw json.RawMessage) (string, error) {
	form := new(struct {
		AssetID uint32            `json:"assetID"`
		Config  map[string]string `json:"config"`
		Type    string            `json:"type"`
		Pass    string            `json:"pass"`
		AppPW   string            `json:"appPass"`
	})
	if err := json.Unmarshal(raw, form); err != nil {
		return "", err
	}
	return "", c.core.CreateWallet([]byte(form.AppPW), []byte(form.Pass), &core.WalletForm{
		AssetID: form.AssetID,
		Config:  form.Config,
		Type:    form.Type,
	})
}

func (c *CoreAdapter) user(raw json.RawMessage) (string, error) {
	return reply(c.core.User())
}

func (c *CoreAdapter) getDexConfig(raw json.RawMessage) (string, error) {
	form := new(struct {
		Addr string `json:"addr"`
		Cert string `json:"cert"` // Not required if there is an entry for the server in the dcrdex/client/core/certs.go
	})
	if err := json.Unmarshal(raw, form); err != nil {
		return "", err
	}
	return replyWithErrorCheck(c.core.GetDEXConfig(form.Addr, []byte(form.Cert)))
}

func (c *CoreAdapter) register(raw json.RawMessage) (string, error) {
	form := new(core.RegisterForm)
	if err := json.Unmarshal(raw, form); err != nil {
		return "", err
	}
	return replyWithErrorCheck(c.core.Register(form))
}

// When restoring from seed with init/InitializeClient, it may be desirable to
// first attempt DEX account discovery without committing to a fee payment. This
// checks with the given DEX server if our account (a public key) is already
// registered. If it is, this creates the account in Core, returns true, and the
// caller should NOT call register. If it returns false, the user should be
// prompted to pay the registration fee as normal using the register method.
func (c *CoreAdapter) discoverAcct(raw json.RawMessage) (string, error) {
	form := new(struct {
		Addr  string `json:"addr"` // DEX host
		AppPW string `json:"appPass"`
		Cert  string `json:"cert"` // Not required if there is an entry for the server in the dcrdex/client/core/certs.go
	})
	if err := json.Unmarshal(raw, form); err != nil {
		return "", err
	}
	config, alreadyRegistered, err := c.core.DiscoverAccount(form.Addr, []byte(form.AppPW), []byte(form.Cert))
	// If alreadyRegistered == true, skip register. It's ready to go.
	if alreadyRegistered {
		return replyWithErrorCheck(alreadyRegistered, err)
	} else {
		return replyWithErrorCheck(config, err)
	}
}

func (c *CoreAdapter) login(raw json.RawMessage) (string, error) {
	form := new(struct {
		Pass string `json:"pass"`
	})
	if err := json.Unmarshal(raw, form); err != nil {
		return "", err
	}
	return replyWithErrorCheck(c.core.Login([]byte(form.Pass)))
}

func (c *CoreAdapter) logout(raw json.RawMessage) (string, error) {
	err := c.core.Logout()
	if err != nil {
		return "", err
	}
	return "", nil
}
