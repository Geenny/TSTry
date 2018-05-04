import URL from "../../framework/core/utils/URL";
export default class Request {
    constructor(requestVO) {
        this.initVO(requestVO);
        this.init();
    }
    // GET/SET
    get state() { return this._state; }
    set state(value) { this._state = value; }
    get vo() { return this._vo; }
    get httpRequest() { return this._httpRequest; }
    set httpRequest(value) { this._httpRequest = value; }
    get status() { return this.vo.status; }
    set status(value) { this.vo.status = value; }
    // Общай ссылка
    get url() { return this.vo.url; }
    set url(value) { this.vo.url = value; }
    get method() { return this.vo.method; }
    // Раздельная ссылка из префикса безопасности, хоста и дополнительного суфикса ресурса
    get secure() { return this.vo.secure; }
    get server() { return this.vo.server; }
    get resource() { return this.vo.resource; }
    get data() { return this.vo.data; }
    // RequestVO
    init() {
        this.updateURL();
    }
    initVO(vo) {
        this._vo = vo;
        this.updateURL();
    }
    updateURL() {
        this.url = URL.compare(this.secure, this.server, this.resource);
    }
}
//# sourceMappingURL=Request.js.map