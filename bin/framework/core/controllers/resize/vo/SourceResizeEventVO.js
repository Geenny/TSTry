export default class SourceResizeEventVO {
    constructor(event) {
        this.event = {};
        this.parse(event);
    }
    parse(event) {
        if (!event)
            return;
        this.event = event;
        this.type = event.type;
        this.isTrusted = event.isTrusted;
        this.width = event.srcElement.innerWidth;
        this.height = event.srcElement.innerHeight;
    }
}
//# sourceMappingURL=SourceResizeEventVO.js.map