interface IWindow {

    width: number;
    height: number;

    /**
     * Приоритет окна. Дает ему возможность оказаться поверх окон с подобными правами на отображение
     */
    priority: number;

    /**
     * Popup, Default
     */
    type: string;

    /**
     * Группа к которой пренадлежит окно
     */
    group: number | string;

    /**
     * Побитовая маска значения влияния на другие окна.
     * Закрываемое, автоматически закрываемое, закрываемое вручную, незакрываемое (strong)
     */
    action: number;

    /**
     * Передает окну данные по тому или получило оно фокус
     */
    focus: boolean;

    open(): void;
    close(): void;

}