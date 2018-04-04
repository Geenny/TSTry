
export default class SourceResizeEventVO implements IVO {

    public type: string;
    public isTrusted: boolean;
    public width: number;
    public height: number;

    public event: any = {};

    constructor( event ) {
        this.parse( event );
    }

    public parse( event ) {

        if ( !event ) event = {};
        this.event = event;

        this.type = event.type || this.type;
        this.isTrusted = event.isTrusted || this.isTrusted;

    }

}