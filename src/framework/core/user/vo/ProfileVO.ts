import VO from '../../vo/VO';

export default class ProfileVO extends VO {

    public ID: number | string = 0;
    public fullname: string;
    public firstname: string;
    public lastname: string;
    public age: number = 0;
    public born: number = 0;

    public timeregister: number;
    public timelastvisit: number;

    public email: string;
    public password: string;
    public key: string;
    public crypto: string;

    public solials: string[] = [];
    public socialsData: any = {};

    public input: any = {};
    public history: any = {};

    constructor( data: any = null ) {
        super( data );
    }

}