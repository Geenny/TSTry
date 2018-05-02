
import Dependency from '../framework/core/dependency/Dependency';
import EventDispathcer from '../framework/core/events/EventDispathcer';
import UserVO from './vo/UserVO';
import UserDependency from './UserDependency';
import ApplicationDependeneManager from '../core/dependency/ApplicationDependenceManager';
import { ApplicationDependencyConst } from '../core/dependency/ApplicationDependencyConst';
import DependencyEvent from '../framework/core/dependency/events/DependencyManagerEvent';
import Application from '../framework/application/Application';
import Profile from '../framework/core/user/Profile';
import Main from '../Main';

export default class User extends EventDispathcer implements IEnable, IInit, IState {

    private _inited: boolean;
    private _enable: boolean;
    private _state: number | string;
    private _dependency: UserDependency;
    private _vo: UserVO;

    constructor( userVO: UserVO = new UserVO() ) {
        super();
        this.initVO( userVO );
    }

    // GET/SET

    public get inited(): boolean { return this._inited; }

    public get state(): number | string { return this._state; }
    public set state( value: number | string ) { this._state = value; }

    public get enable(): boolean { return this._enable; }
    public set enable( value: boolean ) { this._enable = value; }

    public get dependency(): UserDependency { return this._dependency; }
    public set dependency( value: UserDependency) { this._dependency = value; }

    public get vo(): UserVO { return this._vo; }

    public get profile(): Profile { return this.vo.profile as Profile; }

    protected get application(): Application { return Application.instance; }

    // VO

    protected initVO( vo: UserVO ) {
        this._vo = vo;
    }

    // INIT

    public init() {
        if ( this.inited ) return;
        this.initDependency();
        this._inited = true;
    }

    //
    // DEPENDENCY
    //

    /**
     * Создание зависимости для @User
     */
    protected initDependency() {
        let dependency: UserDependency = new UserDependency( ApplicationDependencyConst.USER, [] );
        this._dependency = dependency;

        dependency.manager = Main.instance.applicationDependenceManager;
        dependency.addEventListener( DependencyEvent.DEPENDENCY_COMPLETE, this.onDependencyComplete, false, 1 );
        dependency.addEventListener( DependencyEvent.DEPENDENCY_CHANGE, this.onDependencyChange, false, 1 );
    }
    protected onDependencyComplete( event: DependencyEvent ) {

    }
    protected onDependencyChange( event: DependencyEvent ) {

    }

}