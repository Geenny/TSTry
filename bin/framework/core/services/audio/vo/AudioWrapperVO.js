import Range from '../../../utils/Range';
export default class AudioWrapperVO {
    constructor(data = null) {
        this.channel = null;
        this.volume = 1;
        this.pan = 0;
        this.loop = false;
        this.playtimes = 1;
        this.src = null;
        this.speed = 1; // Скорость воспроизведения
        this.range = new Range(); // Период проигрывания, в секундах
        this.fadetime = 100; // Значение времени в течении которого будет выключен/включен звук через плавное затухание, миллисекунд
        this.pauseback = 500; // Значение времени возврата @audio.currentTime с при приостановке ( pause ), миллисекунд
        this.immortal = false; // Возможность быть убитым
        this.stoptime = Number.MAX_SAFE_INTEGER; // Время остановки проигрывания звука, миллисекунд
        this.killtime = 60000; // Время через которое звук можно уничтожить, миллисекунды
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
        this.range = this.getRange(this.data.range);
        this.channel = this.data.channel || this.channel;
        this.fadetime = this.data.fadetime || this.fadetime;
        this.pauseback = this.data.pauseback || this.pauseback;
        this.immortal = this.data.immortal || this.immortal;
        this.stoptime = this.data.stoptime || this.stoptime;
        this.killtime = this.data.killtime || this.killtime;
        this.progressMethod = this.data.progressMethod || this.progressMethod;
        this.endedMethod = this.data.endedMethod || this.endedMethod;
    }
    getRange(data) {
        let range;
        if (!data)
            return new Range();
        if (data instanceof Range) {
            range = data;
        }
        else if (data.start <= data.finish) {
            range = new Range(data.start, data.finish);
        }
        return range;
    }
}
//# sourceMappingURL=AudioWrapperVO.js.map