import Event from '../../../core/events/Event';
import Module from '../Module';

export default class ModuleEvent extends Event {

    public static get ERROR(): string { return "moduleError"; }
    public static get DESTROY(): string { return "moduleDestroy"; }
    public static get COMPLETE(): string { return "moduleComplete"; }
    public static get CHANGE(): string { return "moduleChange"; }

    public module: Module;

    constructor( type: string, module:Module ) {

        super( type, false, false );

        this.module = module;

    }

}