
import ServiceVO from '../../service/vo/ServiceVO';

export default class StorageServiceVO extends ServiceVO {

    public objectName: string = "ASD";  // Application Storage Data
    public storeTimeout: number = 0;    // Время отсрочки сохранения данных

    constructor( data: any ) {
        super( data );
    }

    public parse( data: any ) {
        super.parse( data );
        if ( !data ) return;

        this.objectName = data.objectName || this.objectName;
        this.storeTimeout = data.storeTimeout || this.storeTimeout;
    }

}