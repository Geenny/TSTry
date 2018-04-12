import Controller from '../Controller';
export default class DeviceController extends Controller {
    constructor(application, options = null) {
        super(application, options);
    }
    get isMobile() {
        return !!(navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i));
    }
}
//# sourceMappingURL=DeviceController.js.map