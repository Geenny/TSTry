
export default class Log {

    constructor() {}

    public static log( ...args ) {

        if ( !args || args.length == 0 ) {
            console.log( args );
            return;
        } 

        if ( args.length == 1 ) {
            console.log( args[ 0 ] );
            return;
        }

        console.log( args );
        
    }

}