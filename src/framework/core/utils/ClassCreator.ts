
export default class ClassCreator<T> {
    constructor( private className: IClassCreator<T> ) {
        
    }
}

interface IClassCreator<T> {
    new(): T;
}