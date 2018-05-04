export var RequestState;
(function (RequestState) {
    RequestState[RequestState["NONE"] = 0] = "NONE";
    RequestState[RequestState["WAIT"] = 1] = "WAIT";
    RequestState[RequestState["PROCESS"] = 2] = "PROCESS";
    RequestState[RequestState["COMPLETE"] = 3] = "COMPLETE";
    RequestState[RequestState["ERROR"] = 4] = "ERROR";
})(RequestState || (RequestState = {}));
//# sourceMappingURL=RequestState.js.map