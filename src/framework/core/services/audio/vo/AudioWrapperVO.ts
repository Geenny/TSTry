
export default class AudioWrapperVO implements IVO {

    public volume: number = 1;
    public pan: number = 0;
    public loop: boolean = false;
    public playtimes: number = 1;
    public src: string = null;

    public data: any = {};

    constructor( data: any = null ) {
        this.parse( data );
    }

    public parse( data: any ) {

        if ( !data ) data = {};
        Object.assign( this.data, data );

        this.volume = ( this.data.hasOwnProperty( "volume" ) ) ? this.data.volume : this.volume;
        this.pan = ( this.data.hasOwnProperty( "pan" ) ) ? this.data.pan : this.pan;
        this.loop = this.data.loop;
        this.playtimes = this.data.playtimes || this.playtimes;
        this.src = this.data.src || this.src;

    }

}