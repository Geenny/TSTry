export default class WindowServiceVO {
    constructor(data = null) {
        this.sourceVOList = {}; // Список - объект с настройками WindowVO
        this.data = {};
        this.parse(data);
    }
    parse(data) {
        if (!data)
            data = {};
        this.data = data;
        for (let key in data) {
            if (!this.hasOwnProperty(key))
                continue;
            this[key] = data[key];
        }
    }
}
//# sourceMappingURL=WindowServiceVO.js.map