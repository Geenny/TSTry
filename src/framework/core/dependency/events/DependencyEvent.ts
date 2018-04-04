
import Event from "../../events/Event";

export default class DependencyEvent extends Event {

    public static get INIT(): string { return "dependencyInit"; }
    public static get START(): string { return "dependencyStart"; }
    public static get COMPLETE(): string { return "dependencyComplete"; }
    public static get CHANGE(): string { return "dependencyChange"; }
    public static get STEP(): string { return "dependencyStep"; }
    public static get ERROR(): string { return "dependencyError"; }
    public static get DESTROY(): string { return "dependencyError"; }

    public dependency: IDependency;

    constructor( type: string, dependency: IDependency ) {

        super( type, false, false );

        this.dependency = dependency;

    }

}