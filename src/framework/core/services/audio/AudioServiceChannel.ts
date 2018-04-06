import AudioWrapper from "./AudioWrapper";
import EventDispathcer from '../../events/EventDispathcer';
import AudioChannelEvent from './events/AudioChannelEvent';

export default class AudioServiceChannel extends EventDispathcer {

    private _name: string = "audioChannelName";
    private _volume: number = 1;
    private _mute: boolean;
    private _globalMute: boolean;

    protected audioWrapperList: AudioWrapper[] = [];

    constructor( name: string, volume: number = 1 ) {
        super();
        this._name = name;
        this.volume = volume;
    }

    // GET/SET

    public get name(): string { return this._name; }

    public get volume(): number { return this._volume; }
    public set volume( value:number ) {
        if ( value < 0 ) value = 0;
        if ( value > 1 ) value = 1;
        this._volume = value;
        this.dispatchEvent( new AudioChannelEvent( AudioChannelEvent.VOLUME, this ) );
    }

    public get mute(): boolean { return this._mute || this._globalMute; }
    public set mute( value: boolean ) {
        this._mute = value;
        this.dispatchEvent( new AudioChannelEvent( AudioChannelEvent.MUTE, this ) );
    }

    // HANDLERS

    public globalMuteSet( globalMute: boolean = false ) {
        this._globalMute = globalMute;
    }

    // SERVICE

    /**
     * изменить звук во всех запущенных звуковых @AudioWrapper
     */
    private volumeChange() {

    }

}