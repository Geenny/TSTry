export default class VO {
    constructor(data = null) {
        // Данные из источника
        this.data = {};
        this.parse(data);
    }
    /**
     * Разбор данных @VO
     * @param data
     */
    parse(data) {
        if (!data)
            data = {};
        Object.assign(this.data, data);
        for (let key in data) {
            if (!this.hasOwnProperty(key))
                continue;
            this[key] = data[key];
        }
    }
}
//# sourceMappingURL=VO.js.map