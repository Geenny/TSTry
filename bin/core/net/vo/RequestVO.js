import VO from '../../../framework/core/vo/VO';
import URL from '../../../framework/core/utils/URL';
export default class RequestVO extends VO {
    constructor(data = {}) {
        super(data);
        this.retry = 0;
        this.headers = [];
        this.status = 0;
    }
    // GET/SET
    // TECH
    update() {
        this.updateURL();
    }
    updateURL() {
        this.url = URL.compare(this.secure, this.server, this.resource);
    }
}
//# sourceMappingURL=RequestVO.js.map