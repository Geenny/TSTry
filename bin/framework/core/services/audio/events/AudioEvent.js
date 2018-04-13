import Event from '../../../events/Event';
export default class AudioEvent extends Event {
    static get METADATA() { return "audioMetaData"; }
    static get PLAY() { return "audioPlay"; }
    static get PLAYING() { return "audioPlaying"; }
    static get PAUSE() { return "audioPause"; }
    static get CAN_PLAY() { return "audioCanPlay"; }
    static get CAN_PLAY_THROUGH() { return "audioCanPlayThrough"; }
    static get PROGRESS() { return "audioProgress"; }
    static get DURATION_CHANGE() { return "audioDurationChange"; }
    static get TIME_CHANGE() { return "audioTimeChange"; } // Изменение позиции проигрывания
    static get RATE_CHANGE() { return "audioTimeChange"; } // Изменение скорости проигрывания
    static get ENDED() { return "audioEnded"; }
    static get LOOP() { return "audioLoop"; }
    constructor(type, audioWrapper = null) {
        super(type, false, false);
        this.audioWrapper = audioWrapper;
    }
}
//# sourceMappingURL=AudioEvent.js.map