
import Dependency from '../framework/core/dependency/Dependency';
import EventDispathcer from '../framework/core/events/EventDispathcer';
import UserVO from './vo/UserVO';
import UserDependency from './UserDependency';
import ApplicationDependeneManager from '../core/dependency/ApplicationDependenceManager';
import { ApplicationDependencyConst } from '../core/dependency/ApplicationDependencyConst';

export default class User extends EventDispathcer implements IEnable, IInit, IState {

    private _inited: boolean;
    private _enable: boolean;
    private _state: boolean;
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

    public vo(): UserVO { return this._vo; }

    // VO

    protected initVO( vo: UserVO ) {
        this._vo = vo;
    }

    // INIT

    protected init() {
        this.initDependency();

    }

    protected initDependency() {
        this._dependency = new UserDependency( ApplicationDependencyConst.USER, [] );
    }

}