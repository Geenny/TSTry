
export default class Utils {

    /**
     * Выбрать объект подходящий по значениям полей
     * @param list Список объектов
     * @param values Список значений ключ:значение для сравнения
     */
    public static findObjectFromList( list: any, values: any ): any {
        if ( list && values ) {
            let complete: boolean;
            for ( let object of list ) {
                complete = true;
                for ( let key in values ) {
                    if ( object.hasOwnProperty( key ) && object[ key ] !== values[ key ] ) continue;
                    complete = false;
                    break;
                }
                if ( complete ) return object;
            }
        }
        return null;
    }


    /**
     * Определение наличия битного ключа @bitKey в битной маске @bitMask
     * @param bitmask Битовая маска
     * @param bitkey Битовый ключь. Данный параметр 
     */
    public static bitmaskCheckKey( bitmask: number, bitkey: number ): boolean {
        if ( bitkey <= 0 ) return false;
        // while( true ) {
        //     if ( bitkey == 1 ) break;
        //     bitkey = bitkey >> 1;
        //     bitmask = bitmask >> 1;
        // }
        // return ( bitmask & bitkey ) == 1;
        return ( bitmask & bitkey ) > 0;
    }

}