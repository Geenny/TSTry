
import AudioManagerVO from '../audio/vo/AudioManagerVO';
import WindowServiceVO from '../../framework/core/services/windows/vo/WindowServiceVO';

export default class CONFIG {

    private static _instance: CONFIG;

    // CONFIG
    public static get instance(): CONFIG { return this._instance; }
    public static set instance( value: CONFIG ) { this._instance = value; }

    // Components
    public static get audio(): AudioManagerVO { return new AudioManagerVO( CONFIG.instance.audio ); }
    public static get window(): WindowServiceVO { return new WindowServiceVO( CONFIG.instance.window ); }

    public audio: any = { };
    public window: any = { };

    public data: any = { };

    constructor( data: any = { } ) {
        this.parse( data );
        CONFIG.instance = this;
    }

    public parse( data ) {
        this.data = data;
    }

}