import EventDispathcer from '../events/EventDispathcer';
import DependencyEvent from './events/DependencyEvent';
import DependencyManagerEvent from "./events/DependencyManagerEvent";
import Dependency from './Dependency';

export default class DependenceManager extends EventDispathcer implements IInit, IEnable, IDestroy {

    private _listOfListeners: IDependency[] = [];
    private _changeDependencyList: IDependency[] = [];
    private _list: IDependency[] = [];
    private _enable: boolean;               // Доступность @DependenceManager
    private _inited: boolean;               // Инициализация заверщена

    protected started: boolean;             // Ручной запуск менеджера зависимостей

    constructor( list: IDependency[] = null ) {
        super();
        this.initDependencyList( list );
    }

    /**
     * INTERFACES
     */

    public init(): void {
        if ( this.started ) return;
        this.started = true;
        this.reinit();
    }

    public destroy(): void {
        for ( let i = 0; i < this.length; i++ ) {
            let dependency = this._list.shift();
            if ( !dependency ) continue;
            dependency.destroy();
        }
    }

    public get inited(): boolean { return this._inited; }

    public get enable(): boolean { return this._enable; }
    public set enable( value: boolean ) { this._enable = value; }


    //
    // GET/SET
    //

    public get length(): number { return this._list.length; }


    //
    // DEPENDENCY LIST
    //

    private initDependencyList( list: IDependency[] = null ) {
        this.clearList();
        for ( let i = 0; i < list.length; i++ ) {
            let dependency = list[ i ];
            this.dependencyAdd( dependency );
        }
    }

    private clearList() {
        while( this.length ) {
            let dependency = this._list.shift();
            this.dependencyDestroy( dependency );
        }
    }


    //
    // DEPENDENCY
    //

    // Уничтожение @IDependency
    protected dependencyDestroy( dependency: IDependency ) {
        if ( !dependency ) return;
        dependency.destroy();
        dependency = null;
    }

    /**
     * Добавление @IDependency в список. Метод не вернет @IDependency если
     * пере
     * @param dependency 
     */
    protected dependencyAdd( dependency: IDependency ): IDependency {
        if ( !( dependency instanceof Dependency ) ) return null;
        if ( this.dependencyInList( dependency ) ) return dependency;
        this._list.push( dependency );

        if ( this.inited ) {
            this.dependenceChange( dependency );
        }

        return dependency;
    }

    /**
     * Удаление зависимости из списка. Метод не вернет @IDependency если
     * не удалось удалить его из списка.
     * @param dependency 
     */
    protected dependencyRemove( dependency: IDependency ): IDependency {
        if ( !this.dependencyInList( dependency ) ) return null;
        this._list.slice( this.dependencyIndex( dependency ), 1 );
        return dependency;
    }

    protected dependencyInList( dependency: IDependency ): boolean {
        return this.dependencyIndex( dependency ) != -1;
    }

    // Позиция @IDependency в списке
    protected dependencyIndex( dependency: IDependency ): number {
        return this._list.indexOf( dependency );
    }

    /**
     * @IDependency по позиции в списке
     * @param index 
     */
    protected dependencyByIndexGet( index: number ): IDependency {
        if ( index < 0 || index >= this.length ) return null;
        return this._list[ index ];
    }

    protected dependencyByIDGet( ID: number ): IDependency {
        for ( let i = 0; i < this.length; i++ ) {
            let dependency = this._list[ i ];
            if ( dependency.ID == ID ) return dependency;
        }
        return null;
    }

    /**
     * Добавление слушателей к @Dependency
     * @param dependency 
     */
    protected dependencyListenersAdd( dependency: Dependency ): boolean {

        if ( this._listOfListeners.indexOf( dependency ) != -1 ) return false;

        dependency.addEventListener( DependencyEvent.INIT, this.onDependencyInit );
        dependency.addEventListener( DependencyEvent.START, this.onDependencyStart );
        dependency.addEventListener( DependencyEvent.STEP, this.onDependencyStep );
        dependency.addEventListener( DependencyEvent.COMPLETE, this.onDependencyComplete );
        dependency.addEventListener( DependencyEvent.CHANGE, this.onDependencyChange );
        dependency.addEventListener( DependencyEvent.ERROR, this.onDependencyError );
        dependency.addEventListener( DependencyEvent.DESTROY, this.onDependencyDestroy );
        return true;

    }

