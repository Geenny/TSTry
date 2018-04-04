import Application from './framework/application/Application';
import Log from './framework/core/utils/Log';
import ApplicationEvent from './framework/application/events/ApplicationEvent';
import StorageService from './framework/core/services/storage/StorageService';
import StorageServiceVO from './framework/core/services/storage/vo/StorageServiceVO';
export default class Main extends Application {
    constructor(container) {
        super(container);
        Log.log("Started: MAIN");
        this.addEventListener(ApplicationEvent.APPLICATION_KEYBOARD_KEYDOWN, (e) => { Log.log(e); });
        this.addEventListener(ApplicationEvent.APPLICATION_KEYBOARD_KEYUP, (e) => { Log.log(e); });
        this.addEventListener(ApplicationEvent.APPLICATION_RESIZE, (e) => { Log.log(e); });
        this.addEventListener(ApplicationEvent.APPLICATION_FOCUS, (e) => { Log.log(e); });
        this.addEventListener(ApplicationEvent.APPLICATION_BLUR, (e) => { Log.log(e); });
        StorageService.instance = new StorageService(new StorageServiceVO({}));
        StorageService.instance.store("abc", 1);
        Log.log(StorageService.instance.read("abc"));
    }
}
//# sourceMappingURL=Main.js.map