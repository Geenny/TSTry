
import Application from './framework/application/Application';
import Log from './framework/core/utils/Log';
import ApplicationEvent from './framework/application/events/ApplicationEvent';
import StorageService from './framework/core/services/storage/StorageService';
import StorageServiceVO from './framework/core/services/storage/vo/StorageServiceVO';
import AudioService from './framework/core/services/audio/AudioService';
import AudioServiceVO from './framework/core/services/audio/vo/AudioServiceVO';
import AudioWrapper from './framework/core/services/audio/AudioWrapper';
import AudioEvent from './framework/core/services/audio/events/AudioEvent';
import AudioWrapperVO from './framework/core/services/audio/vo/AudioWrapperVO';
import Range from './framework/core/utils/Range';
import WindowService from './framework/core/services/windows/WindowService';
import WindowServiceVO from './framework/core/services/windows/vo/WindowServiceVO';
import WindowVO from './framework/core/services/windows/vo/WindowVO';
import ApplicationDependeneManager from './core/dependency/ApplicationDependenceManager';
import DependenceManager from './framework/core/dependency/DependenceManager';
import DependencyManagerEvent from './framework/core/dependency/events/DependencyManagerEvent';
import Event from './framework/core/events/Event';
import UserDependency from './user/UserDependency';
import Launcher from './core/launcher/Launcher';
import AudioManager from './core/audio/AudioManager';
import CONFIG from './core/config/CONFIG';
import Net from './core/net/Net';
import RequestVO from './core/net/vo/RequestVO';

export default class Main extends Application {

    public static instance: Main;
    public static launcher: Launcher;
    public static windowService: WindowService;
    public static audioManager: AudioManager;

    private _applicationDependencyList: IDependency[] = [];
    private _applicationDepndenceManager: ApplicationDependeneManager;

    constructor( container: HTMLElement ) {

        super( container );

        Log.log( "Started: MAIN" );

        this.addEventListener( ApplicationEvent.APPLICATION_KEYBOARD_KEYDOWN, (e) => {
            Log.log(e);

            if ( e.data.key == "q" ) {
                Main.windowService.windowOpen( new WindowVO( { action:1 } ) );
            }
            if ( e.data.key == "w" ) {
                Main.windowService.windowOpen( new WindowVO( { action:2 } ) );
            }
            if ( e.data.key == "e" ) {
                Main.windowService.windowOpen( new WindowVO( { action:4 } ) );
            }
            if ( e.data.key == "r" ) {
                Main.windowService.windowOpen( new WindowVO( { action:64 } ) );
            }
            if ( e.data.key == "t" ) {
                Main.windowService.windowOpen( new WindowVO( { action:128 } ) );
            }
            // if ( e.data.key == "a" ) {
            //     aw.speed -= 0.1;
            // }
            // if ( e.data.key == "w" ) {
            //     aw.pause();
            // }
            // if ( e.data.key == "s" ) {
            //     as.play( "homely_loop.mp3" );
            // }
        } );
        this.addEventListener( ApplicationEvent.APPLICATION_KEYBOARD_KEYUP, (e) => { Log.log(e); } );
        this.addEventListener( ApplicationEvent.APPLICATION_RESIZE, (e) => { Log.log(e); } );
        this.addEventListener( ApplicationEvent.APPLICATION_FOCUS, (e) => { Log.log(e); } );
        this.addEventListener( ApplicationEvent.APPLICATION_BLUR, (e) => { Log.log(e); } );
        this.addEventListener( ApplicationEvent.APPLICATION_DEVICE_MOTION, (e) => { Log.log(e); } );
        this.addEventListener( ApplicationEvent.APPLICATION_DEVICE_ORIENTATION, (e) => { Log.log(e); } );
        this.addEventListener( ApplicationEvent.APPLICATION_DEVICE_ORIENTATION_CHANGE, (e) => { Log.log(e); } );

        let as: AudioService = new AudioService( new AudioServiceVO( { } ) );
        // let awvo: AudioWrapperVO = new AudioWrapperVO( {
        //     src: "homely_loop.mp3",
        //     volume: 0.5,
        //     loop: true,
        //     range: { start:0.3, finish:1000 }
        // } )
        // let aw: AudioWrapper = as.play( awvo );

        // aw.addEventListener( AudioEvent.PLAY, ( event ) => {
        //     Log.log( event );
        // });
        // aw.addEventListener( AudioEvent.PAUSE, ( event ) => {
        //     Log.log( event );
        // });
        // aw.addEventListener( AudioEvent.LOOP, ( event ) => {
        //     Log.log( event );
        // });


        // Create WebSocket connection.
        // const socket = new WebSocket('ws://google.com');

        // socket.onopen = function() {
        //     Log.log("Соединение установлено.");
        //     socket.send( "ping" );
        // };
        
        // socket.onclose = function(event) {
        //     if (event.wasClean) {
        //         Log.log('Соединение закрыто чисто');
        //     } else {
        //         Log.log('Обрыв соединения');
        //     }
        //     Log.log('Код: ' + event.code + ' причина: ' + event.reason);
        // };
          
        // socket.onmessage = function(event) {
        //     Log.log( "Получены данные" );
        //     Log.log( event.data );
        // };
          
        // socket.onerror = function(error) {
        //     Log.log( "Ошибка" );
        //     Log.log( error["message"] );
        // };

        Net.send( new RequestVO( { server: "google.com", data: "hi" } ) );

    }

    // GET/SET

    public get applicationDependenceManager(): ApplicationDependeneManager { return this._applicationDepndenceManager; }

    //
    // INIT
    //

    public init() {
        super.init();

        this.initMain();
        this.initComponents();
        this.initDependenceManager();
        //this.initDependencies();
    }

    //
    //
    //

    protected initMain() {
        Main.instance = this;
    }

    //
    // APPLICATION MANAGER
    //

    protected initDependenceManager() {

        let manager = new ApplicationDependeneManager();
        manager.addEventListener( Event.ANY, this.onApplicationManager );
        manager.dependencyListAdd(  this.dependencyListGet() );

        this._applicationDepndenceManager = manager;

    }

    protected initDependencies() {

        let user: UserDependency = new UserDependency( 10, [] );

        this._applicationDependencyList.push( user );

    }

    protected onApplicationManager( event: DependencyManagerEvent ) {

    }

    protected dependencyListGet(): IDependency[] {
        return this._applicationDependencyList;
    }


    //
    // COMPONENTS
    //

    protected initComponents() {

        let launcher: Launcher = new Launcher( this );
        launcher.init();

        let windowService: WindowService = new WindowService( CONFIG.window );
        windowService.init();

        let audioManager: AudioManager = new AudioManager( CONFIG.audio );
        audioManager.init();

        Main.launcher = launcher;
        Main.windowService = windowService;
        Main.audioManager = audioManager;

    }

}