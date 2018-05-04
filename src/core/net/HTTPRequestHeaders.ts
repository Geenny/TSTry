
export default class HTTPRequestHeaders {

    public key: string;
    public value: string;

    constructor( key: string, value: any = null ) {
        this.parse( key, value );
    }

    public parse( key: string, value: any = null ) {
        this.key = key;
        this.value = ( typeof value == "string" ) ? value : value.toString();
    }

    public toString(): string {
        return this.key + "=" + this.value;
    }

    public toValue(): string {
        return this.key + "=" + this.value;
    }

}