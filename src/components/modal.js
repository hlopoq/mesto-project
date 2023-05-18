import { resetButtonState } from "./validate.js";

const popupCloseButton = document.querySelectorAll(".popup__close-button");
popupCloseButton.forEach((button) => {
  const popupNearest = button.closest(".popup");
  button.addEventListener("click", () => closePopup(popupNearest));
});

export function openPopup(popup) {
  popup.classList.add("popup_opened");
  document.addEventListener("keydown", closePopupEscape);
  popup.addEventListener("click", closePopupOverlay);
}

export function closePopup(popup) {
  popup.classList.remove("popup_opened");
  document.removeEventListener("keydown", closePopupEscape);
  popup.removeEventListener("click", closePopupOverlay);
}

function closePopupEscape(evt) {
  if (evt.key === "Escape") {
    const popup = document.querySelector(".popup_opened");
    closePopup(popup);
  }
}

function closePopupOverlay(evt) {
  if (evt.currentTarget === evt.target) {
    closePopup(evt.target);
  }
}

const profileNameList = document.querySelector(".profile__name");
const profileCaptionList = document.querySelector(".profile__caption");
const popupEditList = document.querySelector(".popup_edit-profile");
const formEditProfile = popupEditList.querySelector(".popup_form-edit");
const formName = formEditProfile.querySelector(".form__input_type_name");
const formAbout = formEditProfile.querySelector(".form__input_type_about");

const profileEditButtonList = document.querySelector(".profile__edit-button");

profileEditButtonList.addEventListener("click", () => {
  formName.value = profileNameList.textContent;
  formAbout.value = profileCaptionList.textContent;
  openPopup(popupEditList);
});

function handleSubmitformEditProfile(e) {
  e.preventDefault();
  const nameValue = formName.value;
  const aboutValue = formAbout.value;
  if (nameValue) {
    profileNameList.textContent = nameValue;
  }
  if (aboutValue) {
    profileCaptionList.textContent = aboutValue;
  }
  closePopup(popupEditList);
}
formEditProfile.addEventListener("submit", handleSubmitformEditProfile);

export const popupTypeCard = document.querySelector(".popup_type-card");
export const popupFormSubmit =
  popupTypeCard.querySelector(".popup_form-submit");
export const inputCardName = popupFormSubmit.querySelector(
  ".form__input_card-name"
);
export const inputCardLink = popupFormSubmit.querySelector(
  ".form__input_card-link"
);
const buttonElement = popupFormSubmit.querySelector(".form__button");

const addButton = document.querySelector(".profile__add-button");

addButton.addEventListener("click", () => {
  popupFormSubmit.reset();
  resetButtonState(buttonElement, "form__button_inactive");
  openPopup(popupTypeCard);
});
