import Service from '../service/Service';
import AudioServiceVO from './vo/AudioServiceVO';
import AudioServiceChannel from './AudioServiceChannel';
export default class AudioService extends Service {

    constructor( vo: AudioServiceVO ) {
        super( vo );
        this.init();
    }

    // GET/SET

    public get vo(): AudioServiceVO { return this.sourceVO as AudioServiceVO; }

    // INIT

    public init() {
        this.initChannels();
    }

    // 
    // AUDIO SERVICE
    //

    protected initChannels() {

    }

    public channelAddByName( name: string, volume: number = 1 ): AudioServiceChannel {
        
        let channel: AudioServiceChannel = this.channelGetByName( name );
        if ( !channel ) channel = this.channelCreate( name, volume );
        return channel;

    }

    protected channelGetByName( name: string ): AudioServiceChannel {
        return null;
    }

    protected channelCreate( name: string, volume: number = 1 ): AudioServiceChannel {
        if ( !name ) return null;
        return new AudioServiceChannel( name, volume );
    }

}