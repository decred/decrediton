// @flow
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import GetStarted from "./GetStarted";
import {createWalletGoBackNewSeed, createWalletExistingToggle, discoverAddressAttempt, openWalletAttempt, startRpcRequestFunc, versionCheckAction } from "../../actions/WalletLoaderActions";

function mapStateToProps(state) {
  return {
    address: state.grpc.address,
    port: state.grpc.port,

    // Version checking
    getVersionServiceAttempt: state.version.getVersionServiceAttempt,
    getVersionServiceError: state.version.getVersionServiceError,
    requiredVersion: state.version.requiredVersion,
    versionInvalid: state.version.versionInvalid,
    versionInvalidError: state.version.versionInvalidError,

    stepIndex: state.walletLoader.stepIndex,
    // Step 0
    getLoaderRequestAttempt: state.walletLoader.getLoaderRequestAttempt,
    loader: state.walletLoader.loader,
    getLoaderError: state.walletLoader.getLoaderError,
    // Step 1
    walletExistRequestAttempt: state.walletLoader.walletExistRequestAttempt,
    walletExistResponse: state.walletLoader.walletExistResponse,
    walletExistError: state.walletLoader.walletExistError,
    // Step 2
    walletCreateRequestAttempt: state.walletLoader.walletCreateRequestAttempt,
    walletCreateResponse: state.walletLoader.walletCreateResponse,
    walletCreateError: state.walletLoader.walletCreateError,
    walletOpenRequestAttempt: state.walletLoader.walletOpenRequestAttempt,
    walletOpenResponse: state.walletLoader.walletOpenResponse,
    walletOpenError: state.walletLoader.walletOpenError,
    // Step 3
    startRpcRequestAttempt: state.walletLoader.startRpcRequestAttempt,
    startRpcError: state.walletLoader.startRpcError,
    startRpcResponse: state.walletLoader.startRpcResponse,
    startRpcRequestFunc: state.walletLoader.startRpcRequest,
    // Step 4
    discoverAddressRequestAttempt: state.walletLoader.discoverAddressRequestAttempt,
    discoverAddressError: state.walletLoader.discoverAddressError,
    discoverAddressResponse: state.walletLoader.discoverAddressResponse,
    // Step 5
    neededBlocks: state.walletLoader.neededBlocks,
    fetchHeadersRequestAttempt: state.walletLoader.fetchHeadersRequestAttempt,
    fetchHeadersError: state.walletLoader.fetchHeadersError,
    fetchHeadersResponse: state.walletLoader.fetchHeadersResponse,
    // Step 6
    subscribeBlockNtfnsRequestAttempt: state.walletLoader.subscribeBlockNtfnsRequestAttempt,
    subscribeBlockNtfnsError: state.walletLoader.subscribeBlockNtfnsError,
    subscribeBlockNtfnsResponse: state.walletLoader.subscribeBlockNtfnsResponse,
    // Final Prep
    walletService: state.grpc.walletService,
    getWalletServiceRequestAttempt: state.grpc.getWalletServiceRequestAttempt,
    getWalletServiceError: state.grpc.getWalletServiceError,
    loadActiveDataFiltersRequestAttempt: state.control.loadActiveDataFiltersRequestAttempt,
    loadActiveDataFiltersError: state.control.loadActiveDataFiltersError,
    loadActiveDataFiltersResponse: state.control.loadActiveDataFiltersResponse,

    // SeedService
    generateRandomSeedRequestAttempt: state.seedService.generateRandomSeedRequestAttempt,
    generateRandomSeedResponse: state.seedService.generateRandomSeedResponse,
    generateRandomSeedError: state.seedService.generateRandomSeedError,

    decodeSeedRequestAttempt: state.seedService.decodeSeedRequestAttempt,
    decodeSeedResponse: state.seedService.decodeSeedResponse,
    decodeSeedError: state.seedService.decodeSeedError,

    createWalletExisting: state.walletLoader.createWalletExisting,
    confirmNewSeed: state.walletLoader.confirmNewSeed,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({createWalletGoBackNewSeed, createWalletExistingToggle, discoverAddressAttempt, openWalletAttempt, startRpcRequestFunc, versionCheckAction}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(GetStarted);
