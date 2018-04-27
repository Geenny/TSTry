import Event from '../../framework/core/events/Event';
export default class MainEvent extends Event {

    public static get INIT(): string { return "mainInit"; }

    public static get DEPENDENCY_INIT(): string { return "mainDependencyInit"; }
    public static get DEPENDENCY_PROGRESS(): string { return "mainDependencyProgress"; }
    public static get DEPENDENCY_COMPLETE(): string { return "mainDependencyComplete"; }

    public data: any;

    constructor( type: string, data: any ) {
        super( type, false, false );
        this.data = data;
    }

}