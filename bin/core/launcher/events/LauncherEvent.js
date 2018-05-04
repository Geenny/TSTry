import Event from '../../../framework/core/events/Event';
export default class LauncherEvent extends Event {
    static get INIT() { return "launcherInit"; }
    constructor(type, launcher) {
        super(type, false, false);
        this.launcher = launcher;
    }
}
//# sourceMappingURL=LauncherEvent.js.map