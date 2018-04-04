import Dependency from '../../core/dependency/Dependency';
export default class Module extends Dependency {
    constructor(manager, dependencies = []) {
        super(manager, dependencies);
        this.options = {};
    }
}
//# sourceMappingURL=Module.js.map