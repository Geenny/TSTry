import { WindowType } from '../states/WindowType';
import WindowService from '../WindowService';
export default class WindowVO {
    constructor(data = null) {
        this.windowService = WindowService.service;
        this.type = WindowType.DEFAULT;
        this.priority = 0;
        this.action = 0; // bitmask: 1 - default, 2 - autoclose, 4 - closeable, 8 - faderclose, 16 - strong
        this.group = 0;
        this.unique = -1;
        this.ID = -1;
        this.name = "Window";
        this.width = 400;
        this.height = 400;
        this.fader = true;
        this.animation = true;
        this.animationShowTime = 500; // ms
        this.animationHideTime = 500; // ms
        this.options = {};
        this.data = {};
        this.parse(data);
    }
    parse(data) {
        if (!data)
            data = {};
        Object.assign(this.data, data);
        for (let key in data) {
            if (!this.hasOwnProperty(key))
                continue;
            this[key] = data[key];
        }
        // this.windowService = data.windowService || this.windowService;
        // this.type = data.type || this.type;
        // this.priority = data.priority || this.priority;
        // this.action = data.action || this.action;
        // this.group = data.group || this.group;
        // this.name = data.name || this.name;
        // this.width = data.width || this.width;
        // this.height = data.height || this.height;
    }
    /**
     * Вернуть клон данного объекта VO
     */
    clone() {
        return new WindowVO(this.data);
    }
    /**
     * Вернуть клон данного объекта VO c изменениями через параметр @options
     */
    cloneWithChanges(addons = {}) {
        let data = {};
        Object.assign(data, this.data);
        Object.assign(data, this.data);
        return new WindowVO(data);
    }
}
//# sourceMappingURL=WindowVO.js.map