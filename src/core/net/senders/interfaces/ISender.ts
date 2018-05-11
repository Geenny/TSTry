
interface ISender {

    /**
     * ID :)
     */
    ID: number;

    /**
     * 
     */
    main: boolean;

    /**
     * 
     */
    isConnected: boolean;

    /**
     * Количество @Request на обслуживании
     */
    length: number;

    /**
     * Список @Request на обслуживании
     */
    requests: any[];

    /**
     * Отправка данных через данный интерфейс рассылки
     * @param data 
     */
    send( data: any ): any;


    /**
     * Отмена и уничтожение @Request 
     * @param request 
     */
    cancel( request: any ): boolean;
    
    /**
     * Отмена и уничтожение всех @Request 
     */
    cancelAll();

}