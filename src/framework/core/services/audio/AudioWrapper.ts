import AudioWrapperVO from './vo/AudioWrapperVO';
import AudioServiceChannel from './AudioServiceChannel';
import EventDispathcer from '../../events/EventDispathcer';
import Log from '../../utils/Log';
import AudioEvent from './events/AudioEvent';
import { AudioWrapperState } from './states/AudioWrapperState';
import Time from '../../utils/Time';

export default class AudioWrapper extends EventDispathcer implements IState, IDestroy {

    private _globalMute: boolean = false;
    private _audio: HTMLAudioElement;
    private _state: number = AudioWrapperState.WAIT;

    public name: string  = "";
    public link: string = "";

    public vo: AudioWrapperVO;

    constructor( vo: AudioWrapperVO ) {
        super();
        this.init( vo );
    }

    // GET/SET

    public get audio(): HTMLAudioElement {
        if ( !this._audio ) this._audio = new Audio();
        return this._audio;
    }

    public get muted(): boolean { return this.audio.muted; }
    public set muted( value: boolean ) { this.audio.muted = value; }

    public get time(): number { return this.audio.currentTime; }
    public set time( value: number ) {
        this.audio.currentTime = value;
        this.dispatchEvent( new AudioEvent( AudioEvent.TIME_CHANGE, this ) );
    }

    public get playtimes(): number { return this.vo.playtimes; }
    public set playtimes( value: number ) { this.vo.playtimes = value; }

    public get volume(): number { return this.vo.volume; }
    public set volume( value: number ) {
        if ( value < 0 ) value = 0;
        if ( value > 1 ) value = 1;
        if ( this.vo.volume == value ) return;
        this.vo.volume = value;
        this.volumeChange();
    }

    public get mute() { return this.audio.muted; }
    public set mute( value: boolean ) { this.audio.muted = value; }

    public get src(): string { return ( this.audio ) ? this.audio.src : ""; }
    public set src( value:string ) {
        if ( !value ) return;
        this.vo.src = value;
        this.srcChange();
    }

    public get speed(): number { return this.vo.speed; }
    public set speed( value: number ) {
        this.vo.speed = value;
        this.speedChange();
    }

    public get duration(): number { return this.audio.duration; }
    public get durationInMilliseconds(): number { return ~~( this.duration * 1000 ); }
    public get progress(): number { return this.time / this.duration; }
    public get channel(): AudioServiceChannel { return this.vo.channel; }
    public get playing(): boolean { return !this.audio.paused; }

    public get state(): number { return this._state; }

    public get canKill(): boolean { return !this.vo.immortal && this.vo.stoptime + this.vo.killtime < Time.now(); }

    // Range
    public get isRange(): boolean { return this.vo.range.size < this.durationInMilliseconds; }
    public get startTime(): number { return this.vo.range.start; }  // секунд
    public get finishTime(): number { return this.vo.range.finish; } // секунд
    public get startTimeInMilliseconds(): number { return ~~( this.vo.range.start * 1000 ); }  // миллисекунд
    public get finishTimeInMilliseconds(): number { return ~~( this.vo.range.finish * 1000 ); } // миллисекунд

    // INIT

    protected init( vo: AudioWrapperVO ) {

        this.initVO( vo );
        this.initAudio();
        this.addListeners();
    }

    protected initVO( vo: AudioWrapperVO ) {
        if ( !vo ) vo = new AudioWrapperVO();
        this.vo = vo;
    }

    protected initAudio() {
        this.stop( true );
        this.srcChange();
        this.volumeChange();
    }

    protected initRange() {
        if ( this.vo.range.start > this.vo.range.finish ) this.vo.range.reset();
        if ( this.vo.range.start < 0 ) this.vo.range.start = 0;
        if ( this.vo.range.start > this.duration ) this.vo.range.start = 0;
        if ( this.vo.range.finish > this.duration ) this.vo.range.finish = this.duration;
    }

    private addListeners() {
        let audio = this.audio;
        audio.addEventListener( "loadedmetadata", ( event ) => { this.onLoadedMetaData() } );
        audio.addEventListener( "canplay", ( event ) => { this.onCanPlay() } );
        audio.addEventListener( "canplaythrough", ( event ) => { this.onCanPlayThrough() } );
        audio.addEventListener( "play", ( event ) => { this.onPlay() } );
        audio.addEventListener( "playing", ( event ) => { this.onPlaying() } );
        audio.addEventListener( "pause", ( event ) => { this.onPause() } );
        audio.addEventListener( "progress", ( event ) => { this.onProgress() } );
        audio.addEventListener( "durationchange", ( event ) => { this.onDurationChange() } );
        audio.addEventListener( "ended", ( event ) => { this.onEnded() } );
    }

