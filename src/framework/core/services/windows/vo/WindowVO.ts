
import { WindowType } from '../states/WindowType';
import WindowService from '../WindowService';

export default class WindowVO implements IVO {

    public windowService: WindowService = null;

    public type: string = WindowType.DEFAULT;
    public priority: number = 0;
    public action: number = 0;                  // bitmask: 0 - default, 2 - autoclose, 4 - closeable, 8 - faderclose, 16 - strong
    public group: string | number = 0;

    public name: string = "Window";
    public width: number = 400;
    public height: number = 400;

    public fader: boolean = true;

    public animation: boolean = true;
    public animationShowTime: number = 500;     // ms
    public animationHideTime: number = 500;     // ms

    public data: any = {};

    constructor( data: any = null ) {
        this.parse( data );
    } 

    public parse( data: any ) {

        if ( !data ) data = {}; 
        this.data = data;

        for ( let key in data ) {
            if ( !this.hasOwnProperty( key ) ) continue;
            this[ key ] = data[ key ];
        }

        // this.windowService = data.windowService || this.windowService;

        // this.type = data.type || this.type;
        // this.priority = data.priority || this.priority;
        // this.action = data.action || this.action;
        // this.group = data.group || this.group;

        // this.name = data.name || this.name;
        // this.width = data.width || this.width;
        // this.height = data.height || this.height;

    }

}