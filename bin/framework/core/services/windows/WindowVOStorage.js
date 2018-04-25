import WindowVO from './vo/WindowVO';
import Utils from '../../utils/Utils';
export default class WindowVOStorage {
    constructor(listVO = null) {
        //
        this._list = [];
        this.parse(listVO);
    }
    /**
     * @WindowVOStorage для Singleton подхода
     */
    static get instance() {
        if (!WindowVOStorage._instanse)
            WindowVOStorage._instanse = new WindowVOStorage();
        return WindowVOStorage._instanse;
    }
    /**
     * Вернуть @WindowVO по его @ID
     * @param ID
     */
    static VOGetByID(ID) {
        return WindowVOStorage.instance.VOGetByID(ID);
    }
    /**
     * Разборка и/или добавление данных по @WindowVO
     * @param listVO
     * @param fullupdate флаг полной перезаписи списка
     */
    parse(listVO, fullupdate = true) {
        if (!listVO)
            listVO = {};
        if (fullupdate)
            this._list.length = 0;
        for (let key in listVO) {
            let object = listVO[key];
            object["ID"] = key;
            let vo = new WindowVO(object);
            this._list.push(vo);
        }
    }
    /**
     * Вернуть @WindowVO по его @ID
     * @param ID
     */
    VOGetByID(ID) {
        return Utils.findObjectFromList(this._list, { "ID": ID });
    }
    /**
     * Вернуть @WindowVO по его @name
     * @param name
     */
    VOGetByName(name) {
        return Utils.findObjectFromList(this._list, { "name": name });
    }
}
//# sourceMappingURL=WindowVOStorage.js.map