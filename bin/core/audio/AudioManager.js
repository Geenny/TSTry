import AudioManagerVO from './vo/AudioManagerVO';
export default class AudioManager {
    constructor(audioManagerVO = new AudioManagerVO()) {
        this.initVO(audioManagerVO);
    }
    // GET/SET
    get inited() { return this._inited; }
    set inited(value) { this._inited = value; }
    get vo() { return this._vo; }
    // VO
    initVO(vo) {
        this._vo = vo;
    }
    // Init
    init() { }
}
//# sourceMappingURL=AudioManager.js.map