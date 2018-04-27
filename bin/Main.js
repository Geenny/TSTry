import Application from './framework/application/Application';
import Log from './framework/core/utils/Log';
import ApplicationEvent from './framework/application/events/ApplicationEvent';
import AudioService from './framework/core/services/audio/AudioService';
import AudioServiceVO from './framework/core/services/audio/vo/AudioServiceVO';
import WindowService from './framework/core/services/windows/WindowService';
import WindowServiceVO from './framework/core/services/windows/vo/WindowServiceVO';
import WindowVO from './framework/core/services/windows/vo/WindowVO';
export default class Main extends Application {
    constructor(container) {
        super(container);
        Log.log("Started: MAIN");
        this.addEventListener(ApplicationEvent.APPLICATION_KEYBOARD_KEYDOWN, (e) => {
            Log.log(e);
            if (e.data.key == "q") {
                windowService.windowOpen(new WindowVO({ action: 1 }));
            }
            if (e.data.key == "w") {
                windowService.windowOpen(new WindowVO({ action: 2 }));
            }
            if (e.data.key == "e") {
                windowService.windowOpen(new WindowVO({ action: 4 }));
            }
            if (e.data.key == "r") {
                windowService.windowOpen(new WindowVO({ action: 64 }));
            }
            if (e.data.key == "t") {
                windowService.windowOpen(new WindowVO({ action: 128 }));
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
        });
        this.addEventListener(ApplicationEvent.APPLICATION_KEYBOARD_KEYUP, (e) => { Log.log(e); });
        this.addEventListener(ApplicationEvent.APPLICATION_RESIZE, (e) => { Log.log(e); });
        this.addEventListener(ApplicationEvent.APPLICATION_FOCUS, (e) => { Log.log(e); });
        this.addEventListener(ApplicationEvent.APPLICATION_BLUR, (e) => { Log.log(e); });
        this.addEventListener(ApplicationEvent.APPLICATION_DEVICE_MOTION, (e) => { Log.log(e); });
        this.addEventListener(ApplicationEvent.APPLICATION_DEVICE_ORIENTATION, (e) => { Log.log(e); });
        this.addEventListener(ApplicationEvent.APPLICATION_DEVICE_ORIENTATION_CHANGE, (e) => { Log.log(e); });
        let as = new AudioService(new AudioServiceVO({}));
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
        let windowService = new WindowService(new WindowServiceVO());
        windowService.init();
    }
}
//# sourceMappingURL=Main.js.map