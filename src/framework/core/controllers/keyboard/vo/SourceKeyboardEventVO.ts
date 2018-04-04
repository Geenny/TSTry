
export default class SourceKeyboardEventVO implements IVO {

    public type: string;
    public alt: boolean = false;
    public ctrl: boolean = false;
    public charCode: number = 0;
    public keyCode: number = 0;
    public key: string;

    public event: any;

    constructor( event ) {
        this.parse( event );
    }

    public parse( event ) {

        if ( !event ) return;
        this.event = event;

        this.type = event.type;
        this.alt = event.altKey || false;
        this.ctrl = event.ctrlKey || false;
        this.charCode = event.charCode || 0;
        this.keyCode = event.keyCode || 0;
        this.key = event.key;

    }

}