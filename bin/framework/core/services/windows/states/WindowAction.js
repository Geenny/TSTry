export var WindowAction;
(function (WindowAction) {
    WindowAction[WindowAction["DEFAULT"] = 1] = "DEFAULT";
    WindowAction[WindowAction["AUTOCLOSE"] = 2] = "AUTOCLOSE";
    WindowAction[WindowAction["CLOSEOTHER"] = 4] = "CLOSEOTHER";
    WindowAction[WindowAction["FADERCLOSE"] = 8] = "FADERCLOSE";
    WindowAction[WindowAction["INTERACTIVE"] = 16] = "INTERACTIVE";
    WindowAction[WindowAction["POPUP"] = 32] = "POPUP";
    WindowAction[WindowAction["UNIQUE"] = 64] = "UNIQUE";
    WindowAction[WindowAction["STRONG"] = 128] = "STRONG"; // Не закрывается ни при каких условиях, кроме программного закрытия или перезапуска приложения
})(WindowAction || (WindowAction = {}));
//# sourceMappingURL=WindowAction.js.map