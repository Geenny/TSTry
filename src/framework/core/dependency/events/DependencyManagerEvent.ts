
import Event from "../../events/Event";
import DependenceManager from '../DependenceManager';

export default class DependencyEvent extends Event {

    static get INIT(): string { return "dependencyManagerInit"; }
    static get COMPLETE(): string { return "dependencyManagerComplete"; }
    static get DEPENDENCY_COMPLETE(): string { return "dependencyManagerDependencyComplete"; }
    static get DEPENDENCY_CHANGE(): string { return "dependencyManagerDependencyChange"; }
    static get DEPENDENCY_ERROR(): string { return "dependencyManagerDependencyError"; }
    static get DEPENDENCY_DESTROY(): string { return "dependencyManagerDependencyDestroy"; }

    public manager: DependenceManager;
    public dependency: IDependency;

    constructor( type: string, manager: DependenceManager = null, dependency: IDependency = null ) {

        super( type, false, false );

        this.manager = manager;
        this.dependency = dependency;

    }

}