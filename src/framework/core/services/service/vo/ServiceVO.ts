export default class ServiceVO implements IVO {

    public data: any;

    constructor( data: any ) {
        this.parse( data );
    }

    public parse( data: any ) {

        if ( !data ) return;
        this.data = data;

    }

}