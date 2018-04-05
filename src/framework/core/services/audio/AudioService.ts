import Service from '../service/Service';
import AudioServiceVO from './vo/AudioServiceVO';
import AudioServiceChannel from './AudioServiceChannel';
import AudioWrapper from './AudioWrapper';
import AudioWrapperVO from './vo/AudioWrapperVO';
export default class AudioService extends Service {

    private static _instance: AudioService;

    /**
     * 
     */
    public static get instance(): AudioService {
        if ( !AudioService.instance ) AudioService._instance = new AudioService( new AudioServiceVO( {} ) );
        return AudioService._instance;
    }

    public static AUDIO_CHANNEL_NAME_DEFAULT: string = "main";
    public static AUDIO_CHANNEL_VOLUME_DEFAULT: number = 1;

    // LOCAL VARS

    private _mute: boolean = false;

    protected _channels: AudioServiceChannel[] = [];

    constructor( vo: AudioServiceVO ) {
        super( vo );
        this.init();
    }

    // GET/SET

    public get vo(): AudioServiceVO { return this.sourceVO as AudioServiceVO; }
    public get channels(): AudioServiceChannel[] { return this._channels; }

    // INIT

    public init() {
        this.initChannels();
    }

    // 
    // AUDIO SERVICE
    //

    protected initChannels() {
        for ( let channelName of this.vo.channels ) {
            this.channelAddByName( channelName );
        }
    }

    public channelAddByName( name: string, volume: number = 1 ): AudioServiceChannel {
        
        let channel: AudioServiceChannel = this.channelGetByName( name );
        if ( !channel ) channel = this.channelCreate( name, volume );
        this._channels.push( channel );
        return channel;

    }

    protected channelGetByName( name: string ): AudioServiceChannel {
        return null;
    }
    protected channelGetChannelByIndex( index: number = 0 ): AudioServiceChannel {
        return ( index > -1 && this._channels.length > index ) ? this._channels[ index ] : null;
    }

    protected channelCreate( name: string, volume: number = 1 ): AudioServiceChannel {
        if ( !name ) return null;
        return new AudioServiceChannel( name, volume );
    }

    // Возвращает имя первого канала. Если каналов нет он будет создан и его имя будет возвращено
    private channelGetChannelName(): string {
        let channel: AudioServiceChannel = this.channelGetChannelByIndex( 0 );

        if ( !channel ) channel = this.channelAddByName( AudioService.AUDIO_CHANNEL_NAME_DEFAULT, AudioService.AUDIO_CHANNEL_VOLUME_DEFAULT );

        return channel.name;
    }

    // AUDIO IFACES

    // GET/SET

    public get mute(): boolean { return this._mute; }
    public set mute( value: boolean ) {
        if ( this._mute == value ) return;
        this._mute = value;
        for ( let channel of this.channels ) {
            channel.globalMuteSet( value );
        }
    }

    // 

    /**
     * Запуск проигрывания звука
     * @param soundName Имя звука, ссылка звука
     * @param channelName Имя канала. Если это значение не задано будет взят первый канал
     */
    public play( soundName: string, channelName: string = null, volume: number = -1, pan: number = 0, loop: boolean = false, playtimes: number = -1 ): AudioWrapper {

        if ( !soundName ) return null;
        if ( !channelName ) channelName = this.channelGetChannelName();

        let vo: AudioWrapperVO = new AudioWrapperVO( {
            src: soundName,
            volume: ( volume >= 0) ? volume : this.vo.volume,
            pan: pan,
            loop: loop,
            playtimes: playtimes
        } );
        let audio: AudioWrapper = new AudioWrapper( vo );
        audio.play();

        return audio;
        
    }

}