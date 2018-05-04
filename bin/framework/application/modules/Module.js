import Dependency from '../../core/dependency/Dependency';
export default class Module extends Dependency {
    constructor(ID, dependencies = []) {
        super(ID, dependencies);
        this.options = {};
    }
}
//# sourceMappingURL=Module.js.map