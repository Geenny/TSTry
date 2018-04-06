import AudioWrapperVO from './vo/AudioWrapperVO';
import AudioServiceChannel from './AudioServiceChannel';
import EventDispathcer from '../../events/EventDispathcer';
import Log from '../../utils/Log';
import AudioEvent from './events/AudioEvent';

export default class AudioWrapper extends EventDispathcer {

    private _globalMute: boolean = false;
    private _audio: HTMLAudioElement;
    private _playing: boolean = false;

    public name: string  = "";
    public link: string = "";

    public vo: AudioWrapperVO;

    constructor( vo: AudioWrapperVO ) {
        super();
        this.initVO( vo );
        this.init();
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
    public get duration(): number { return this.audio.duration; }
    public get progress(): number { return this.time / this.duration; }
    public get channel(): AudioServiceChannel { return this.vo.channel; }
    public get playing(): boolean { return this._playing; }

    public get isActive(): boolean { return this.playing; }

    // INIT

    protected init() {
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

    protected initVO( vo: AudioWrapperVO ) {
        if ( !vo ) vo = new AudioWrapperVO();
        this.vo = vo;
    }

    // HANDLERS

    private onLoadedMetaData() {
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
        this.dispatchEvent( new AudioEvent( AudioEvent.PAUSE, this ) );
    }
    private onProgress() { }
    private onDurationChange() {
        this.dispatchEvent( new AudioEvent( AudioEvent.DURATION_CHANGE, this ) );
    }
    private onEnded() {
        this.dispatchEvent( new AudioEvent( AudioEvent.ENDED, this ) );
        this.checkPlayTimes();
    }

    //
    // SERVICE
    //

    public update() {
        if ( this.playing ) {
            this.dispatchEvent( new AudioEvent( AudioEvent.PROGRESS, this ) );
        }
    }

    // VOLUME

    public volumeUpdate() {
        this.volume = this.channel.volume * this.volume;
    }
    private volumeChange() {
        this.audio.volume = this.volume;
    }

    // MUTE

    public globalMuteSet( globalMute: boolean = false ) {
        this._globalMute = globalMute;
    }
    public muteUpdate() {
        this.mute = this._globalMute || this.channel.mute || this.audio.muted;
    }

    // SERVICE

    private checkPlayTimes() {
        if ( this.vo.playtimes < 0 ) return;
        this.vo.playtimes --;
        if ( this.vo.playtimes > 0 )
            this.play();
    }

    // IFACES

    public play() {

        if ( this._playing ) {
            this.stop();
        }

        this.audio.src = this.vo.src;
        this.audio.play();
        this._playing = !this.audio.paused;
    }

    public stop() {
        this.pause();
        this.time = 0;
    }

    public pause() {
        if ( this.audio.paused ) return;
        this.audio.pause();
        this._playing = !this.audio.paused;
    }

}