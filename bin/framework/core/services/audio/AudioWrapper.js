import AudioWrapperVO from './vo/AudioWrapperVO';
import EventDispathcer from '../../events/EventDispathcer';
import AudioEvent from './events/AudioEvent';
import { AudioWrapperState } from './states/AudioWrapperState';
import Time from '../../utils/Time';
export default class AudioWrapper extends EventDispathcer {
    constructor(vo) {
        super();
        this._globalMute = false;
        this._state = AudioWrapperState.WAIT;
        this.name = "";
        this.link = "";
        // FADER
        this.fadeStoppingInterval = 0;
        this.fadeStoppingTime = 0;
        this.pauseTime = 0;
        this.init(vo);
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
    get volume() { return this.vo.volume; }
    set volume(value) {
        if (value < 0)
            value = 0;
        if (value > 1)
            value = 1;
        if (this.vo.volume == value)
            return;
        this.vo.volume = value;
        this.volumeChange();
    }
    get mute() { return this.audio.muted; }
    set mute(value) { this.audio.muted = value; }
    get src() { return (this.audio) ? this.audio.src : ""; }
    set src(value) {
        if (!value)
            return;
        this.vo.src = value;
        this.initAudio();
    }
    get duration() { return this.audio.duration; }
    get progress() { return this.time / this.duration; }
    get channel() { return this.vo.channel; }
    get playing() { return !this.audio.paused; }
    get state() { return this._state; }
    // INIT
    init(vo) {
        this.initVO(vo);
        this.initAudio();
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
    initAudio() {
        this.stop(true);
        this.srcChange();
        this.volumeChange();
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
    onProgress() { }
    onDurationChange() {
        this.dispatchEvent(new AudioEvent(AudioEvent.DURATION_CHANGE, this));
    }
    onEnded() {
        this.dispatchEvent(new AudioEvent(AudioEvent.ENDED, this));
        this.audioEnded();
    }
    //
    // SERVICE
    //
    update() {
        if (this.playing) {
            this.dispatchEvent(new AudioEvent(AudioEvent.PROGRESS, this));
        }
    }
    // VOLUME
    volumeUpdate() {
        this.volume = this.channel.volume * this.volume;
    }
    volumeChange() {
        if (this.audio.volume == this.vo.volume)
            return;
        this.audio.volume = this.volume;
    }
    // MUTE
    globalMuteSet(globalMute = false) {
        this._globalMute = globalMute;
    }
    muteUpdate() {
        this.mute = this._globalMute || this.channel.mute || this.audio.muted;
    }
    // SRC
    srcChange() {
        if (this.audio.src == this.vo.src)
            return;
        this.audio.src = this.vo.src;
    }
    // STATE
    setState(state) {
        this._state = state;
    }
    fadingKillTimeout() {
        clearInterval(this.fadeStoppingInterval);
        this.fadeStoppingInterval = 0;
    }
    fadingCreateInterval() {
        if (this.fadeStoppingInterval)
            return;
        this.fadeStoppingInterval = setInterval(() => { this.fadingTick(); }, 20);
    }
    fadingTick() {
        let fadingComplete = false;
        let percent = (Time.now() - this.fadeStoppingTime) / this.vo.fadetime;
        if (percent > 1)
            percent = 1;
        switch (this.state) {
            case AudioWrapperState.STOPPING:
            case AudioWrapperState.PAUSING:
                this.audioSteppingVolume(1 - percent);
                break;
            case AudioWrapperState.PLAY:
            case AudioWrapperState.PLAYING:
                this.audioSteppingVolume(percent);
                break;
        }
        if (percent == 1) {
            this.fadingStop();
        }
    }
    fadingStart(state = AudioWrapperState.NONE) {
        let fadeable = this.vo.fadetime > 0;
        let playable = this.state == AudioWrapperState.PLAYING || this.state == AudioWrapperState.PLAY;
        let stopable = this.state == AudioWrapperState.STOP ||
            this.state == AudioWrapperState.STOPPING ||
            this.state == AudioWrapperState.PAUSE ||
            this.state == AudioWrapperState.PAUSING;
        this.setState(state);
        if (!playable && !stopable)
            return;
        if (fadeable) {
            this.fadeStoppingTime = Time.now();
            this.fadingCreateInterval();
        }
        else {
            this.fadingStop();
        }
    }
    fadingStop() {
        this.fadingCreateInterval();
        switch (this.state) {
            case AudioWrapperState.STOPPING:
                this.setState(AudioWrapperState.STOP);
                this.audioSteppingVolume(0);
                this.audioStop();
                break;
            case AudioWrapperState.PAUSING:
                this.setState(AudioWrapperState.PAUSE);
                this.audioSteppingVolume(0);
                this.audioPause();
                break;
            case AudioWrapperState.PLAY:
            case AudioWrapperState.PLAYING:
                this.setState(AudioWrapperState.PLAY);
                this.audioSteppingVolume(1);
                break;
        }
    }
    // AUDIO
    audioSetPauseTime() {
        this.pauseTime = this.audio.currentTime - (this.vo.pauseback * 0.001);
        if (this.pauseTime < 0)
            this.pauseTime = 0;
        this.audio.currentTime = this.pauseTime;
    }
    audioResetPauseTime() {
        this.pauseTime = 0;
        this.audio.currentTime = this.pauseTime;
    }
    audioPlay() {
        this.audio.play();
    }
    audioPause() {
        this.audioSetPauseTime();
        this.audio.pause();
    }
    audioStop() {
        this.audioPause();
        this.audioResetPauseTime();
        this.setState(AudioWrapperState.WAIT);
    }
    audioSteppingVolume(volume = 1) {
        this.audio.volume = this.volume * volume;
    }
    audioEnded() {
        if (this.state != AudioWrapperState.PLAY)
            return;
        this.stop(true);
        if (this.vo.loop) {
            this.dispatchEvent(new AudioEvent(AudioEvent.LOOP, this));
            this.play();
        }
        else if (this.vo.playtimes > 0) {
            this.vo.playtimes--;
            this.dispatchEvent(new AudioEvent(AudioEvent.LOOP, this));
            this.play();
        }
    }
    // SERVICE
    // IFACES
    play() {
        if (this.state == AudioWrapperState.PLAY || this.state == AudioWrapperState.PLAYING)
            return;
        this.volumeChange();
        this.audioPlay();
        this.fadingStart(AudioWrapperState.PLAY);
    }
    stop(force = false) {
        if (force) {
            this.fadingStop();
            this.audioStop();
        }
        else {
            this.fadingStart(AudioWrapperState.STOPPING);
        }
    }
    pause() {
        if (this.audio.paused) {
            this.volumeChange();
            this.audioPlay();
            this.fadingStart(AudioWrapperState.PLAY);
        }
        else {
            this.fadingStart(AudioWrapperState.PAUSING);
        }
    }
}
//# sourceMappingURL=AudioWrapper.js.map