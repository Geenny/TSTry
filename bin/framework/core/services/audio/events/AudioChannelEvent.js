import Event from '../../../events/Event';
export default class AudioChannelEvent extends Event {
    static get VOLUME() { return "audioChannelVolume"; }
    static get MUTE() { return "audioChannelMute"; }
    constructor(type, channel = null) {
        super(type, false, false);
        this.channel = channel;
    }
}
//# sourceMappingURL=AudioChannelEvent.js.map