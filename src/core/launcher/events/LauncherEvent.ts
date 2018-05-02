import Event from '../../../framework/core/events/Event';
import Launcher from '../Launcher';

export default class LauncherEvent extends Event {

    public static get INIT(): string { return "launcherInit"; }

    public launcher: Launcher;

    constructor( type: string, launcher: Launcher ) {
        super( type, false, false );
        this.launcher = launcher;
    }

}