    /**
     * Удаление пакета слушателей с @Dependency
     * @param dependency 
     */
    protected dependencyListenersRemove( dependency: Dependency ): boolean {

        if ( !dependency ) return false;
        dependency.removeEventListener( DependencyEvent.INIT, this.onDependencyInit );
        dependency.removeEventListener( DependencyEvent.START, this.onDependencyStart );
        dependency.removeEventListener( DependencyEvent.STEP, this.onDependencyStep );
        dependency.removeEventListener( DependencyEvent.COMPLETE, this.onDependencyComplete );
        dependency.removeEventListener( DependencyEvent.CHANGE, this.onDependencyChange );
        dependency.removeEventListener( DependencyEvent.ERROR, this.onDependencyError );
        dependency.removeEventListener( DependencyEvent.DESTROY, this.onDependencyDestroy );

        let index = this._listOfListeners.indexOf( dependency );
        if ( index == -1 ) this._listOfListeners.splice( index, 1 );

        return true;
    }



    //
    // INIT
    //

    private reinit() {
        if ( !this.enable ) return;
        if ( !this.started ) return;
        this.dependenceListAddListeners();
        this.dependenceProcess();
    }

    /**
     * Подвязка слушателей к зависимостям без 
     */
    private dependenceListAddListeners() {
        for ( let i = 0; i < this.length; i++ ) {
            let dependency = this.dependencyByIndexGet( i ) as Dependency;
            if ( !dependency ) continue;
            this.dependencyListenersAdd( dependency );
        }
    }

    private dependenceListRemoveListeners() {
        for ( let i = 0; i < this.length; i++ ) {
            let dependency = this.dependencyByIndexGet( i ) as Dependency;
            if ( !dependency ) continue;
            this.dependencyListenersRemove( dependency );
        }
    }


    //
    // DEPENDENCE PROCESS
    // Процесс подготовки каждого из модуля зависимостей
    //

    private dependenceProcess() {
        this.dependencyProcessStart();
        this.dependencyProcessCheckReady();
    }

    private dependencyProcessStart() {
        let listForStart: Dependency[] = [];

        // 
        for ( let i = 0; i < this.length; i++ ) {
            let dependency = this.dependencyByIndexGet( i ) as Dependency;
            if ( !this.isReadyForStart( dependency ) ) continue;
            if ( !this.childDependenciesReady( dependency ) ) continue;
            listForStart.push( dependency );
        }

        // Запуск @Dependency
        for ( let i = 0; i < listForStart.length; i++ ) {
            listForStart[ i ].start();
        }
    }

    private dependencyProcessCheckReady(): boolean {
        if ( !this.isDependencyProcessComplete ) return false;
        this._inited = true;
        this.dispatchEvent( new DependencyManagerEvent( DependencyManagerEvent.COMPLETE, this ) );
        return true;
    }

    private get isDependencyProcessComplete(): boolean {
        let completeCount = 0;
        for ( let i = 0; i < this.length; i++ ) {
            let dependency = this.dependencyByIndexGet( i ) as Dependency;
            if ( dependency.complete ) completeCount ++;
        }
        return completeCount >= this.length;
    }

    /**
     * Можно ли отправить данный @Dependency на обработку
     * @param dependency 
     */
    private isReadyForStart( dependency: Dependency ): boolean {
        return dependency && dependency.enable && !dependency.process && dependency.complete;
    }