    private removeListeners() {
        let audio = this.audio;
        audio.removeEventListener( "loadedmetadata", ( event ) => { this.onLoadedMetaData() } );
        audio.removeEventListener( "canplay", ( event ) => { this.onCanPlay() } );
        audio.removeEventListener( "canplaythrough", ( event ) => { this.onCanPlayThrough() } );
        audio.removeEventListener( "play", ( event ) => { this.onPlay() } );
        audio.removeEventListener( "playing", ( event ) => { this.onPlaying() } );
        audio.removeEventListener( "pause", ( event ) => { this.onPause() } );
        audio.removeEventListener( "progress", ( event ) => { this.onProgress() } );
        audio.removeEventListener( "durationchange", ( event ) => { this.onDurationChange() } );
        audio.removeEventListener( "ended", ( event ) => { this.onEnded() } );
    }

    // HANDLERS

    private onLoadedMetaData() {
        this.initRange();
        this.dispatchEvent( new AudioEvent( AudioEvent.METADATA, this ) );
    }
    private onCanPlay() {
        this.dispatchEvent( new AudioEvent( AudioEvent.CAN_PLAY, this ) );
    }
    private onCanPlayThrough() {
        this.dispatchEvent( new AudioEvent( AudioEvent.CAN_PLAY_THROUGH, this ) );
    }
    private onPlay() {
        this.dispatchEvent( new AudioEvent( AudioEvent.PLAY, this ) );
    }
    private onPlaying() {
        this.dispatchEvent( new AudioEvent( AudioEvent.PLAYING, this ) );
    }
    private onPause() {
        if ( this.isRange && this.time >= this.finishTime ) {
            this.dispatchEvent( new AudioEvent( AudioEvent.ENDED, this ) );
            this.audioEnded();
        }else{
            this.dispatchEvent( new AudioEvent( AudioEvent.PAUSE, this ) );
        }
    }
    private onProgress() { }
    private onDurationChange() {
        this.dispatchEvent( new AudioEvent( AudioEvent.DURATION_CHANGE, this ) );
    }
    private onEnded() {
        this.dispatchEvent( new AudioEvent( AudioEvent.ENDED, this ) );
        this.audioEnded();
    }

    //
    // SERVICE
    //

    /**
     * Обновить данные по @AudioWrapper
     */
    public update() {
        if ( !this.playing ) return;
        this.dispatchEvent( new AudioEvent( AudioEvent.PROGRESS, this ) );
    }

    /**
     * Удаление важных данных по @AudioWrapper после чего его можно удалить
     */
    public destroy() {
        if ( this.playing ) this.stop( true );
        this.removeListeners();
        this._audio = null;
    }

    // VOLUME

    public volumeUpdate() {
        this.volume = this.channel.volume * this.volume;
    }
    private volumeChange() {
        if ( this.audio.volume == this.vo.volume ) return;
        this.audio.volume = this.volume;
    }

    // MUTE

    public globalMuteSet( globalMute: boolean = false ) {
        this._globalMute = globalMute;
    }
    public muteUpdate() {
        this.mute = this._globalMute || this.channel.mute || this.audio.muted;
    }

    // SRC

    public srcChange() {
        if ( this.audio.src == this.vo.src ) return;
        this.audio.src = this.vo.src + this.getRangeValue();
    }

    // RANGE

    private getRangeValue(): string {
        return "#t=" + String( this.startTime ) + "," + String( this.finishTime );
    }

    // SPEED

    public speedChange() {
        if ( this.audio.playbackRate == this.vo.speed ) return;
        this.audio.playbackRate = this.vo.speed;
        this.dispatchEvent( new AudioEvent( AudioEvent.RATE_CHANGE, this ) );
    }

    // STATE

    protected setState( state: number ) {
        this._state = state;
    }

    // FADER

    protected fadeStoppingInterval: number = 0;
    protected fadeStoppingTime: number = 0;
    protected pauseTime: number = 0;

    protected fadingClearInterval() {
        clearInterval( this.fadeStoppingInterval );
        this.fadeStoppingInterval = 0;
    }
    protected fadingCreateInterval() {
        if ( this.fadeStoppingInterval ) return;
        this.fadeStoppingInterval = setInterval( () => { this.fadingTick(); }, 20 );
    }
    private fadingTick() {

        let fadingComplete: boolean = false;
        let percent: number = ( Time.now() - this.fadeStoppingTime ) / this.vo.fadetime;
        if ( percent > 1 ) percent = 1;

        switch( this.state ) {
            case AudioWrapperState.STOPPING:
            case AudioWrapperState.PAUSING:
                this.audioSteppingVolume( 1 - percent );
                break;
            case AudioWrapperState.PLAY:
            case AudioWrapperState.PLAYING:
                this.audioSteppingVolume( percent );
                break;
        }

        if ( percent == 1 ) {
            this.fadingStop();
        }

    }

