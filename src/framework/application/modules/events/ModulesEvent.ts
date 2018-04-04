import Event from '../../../core/events/Event';
import Modules from '../Modules';
import Module from '../Module';

export default class ModuleEvent extends Event {

    public static get INIT(): string { return "modulesInit"; }
    public static get COMPLETE(): string { return "modulesComplete"; }

    public modules: Modules;
    public module: Module;

    constructor( type: string, modules:Modules, module:Module = null ) {

        super( type, false, false );

        this.modules = modules;
        this.module = module;

    }

}