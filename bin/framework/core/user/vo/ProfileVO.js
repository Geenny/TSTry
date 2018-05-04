import VO from '../../vo/VO';
export default class ProfileVO extends VO {
    constructor(data = null) {
        super(data);
        this.ID = 0;
        this.age = 0;
        this.born = 0;
        this.solials = [];
        this.socialsData = {};
        this.input = {};
        this.history = {};
    }
}
//# sourceMappingURL=ProfileVO.js.map