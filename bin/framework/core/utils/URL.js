export default class URL {
    /**
     * Составление URL строки
     * @param args
     */
    static compare(...args) {
        let url = "";
        for (let i = 0; args && i < args.length; i++) {
            let slash = (i > 0 && url.charAt(url.length - 1) != "/") ? "/" : "";
            let addition = (args[i] && typeof args[i] == "string") ? args[i] : "";
            url += slash + addition;
        }
        return url;
    }
}
//# sourceMappingURL=URL.js.map