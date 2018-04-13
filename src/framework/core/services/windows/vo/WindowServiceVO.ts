export default class WindowServiceVO implements IVO {

    public data: any = {};

    constructor( data: any = null ) {
        this.parse( data );
    }

    public parse( data: any ) {

        if ( !data ) data = {};
        this.data = data;
        
    }

}