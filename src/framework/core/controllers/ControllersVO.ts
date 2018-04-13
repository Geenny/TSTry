
import KeyboardController from './keyboard/KeyboardController';
import ResizeController from './resize/ResizeController';
import FocusController from './focus/FocusController';
import OrientationController from './orientation/OrientationController';
import DeviceController from './device/DeviceController';

export default class ControllersVO implements IVO {

    /**
     * Список Классов контроллеров для 
     */
    public static controllerListDefault: any[] = [
        KeyboardController,
        ResizeController,
        FocusController,
        OrientationController,
        DeviceController
    ]

    /**
     * Список объектов опций для классов контроллеров
     */
    public KeyboardController: any = {};
    public ResizeController: any = {};
    public OrientationController: any = {};
    public FocusController: any = {};
    public DeviceController: any = {};

    public controllerList: any[] = [];      // Список классов контроллеров, которые должны быть запущены

    public data: any;

    constructor( data: any = null ) {
        this.parse( data );
    }

    public parse( data: any ) {

        if ( !data ) data = {};
        this.data = data;

        this.KeyboardController = this.data.KeyboardController || this.KeyboardController;
        this.ResizeController = this.data.ResizeController || this.ResizeController;
        this.OrientationController = this.data.OrientationController || this.OrientationController;
        this.FocusController = this.data.FocusController || this.FocusController;
        this.DeviceController = this.data.DeviceController || this.DeviceController;

        this.controllerList = this.getControllerList( data.controllerList );

    }

    private getControllerList( controllerList: any[] ): any[] {
        let list: any[];
        if ( !controllerList || this.controllerList.length == 0 ) {
            list = ControllersVO.controllerListDefault;
        }else{
            list = controllerList;
        }
        return list;
    }

}