import default class Popup {
    constructor(popup){
        this.popup = popup;
    }
    open(){
        this.popup.classList.add("popup_opened");
        document.addEventListener("keydown", this._handleEscClose.bind(this));
        this.popup.addEventListener("click", this.setEventListeners.bind(this));
    }
    close(){
        this.popup.classList.remove("popup_opened");
        document.removeEventListener("keydown", this._handleEscClose.bind(this));
        this.popup.removeEventListener("click", this.setEventListeners.bind(this));
    }
    _handleEscClose(evt){
        if (evt.key === "Escape") {
            this.close();
        }
    }
    setEventListeners(evt){
        if (evt.currentTarget === evt.target) {
            this.close();
        }
    }
}