    /**
     * Все дочерние @Dependency готовы для подготовки @dependency
     * @param dependency 
     */
    private childDependenciesReady( dependency: Dependency ): boolean {
        
        let ready = false;
        let readyCount = 0;

        for ( let i = 0; i < this.length; i++ ) {
            let target = this.dependencyByIndexGet( i ) as Dependency;
            if ( target == dependency ) continue;
            if ( target.complete ) continue;
            if ( dependency.list.indexOf( target.ID ) != -1 ) {
                readyCount ++;
            }
        }
        
        return readyCount >= dependency.list.length;

    }

    /**
     * Реакция на изменение какого либо @Dependency
     * @param dependency 
     */
    private dependenceChange( dependency: IDependency ) {

        if ( this.dependencyInList( dependency ) ) return;
        if ( this.dependencyInChangeList( dependency ) ) return;

        // Если не this.inited то дополнительные @Dependency собираются в отдельный
        // this._changeDependencyList для начала разинициализации родительских 
        // @Depemdency
        this._changeDependencyList.push( dependency );
        if ( !this.inited ) return;

        this.dependenceDownChange();
    }

    /**
     * Наличие данного @IDependency в списке на переинициализацию зависимостей
     * @param dependency 
     */
    private dependencyInChangeList( dependency: IDependency ): boolean {
        return this._changeDependencyList.indexOf( dependency ) != -1;
    }

    private dependenceDownChange() {
        this._inited = false;

        // Дополнение this._changeDependencyList теми @IDependency из this._list
        // чтобы всем элементами this._changeDependencyList сделать переинициализацию
        while( true ) {
            let addDependenciesCount = 0;
            for ( let i = 0; i < this._changeDependencyList.length; i++ ) {
                let dependency = this._changeDependencyList[ i ] as Dependency;
                for ( let j = 0; j < this._list.length; j++ ) {
                    let target = this._list[ j ] as Dependency;
                    if ( dependency.list.indexOf( target.ID ) == -1 ) continue;
                    if ( this._changeDependencyList.indexOf( target ) == -1 ) continue;
                    this._changeDependencyList.push( target );
                    addDependenciesCount ++;
                }
            }
            if ( addDependenciesCount == 0 ) break;
        }

        // Сброс данных @Dependency
        for ( let i = 0; i < this._changeDependencyList.length; i++ ) {
            let dependency = this._changeDependencyList[ i ] as Dependency;
            if ( !dependency ) continue;
            if ( !this.dependencyInList( dependency ) ) this._list.push( dependency );
            dependency.reset();
        }

        this.dependenceProcess();
    }

    // LISTENERS HANDLERS

    private onDependencyInit( event:DependencyEvent ) {}
    private onDependencyStart( event:DependencyEvent ) {}
    private onDependencyStep( event:DependencyEvent ) {}
    private onDependencyComplete( event:DependencyEvent ) {
        let dependency = event.dependency as Dependency;
        let manager = dependency.manager;
        manager.dispatchEvent( new DependencyManagerEvent( DependencyManagerEvent.DEPENDENCY_COMPLETE, manager, dependency ) );
        manager.dependenceProcess();
    }
    private onDependencyChange( event:DependencyEvent ) {
        let dependency = event.dependency as Dependency;
        let manager = dependency.manager;
        manager.dispatchEvent( new DependencyManagerEvent( DependencyManagerEvent.DEPENDENCY_CHANGE, manager, dependency ) );
        manager.dependenceChange( dependency );
    }
    private onDependencyError( event:DependencyEvent ) {
        let dependency = event.dependency as Dependency;
        let manager = dependency.manager;
        manager.dispatchEvent( new DependencyManagerEvent( DependencyManagerEvent.DEPENDENCY_ERROR, manager, dependency ) );
    }
    private onDependencyDestroy( event:DependencyEvent ) {
        let dependency = event.dependency as Dependency;
        let manager = dependency.manager;
        manager.dispatchEvent( new DependencyManagerEvent( DependencyManagerEvent.DEPENDENCY_DESTROY, manager, dependency ) );

    }



}