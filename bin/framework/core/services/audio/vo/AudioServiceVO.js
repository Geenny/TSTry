export default class AudioServiceVO {
    constructor(data) {
        this.volume = 1; // 0-1, общее значение звукового уровня
        this.channels = []; // Списки каналов
        this.mute = false;
        this.progressCustom = true;
        this.progressTimeout = 1000; // ms
        this.data = {};
        this.parse(data);
    }
    parse(data) {
        if (!data)
            data = {};
        Object.assign(this.data, data);
        this.volume = this.data.volume || this.volume;
        this.channels = this.data.channels || this.channels;
    }
}
//# sourceMappingURL=AudioServiceVO.js.map