import Service from '../service/Service';
import AudioServiceVO from './vo/AudioServiceVO';
import AudioServiceChannel from './AudioServiceChannel';
import AudioWrapper from './AudioWrapper';
import AudioWrapperVO from './vo/AudioWrapperVO';
export default class AudioService extends Service {
    constructor(vo) {
        super(vo);
        // LOCAL VARS
        this._mute = false;
        this._channels = [];
        this.init();
    }
    /**
     *
     */
    static get instance() {
        if (!AudioService.instance)
            AudioService._instance = new AudioService(new AudioServiceVO({}));
        return AudioService._instance;
    }
    // GET/SET
    get vo() { return this.sourceVO; }
    get channels() { return this._channels; }
    // INIT
    init() {
        this.initChannels();
    }
    // 
    // AUDIO SERVICE
    //
    initChannels() {
        for (let channelName of this.vo.channels) {
            this.channelAddByName(channelName);
        }
    }
    channelAddByName(name, volume = 1) {
        let channel = this.channelGetByName(name);
        if (!channel)
            channel = this.channelCreate(name, volume);
        this._channels.push(channel);
        return channel;
    }
    channelGetByName(name) {
        return null;
    }
    channelGetChannelByIndex(index = 0) {
        return (index > -1 && this._channels.length > index) ? this._channels[index] : null;
    }
    channelCreate(name, volume = 1) {
        if (!name)
            return null;
        return new AudioServiceChannel(name, volume);
    }
    // Возвращает имя первого канала. Если каналов нет он будет создан и его имя будет возвращено
    channelGetChannelName() {
        let channel = this.channelGetChannelByIndex(0);
        if (!channel)
            channel = this.channelAddByName(AudioService.AUDIO_CHANNEL_NAME_DEFAULT, AudioService.AUDIO_CHANNEL_VOLUME_DEFAULT);
        return channel.name;
    }
    // AUDIO IFACES
    // GET/SET
    get mute() { return this._mute; }
    set mute(value) {
        if (this._mute == value)
            return;
        this._mute = value;
        for (let channel of this.channels) {
            channel.globalMuteSet(value);
        }
    }
    // 
    /**
     * Запуск проигрывания звука
     * @param soundName Имя звука, ссылка звука
     * @param channelName Имя канала. Если это значение не задано будет взят первый канал
     */
    play(soundName, channelName = null, volume = -1, pan = 0, loop = false, playtimes = -1) {
        if (!soundName)
            return null;
        if (!channelName)
            channelName = this.channelGetChannelName();
        let vo = new AudioWrapperVO({
            src: soundName,
            volume: (volume >= 0) ? volume : this.vo.volume,
            pan: pan,
            loop: loop,
            playtimes: playtimes
        });
        let audio = new AudioWrapper(vo);
        audio.play();
        return audio;
    }
}
AudioService.AUDIO_CHANNEL_NAME_DEFAULT = "main";
AudioService.AUDIO_CHANNEL_VOLUME_DEFAULT = 1;
//# sourceMappingURL=AudioService.js.map