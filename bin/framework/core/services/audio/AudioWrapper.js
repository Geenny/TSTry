import AudioWrapperVO from './vo/AudioWrapperVO';
import EventDispathcer from '../../events/EventDispathcer';
import Log from '../../utils/Log';
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
        this.srcChange();
    }
    get speed() { return this.vo.speed; }
    set speed(value) {
        this.vo.speed = value;
        this.speedChange();
    }
    get duration() { return this.audio.duration; }
    get durationInMilliseconds() { return ~~(this.duration * 1000); }
    get progress() { return this.time / this.duration; }
    get channel() { return this.vo.channel; }
    get playing() { return !this.audio.paused; }
    get state() { return this._state; }
    get canKill() { return !this.vo.immortal && this.vo.stoptime + this.vo.killtime < Time.now(); }
    // Range
    get isRange() { return this.vo.range.size < this.durationInMilliseconds; }
    get startTime() { return this.vo.range.start; } // секунд
    get finishTime() { return this.vo.range.finish; } // секунд
    get startTimeInMilliseconds() { return ~~(this.vo.range.start * 1000); } // миллисекунд
    get finishTimeInMilliseconds() { return ~~(this.vo.range.finish * 1000); } // миллисекунд
    // INIT
    init(vo) {
        this.initVO(vo);
        this.initAudio();
        this.addListeners();
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
    initRange() {
        if (this.vo.range.start > this.vo.range.finish)
            this.vo.range.reset();
        if (this.vo.range.start < 0)
            this.vo.range.start = 0;
        if (this.vo.range.start > this.duration)
            this.vo.range.start = 0;
        if (this.vo.range.finish > this.duration)
            this.vo.range.finish = this.duration;
    }
    addListeners() {
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
    removeListeners() {
        let audio = this.audio;
        audio.removeEventListener("loadedmetadata", (event) => { this.onLoadedMetaData(); });
        audio.removeEventListener("canplay", (event) => { this.onCanPlay(); });
        audio.removeEventListener("canplaythrough", (event) => { this.onCanPlayThrough(); });
        audio.removeEventListener("play", (event) => { this.onPlay(); });
        audio.removeEventListener("playing", (event) => { this.onPlaying(); });
        audio.removeEventListener("pause", (event) => { this.onPause(); });
        audio.removeEventListener("progress", (event) => { this.onProgress(); });
        audio.removeEventListener("durationchange", (event) => { this.onDurationChange(); });
        audio.removeEventListener("ended", (event) => { this.onEnded(); });
    }
    // HANDLERS
    onLoadedMetaData() {
        this.initRange();
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
        if (this.isRange && this.time >= this.finishTime) {
            this.dispatchEvent(new AudioEvent(AudioEvent.ENDED, this));
            this.audioEnded();
        }
        else {
            this.dispatchEvent(new AudioEvent(AudioEvent.PAUSE, this));
        }
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
    /**
     * Обновить данные по @AudioWrapper
     */
    update() {
        if (!this.playing)
            return;
        this.dispatchEvent(new AudioEvent(AudioEvent.PROGRESS, this));
    }
    /**
     * Удаление важных данных по @AudioWrapper после чего его можно удалить
     */
    destroy() {
        if (this.playing)
            this.stop(true);
        this.removeListeners();
        this._audio = null;
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
        this.audio.src = this.vo.src + this.getRangeValue();
    }
    // RANGE
    getRangeValue() {
        return "#t=" + String(this.startTime) + "," + String(this.finishTime);
    }
    // SPEED
    speedChange() {
        if (this.audio.playbackRate == this.vo.speed)
            return;
        this.audio.playbackRate = this.vo.speed;
        this.dispatchEvent(new AudioEvent(AudioEvent.RATE_CHANGE, this));
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
    /**
     * Установка позиции паузы для данного audio.currentSrc
     */
    audioSetPauseTime() {
        this.pauseTime = this.audio.currentTime - (this.vo.pauseback * 0.001);
        if (this.pauseTime < 0)
            this.pauseTime = this.startTime;
        this.time = this.pauseTime;
    }
    /**
     * Cброс позиции паузы
     */
    audioResetPauseTime() {
        this.pauseTime = this.startTime;
        this.time = this.pauseTime;
    }
    /**
     * Запуск проигрывания данного audio.currentSrc
     */
    audioPlay() {
        let promise = this.audio.play();
        this.audioKillRegisterSet();
        if (promise === null)
            return;
        promise.catch(() => {
            this.audioKillRegisterClear();
            Log.error("AudioWrapper: audio play error!");
        });
    }
    /**
     * Установка паузы для данного audio.currentSrc
     */
    audioPause() {
        this.audioSetPauseTime();
        this.audio.pause();
    }
    /**
     * Остановка проигрывания audio. Сброс параметров audio.currentTime, установка статуса AudioWrapperState.WAIT
     */
    audioStop() {
        this.audioPause();
        this.audioResetPauseTime();
        this.audioKillRegisterSet();
        this.setState(AudioWrapperState.WAIT);
    }
    /**
     * Установка уровня @this.volume с виртуальной коррекцией @volume к основному уровню
     * @param volume
     */
    audioSteppingVolume(volume = 1) {
        this.audio.volume = this.volume * volume;
    }
    /**
     * Обработка звука по окончании проигрывания
     */
    audioEnded() {
        if (this.state != AudioWrapperState.PLAY)
            return;
        this.stop(true);
        if (this.vo.loop) {
            this.audioLoop();
        }
        else if (this.vo.playtimes > 0) {
            this.vo.playtimes--;
            this.audioLoop();
        }
    }
    /**
     * Перезапуск звука
     */
    audioLoop() {
        this.setState(AudioWrapperState.STOP);
        this.dispatchEvent(new AudioEvent(AudioEvent.LOOP, this));
        this.play();
    }
    /**
     * Установка времени остановки проигрывания @this.vo.stoptime
     */
    audioKillRegisterSet() {
        if (this.vo.immortal)
            return;
        this.vo.stoptime = Time.now();
    }
    /**
     * Очистка времени остановки проигрывания @this.vo.stoptime
     */
    audioKillRegisterClear() {
        this.vo.stoptime = Number.MAX_SAFE_INTEGER;
    }
    // SERVICE
    // IFACES
    play() {
        if (this.state == AudioWrapperState.PLAY || this.state == AudioWrapperState.PLAYING)
            return;
        this.srcChange();
        this.volumeChange();
        this.audioPlay();
        this.fadingStart(AudioWrapperState.PLAY);
    }
    stop(force = false) {
        // if ( !this.playing ) return;
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