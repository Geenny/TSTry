import VO from '../../framework/core/vo/VO';
import Profile from '../../framework/core/user/Profile';
export default class UserVO extends VO {
    constructor(data = null) {
        super(data);
        this.data = null;
    }
    parse(data) {
        super.parse(data);
        this.profile = this.getProfile(this.data.profile);
    }
    /**
     * Создать @Profile из данных источника ( простой объект ) @data
     * @param data
     */
    getProfile(data) {
        return new Profile(data);
    }
}
//# sourceMappingURL=UserVO.js.map