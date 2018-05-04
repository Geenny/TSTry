import AudioManagerVO from '../audio/vo/AudioManagerVO';
import WindowServiceVO from '../../framework/core/services/windows/vo/WindowServiceVO';
export default class CONFIG {
    constructor(data = {}) {
        this.audio = {};
        this.window = {};
        this.data = {};
        this.parse(data);
        CONFIG.instance = this;
    }
    // CONFIG
    static get instance() { return this._instance; }
    static set instance(value) { this._instance = value; }
    // Components
    static get audio() { return new AudioManagerVO(CONFIG.instance.audio); }
    static get window() { return new WindowServiceVO(CONFIG.instance.window); }
    parse(data) {
        this.data = data;
    }
}
//# sourceMappingURL=CONFIG.js.map