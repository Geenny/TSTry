import ServiceVO from '../../service/vo/ServiceVO';
export default class StorageServiceVO extends ServiceVO {
    constructor(data) {
        super(data);
        this.objectName = "ASD"; // Application Storage Data
        this.storeTimeout = 0; // Время отсрочки сохранения данных
    }
    parse(data) {
        super.parse(data);
        if (!data)
            return;
        this.objectName = data.objectName || this.objectName;
        this.storeTimeout = data.storeTimeout || this.storeTimeout;
    }
}
//# sourceMappingURL=StorageServiceVO.js.map