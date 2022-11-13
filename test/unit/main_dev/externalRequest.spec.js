import * as ext from "../../../app/main_dev/externalRequests";
import * as con from "../../../app/config";
import {
  onBeforeSendHeadersListener,
  onHeadersReceivedListener
} from "../../mocks/electronMock";
import {
  EXTERNALREQUEST_DEX,
  EXTERNALREQUEST_NETWORK_STATUS,
  EXTERNALREQUEST_STAKEPOOL_LISTING,
  EXTERNALREQUEST_UPDATE_CHECK,
  EXTERNALREQUEST_POLITEIA,
  EXTERNALREQUEST_DCRDATA,
  EXTERNALREQUEST_TREZOR_BRIDGE,
  ALLOWED_EXTERNAL_REQUESTS,
  ALLOWED_VSP_HOSTS
} from "constants";
import {
  POLITEIA_URL_TESTNET,
  POLITEIA_URL_MAINNET
} from "../../../app/middleware/politeiaapi";
import { cloneDeep } from "fp";

const externalRequests = ext;
const logger = {};
const config = con;
let mockGlobalCfgGet;
let mockGlobalCfgSet;

const testDefaultAllowedExternalRequests = [
  EXTERNALREQUEST_NETWORK_STATUS,
  EXTERNALREQUEST_STAKEPOOL_LISTING,
  EXTERNALREQUEST_UPDATE_CHECK,
  EXTERNALREQUEST_DCRDATA,
  EXTERNALREQUEST_DEX,
  EXTERNALREQUEST_POLITEIA,
  EXTERNALREQUEST_TREZOR_BRIDGE
];

const testDefaultAllowedVSPHosts = ["host-1", "http://host-2"];
const testOnBeforeSendHeadersDetails = {
  url: "test-url",
  method: "test-method",
  requestHeaders: {
    testKey: "test-key"
  }
};
const testOnHeadersReceivedDetails = {
  url: "test-url",
  statusLine: "test-statusline",
  responseHeaders: {
    testKey: "test-key"
  }
};
const mockOnBeforeSendHeadersCallback = jest.fn(() => {});
const mockOnHeadersReceivedCallback = jest.fn(() => {});

beforeEach(() => {
  logger.log = jest.fn(() => {});
  mockGlobalCfgGet = jest.fn((key) => {
    switch (key) {
      case ALLOWED_EXTERNAL_REQUESTS:
        return testDefaultAllowedExternalRequests;
      case ALLOWED_VSP_HOSTS:
        return testDefaultAllowedVSPHosts;
    }
  });
  mockGlobalCfgSet = jest.fn(() => {});
  config.getGlobalCfg = jest.fn(() => ({
    get: mockGlobalCfgGet,
    set: mockGlobalCfgSet
  }));
  Object.defineProperty(process, "env", {
    value: {
      NODE_ENV: "not-development"
    }
  });
});

test("test installSessionHandlers - call a not allowed url", () => {
  externalRequests.installSessionHandlers(logger);

  onBeforeSendHeadersListener(
    cloneDeep(testOnBeforeSendHeadersDetails),
    mockOnBeforeSendHeadersCallback
  );
  expect(mockOnBeforeSendHeadersCallback).toHaveBeenCalledWith({
    cancel: true,
    requestHeaders: testOnBeforeSendHeadersDetails.requestHeaders
  });
});

test("test installSessionHandlers - call a allowed url", () => {
  externalRequests.installSessionHandlers(logger);

  // call an allowed url
  onBeforeSendHeadersListener(
    {
      ...cloneDeep(testOnBeforeSendHeadersDetails),
      url: `${testDefaultAllowedVSPHosts[0]}/api/v3/vspinfo`
    },
    mockOnBeforeSendHeadersCallback
  );
  expect(mockOnBeforeSendHeadersCallback).toHaveBeenLastCalledWith({
    cancel: false,
    requestHeaders: testOnBeforeSendHeadersDetails.requestHeaders
  });
});

test("test installSessionHandlers - call trezor", () => {
  externalRequests.installSessionHandlers(logger);

  onBeforeSendHeadersListener(
    {
      ...cloneDeep(testOnBeforeSendHeadersDetails),
      url: "http://127.0.0.1:21325/"
    },
    mockOnBeforeSendHeadersCallback
  );
  expect(mockOnBeforeSendHeadersCallback).toHaveBeenLastCalledWith({
    cancel: false,
    requestHeaders: {
      ...cloneDeep(testOnBeforeSendHeadersDetails.requestHeaders),
      Origin: "https://dummy-origin-to-fool-trezor-bridge.trezor.io"
    }
  });
});

