import Dependency from '../../core/dependency/Dependency';

export default class Module extends Dependency implements IInfo {

    protected options: any = {};

    constructor( ID: number, dependencies: number[] = [] ) {

        super( ID, dependencies );

    }

}