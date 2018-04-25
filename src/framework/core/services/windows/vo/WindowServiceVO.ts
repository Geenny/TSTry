export default class WindowServiceVO implements IVO {

    public sourceVOList: any = {}; // Список - объект с настройками WindowVO

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
        
    }

}