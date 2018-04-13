import KeyboardController from './keyboard/KeyboardController';
import ResizeController from './resize/ResizeController';
import FocusController from './focus/FocusController';
import OrientationController from './orientation/OrientationController';
import DeviceController from './device/DeviceController';
export default class ControllersVO {
    constructor(data = null) {
        /**
         * Список объектов опций для классов контроллеров
         */
        this.KeyboardController = {};
        this.ResizeController = {};
        this.OrientationController = {};
        this.FocusController = {};
        this.DeviceController = {};
        this.controllerList = []; // Список классов контроллеров, которые должны быть запущены
        this.parse(data);
    }
    parse(data) {
        if (!data)
            data = {};
        this.data = data;
        this.KeyboardController = this.data.KeyboardController || this.KeyboardController;
        this.ResizeController = this.data.ResizeController || this.ResizeController;
        this.OrientationController = this.data.OrientationController || this.OrientationController;
        this.FocusController = this.data.FocusController || this.FocusController;
        this.DeviceController = this.data.DeviceController || this.DeviceController;
        this.controllerList = this.getControllerList(data.controllerList);
    }
    getControllerList(controllerList) {
        let list;
        if (!controllerList || this.controllerList.length == 0) {
            list = ControllersVO.controllerListDefault;
        }
        else {
            list = controllerList;
        }
        return list;
    }
}
/**
 * Список Классов контроллеров для
 */
ControllersVO.controllerListDefault = [
    KeyboardController,
    ResizeController,
    FocusController,
    OrientationController,
    DeviceController
];
//# sourceMappingURL=ControllersVO.js.map