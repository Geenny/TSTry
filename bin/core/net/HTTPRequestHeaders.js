export default class HTTPRequestHeaders {
    constructor(key, value = null) {
        this.parse(key, value);
    }
    parse(key, value = null) {
        this.key = key;
        this.value = (typeof value == "string") ? value : value.toString();
    }
    toString() {
        return this.key + "=" + this.value;
    }
    toValue() {
        return this.key + "=" + this.value;
    }
}
//# sourceMappingURL=HTTPRequestHeaders.js.map