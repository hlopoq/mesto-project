import { resetButtonState, clearFormErrors } from "./validate.js";
import { changeUserInformation, postNewCard, changeUserAvatar } from "./api.js";
import { createCard } from "./card.js";

export const cardsContainer = document.querySelector(".cards");

const popupCloseButton = document.querySelectorAll(".popup__close-button");
popupCloseButton.forEach((button) => {
  const popupNearest = button.closest(".popup");
  button.addEventListener("click", () => closePopup(popupNearest));
});

export function openPopup(popup) {
  popup.classList.add("popup_opened");
  const formElement = popup.querySelector(".form");
  if (formElement) {
    clearFormErrors(
      formElement,
      "form__input_type-error",
      "form__input-error_active"
    );
    formElement.reset();
  }

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

export const profileNameList = document.querySelector(".profile__name");
export const profileCaptionList = document.querySelector(".profile__caption");
export const profileAvatarList = document.querySelector(".profile__avatar");
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

function updateButtonState(
  isLoading,
  btn,
  btnText = "Сохранить",
  loadingText = "Сохранение..."
) {
  if (isLoading) {
    btn.textContent = loadingText;
  } else {
    btn.textContent = btnText;
  }
}

export function handleFormSubmit(request, evt, loadingText = "Сохранение...") {
  evt.preventDefault();
  const submitBtn = evt.target.querySelector('[type="submit"]');
  const originalText = submitBtn.textContent;
  updateButtonState(true, submitBtn, originalText, loadingText);
  request()
    .then(() => {
      evt.target.reset();
    })
    .catch((err) => {
      console.error(`Ошибка: ${err}`);
    })
    .finally(() => {
      updateButtonState(false, submitBtn, originalText);
    });
}

function handleSubmitformEditProfile(evt) {
  function sendRequest() {
    return changeUserInformation(formName.value, formAbout.value).then(
      (updatedData) => {
        profileNameList.textContent = updatedData.name;
        profileCaptionList.textContent = updatedData.about;
        profileAvatarList.src = updatedData.avatar;
        closePopup(popupEditList);
      }
    );
  }
  handleFormSubmit(sendRequest, evt);
}
formEditProfile.addEventListener("submit", handleSubmitformEditProfile);

export const popupTypeCard = document.querySelector(".popup_type-card");
export const popupFormSubmit =
  popupTypeCard.querySelector(".popup_form-submit");
export const inputCardName = popupFormSubmit.querySelector(
  ".form__input_card-name"
);
export const inputCardLink = popupFormSubmit.querySelector(".form__input_link");
const buttonElement = popupFormSubmit.querySelector(".form__button");

const addButton = document.querySelector(".profile__add-button");
addButton.addEventListener("click", () => {
  popupFormSubmit.reset();
  resetButtonState(buttonElement, "form__button_inactive");
  openPopup(popupTypeCard);
});

function handleSubmitformAddCard(evt) {
  function sendRequest() {
    return postNewCard(inputCardName.value, inputCardLink.value).then(
      (cardData) => {
        const newCard = createCard(
          cardData.likes,
          cardData._id,
          cardData.owner,
          cardData.link,
          cardData.name
        );
        cardsContainer.prepend(newCard);
        closePopup(popupTypeCard);
      }
    );
  }
  handleFormSubmit(sendRequest, evt);
}

popupFormSubmit.addEventListener("submit", handleSubmitformAddCard);

export const avatarPopupWindow = document.querySelector(".popup_edit-avatar");
export const avatarFormElement =
  avatarPopupWindow.querySelector(".popup_form-avatar");
export const avatarLinkInputField =
  avatarFormElement.querySelector(".form__input_link");
const changeAvatarButton = avatarFormElement.querySelector(".form__button");

const openAvatarPopupButton = document.querySelector(".profile__avatar-button");
openAvatarPopupButton.addEventListener("click", () => {
  avatarFormElement.reset();
  changeAvatarButton.classList.add("form__button_inactive");
  changeAvatarButton.disabled = true;
  openPopup(avatarPopupWindow);
});

function handleAvatarChangeSubmit(evt) {
  function sendRequest() {
    return changeUserAvatar(avatarLinkInputField.value).then((avatarData) => {
      profileAvatarList.src = avatarData.avatar;
      closePopup(avatarPopupWindow);
    });
  }
  handleSubmit(sendRequest, evt);
}

avatarFormElement.addEventListener("submit", handleAvatarChangeSubmit);

export const deletePopup = document.querySelector(".popup_delete-card");
const deleteButton = deletePopup.querySelector(".form__button");
export function confirmDelete() {
  return new Promise((resolve) => {
    deleteButton.onclick = function () {
      resolve();
    };
  });
}