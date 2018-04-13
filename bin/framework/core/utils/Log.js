export default class Log {
    constructor() { }
    static log(...args) {
        if (!args || args.length == 0) {
            console.log(args);
            return;
        }
        let textarea = document.getElementById("text_for_log");
        textarea.innerHTML += "<br>" + args.toString();
        if (args.length == 1) {
            console.log(args[0]);
            return;
        }
        console.log(args);
    }
    static error(...args) {
        if (!args || args.length == 0)
            return;
    }
}
//# sourceMappingURL=Log.js.map