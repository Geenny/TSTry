import EventDispathcer from '../../core/events/EventDispathcer';
import DependenceManager from '../../core/dependency/DependenceManager';
import DependencyManagerEvent from '../../core/dependency/events/DependencyManagerEvent';
import Module from './Module';
import ModuleEvent from './events/ModuleEvent';
import ModulesEvent from './events/ModulesEvent';

export default class Modules extends EventDispathcer implements IEnable, IDestroy {

    private _enable: boolean = true;

    protected manager: DependenceManager;
    protected dependencyListByNames: string[] = [];     // Список имен

    constructor() {
        super();
    }

    //

    public init() {
        this.initDependencyManager();
    }

    public destroy() { }

    // GET/SET

    public get enable(): boolean { return this._enable; }
    public set enable( value: boolean) { this._enable = value; }

    // DEPENDENCIES

    private initDependencyManager() {
        this.manager = new DependenceManager( this.getModules() );
        this.addEventListener( DependencyManagerEvent.DEPENDENCY_CHANGE, this.onModuleChange );
        this.addEventListener( DependencyManagerEvent.DEPENDENCY_COMPLETE, this.onModuleComplete );
        this.addEventListener( DependencyManagerEvent.DEPENDENCY_DESTROY, this.onModuleDestroy );
        this.addEventListener( DependencyManagerEvent.DEPENDENCY_ERROR, this.onModuleError );
        this.addEventListener( DependencyManagerEvent.INIT, this.onModulesInit );
        this.addEventListener( DependencyManagerEvent.COMPLETE, this.onModulesComplete );
        this.manager.init();
    }

    protected onModuleChange( event: DependencyManagerEvent ) {
        this.dispatchEvent( new ModuleEvent( ModuleEvent.CHANGE, event.dependency as Module ) );
    }
    protected onModuleComplete( event: DependencyManagerEvent ) {
        this.dispatchEvent( new ModuleEvent( ModuleEvent.COMPLETE, event.dependency as Module ) );
    }
    protected onModuleDestroy( event: DependencyManagerEvent ) {
        this.dispatchEvent( new ModuleEvent( ModuleEvent.DESTROY, event.dependency as Module ) );
    }
    protected onModuleError( event: DependencyManagerEvent ) {
        this.dispatchEvent( new ModuleEvent( ModuleEvent.ERROR, event.dependency as Module ) );
    }
    protected onModulesInit( event: DependencyManagerEvent ) {
        this.dispatchEvent( new ModulesEvent( ModulesEvent.INIT, this, event.dependency as Module ) );
    }
    protected onModulesComplete( event: DependencyManagerEvent ) {
        this.dispatchEvent( new ModulesEvent( ModulesEvent.COMPLETE, this, event.dependency as Module ) );
    }
    


    /**
     * Список 
     */
    private getModules(): Module[] {
        let list: Module[] = [];
        for ( let i = 0; i < this.dependencyListByNames.length; i++ ) {
            let dependency = this.getDependencyByName( this.dependencyListByNames[ i ] );
            if ( !dependency ) continue;
            list.push( dependency );
        }
        return list;
    }

    /**
     * Метод для возврата @Module по его имени 
     * @param name 
     */
    protected getDependencyByName( name: string ): Module { return null; }

}