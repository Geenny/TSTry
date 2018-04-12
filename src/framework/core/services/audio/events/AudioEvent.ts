import AudioWrapper from '../AudioWrapper';
import Event from '../../../events/Event';

export default class AudioEvent extends Event {

    public static get METADATA(): string { return "audioMetaData"; }
    public static get PLAY(): string { return "audioPlay"; }
    public static get PLAYING(): string { return "audioPlaying"; }
    public static get PAUSE(): string { return "audioPause"; }
    public static get CAN_PLAY(): string { return "audioCanPlay"; }
    public static get CAN_PLAY_THROUGH(): string { return "audioCanPlayThrough"; }
    public static get PROGRESS(): string { return "audioProgress"; }
    public static get DURATION_CHANGE(): string { return "audioDurationChange"; }
    public static get TIME_CHANGE(): string { return "audioTimeChange"; }               // Изменение позиции проигрывания
    public static get ENDED(): string { return "audioEnded"; }
    public static get LOOP(): string { return "audioLoop"; }

    public audioWrapper: AudioWrapper;

    constructor( type: string, audioWrapper: AudioWrapper = null ) {

        super( type, false, false );

        this.audioWrapper = audioWrapper;

    }

}