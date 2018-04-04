
export default class AudioWrapperVO implements IVO {

    public data: any = {};

    constructor( data: any ) {
        this.parse( data );
    }

    public parse( data: any ) {

        if ( !data ) data = {};
        Object.assign( this.data, data );

    }

}