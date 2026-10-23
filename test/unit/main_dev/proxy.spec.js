import * as p from "../../../app/main_dev/proxy";
import { session } from "../../mocks/electronMock";
import * as con from "../../../app/config";
import { PROXY_TYPE, PROXY_LOCATION } from "constants/config";

import {
  PROXYTYPE_PAC,
  PROXYTYPE_HTTP,
  PROXYTYPE_SOCKS4,
  PROXYTYPE_SOCKS5
} from "constants";

const proxy = p;
const config = con;

let mockLog;
let mockGlobalCfgGet;
let mockGlobalCfgSet;
const logger = {};
const testProxyLocation = "test-proxy-location";

beforeEach(() => {
  mockLog = logger.log = jest.fn(() => {});
  mockGlobalCfgGet = jest.fn((key) => {
    switch (key) {
      case PROXY_TYPE:
        return PROXYTYPE_PAC;
      case PROXY_LOCATION:
        return testProxyLocation;
    }
  });
  mockGlobalCfgSet = jest.fn(() => {});
  config.getGlobalCfg = jest.fn(() => ({
    get: mockGlobalCfgGet,
    set: mockGlobalCfgSet
  }));
  session.defaultSession.setProxy.mockClear();
});

test("test setupProxy - no proxy has been set", async () => {
  mockGlobalCfgGet = jest.fn(() => {});
  await proxy.setupProxy(logger);
  expect(mockLog).toHaveBeenCalled();
  expect(session.defaultSession.setProxy).toHaveBeenCalledWith({
    pacScript: null,
    proxyRules: null,
    proxyBypassRules: null
  });
});

test("test setupProxy - proxy type is pac", async () => {
  await proxy.setupProxy(logger);
  expect(session.defaultSession.setProxy).toHaveBeenCalledWith({
    pacScript: testProxyLocation,
    proxyRules: null,
    proxyBypassRules: null
  });
});

test("test setupProxy - proxy type is http", async () => {
  mockGlobalCfgGet = jest.fn((key) => {
    switch (key) {
      case PROXY_TYPE:
        return PROXYTYPE_HTTP;
      case PROXY_LOCATION:
        return testProxyLocation;
    }
  });
  await proxy.setupProxy(logger);
  expect(session.defaultSession.setProxy).toHaveBeenCalledWith({
    pacScript: null,
    proxyRules: testProxyLocation,
    proxyBypassRules: null
  });
});

test("test setupProxy - proxy type is sock4", async () => {
  mockGlobalCfgGet = jest.fn((key) => {
    switch (key) {
      case PROXY_TYPE:
        return PROXYTYPE_SOCKS4;
      case PROXY_LOCATION:
        return testProxyLocation;
    }
  });
  await proxy.setupProxy(logger);
  expect(session.defaultSession.setProxy).toHaveBeenCalledWith({
    pacScript: null,
    proxyRules: `socks4://${testProxyLocation}`,
    proxyBypassRules: null
  });
});

test("test setupProxy - proxy type is sock5", async () => {
  mockGlobalCfgGet = jest.fn((key) => {
    switch (key) {
      case PROXY_TYPE:
        return PROXYTYPE_SOCKS5;
      case PROXY_LOCATION:
        return testProxyLocation;
    }
  });
  await proxy.setupProxy(logger);
  expect(session.defaultSession.setProxy).toHaveBeenCalledWith({
    pacScript: null,
    proxyRules: `socks5://${testProxyLocation}`,
    proxyBypassRules: null
  });
});

test("test setupProxy - failed: proxy type is unknown", async () => {
  const testUnknownProxyType = "unknown-proxy-type";
  mockGlobalCfgGet = jest.fn((key) => {
    switch (key) {
      case PROXY_TYPE:
        return testUnknownProxyType;
      case PROXY_LOCATION:
        return testProxyLocation;
    }
  });
  let catchedError;
  try {
    await proxy.setupProxy(logger);
  } catch (error) {
    catchedError = error;
  }
  expect(catchedError).toBe(`Unknown proxy type: ${testUnknownProxyType}`);
  expect(session.defaultSession.setProxy).not.toHaveBeenCalled();
});

test("test setupProxy - in dev mode", async () => {
  Object.defineProperty(process, "env", {
    value: {
      NODE_ENV: "development"
    }
  });
  mockGlobalCfgGet = jest.fn(() => {});
  await proxy.setupProxy(logger);
  expect(mockLog).toHaveBeenCalled();
  expect(session.defaultSession.setProxy).toHaveBeenCalledWith({
    pacScript: null,
    proxyRules: null,
    proxyBypassRules: "http://localhost:3000"
  });
});
