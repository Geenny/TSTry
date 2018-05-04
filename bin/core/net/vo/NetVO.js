import VO from '../../../framework/core/vo/VO';
import { RequestSecureState } from '../state/RequestSecureState';
import { RequestMethodState } from '../state/RequestMethodState';
export default class NetVO extends VO {
    constructor(data = {}) {
        super(data);
        this.retry = 5;
        this.secure = RequestSecureState.HTTP;
        this.server = "google.com";
        this.method = RequestMethodState.GET;
        this.headers = [];
        this.sendCount = 5;
    }
}
//# sourceMappingURL=NetVO.js.map