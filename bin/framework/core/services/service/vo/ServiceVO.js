export default class ServiceVO {
    constructor(data) {
        this.parse(data);
    }
    parse(data) {
        if (!data)
            return;
        this.data = data;
    }
}
//# sourceMappingURL=ServiceVO.js.map