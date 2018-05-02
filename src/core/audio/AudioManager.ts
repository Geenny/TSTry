import AudioManagerVO from './vo/AudioManagerVO';

export default class AudioManager implements IInit {

    private _inited: boolean;
    private _vo: AudioManagerVO;

    constructor( audioManagerVO: AudioManagerVO = new AudioManagerVO() ) {

        this.initVO( audioManagerVO );

    }

    // GET/SET

    public get inited(): boolean { return this._inited; }
    public set inited( value: boolean ) { this._inited = value; }

    protected get vo(): AudioManagerVO { return this._vo; }

    // VO

    protected initVO( vo: AudioManagerVO ) {
        this._vo = vo;
    }

    // Init

    public init() { }

}