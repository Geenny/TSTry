
export default class URL {

    /**
     * Составление URL строки 
     * @param args 
     */
    public static compare( ... args ): string {
        let url: string = "";
        for( let i = 0; args && i < args.length; i++ ) {
            let slash: string = ( i > 0 && url.charAt( url.length - 1 ) != "/" ) ? "/" : "";
            let addition: string = ( args[ i ] && typeof args[ i ] == "string" ) ? args[ i ] : "";
            url += slash + addition;
        }
        return url;
    }

}