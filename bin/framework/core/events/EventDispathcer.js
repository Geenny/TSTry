export default class EventDispathcer {
    constructor() {
        this._dispatcher = [];
    }
    dispatchEvent(event) {
        for (let i = 0; i < this._dispatcher.length; i++) {
            let target = this._dispatcher[i];
            if (target.type != event.type)
                continue;
            target.handler(event);
        }
    }
    /**
     * Проверка наличия данного слушателя событий по @type
     * @param type
     * @param handler
     */
    hasEventListener(type, handler = null) {
        for (let eventVO of this._dispatcher) {
            if (eventVO.type == type) {
                if (handler == null) {
                    return true;
                }
                else if (eventVO.handler == handler) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * Добавление слушателя событий @handler по @type
     * @param type
     * @param handler
     * @param useCapture
     * @param priority
     */
    addEventListener(type, handler, useCapture = false, priority = 0) {
        if (!type || !handler)
            return;
        this._dispatcher.push(new EventVO(type, handler, useCapture, priority));
    }
    /**
     * Очистка слушателя
     * @param type
     * @param handler
     */
    removeEventListener(type, handler) {
        for (let i = this._dispatcher.length - 1; i > -1; i--) {
            let target = this._dispatcher[i];
            if (target.type != type && target.handler != handler)
                continue;
            this._dispatcher.splice(i, 1);
        }
    }
    /**
     * Очистка всех слушателей
     */
    removeEventListeners() {
        while (this._dispatcher.length) {
            let target = this._dispatcher[this._dispatcher.length - 1];
            this.removeEventListener(target.type, target.handler);
        }
    }
}
class EventVO {
    constructor(type, handler, useCapture = false, priority = 0) {
        this.type = type;
        this.handler = handler;
        this.useCapture = useCapture;
        this.priority = priority;
    }
}
//# sourceMappingURL=EventDispathcer.js.map