test("test installSessionHandlers - called an arbitrary url, headers received in not a dev env", () => {
  externalRequests.installSessionHandlers(logger);

  onHeadersReceivedListener(
    cloneDeep(testOnHeadersReceivedDetails),
    mockOnHeadersReceivedCallback
  );
  expect(mockOnHeadersReceivedCallback).toHaveBeenLastCalledWith({
    responseHeaders: testOnHeadersReceivedDetails.responseHeaders,
    statusLine: testOnHeadersReceivedDetails.statusLine
  });
});

test("test installSessionHandlers - called politeia testnet url, headers received in dev env", () => {
  Object.defineProperty(process, "env", {
    value: {
      NODE_ENV: "development"
    }
  });
  externalRequests.installSessionHandlers(logger);

  onHeadersReceivedListener(
    cloneDeep({
      ...testOnHeadersReceivedDetails,
      url: POLITEIA_URL_TESTNET,

      responseHeaders: {
        ...cloneDeep(testOnHeadersReceivedDetails.responseHeaders),
        "Access-Control-Allow-Origin": "this-should-be-deleted"
      }
    }),
    mockOnHeadersReceivedCallback
  );
  expect(mockOnHeadersReceivedCallback).toHaveBeenLastCalledWith({
    responseHeaders: {
      ...cloneDeep(testOnHeadersReceivedDetails.responseHeaders),
      "Access-Control-Allow-Origin": "http://localhost:3000"
    },
    statusLine: testOnHeadersReceivedDetails.statusLine
  });
});

test("test installSessionHandlers - called politeia mainnet url, headers received in dev env, received OPTIONS method", () => {
  Object.defineProperty(process, "env", {
    value: {
      NODE_ENV: "development"
    }
  });
  externalRequests.installSessionHandlers(logger);

  onHeadersReceivedListener(
    cloneDeep({
      ...testOnHeadersReceivedDetails,
      url: POLITEIA_URL_MAINNET,
      responseHeaders: {
        ...cloneDeep(testOnHeadersReceivedDetails.responseHeaders),
        "Access-Control-Allow-Origin": "this-should-be-deleted"
      },
      method: "OPTIONS"
    }),
    mockOnHeadersReceivedCallback
  );
  expect(mockOnHeadersReceivedCallback).toHaveBeenLastCalledWith({
    responseHeaders: {
      ...cloneDeep(testOnHeadersReceivedDetails.responseHeaders),
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Headers": "Content-Type"
    },
    statusLine: "OK"
  });
});

test("test installSessionHandlers - called an allowed VSP url, headers received in dev env", () => {
  Object.defineProperty(process, "env", {
    value: {
      NODE_ENV: "development"
    }
  });
  externalRequests.installSessionHandlers(logger);

  onHeadersReceivedListener(
    cloneDeep({
      ...testOnHeadersReceivedDetails,
      url: `${testDefaultAllowedVSPHosts[1]}/api/v3/vspinfo`,
      responseHeaders: {
        ...cloneDeep(testOnHeadersReceivedDetails.responseHeaders),
        "Access-Control-Allow-Origin": "this-should-be-deleted"
      }
    }),
    mockOnHeadersReceivedCallback
  );
  expect(mockOnHeadersReceivedCallback).toHaveBeenLastCalledWith({
    responseHeaders: {
      ...cloneDeep(testOnHeadersReceivedDetails.responseHeaders),
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Headers": "Content-Type, VSP-Client-Signature"
    },
    statusLine: "OK"
  });
});

test("test installSessionHandlers - called an app.html url, headers received in not a dev env", () => {
  externalRequests.installSessionHandlers(logger);

  onHeadersReceivedListener(
    cloneDeep({
      ...testOnHeadersReceivedDetails,
      url: "app.html"
    }),
    mockOnHeadersReceivedCallback
  );
  expect(mockOnHeadersReceivedCallback).toHaveBeenLastCalledWith({
    responseHeaders: {
      ...cloneDeep(testOnHeadersReceivedDetails.responseHeaders),
      "Content-Security-Policy":
        "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src data: 'self'; connect-src https:; "
    },
    statusLine: testOnHeadersReceivedDetails.statusLine
  });
});

test("test installSessionHandlers - called an app.html url, headers received in dev env", () => {
  Object.defineProperty(process, "env", {
    value: {
      NODE_ENV: "development"
    }
  });
  externalRequests.installSessionHandlers(logger);

  onHeadersReceivedListener(
    cloneDeep({
      ...testOnHeadersReceivedDetails,
      url: "app.html"
    }),
    mockOnHeadersReceivedCallback
  );
  expect(mockOnHeadersReceivedCallback).toHaveBeenLastCalledWith({
    responseHeaders: {
      ...cloneDeep(testOnHeadersReceivedDetails.responseHeaders),
      "Content-Security-Policy":
        "default-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src data: 'self'; connect-src https: http:; "
    },
    statusLine: testOnHeadersReceivedDetails.statusLine
  });
});
