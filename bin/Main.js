import Application from './framework/application/Application';
import Log from './framework/core/utils/Log';
import ApplicationEvent from './framework/application/events/ApplicationEvent';
import AudioService from './framework/core/services/audio/AudioService';
import AudioServiceVO from './framework/core/services/audio/vo/AudioServiceVO';
import AudioEvent from './framework/core/services/audio/events/AudioEvent';
import AudioWrapperVO from './framework/core/services/audio/vo/AudioWrapperVO';
export default class Main extends Application {
    constructor(container) {
        super(container);
        Log.log("Started: MAIN");
        this.addEventListener(ApplicationEvent.APPLICATION_KEYBOARD_KEYDOWN, (e) => {
            Log.log(e);
            if (e.data.key == "q") {
                aw.volume += 0.05;
            }
            if (e.data.key == "a") {
                aw.volume -= 0.05;
            }
            if (e.data.key == "w") {
                aw.pause();
            }
            if (e.data.key == "s") {
                as.play("homely_loop.mp3");
            }
        });
        this.addEventListener(ApplicationEvent.APPLICATION_KEYBOARD_KEYUP, (e) => { Log.log(e); });
        this.addEventListener(ApplicationEvent.APPLICATION_RESIZE, (e) => { Log.log(e); });
        this.addEventListener(ApplicationEvent.APPLICATION_FOCUS, (e) => { Log.log(e); });
        this.addEventListener(ApplicationEvent.APPLICATION_BLUR, (e) => { Log.log(e); });
        let as = new AudioService(new AudioServiceVO({}));
        let awvo = new AudioWrapperVO({
            src: "homely_loop.mp3",
            volume: 0,
            loop: true
        });
        let aw = as.play(awvo);
        aw.addEventListener(AudioEvent.PLAY, (event) => {
            Log.log(event);
        });
        aw.addEventListener(AudioEvent.PAUSE, (event) => {
            Log.log(event);
        });
        aw.addEventListener(AudioEvent.LOOP, (event) => {
            Log.log(event);
        });
        // Create WebSocket connection.
        const socket = new WebSocket('wss://www.facebook.com:80');
        // Connection opened
        socket.addEventListener('open', function (event) {
            socket.send('Hello Server!');
        });
        socket.addEventListener('error', function (event) {
            socket.send('error');
        });
        socket.addEventListener('message', function (event) {
            console.log('Message from server ', event.data);
        });
        socket.addEventListener('close', function (event) {
            console.log('close ', event);
        });
        //let tcp: TCPSocket = new TCPSocket
    }
}
//# sourceMappingURL=Main.js.map