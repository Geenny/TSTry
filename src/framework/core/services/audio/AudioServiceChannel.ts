import AudioWrapper from "./AudioWrapper";

export default class AudioServiceChannel {

    private _name: string = "audioChannelName";
    private _volume: number = 1;
    private _mute: boolean;

    protected audioWrapperList: AudioWrapper[] = [];
    protected globalMute: boolean = false;

    constructor( name: string, volume: number = 1 ) {
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
        this.volumeChange();
    }

    public get mute(): boolean { return this._mute || this.globalMute; }
    public set mute( value: boolean ) { this._mute = value; }

    // HANDLERS

    public globalMuteSet( value: boolean = false ) {
        this.globalMute = value;
    }

    // SERVICE

    /**
     * изменить звук во всех запущенных звуковых @AudioWrapper
     */
    private volumeChange() {

    }

}