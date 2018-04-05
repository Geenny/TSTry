import AudioWrapperVO from './vo/AudioWrapperVO';
import EventDispathcer from '../../events/EventDispathcer';
import AudioEvent from './events/AudioEvent';
export default class AudioWrapper extends EventDispathcer {
    constructor(vo) {
        super();
        this._playing = false;
        this.name = "";
        this.link = "";
        this.initVO(vo);
        this.init();
    }
    // GET/SET
    get audio() {
        if (!this._audio)
            this._audio = new Audio();
        return this._audio;
    }
    get muted() { return this.audio.muted; }
    set muted(value) { this.audio.muted = value; }
    get time() { return this.audio.currentTime; }
    set time(value) {
        this.audio.currentTime = value;
        this.dispatchEvent(new AudioEvent(AudioEvent.TIME_CHANGE, this));
    }
    get playtimes() { return this.vo.playtimes; }
    set playtimes(value) { this.vo.playtimes = value; }
    get volume() { return (this.channel) ? this.channel.volume : 1; }
    get src() { return (this.audio) ? this.audio.src : ""; }
    get duration() { return this.audio.duration; }
    get progress() { return this.time / this.duration; }
    // INIT
    init() {
        let audio = this.audio;
        audio.addEventListener("loadedmetadata", (event) => { this.onLoadedMetaData(); });
        audio.addEventListener("canplay", (event) => { this.onCanPlay(); });
        audio.addEventListener("canplaythrough", (event) => { this.onCanPlayThrough(); });
        audio.addEventListener("play", (event) => { this.onPlay(); });
        audio.addEventListener("playing", (event) => { this.onPlaying(); });
        audio.addEventListener("pause", (event) => { this.onPause(); });
        audio.addEventListener("progress", (event) => { this.onProgress(); });
        audio.addEventListener("durationchange", (event) => { this.onDurationChange(); });
        audio.addEventListener("ended", (event) => { this.onEnded(); });
    }
    initVO(vo) {
        if (!vo)
            vo = new AudioWrapperVO();
        this.vo = vo;
    }
    // HANDLERS
    onLoadedMetaData() {
        this.dispatchEvent(new AudioEvent(AudioEvent.METADATA, this));
    }
    onCanPlay() {
        this.dispatchEvent(new AudioEvent(AudioEvent.CAN_PLAY, this));
    }
    onCanPlayThrough() {
        this.dispatchEvent(new AudioEvent(AudioEvent.CAN_PLAY_THROUGH, this));
    }
    onPlay() {
        this.dispatchEvent(new AudioEvent(AudioEvent.PLAY, this));
    }
    onPlaying() {
        this.dispatchEvent(new AudioEvent(AudioEvent.PLAYING, this));
    }
    onPause() {
        this.dispatchEvent(new AudioEvent(AudioEvent.PAUSE, this));
    }
    onProgress() {
        this.dispatchEvent(new AudioEvent(AudioEvent.PROGRESS, this));
    }
    onDurationChange() {
        this.dispatchEvent(new AudioEvent(AudioEvent.DURATION_CHANGE, this));
    }
    onEnded() {
        this.dispatchEvent(new AudioEvent(AudioEvent.ENDED, this));
        this.checkPlayTimes();
    }
    // SERVICE
    checkPlayTimes() {
        if (this.vo.playtimes < 0)
            return;
        this.vo.playtimes--;
        if (this.vo.playtimes > 0)
            this.play();
    }
    // IFACES
    play() {
        if (this._playing) {
            this.stop();
        }
        this._playing = true;
        this.audio.src = this.vo.src;
        this.audio.play();
    }
    stop() {
        if (this.audio.paused)
            return;
        this.audio.pause();
    }
}
//# sourceMappingURL=AudioWrapper.js.map