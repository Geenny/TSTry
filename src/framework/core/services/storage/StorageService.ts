import Service from '../service/Service';
import StorageServiceVO from './vo/StorageServiceVO';
import { ServiceState } from '../service/states/ServiceState';
import Time from '../../utils/Time';

export default class StorageService extends Service {

    private static _instance: StorageService;

    public static get instance(): StorageService {
        if ( !StorageService.instance ) StorageService._instance = new StorageService( new StorageServiceVO( {} ) );
        return StorageService.instance;
    }

    protected timeoutIndentifier: number = 0;
    protected timeoutLast: number = 0;

    public storage: any = { };

    constructor( vo: StorageServiceVO ) {
        super( vo );
        this.init();
    }

    // GET/SET

    public get isSupport(): boolean { return typeof( Storage ) !== "undefined"; }

    public get vo(): StorageServiceVO { return this.sourceVO as StorageServiceVO; }
    public get timeout(): number { return this.vo.storeTimeout; }
    public get now(): number { return Time.now(); }

    protected get localStorageBranch(): any { return JSON.parse( localStorage[ this.vo.objectName ] ); }
    protected set localStorageBranch( value: any) { localStorage[ this.vo.objectName ] = JSON.stringify( value ); }

    // INIT

    public init() {
        super.init();
        this.initStorage();
    }

    // STORAGE

    public initStorage() {
        this.storage = this.localStorageBranch;
    }

    // ACTIONS

    public store( key: string, data: any, immediatly: boolean = false ) {
        if ( !key || !( typeof key == "string" ) || key.length == 0 ) return;
        this.storage[ key ] = data;
        this.save( immediatly );
    }
    public read( key: string, defaults: any = null ): any {
        return this.storage[ key ] || defaults;
    }

    // SAVE

    private save( immediatly: boolean = false ) {
        if ( immediatly ) this.clearSaveTimeout();
        if ( !this.checkStoreTimeout() ) return;
        this.state = ServiceState.WORKING;
        this.saving();
        this.state = ServiceState.FREE;
    }
    private saving() {
        this.localStorageBranch = this.storage;
    }

    // TIMEOUT

    private clearSaveTimeout() {
        this.timeoutLast = this.now;
        clearTimeout( this.timeoutIndentifier );
    }
    private setSaveTimeout() {
        if ( this.timeoutIndentifier > 0 ) return;
        this.timeoutLast = this.now + this.vo.storeTimeout;
        this.timeoutIndentifier = setTimeout( () => {
            this.save( true );
        }, this.vo.storeTimeout );
    }
    private checkStoreTimeout(): boolean {

        if ( this.vo.storeTimeout <= 0 ) return true;

        if ( this.timeoutLast <= this.now ) {
            this.setSaveTimeout();
            return false;
        }

        if ( this.timeoutLast > this.now ) {
            return false;
        }

        return true;
    }

    //
    // INSTANCE METHODS
    //

    public static store( key: string, value: any, immediatly: boolean = false ) {
        StorageService.instance.store( key, value, immediatly );
    }
    public static read( key: string, defaults: any = null ) {
        StorageService.instance.store( key, defaults );
    }


}