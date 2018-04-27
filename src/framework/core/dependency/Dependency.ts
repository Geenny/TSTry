import EventDispathcer from '../events/EventDispathcer';
import DependenceManager from './DependenceManager';
import DependencyManagerEvent from "./events/DependencyManagerEvent";
import DependencyEvent from './events/DependencyEvent';
import { DependenyState } from './states/DependencyState';

export default abstract class Dependency extends EventDispathcer implements IDependency {

    private _inited: boolean;
    private _state: number | string;
    private _manager: DependenceManager;
    private _ID: number;
    private _name: string;
    private _description: string;
    private _enable: boolean;
    private _complete: boolean;
    private _process: boolean;
    private _errorMessage: string;
    private _list: number[] = [];

    constructor( ID: number, dependencies: number[] = [] ) {
        super();
        this._ID = ID;
        this._list = dependencies;
    }

    //
    // GET/SET
    //

    // INTERFACE

    public get inited(): boolean { return this._inited; }

    public get ID(): number { return this._ID; }
    public get name(): string { return this._name; }
    public get description(): string { return this._description; }

    public get state(): number | string { return this._state; }
    public set state( value: number | string ) { this._state = value; }

    public get list(): number[] { return this._list; }

    public get enable(): boolean { return this._enable; }
    public set enable( value: boolean ) { this._enable = value; }

    public get complete(): boolean { return this._complete; }           // Инициализация завершена
    public get process(): boolean { return this._process; }             // Процесс инициализации
    public get errorMessage(): string { return this._errorMessage; }

    public get manager(): DependenceManager { return this._manager; }
    public set manager( value: DependenceManager ) { this._manager = value; }

    // 

    public init(): void {
        this.dispatchEvent( new DependencyEvent( DependencyEvent.INIT, this ) );
    }
    public destroy(): void {
        this.state = DependenyState.DESTROY;
        this._enable = false;
        this.dispatchEvent( new DependencyEvent( DependencyEvent.DESTROY, this ) );
    }

    //

    /**
     * Добавление @ID зависимостей от которых зависит данная зависимость
     * @param list 
     */
    protected addDependency( list: IDependency[] | number[] ): boolean {
        if ( !list ) return false;
        for ( let i = 0; i < list.length; i++ ) {
            let id: IDependency | number = list[ i ];
            let ID: number = ( id instanceof Dependency ) ? ( id as Dependency ).ID : id as number;
            if ( this.list.indexOf( ID ) != -1 ) continue;
            this.list.push( ID );
        }
        return this.list.length > 0;
    }

    // 

    /**
     * Сброс данных данного @Dependency
     */
    public reset() {
        this._complete = false;
    }

    /**
     * Инициация инициализации модуля @IDependency
     */
    public start(): void {
        this._process = true;
        this.state = DependenyState.STARTED;
        this.dispatchEvent( new DependencyEvent( DependencyEvent.START, this ) );
    }

    /**
     * Условный шаг процесса подготовки модуля @IDependency
     */
    protected step(): void {
        this.state = DependenyState.PROCESS;
        this.dispatchEvent( new DependencyEvent( DependencyEvent.STEP, this ) );
    }

    /**
     * Завершение инициализации модуля @IDependency
     */
    protected finish(): void {
        this._process = false;
        this._complete = true;
        this.state = DependenyState.COMPLETE;
        this.dispatchEvent( new DependencyEvent( DependencyEvent.COMPLETE, this ) );
    }

    /**
     * Ошибка модуля
     */
    protected error(): void {
        this._process = false;
        this.state = DependenyState.ERROR;
        this.dispatchEvent( new DependencyEvent( DependencyEvent.ERROR, this ) );
    }

    /**
     * Инициация изменений в модуле @IDependency
     */
    protected change(): void {
        this._process = true;
        this.state = DependenyState.CHANGE;
        this.dispatchEvent( new DependencyEvent( DependencyEvent.CHANGE, this ) );
    }

}