import ProfileVO from './vo/ProfileVO';
export default class Profile {
    constructor(data) {
        this._vo = new ProfileVO();
        this.parse(data);
    }
    // GET/SET
    get ID() { return this.vo.ID; }
    ;
    get fullname() { return this.vo.fullname; }
    ;
    get firstname() { return this.vo.firstname; }
    ;
    get lastname() { return this.vo.lastname; }
    ;
    get age() { return this.vo.age; }
    ;
    get born() { return this.vo.born; }
    ;
    get timeregister() { return this.vo.timeregister; }
    ;
    get timelastvisit() { return this.vo.timelastvisit; }
    ;
    get email() { return this.vo.email; }
    ;
    get password() { return this.vo.password; }
    ;
    get key() { return this.vo.key; }
    ;
    get crypto() { return this.vo.crypto; }
    ;
    get solials() { return this.vo.solials; }
    ;
    get socialsData() { return this.vo.socialsData; }
    ;
    get input() { return this.vo.input; }
    ;
    get history() { return this.vo.ID; }
    ;
    get vo() { return this._vo; }
    // 
    /**
     * Разобрать данные
     * @param data
     */
    parse(data) {
        this.vo.parse(data);
    }
    /**
     * Обновление данных поля в профиле @Profile
     * @param poleName string Название поля
     * @param data Данные поля. Важно чтоб тип данных соответствовал
     */
    setPole(poleName, data = null) {
        if (!this.vo.hasOwnProperty(poleName) || typeof this.vo[poleName] != typeof data)
            return;
        this.vo[poleName] = data;
    }
    /**
     * Преобразовать в JSON строку
     */
    toJSONString() {
        return JSON.stringify(this.vo);
    }
}
//# sourceMappingURL=Profile.js.map