import Service from '../service/Service';
import AudioServiceVO from './vo/AudioServiceVO';
import AudioServiceChannel from './AudioServiceChannel';
import AudioWrapper from './AudioWrapper';
import AudioWrapperVO from './vo/AudioWrapperVO';
import AudioChannelEvent from './events/AudioChannelEvent';
import Event from '../../events/Event';
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

    protected _channels: AudioServiceChannel[] = [];
    protected _audioWrapperList: AudioWrapper[] = [];

    constructor( vo: AudioServiceVO ) {
        super( vo );
        this.init();
    }

    // GET/SET

    public get vo(): AudioServiceVO { return this.sourceVO as AudioServiceVO; }
    public get channels(): AudioServiceChannel[] { return this._channels; }

    public get volume(): number { return this.vo.volume; }
    public set volume( value: number ) {
        if ( value < 0 ) value = 0;
        if ( value > 1 ) value = 1;

        if ( this.vo.volume == value ) return;
        this.vo.volume = value;
        this.volumeChange();
    }

    public get mute(): boolean { return this.vo.mute; }
    public set mute( value: boolean ) {
        if ( this.vo.mute == value ) return;
        this.vo.mute = value;
        this.channelChangeMute();
    }

    // INIT

    public init() {
        this.initChannels();
    }

    // 
    // AUDIO SERVICE
    //

    // CHANNEL

    protected initChannels() {
        for ( let channelName of this.vo.channels ) {
            this.channelAddByName( channelName );
        }
    }

    public channelAddByName( name: string, volume: number = 1 ): AudioServiceChannel {
        
        let channel: AudioServiceChannel;
        if ( !name ) return null;

        channel = this.channelGetByName( name );
        if ( !channel ) {
            channel = this.channelCreate( name, volume );
            this._channels.push( channel );
        }
        return channel;

    }

    protected channelGetByName( name: string ): AudioServiceChannel {
        for ( let channel of this._channels ) {
            if ( channel.name == name ) return channel;
        }
        return null;
    }
    protected channelGetChannelByIndex( index: number = 0 ): AudioServiceChannel {
        return ( index > -1 && this._channels.length > index ) ? this._channels[ index ] : null;
    }

    protected channelCreate( name: string, volume: number = 1 ): AudioServiceChannel {
        if ( !name ) return null;

        let channel: AudioServiceChannel = new AudioServiceChannel( name, volume );
        channel.addEventListener( AudioChannelEvent.VOLUME, this.onAudioChannelVolume );
        channel.addEventListener( AudioChannelEvent.MUTE, this.onAudioChannelMute );

        return channel;
    }

    private channelGetByNameOrCreate( name: string = null ): AudioServiceChannel {

        let channel: AudioServiceChannel = this.channelAddByName( name );
        if ( channel ) return channel;

        channel = this.channelAddByName( AudioService.AUDIO_CHANNEL_NAME_DEFAULT, AudioService.AUDIO_CHANNEL_VOLUME_DEFAULT );
        return channel;

    }

    private onAudioChannelVolume( event: Event ) {
        this.audioWrapperVolumeChange();
    }
    private onAudioChannelMute( event: Event ) {
        this.muteChange();
    }

    // VOLUME

    private volumeChange() {
        this.channelVolumeChange();
    }
    private channelVolumeChange() {
        for ( let channel of this.channels ) {
            channel.volume = channel.volume * this.vo.volume;
        }
    }
    private audioWrapperVolumeChange() {
        for ( let audioWrapper of this._audioWrapperList ) {
            audioWrapper.volumeUpdate();
        }
    }

    // MUTE

    private muteChange() {
        for ( let audioWrapper of this._audioWrapperList ) {
            audioWrapper.globalMuteSet( this.mute );
        }
    }
    private channelChangeMute() {
        for ( let channel of this.channels ) {
            channel.globalMuteSet( this.mute );
        }
    }

    //
    // AUDIOWRAPPER
    //

    private audioWrapperTimerIndex: number = 0;

    private audioWrapperGet( vo: AudioWrapperVO ): AudioWrapper {
        let audioWrapper = new AudioWrapper( vo );
        this._audioWrapperList.push( audioWrapper );
        return audioWrapper;
    }

    private audioWrappersListenerUpdate() {
        if ( !this.vo.progressCustom || this.vo.progressTimeout <= 0 ) return;
        if ( this.isAudioWrapperActive() ) {
            this.audioWrapperTimerStart();
        }else{
            this.audioWrapperTimerStop();
        }
    }

    private isAudioWrapperActive(): boolean {
        for ( let audioWrapper of this._audioWrapperList) {
            if ( audioWrapper.playing ) return true;
        }
        return false;
    }

    private audioWrapperTimerStart() {
        if ( this.audioWrapperTimerIndex ) return;
        this.audioWrapperTimerIndex = setInterval( () => { this.audioWrapperInterval(); }, this.vo.progressTimeout )
    }
    private audioWrapperTimerStop() {
        clearInterval( this.audioWrapperTimerIndex );
    }

    private audioWrapperInterval() {
        for ( let audioWrapper of this._audioWrapperList) {
            if ( !audioWrapper.playing ) continue;
            audioWrapper.update();
        }
    }

    // Создать главый экземпляр @AudioWrapperVO
    private audioWrapperVOGetNew( 
        soundName: string,
        channel: AudioServiceChannel,
        volume: number = 1,
        pan: number = 0,
        loop: boolean = false,
        playtimes: number = -1 ): AudioWrapperVO
    {

        let vo: AudioWrapperVO = new AudioWrapperVO( {
            src:        soundName,
            channel:    channel,
            volume:     volume,
            pan:        pan,
            loop:       loop,
            playtimes:  playtimes
        } );

        return vo;
    }

    // AUDIO IFACES

    // GET/SET

    // 

    /**
     * Запуск проигрывания звука
     * @param soundName Имя звука, ссылка звука
     * @param channelName Имя канала. Если это значение не задано будет взят первый канал
     */
    public play( input: string | AudioWrapperVO ): AudioWrapper {

        if ( !input ) return null;

        let channelName: string, channel: AudioServiceChannel, vo: AudioWrapperVO, audio: AudioWrapper;

        if ( input instanceof AudioWrapperVO ) {
            vo = input;
            if ( !vo.channel ) vo.channel = this.channelGetByNameOrCreate( null );
        }else if ( typeof input == "string" ) {
            channel =  this.channelGetByNameOrCreate( null );
            vo = this.audioWrapperVOGetNew( input, channel, this.volume );
        }

        if ( !vo ) return;

        audio = this.audioWrapperGet( vo );
        audio.play();

        this.audioWrappersListenerUpdate();

        return audio;
        
    }

}