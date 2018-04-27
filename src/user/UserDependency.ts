import Dependency from '../framework/core/dependency/Dependency';
import DependenceManager from '../framework/core/dependency/DependenceManager';

export default class UserDependency extends Dependency {

    constructor( ID: number, dependencies: number[] = [] ) {
        super( ID, dependencies );
    }

    public start() {
        super.start();
    }

    public finish() {
        super.finish();
    }

}