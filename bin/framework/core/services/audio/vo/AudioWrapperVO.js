export default class AudioWrapperVO {
    constructor(data = null) {
        this.volume = 1;
        this.pan = 0;
        this.loop = false;
        this.playtimes = 1;
        this.src = null;
        this.data = {};
        this.parse(data);
    }
    parse(data) {
        if (!data)
            data = {};
        Object.assign(this.data, data);
        this.volume = (this.data.hasOwnProperty("volume")) ? this.data.volume : this.volume;
        this.pan = (this.data.hasOwnProperty("pan")) ? this.data.pan : this.pan;
        this.loop = this.data.loop;
        this.playtimes = this.data.playtimes || this.playtimes;
        this.src = this.data.src || this.src;
    }
}
//# sourceMappingURL=AudioWrapperVO.js.map