export default class AudioServiceChannel {
    constructor(name, volume = 1) {
        this._name = "audioChannelName";
        this._volume = 1;
        this.audioWrapperList = [];
        this.globalMute = false;
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
        this.volumeChange();
    }
    get mute() { return this._mute || this.globalMute; }
    set mute(value) { this._mute = value; }
    // HANDLERS
    globalMuteSet(value = false) {
        this.globalMute = value;
    }
    // SERVICE
    /**
     * изменить звук во всех запущенных звуковых @AudioWrapper
     */
    volumeChange() {
    }
}
//# sourceMappingURL=AudioServiceChannel.js.map