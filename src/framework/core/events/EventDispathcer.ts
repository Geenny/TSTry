
import Event from "./Event";

export default class EventDispathcer {

    private _dispatcher: Array<EventVO> = [];

    constructor() {  }

    dispatchEvent( event:Event ) {
        for ( let i = 0; i < this._dispatcher.length; i++ ) {
            let target = this._dispatcher[ i ];
            if ( target.type != event.type ) continue;
            target.handler( event );
        }
    }

    addEventListener( type: string, handler:Function, useCapture: boolean = false, priority: number = 0 ) {
        if ( !type || !handler ) return;
        this._dispatcher.push( new EventVO( type, handler, useCapture, priority ) );
    }

    /**
     * Очистка слушателя
     * @param type 
     * @param handler 
     */
    removeEventListener( type:string, handler:Function ) {
        for ( let i = this._dispatcher.length - 1; i > -1; i-- ) {
            let target: EventVO = this._dispatcher[ i ];
            if ( target.type != type && target.handler != handler ) continue;
            this._dispatcher.splice( i, 1 );
        }
    }

    /**
     * Очистка всех слушателей
     */
    removeEventListeners() {
        while( this._dispatcher.length ) {
            let target: EventVO = this._dispatcher[ this._dispatcher.length - 1 ];
            this.removeEventListener( target.type, target.handler );
        }
    }

}

class EventVO {

    public type: string;
    public handler: Function;
    public useCapture: boolean;
    public priority: number;

    constructor( type:string, handler:Function, useCapture: boolean = false, priority: number = 0 ) {

        this.type = type;
        this.handler = handler;
        this.useCapture = useCapture;
        this.priority = priority;

    }

}
