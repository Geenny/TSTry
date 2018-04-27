import VO from '../../framework/core/vo/VO';
import Profile from '../../framework/core/user/Profile';

export default class UserVO extends VO {

    public profile: IProfile;           // ProfileVO

    public data: any = null;

    constructor( data: any = null ) {
        super( data );
    }

    public parse( data: any ) {

        super.parse( data );

        this.profile = this.getProfile( this.data.profile );

    }

    /**
     * Создать @Profile из данных источника ( простой объект ) @data
     * @param data 
     */
    protected getProfile( data: any ): IProfile {
        return new Profile( data );
    }

}