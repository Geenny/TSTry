import Dependency from '../../core/dependency/Dependency';
import DependenceManager from '../../core/dependency/DependenceManager';

export default class Module extends Dependency implements IInfo {

    protected options: any = {};

    constructor( manager: DependenceManager, dependencies: number[] = [] ) {

        super( manager, dependencies );

    }

}