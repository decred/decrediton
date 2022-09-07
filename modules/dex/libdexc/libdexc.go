package main

/*
#include <string.h>
*/
import "C"
import (
	"encoding/json"
	"fmt"
	"unsafe"
)

// CallData is the type sent for all golink calls.
type CallData struct {
	Function string          `json:"function"`
	Params   json.RawMessage `json:"params"`
}

func callError(s string, a ...interface{}) string {
	b, _ := json.Marshal(&struct {
		Error string `json:"error"`
	}{
		Error: fmt.Sprintf(s, a...),
	})
	return string(b)
}

var adapter = NewCoreAdapter()

// CallAlt executes the call and fills the given buffer with the return value of
// the function. The buffer MUST have enough room for the response.
//
//export CallAlt
func CallAlt(msg *C.char, res unsafe.Pointer, resSz uint32, writtenSz *uint32) uint8 {
	const (
		RET_OK            uint8 = 0
		RET_UNMARSHAL_ERR       = 1
		RET_CALL_ERR            = 2
		RET_RESSZ_ERR           = 3
	)

	jsonStr := C.GoString(msg)
	cd := new(CallData)

	var resStr string
	retVal := RET_OK

	err := json.Unmarshal([]byte(jsonStr), cd)
	if err != nil {
		resStr = callError("json Unmarshal error: %v", err)
		retVal = RET_UNMARSHAL_ERR
	} else {
		var err error
		resStr, err = adapter.run(cd)
		if err != nil {
			resStr = callError("%s error: %v", cd.Function, err)
			retVal = RET_CALL_ERR
		}
	}

	// Ensure the response string will fit in the res buffer.
	if uint32(len(resStr)) > resSz {
		resStr = callError("%s error: response buffer too short (need %d bytes)",
			cd.Function, len(resStr))
		// If still not enough bytes for the error msg, truncate.
		if uint32(len(resStr)) > resSz {
			resStr = resStr[:resSz]
		}
		retVal = RET_RESSZ_ERR
	}

	// If there is response data, copy it to the res buffer.
	if len(resStr) > 0 {
		resStart := unsafe.Pointer(&([]byte(resStr)[0]))
		C.memcpy(res, resStart, C.size_t(len(resStr)))
		*writtenSz = uint32(len(resStr))
	}
	return retVal
}

func main() {}
