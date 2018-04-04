import Service from '../service/Service';
import { ServiceState } from '../service/states/ServiceState';
export default class StorageService extends Service {
    constructor(vo) {
        super(vo);
        this.timeoutIndentifier = 0;
        this.timeoutLast = 0;
        this.storage = {};
        this.init();
    }
    // GET/SET
    get vo() { return this.sourceVO; }
    get timeout() { return this.vo.storeTimeout; }
    get now() { return Date.now(); }
    get localStorageBranch() { return JSON.parse(localStorage[this.vo.objectName]); }
    set localStorageBranch(value) { localStorage[this.vo.objectName] = JSON.stringify(value); }
    // INIT
    init() {
        super.init();
        StorageService.instance = this;
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
}
//# sourceMappingURL=StorageService.js.map