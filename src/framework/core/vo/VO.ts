export default class VO implements IVO {

    // Данные из источника
    public data: any = {};

    constructor( data: any = null ) {
        this.parse( data );
    }

    /**
     * Разбор данных @VO
     * @param data 
     */
    public parse( data: any ) {

        if ( !data ) data = {};
        Object.assign( this.data, data );

        for ( let key in data ) {
            if ( !this.hasOwnProperty( key ) ) continue;
            this[ key ] = data[ key ];
        }

    }

}