export default class AudioServiceVO implements IVO {

    public volume: number = 1;                  // 0-1, общее значение звукового уровня
    public channels: string[] = [];             // Списки каналов

    public progressCustom: boolean = true;
    public progressTimeout: number = 1000;      // ms

    public data: any = {};

    constructor( data: any ) {
        this.parse( data );
    }

    public parse( data: any ) {

        if ( !data ) data = {};
        Object.assign( this.data, data );

        this.volume = this.data.volume || this.volume;
        this.channels = this.data.channels || this.channels;

    }
    
}