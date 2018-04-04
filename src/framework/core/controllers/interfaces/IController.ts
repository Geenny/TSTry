
import Application from '../../../application/Application';
import EventDispathcer from '../../events/EventDispathcer';

interface IController {

    /**
     * @Applicaiton
     */
    application: Application;

    /**
     * Цель @target в которую контроллер расслылает свои данные через eventDispathcer
     */
    target: EventDispathcer;

}