    protected fadingStart( state: number = AudioWrapperState.NONE ) {

        let fadeable: boolean = this.vo.fadetime > 0;
        let playable: boolean = this.state == AudioWrapperState.PLAYING || this.state == AudioWrapperState.PLAY;
        let stopable: boolean = this.state == AudioWrapperState.STOP ||
                                this.state == AudioWrapperState.STOPPING ||
                                this.state == AudioWrapperState.PAUSE ||
                                this.state == AudioWrapperState.PAUSING;

        
        this.setState( state );
        
        if ( !playable && !stopable ) return;

        if ( fadeable ) {
            this.fadeStoppingTime = Time.now();
            this.fadingCreateInterval();
        }else{
            this.fadingStop();
        }
    }

    protected fadingStop() {
        this.fadingClearInterval();

        switch( this.state ) {
            case AudioWrapperState.STOPPING:
                this.setState( AudioWrapperState.STOP );
                this.audioSteppingVolume( 0 );
                this.audioStop();
                break;
            case AudioWrapperState.PAUSING:
                this.setState( AudioWrapperState.PAUSE );
                this.audioSteppingVolume( 0 );
                this.audioPause();
                break;
            case AudioWrapperState.PLAY:
            case AudioWrapperState.PLAYING:
                this.setState( AudioWrapperState.PLAY );
                this.audioSteppingVolume( 1 );
                break;
        }
    }

    // AUDIO

    /**
     * Установка позиции паузы для данного audio.currentSrc
     */
    protected audioSetPauseTime() {
        this.pauseTime = this.audio.currentTime - ( this.vo.pauseback * 0.001 );
        if ( this.pauseTime < 0 ) this.pauseTime = this.startTime;
        this.time = this.pauseTime;
    }

    /**
     * Cброс позиции паузы
     */
    protected audioResetPauseTime() {
        this.pauseTime = this.startTime;
        this.time = this.pauseTime;
    }

    /**
     * Запуск проигрывания данного audio.currentSrc
     */
    protected audioPlay() {
        let promise: any = this.audio.play();
        this.audioKillRegisterSet();
        if ( promise === null ) return;
        promise.catch( () => {
            this.audioKillRegisterClear();
            Log.error( "AudioWrapper: audio play error!" );
        } )
    }
    
    /**
     * Установка паузы для данного audio.currentSrc
     */
    protected audioPause() {
        this.audioSetPauseTime();
        this.audio.pause();
    }

    /**
     * Остановка проигрывания audio. Сброс параметров audio.currentTime, установка статуса AudioWrapperState.WAIT
     */
    protected audioStop() {
        this.audioPause();
        this.audioResetPauseTime();
        this.audioKillRegisterSet();
        this.setState( AudioWrapperState.WAIT );
    }

    /**
     * Установка уровня @this.volume с виртуальной коррекцией @volume к основному уровню
     * @param volume 
     */
    protected audioSteppingVolume( volume: number = 1 ) {
        this.audio.volume = this.volume * volume;
    }

    /**
     * Обработка звука по окончании проигрывания
     */
    protected audioEnded() {
        if ( this.state != AudioWrapperState.PLAY ) return;
        this.stop( true );
        if ( this.vo.loop ) {
            this.audioLoop();
        }else if( this.vo.playtimes > 0 ) {
            this.vo.playtimes --;
            this.audioLoop();
        }
    }

    /**
     * Перезапуск звука
     */
    protected audioLoop() {
        this.setState( AudioWrapperState.STOP );
        this.dispatchEvent( new AudioEvent( AudioEvent.LOOP, this ) );
        this.play( true );
    }

    /**
     * Установка времени остановки проигрывания @this.vo.stoptime
     */
    protected audioKillRegisterSet() {
        if ( this.vo.immortal ) return;
        this.vo.stoptime = Time.now();
    }

    /**
     * Очистка времени остановки проигрывания @this.vo.stoptime
     */
    protected audioKillRegisterClear() {
        this.vo.stoptime = Number.MAX_SAFE_INTEGER;
    }

    // SERVICE

    

    // IFACES

    public play( force: boolean = false ) {

        if ( this.state == AudioWrapperState.PLAY || this.state == AudioWrapperState.PLAYING ) return;

        this.srcChange();
        this.volumeChange();
        this.audioPlay();

        if ( force ) {
            this.audioSteppingVolume( 1 );
        }else{
            this.fadingStart( AudioWrapperState.PLAY );
        }
    }

    public stop( force: boolean = false ) {
        // if ( !this.playing ) return;
        if ( force ) {
            this.fadingStop();
            this.audioStop();
        }else{
            this.fadingStart( AudioWrapperState.STOPPING );
        }
    }

    public pause() {
        if ( this.audio.paused ) {
            this.volumeChange();
            this.audioPlay();
            this.fadingStart( AudioWrapperState.PLAY );
        }else{
            this.fadingStart( AudioWrapperState.PAUSING );
        }
    }

}