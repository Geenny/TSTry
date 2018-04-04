export default class SourceFocusEventVO {
    constructor(event) {
        this.parse(event);
    }
    parse(event) {
        if (!event)
            return;
        this.event = event;
        this.type = event.type;
    }
}
//# sourceMappingURL=SourceFocusEventVO.js.map