import AudioServiceChannel from '../AudioServiceChannel';

export default class AudioWrapperVO implements IVO {

    public volume: number = 1;
    public pan: number = 0;
    public loop: boolean = false;
    public playtimes: number = 1;
    public src: string = null;
    public channel: AudioServiceChannel = null;
    public autodestroy: boolean = true;
    public fadetime: number = 500;              // Значение времени в течении которого будет выключен/включен звук через плавное затухание
    public pauseback: number = 1000;            // Значение времени возврата @audio.currentTime с при приостановке ( pause )

    public progressMethod: Function = null;
    public endedMethod: Function = null;

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
        this.channel = this.data.channel || this.channel;
        this.autodestroy = this.data.autodestroy || this.autodestroy;
        this.fadetime = this.data.fadetime || this.fadetime;
        this.pauseback = this.data.pauseback || this.pauseback;

        this.progressMethod = this.data.progressMethod || this.progressMethod;
        this.endedMethod = this.data.endedMethod || this.endedMethod;

    }

}