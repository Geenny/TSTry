export default class SourceFocusEventVO {

    public type: string;

    public event: any;

    constructor( event: any ) {
        this.parse( event );
    }

    public parse( event: any ) {

        if ( !event ) return;
        this.event = event;

        this.type = event.type;

    }

}