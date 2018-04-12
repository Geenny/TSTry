export default class AudioWrapperVO {
    constructor(data = null) {
        this.volume = 1;
        this.pan = 0;
        this.loop = false;
        this.playtimes = 1;
        this.src = null;
        this.channel = null;
        this.autodestroy = true;
        this.fadetime = 500; // Значение времени в течении которого будет выключен/включен звук через плавное затухание
        this.pauseback = 1000; // Значение времени возврата @audio.currentTime с при приостановке ( pause )
        this.progressMethod = null;
        this.endedMethod = null;
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
        this.channel = this.data.channel || this.channel;
        this.autodestroy = this.data.autodestroy || this.autodestroy;
        this.fadetime = this.data.fadetime || this.fadetime;
        this.pauseback = this.data.pauseback || this.pauseback;
        this.progressMethod = this.data.progressMethod || this.progressMethod;
        this.endedMethod = this.data.endedMethod || this.endedMethod;
    }
}
//# sourceMappingURL=AudioWrapperVO.js.map