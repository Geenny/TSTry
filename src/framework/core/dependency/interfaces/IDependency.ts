interface IDependency extends IInfo, IEnable, IInit, IState, IDestroy {

    /**
     * Инициализация заверщена
     */
    complete: boolean;

    /**
     * @IDependency в процессе инициализации
     */
    process: boolean;

    /**
     * 
     */
    errorMessage: string;

    /**
     * Список @ID @IDenendency от которых зависит данныя зависимость
     */
    list: number[];

    /**
     * @DependenceManager
     */
    manager: any;

    /**
     * 
     */
    reset(): void;

}