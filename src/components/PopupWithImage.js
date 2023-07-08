import Popup from "./Popup";

export default class PopupWithImage extends Popup {
    constructor(popupSelector) {
        super(popupSelector);
        this._fullScreenImage = this._popup.querySelector(".popup__fullscreen-image");
        this._fullScreenHeading = this._popup.querySelector(".popup__fullscreen-heading");
    }
    
    
    open(name, link) {
        super.open();
        this._fullScreenHeading.textContent = name;
        this._fullScreenImage.src = link;
        this._fullScreenImage.alt = name;
    }
}    
