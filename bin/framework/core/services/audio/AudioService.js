import Service from '../service/Service';
import AudioServiceVO from './vo/AudioServiceVO';
import AudioServiceChannel from './AudioServiceChannel';
import AudioWrapper from './AudioWrapper';
import AudioWrapperVO from './vo/AudioWrapperVO';
import AudioChannelEvent from './events/AudioChannelEvent';
export default class AudioService extends Service {
    constructor(vo) {
        super(vo);
        // LOCAL VARS
        this._channels = [];
        this._audioWrapperList = [];
        //
        // AUDIOWRAPPER
        //
        this.audioWrapperTimerIndex = 0;
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
    get volume() { return this.vo.volume; }
    set volume(value) {
        if (value < 0)
            value = 0;
        if (value > 1)
            value = 1;
        if (this.vo.volume == value)
            return;
        this.vo.volume = value;
        this.volumeChange();
    }
    get mute() { return this.vo.mute; }
    set mute(value) {
        if (this.vo.mute == value)
            return;
        this.vo.mute = value;
        this.channelChangeMute();
    }
    // INIT
    init() {
        this.initChannels();
    }
    // 
    // AUDIO SERVICE
    //
    // CHANNEL
    initChannels() {
        for (let channelName of this.vo.channels) {
            this.channelAddByName(channelName);
        }
    }
    channelAddByName(name, volume = 1) {
        let channel;
        if (!name)
            return null;
        channel = this.channelGetByName(name);
        if (!channel) {
            channel = this.channelCreate(name, volume);
            this._channels.push(channel);
        }
        return channel;
    }
    channelGetByName(name) {
        for (let channel of this._channels) {
            if (channel.name == name)
                return channel;
        }
        return null;
    }
    channelGetChannelByIndex(index = 0) {
        return (index > -1 && this._channels.length > index) ? this._channels[index] : null;
    }
    channelCreate(name, volume = 1) {
        if (!name)
            return null;
        let channel = new AudioServiceChannel(name, volume);
        channel.addEventListener(AudioChannelEvent.VOLUME, this.onAudioChannelVolume);
        channel.addEventListener(AudioChannelEvent.MUTE, this.onAudioChannelMute);
        return channel;
    }
    channelGetByNameOrCreate(name = null) {
        let channel = this.channelAddByName(name);
        if (channel)
            return channel;
        channel = this.channelAddByName(AudioService.AUDIO_CHANNEL_NAME_DEFAULT, AudioService.AUDIO_CHANNEL_VOLUME_DEFAULT);
        return channel;
    }
    onAudioChannelVolume(event) {
        this.audioWrapperVolumeChange();
    }
    onAudioChannelMute(event) {
        this.muteChange();
    }
    // VOLUME
    volumeChange() {
        this.channelVolumeChange();
    }
    channelVolumeChange() {
        for (let channel of this.channels) {
            channel.volume = channel.volume * this.vo.volume;
        }
    }
    audioWrapperVolumeChange() {
        for (let audioWrapper of this._audioWrapperList) {
            audioWrapper.volumeUpdate();
        }
    }
    // MUTE
    muteChange() {
        for (let audioWrapper of this._audioWrapperList) {
            audioWrapper.globalMuteSet(this.mute);
        }
    }
    channelChangeMute() {
        for (let channel of this.channels) {
            channel.globalMuteSet(this.mute);
        }
    }
    audioWrapperGet(vo) {
        let audioWrapper = new AudioWrapper(vo);
        this._audioWrapperList.push(audioWrapper);
        return audioWrapper;
    }
    audioWrappersListenerUpdate() {
        if (!this.vo.progressCustom || this.vo.progressTimeout <= 0)
            return;
        if (this.isAudioWrapperActive()) {
            this.audioWrapperTimerStart();
        }
        else {
            this.audioWrapperTimerStop();
        }
    }
    isAudioWrapperActive() {
        for (let audioWrapper of this._audioWrapperList) {
            if (audioWrapper.playing)
                return true;
        }
        return false;
    }
    audioWrapperTimerStart() {
        if (this.audioWrapperTimerIndex)
            return;
        this.audioWrapperTimerIndex = setInterval(() => { this.audioWrapperInterval(); }, this.vo.progressTimeout);
    }
    audioWrapperTimerStop() {
        clearInterval(this.audioWrapperTimerIndex);
    }
    audioWrapperInterval() {
        if (this._audioWrapperList.length == 0) {
            this.audioWrappersListenerUpdate();
        }
        for (let audioWrapper of this._audioWrapperList) {
            if (!audioWrapper.playing)
                continue;
            audioWrapper.update();
        }
    }
    // Удалить все истекшие по времени или ошибочные @AudioWrapper 
    audioWrapperKillOutdated() {
        for (let i = this._audioWrapperList.length - 1; i > -1; i--) {
            let audioWrapper = this._audioWrapperList[i];
            if (!audioWrapper.canKill)
                continue;
            audioWrapper.destroy();
            this._audioWrapperList.splice(i, 1);
        }
    }
    // Создать главый экземпляр @AudioWrapperVO
    audioWrapperVOGetNew(soundName, channel, volume = 1, pan = 0, loop = false, playtimes = -1) {
        let vo = new AudioWrapperVO({
            src: soundName,
            channel: channel,
            volume: volume,
            pan: pan,
            loop: loop,
            playtimes: playtimes
        });
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
    play(input) {
        if (!input)
            return null;
        let channelName, channel, vo, audio;
        if (input instanceof AudioWrapperVO) {
            vo = input;
            if (!vo.channel)
                vo.channel = this.channelGetByNameOrCreate(null);
        }
        else if (typeof input == "string") {
            channel = this.channelGetByNameOrCreate(null);
            vo = this.audioWrapperVOGetNew(input, channel, this.volume);
        }
        if (!vo)
            return;
        audio = this.audioWrapperGet(vo);
        audio.play();
        this.audioWrapperKillOutdated();
        this.audioWrappersListenerUpdate();
        return audio;
    }
}
AudioService.AUDIO_CHANNEL_NAME_DEFAULT = "main";
AudioService.AUDIO_CHANNEL_VOLUME_DEFAULT = 1;
//# sourceMappingURL=AudioService.js.map