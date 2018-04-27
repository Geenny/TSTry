interface IProfile {

    ID: number | string;
    fullname: string;
    firstname: string;
    lastname: string;
    age: number;        // UTC
    born: number;       // UTC

    timeregister: number;
    timelastvisit: number;

    email: string;
    password: string;
    key: string;        // Ключ сессии
    crypto: string;     // Ключ шифрования данных

    solials: string[];  // Список социальных сетей
    socialsData: any;   // Объект данных по данным социальных сетей

    input: any;         // Объект данных по истории пользовательского ввода
    history: any;       // Объект данных по истории изменения профиля

}