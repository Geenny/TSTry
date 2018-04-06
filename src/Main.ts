
import Application from './framework/application/Application';
import Log from './framework/core/utils/Log';
import ApplicationEvent from './framework/application/events/ApplicationEvent';
import StorageService from './framework/core/services/storage/StorageService';
import StorageServiceVO from './framework/core/services/storage/vo/StorageServiceVO';
import AudioService from './framework/core/services/audio/AudioService';
import AudioServiceVO from './framework/core/services/audio/vo/AudioServiceVO';
import AudioWrapper from './framework/core/services/audio/AudioWrapper';
import AudioEvent from './framework/core/services/audio/events/AudioEvent';

export default class Main extends Application {

    constructor( container: HTMLElement ) {

        super( container );

        Log.log( "Started: MAIN" );

        this.addEventListener( ApplicationEvent.APPLICATION_KEYBOARD_KEYDOWN, (e) => { Log.log(e); } );
        this.addEventListener( ApplicationEvent.APPLICATION_KEYBOARD_KEYUP, (e) => { Log.log(e); } );
        this.addEventListener( ApplicationEvent.APPLICATION_RESIZE, (e) => { Log.log(e); } );
        this.addEventListener( ApplicationEvent.APPLICATION_FOCUS, (e) => { Log.log(e); } );
        this.addEventListener( ApplicationEvent.APPLICATION_BLUR, (e) => { Log.log(e); } );

        let as: AudioService = new AudioService( new AudioServiceVO( {} ) );
        let aw: AudioWrapper = as.play( "abc.mp3" );

        aw.addEventListener( AudioEvent.PLAY, ( event ) => {
            Log.log( event );
        });
        aw.addEventListener( AudioEvent.PAUSE, ( event ) => {
            Log.log( event );
        });
        aw.addEventListener( AudioEvent.PROGRESS, ( event ) => {
            Log.log( event );
            Log.log( aw.time );
        });

    }

}