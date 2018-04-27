import ProfileVO from './vo/ProfileVO';
export default class Profile implements IProfile {

    private _vo: ProfileVO = new ProfileVO();

    constructor( data ) {
        this.parse( data );
    }

    // GET/SET

    public get ID(): number | string { return this.vo.ID; };
    public get fullname(): string { return this.vo.fullname; };
    public get firstname(): string { return this.vo.firstname; };
    public get lastname(): string { return this.vo.lastname; };
    public get age(): number { return this.vo.age; };
    public get born(): number { return this.vo.born; };

    public get timeregister(): number { return this.vo.timeregister; };
    public get timelastvisit(): number { return this.vo.timelastvisit; };

    public get email(): string { return this.vo.email; };
    public get password(): string { return this.vo.password; };
    public get key(): string { return this.vo.key; };
    public get crypto(): string { return this.vo.crypto; };

    public get solials(): string[] { return this.vo.solials; };
    public get socialsData(): any { return this.vo.socialsData; };

    public get input(): any { return this.vo.input; };
    public get history(): any { return this.vo.ID; };

    public get vo(): ProfileVO { return this._vo; }

    // 

    /**
     * Разобрать данные
     * @param data 
     */
    public parse( data: any ) {
        this.vo.parse( data );
    }

    /**
     * Обновление данных поля в профиле @Profile
     * @param poleName string Название поля
     * @param data Данные поля. Важно чтоб тип данных соответствовал
     */
    public setPole( poleName: string, data: any = null ) {
        if ( !this.vo.hasOwnProperty( poleName ) ||  typeof this.vo[ poleName ] != typeof data ) return;
        this.vo[ poleName ] = data;
    }

    /**
     * Преобразовать в JSON строку
     */
    public toJSONString(): string {
        return JSON.stringify( this.vo );
    }



} 