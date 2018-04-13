
export default class Log {

    constructor() {}

    public static log( ...args ) {

        if ( !args || args.length == 0 ) {
            console.log( args );
            return;
        } 
        
        let textarea: HTMLElement = document.getElementById("text_for_log");
        textarea.innerHTML += "<br>" + args.toString();

        if ( args.length == 1 ) {
            console.log( args[ 0 ] );
            return;
        }

        console.log( args );
        
    }

    public static error( ...args ) {

        if ( !args || args.length == 0 ) return;

    }

}