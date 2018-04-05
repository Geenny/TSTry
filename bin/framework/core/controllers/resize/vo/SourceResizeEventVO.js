export default class SourceResizeEventVO {
    constructor(event) {
        this.event = {};
        this.parse(event);
    }
    parse(event) {
        if (!event)
            event = {};
        this.event = event;
        this.type = event.type || this.type;
        this.isTrusted = event.isTrusted || this.isTrusted;
    }
}
//# sourceMappingURL=SourceResizeEventVO.js.map