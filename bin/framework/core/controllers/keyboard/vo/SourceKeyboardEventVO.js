export default class SourceKeyboardEventVO {
    constructor(event) {
        this.alt = false;
        this.ctrl = false;
        this.charCode = 0;
        this.keyCode = 0;
        this.parse(event);
    }
    parse(event) {
        if (!event)
            return;
        this.event = event;
        this.type = event.type;
        this.alt = event.altKey || false;
        this.ctrl = event.ctrlKey || false;
        this.charCode = event.charCode || 0;
        this.keyCode = event.keyCode || 0;
        this.key = event.key;
    }
}
//# sourceMappingURL=SourceKeyboardEventVO.js.map