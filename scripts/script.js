const cardTemplateList = document.querySelector("#card").content;
const fullScreenList = document.querySelector(".popup__fullscreen");
const fullScreenImage = fullScreenList.querySelector(
  ".popup__fullscreen-image"
);
const fullScreenHeading = fullScreenList.querySelector(
  ".popup__fullscreen-heading"
);

// Open/close popup
function openPopup(openPopup) {
  openPopup.classList.add("popup_opened");
}
function closePopup(closePopup) {
  closePopup.classList.remove("popup_opened");
}

// Eventlistener for popup close button
const popupCloseButtonList = document.querySelectorAll(".popup__close-button");
popupCloseButtonList.forEach((button) => {
  const popupNearest = button.closest(".popup");
  button.addEventListener("click", () => closePopup(popupNearest));
});

// Popup in profile
const profileNameList = document.querySelector(".profile__name");
const profileCaptionList = document.querySelector(".profile__caption");
const popupEditList = document.querySelector(".popup_edit-profile");

const formEditProfile = popupEditList.querySelector(".popup_form-edit");

const formName = formEditProfile.querySelector(".form__input_type_name");
const formAbout = formEditProfile.querySelector(".form__input_type_about");

const profileEditButtonList = document.querySelector(".profile__edit-button");

// Eventlistener for popup profile button
profileEditButtonList.addEventListener("click", () => {
  formName.value = profileNameList.textContent;
  formAbout.value = profileCaptionList.textContent;
  openPopup(popupEditList);
});

// Function for submit for profile
function formSubmitEditProfile(e) {
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
// Eventlistener for submit
formEditProfile.addEventListener("submit", formSubmitEditProfile);

// Card
const popupTypeCardList = document.querySelector(".popup_type-card");
const popupFormSubmit = popupTypeCardList.querySelector(".popup_form-submit");

const inputCardName = popupFormSubmit.querySelector(".form__input_card-name");
const inputCardLink = popupFormSubmit.querySelector(".form__input_card-link");

const addButtonList = document.querySelector(".profile__add-button");

// Eventlistener for popup submit button
addButtonList.addEventListener("click", () => {
  popupFormSubmit.reset();
  openPopup(popupTypeCardList);
});

const cardsContainer = document.querySelector(".cards");

// Function to create card
function createCard(nameValue, linkValue) {
  if (linkValue) {
    const cardItem = cardTemplateList.querySelector(".card").cloneNode(true);
    let cardImage = cardItem.querySelector(".card__image");
    cardImage.src = linkValue;
    cardImage.alt = nameValue;
    cardItem.querySelector(".card__heading").textContent = nameValue;
    //Eventlistener for like
    cardItem
      .querySelector(".card__like-button")
      .addEventListener("click", function (e) {
        e.target.classList.toggle("card__like-button_active");
      });
    //Eventlistener for
    cardItem
      .querySelector(".card__trash")
      .addEventListener("click", function (e) {
        e.target.closest(".card").remove();
      });

    //Eventlistener for fullscreen
    cardImage.addEventListener("click", function () {
      fullScreenImage.src = linkValue;
      fullScreenImage.alt = nameValue;
      fullScreenHeading.textContent = nameValue;
      openPopup(fullScreenList);
    });
    return cardItem;
  } else {
    return "";
  }
}

function renderCard(newCard) {
  cardsContainer.prepend(newCard);
}

// Function for submit for card
function formSubmitCards(e) {
  e.preventDefault();
  const nameValue = inputCardName.value;
  const linkValue = inputCardLink.value;
  const newCard = createCard(nameValue, linkValue);

  if (newCard) {
    renderCard(newCard);
  }

  closePopup(popupTypeCardList);
}
// Eventlistener for submit
popupFormSubmit.addEventListener("submit", formSubmitCards);

//InitialCards
function addInitialCards() {
  for (let i = 0; i < initialCards.length; i++) {
    const nameValue = initialCards[i].name;
    const linkValue = initialCards[i].link;
    const newCard = createCard(nameValue, linkValue);
    renderCard(newCard);
  }
}
addInitialCards();
