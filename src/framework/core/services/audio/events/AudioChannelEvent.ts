import Event from '../../../events/Event';
import AudioServiceChannel from '../AudioServiceChannel';

export default class AudioChannelEvent extends Event {

    public static get VOLUME(): string { return "audioChannelVolume"; }
    public static get MUTE(): string { return "audioChannelMute"; }

    public channel: AudioServiceChannel;

    constructor( type: string, channel: AudioServiceChannel = null ) {

        super( type, false, false );

        this.channel = channel;

    }

}