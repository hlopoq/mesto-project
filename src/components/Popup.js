export default class Popup {
    constructor(popupSelector) {
        this._popupSelector = popupSelector;
        this._popup = document.querySelector(this._popupSelector);
        this._closeButtonElement = this._popup.querySelector(".popup__close-button");
        this._handleEscClose = this._handleEscClose.bind(this);
        this._handleOverlayClose = this._handleOverlayClose.bind(this);
    }
    open() {
        this._popup.classList.add("popup_opened");
        document.addEventListener("keydown", this._handleEscClose);
        this._popup.addEventListener("click", this._handleOverlayClose);
    }
    close() {
        this._popup.classList.remove("popup_opened");
        document.removeEventListener("keydown", this._handleEscClose);
        this._popup.removeEventListener("click", this._handleOverlayClose);
    }
    _handleEscClose(evt) {
        if (evt.key === "Escape") {
            this.close();
        }
    }
    _handleOverlayClose(evt) {
        if (evt.currentTarget === evt.target) {
            this.close();
        }
    }
    setEventListeners(evt) {
        this._closeButtonElement.addEventListener("click", () => this.close());
    }
}