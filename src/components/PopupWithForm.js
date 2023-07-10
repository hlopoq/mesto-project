import Popup from "./Popup.js";

export default class PopupWithForm extends Popup {
  constructor(popupSelector, handleSubmitForm) {
    super(popupSelector);
    this._handleSubmitForm = handleSubmitForm;
    this._form = this._popup.querySelector(".form");
    this._formInput = this._form.querySelectorAll(".form__input");
    this._submitBtn = this._form.querySelector(".form__button");
    this._submitBtnText = this._submitBtn.textContent;
  }

  _getInputValues() {
    const formValue = {};
    Array.from(this._formInput).forEach((element) => {
      formValue[element.name] = element.value;
    });
    return formValue;
  }

  setInputValues(data) {
    Array.from(this._formInput).forEach((input) => {
      input.value = data[input.name];
    });
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener("submit", (evt) => {
      evt.preventDefault();
      this._handleSubmitForm(this._getInputValues(), evt);
    });
  }

  close() {
    super.close();
    this._form.reset();
  }
}
