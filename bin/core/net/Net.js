import EventDispathcer from '../../framework/core/events/EventDispathcer';
import NetEvent from './events/NetEvent';
import Request from './Request';
import { RequestState } from './state/RequestState';
import HTTPRequest from './HTTPRequest';
import Log from '../../framework/core/utils/Log';
import NetVO from './vo/NetVO';
export default class Net extends EventDispathcer {
    constructor(netVO = null) {
        super();
        this._requests = [];
        this._sends = [];
        this.initVO(netVO);
        this.initInstance();
    }
    /**
     *
     */
    static get instance() {
        if (!Net._instance) {
            let net = new Net();
            net.init();
            Net._instance = net;
        }
        return Net._instance;
    }
    /**
     * Отправка запроса через статический метод
     */
    static send(requestVO) {
        return Net.instance.send(requestVO);
    }
    // GET/SET
    get inited() { return this._inited; }
    get state() { return this._state; }
    set state(value) { this._state = value; }
    get enable() { return this._enable; }
    set enable(value) { this._enable = value; }
    get vo() { return this._vo; }
    get length() { return this._requests.length; }
    get sendCount() { return this.vo.sendCount; }
    get sendLength() { return this._sends.length; }
    get sendCan() { return this.sendLength < this.sendCount && this.sendIsNotSended; }
    get sendIsNotSended() {
        for (let request of this._requests) {
            if (request.state == RequestState.NONE || request.state == RequestState.WAIT)
                return true;
        }
        return false;
    }
    // Init
    init() {
        this._inited = true;
        this._enable = true;
        this.dispatchEvent(new NetEvent(NetEvent.INIT, this));
    }
    initVO(vo) {
        if (!vo)
            vo = new NetVO();
        this._vo = vo;
    }
    initInstance() {
        if (Net._instance)
            return;
        Net._instance = this;
    }
    // SEND
    /**
     * Отправка запроса
     * @param requestVO
     */
    send(requestVO) {
        if (!this.enable)
            return null;
        let request = this.createRequest(requestVO);
        request.state = RequestState.WAIT;
        this.next();
        return request;
    }
    //
    createRequest(requestVO) {
        let request = new Request(this.requestVOSet(requestVO));
        this._requests.push(request);
        return request;
    }
    next() {
        if (!this.enable)
            return;
        while (this.sendCan)
            this.sendNextProcess();
    }
    getNext() {
        for (let i = 0; i < this.length; i++) {
            let request = this._requests[i];
            if (request.state != RequestState.NONE && request.state != RequestState.WAIT)
                continue;
            return request;
        }
        return null;
    }
    sendNextProcess() {
        let request = this.getNext();
        if (!request)
            return null;
        return this.requestSend(request);
    }
    requestSend(request) {
        let xhttp = this.xmlHttpRequestInstanceGet();
        xhttp.addEventListener("readystatechange", this.onStatus);
        xhttp.addEventListener("loadstart", this.onOpen);
        xhttp.addEventListener("load", this.onLoad);
        xhttp.addEventListener("progress", this.onProgress);
        xhttp.addEventListener("error", this.onError);
        xhttp.addEventListener("abort", this.onAbort);
        xhttp.request = request;
        request.httpRequest = xhttp;
        request.state = RequestState.PROCESS;
        this._sends.push(request);
        xhttp.open(request.method, request.url, true);
        xhttp.send(request.data);
        return request;
    }
    requestVOSet(requestVO) {
        requestVO.secure = requestVO.secure || this.vo.secure;
        requestVO.server = requestVO.server || this.vo.server;
        requestVO.method = requestVO.method || this.vo.method;
        requestVO.headers = requestVO.headers || this.vo.headers;
        requestVO.retry = requestVO.retry || this.vo.retry;
        return requestVO;
    }
    onStatus(event) {
        Log.log(event);
    }
    onOpen(event) {
        Log.log(event);
    }
    onLoad(event) {
        Log.log(event);
    }
    onProgress(event) {
        Log.log(event);
    }
    onError(event) {
        Log.log(event);
    }
    onAbort(event) {
        Log.log(event);
    }
    /**
     * XMLHttpRequest
     */
    xmlHttpRequestInstanceGet() {
        // code for modern browsers
        //if ( window[ "XMLHttpRequest" ] ) return new XMLHttpRequest();
        // code for old IE browsers
        //return new ActiveXObject("Microsoft.XMLHTTP");
        return new HTTPRequest();
    }
}
//# sourceMappingURL=Net.js.map