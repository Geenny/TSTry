
import Request from '../../Request';

interface ISender {

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
    requests: Request[];

    /**
     * Отправка данных через данный интерфейс рассылки
     * @param data 
     */
    send( data: any ): Request;


    /**
     * Отмена и уничтожение @Request 
     * @param request 
     */
    cancel( request: Request ): boolean;
    
    /**
     * Отмена и уничтожение всех @Request 
     */
    cancelAll();

}