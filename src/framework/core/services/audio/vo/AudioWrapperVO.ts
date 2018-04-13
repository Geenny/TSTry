import AudioServiceChannel from '../AudioServiceChannel';
import Range from '../../../utils/Range';

export default class AudioWrapperVO implements IVO {

    public channel: AudioServiceChannel = null;
    public volume: number = 1;
    public pan: number = 0;
    public loop: boolean = false;
    public playtimes: number = 1;
    public src: string = null;
    public speed: number = 1;                   // Скорость воспроизведения
    public range: Range = new Range();          // Период проигрывания, в секундах
    public fadetime: number = 100;              // Значение времени в течении которого будет выключен/включен звук через плавное затухание, миллисекунд
    public pauseback: number = 500;            // Значение времени возврата @audio.currentTime с при приостановке ( pause ), миллисекунд
    public immortal: boolean = false;                   // Возможность быть убитым
    public stoptime: number = Number.MAX_SAFE_INTEGER;  // Время остановки проигрывания звука, миллисекунд
    public killtime: number = 60000;                    // Время через которое звук можно уничтожить, миллисекунды

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
        this.range = this.getRange( this.data.range );
        this.channel = this.data.channel || this.channel;
        this.fadetime = this.data.fadetime || this.fadetime;
        this.pauseback = this.data.pauseback || this.pauseback;
        this.immortal = this.data.immortal || this.immortal;
        this.stoptime = this.data.stoptime || this.stoptime;
        this.killtime = this.data.killtime || this.killtime;

        this.progressMethod = this.data.progressMethod || this.progressMethod;
        this.endedMethod = this.data.endedMethod || this.endedMethod;

    }

    private getRange( data: any ): Range {
        let range: Range;
        if ( !data ) return new Range();
        if ( data instanceof Range ) {
            range = data as Range;
        }else if ( data.start <= data.finish ) {
            range = new Range( data.start, data.finish );
        }
        return range;
    }

}