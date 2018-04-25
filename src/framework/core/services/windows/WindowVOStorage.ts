import WindowVO from './vo/WindowVO';
import Utils from '../../utils/Utils';

export default class WindowVOStorage {

    // STATIC METHODs

    private static _instanse: WindowVOStorage;

    /**
     * @WindowVOStorage для Singleton подхода
     */
    public static get instance(): WindowVOStorage {
        if ( ! WindowVOStorage._instanse ) WindowVOStorage._instanse = new WindowVOStorage();
        return WindowVOStorage._instanse;
    }

    /**
     * Вернуть @WindowVO по его @ID
     * @param ID 
     */
    public static VOGetByID( ID: number | string ): WindowVO {
        return WindowVOStorage.instance.VOGetByID( ID );
    }

    //

    private _list: WindowVO[] = [];

    constructor( listVO: any = null ) {
        this.parse( listVO );
    }

    /**
     * Разборка и/или добавление данных по @WindowVO
     * @param listVO 
     * @param fullupdate флаг полной перезаписи списка
     */
    public parse( listVO: any, fullupdate: boolean = true ) {

        if ( !listVO ) listVO = {};
        if ( fullupdate ) this._list.length = 0;

        for ( let key in listVO ) {
            let object: any = listVO[ key ];
            object[ "ID" ] = key;

            let vo: WindowVO = new WindowVO( object );
            this._list.push( vo );
        }
        
    }

    /**
     * Вернуть @WindowVO по его @ID
     * @param ID 
     */
    public VOGetByID( ID: number | string ): WindowVO {
        return Utils.findObjectFromList( this._list, { "ID":ID } ) as WindowVO;
    }


    /**
     * Вернуть @WindowVO по его @name
     * @param name 
     */
    public VOGetByName( name: string ): WindowVO {
        return Utils.findObjectFromList( this._list, { "name":name } ) as WindowVO;
    }

}