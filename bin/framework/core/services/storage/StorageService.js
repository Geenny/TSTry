import Service from '../service/Service';
import StorageServiceVO from './vo/StorageServiceVO';
import { ServiceState } from '../service/states/ServiceState';
import Time from '../../utils/Time';
export default class StorageService extends Service {
    constructor(vo) {
        super(vo);
        this.timeoutIndentifier = 0;
        this.timeoutLast = 0;
        this.storage = {};
        this.init();
    }
    static get instance() {
        if (!StorageService.instance)
            StorageService._instance = new StorageService(new StorageServiceVO({}));
        return StorageService.instance;
    }
    // GET/SET
    get isSupport() { return typeof (Storage) !== "undefined"; }
    get vo() { return this.sourceVO; }
    get timeout() { return this.vo.storeTimeout; }
    get now() { return Time.now(); }
    get localStorageBranch() { return JSON.parse(localStorage[this.vo.objectName]); }
    set localStorageBranch(value) { localStorage[this.vo.objectName] = JSON.stringify(value); }
    // INIT
    init() {
        super.init();
        this.initStorage();
    }
    // STORAGE
    initStorage() {
        this.storage = this.localStorageBranch;
    }
    // ACTIONS
    store(key, data, immediatly = false) {
        if (!key || !(typeof key == "string") || key.length == 0)
            return;
        this.storage[key] = data;
        this.save(immediatly);
    }
    read(key, defaults = null) {
        return this.storage[key] || defaults;
    }
    // SAVE
    save(immediatly = false) {
        if (immediatly)
            this.clearSaveTimeout();
        if (!this.checkStoreTimeout())
            return;
        this.state = ServiceState.WORKING;
        this.saving();
        this.state = ServiceState.FREE;
    }
    saving() {
        this.localStorageBranch = this.storage;
    }
    // TIMEOUT
    clearSaveTimeout() {
        this.timeoutLast = this.now;
        clearTimeout(this.timeoutIndentifier);
    }
    setSaveTimeout() {
        if (this.timeoutIndentifier > 0)
            return;
        this.timeoutLast = this.now + this.vo.storeTimeout;
        this.timeoutIndentifier = setTimeout(() => {
            this.save(true);
        }, this.vo.storeTimeout);
    }
    checkStoreTimeout() {
        if (this.vo.storeTimeout <= 0)
            return true;
        if (this.timeoutLast <= this.now) {
            this.setSaveTimeout();
            return false;
        }
        if (this.timeoutLast > this.now) {
            return false;
        }
        return true;
    }
    //
    // INSTANCE METHODS
    //
    static store(key, value, immediatly = false) {
        StorageService.instance.store(key, value, immediatly);
    }
    static read(key, defaults = null) {
        StorageService.instance.store(key, defaults);
    }
}
//# sourceMappingURL=StorageService.js.map