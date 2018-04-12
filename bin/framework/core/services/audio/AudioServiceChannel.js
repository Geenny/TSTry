import EventDispathcer from '../../events/EventDispathcer';
import AudioChannelEvent from './events/AudioChannelEvent';
export default class AudioServiceChannel extends EventDispathcer {
    constructor(name, volume = 1) {
        super();
        this._name = "audioChannelName";
        this._volume = 1;
        this.audioWrapperList = [];
        this._name = name;
        this.volume = volume;
    }
    // GET/SET
    get name() { return this._name; }
    get volume() { return this._volume; }
    set volume(value) {
        if (value < 0)
            value = 0;
        if (value > 1)
            value = 1;
        this._volume = value;
        this.dispatchEvent(new AudioChannelEvent(AudioChannelEvent.VOLUME, this));
    }
    get mute() { return this._mute || this._globalMute; }
    set mute(value) {
        this._mute = value;
        this.dispatchEvent(new AudioChannelEvent(AudioChannelEvent.MUTE, this));
    }
    // HANDLERS
    globalMuteSet(globalMute = false) {
        this._globalMute = globalMute;
    }
    // SERVICE
    /**
     * изменить звук во всех запущенных звуковых @AudioWrapper
     */
    volumeChange() {
    }
}
//# sourceMappingURL=AudioServiceChannel.js.map