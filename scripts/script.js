// Open/close popup
function openPopup(openPopup) {
  openPopup.classList.add('popup_opened');
};
function closePopup(closePopup) {
  closePopup.classList.remove('popup_opened');
};


// Eventlistener for popup close button
const popupCloseButton = document.querySelectorAll('.popup__close-button');
popupCloseButton.forEach((button) => {const popupNearest = button.closest('.popup');
button.addEventListener('click', () => closePopup(popupNearest))
});


// Popup in profile
const profileName = document.querySelector('.profile__name');
const profileCaption = document.querySelector('.profile__caption');
const popupEdit = document.querySelector('.popup_edit-profile');

const formEditProfile = popupEdit.querySelector('.popup_form-edit');

const formName = formEditProfile.querySelector('.form__input_type_name');
const formAbout = formEditProfile.querySelector('.form__input_type_about');

const profileEditButton = document.querySelector('.profile__edit-button');

// Eventlistener for popup profile button
profileEditButton.addEventListener('click', () => {
  formName.value = profileName.textContent;
  formAbout.value = profileCaption.textContent;
  openPopup(popupEdit);
});

// Function for submit for profile
function formSubmitEditProfile (e) {
  e.preventDefault();
  const nameValue = formName.value;
  const aboutValue = formAbout.value;
  if (nameValue) {
    profileName.textContent = nameValue;
  }
  if (aboutValue) {
    profileCaption.textContent = aboutValue;
  }
  closePopup(popupEdit)
}
// Eventlistener for submit
formEditProfile.addEventListener('submit', formSubmitEditProfile);

// Card
const popupTypeCard = document.querySelector('.popup_type-card');
const popupFormSubmit = popupTypeCard.querySelector('.popup_form-submit');

const inputCardName = popupFormSubmit.querySelector('.form__input_card-name')
const inputCardLink = popupFormSubmit.querySelector('.form__input_card-link');

const addButton = document.querySelector('.profile__add-button');


// Eventlistener for popup submit button
addButton.addEventListener('click', () => {
  popupFormSubmit.reset();
  openPopup(popupTypeCard)
});

const cards = document.querySelector('.cards');

// Function to create card
function createCard(nameValue, linkValue) {
  const cardTemplate = document.querySelector('#card').content;
  if (linkValue) {
    const cardItem = cardTemplate.querySelector('.card').cloneNode(true);
    cardItem.querySelector('.card__image').src = linkValue;
    cardItem.querySelector('.card__image').alt = nameValue;
    cardItem.querySelector('.card__heading').textContent = nameValue;
    //Eventlistener for like
    cardItem.querySelector('.card__like-button').addEventListener('click', function(e) {
      e.target.classList.toggle('card__like-button_active')
    });
    //Eventlistener for
    cardItem.querySelector('.card__trash').addEventListener('click', function(e) {
      e.target.closest('.card').remove();
    });

    const fullScreen = document.querySelector('.popup__fullscreen');
    const fullScreenImage = fullScreen.querySelector('.popup__fullscreen-image');
    const fullScreenHeading = fullScreen.querySelector('.popup__fullscreen-heading');
    //Eventlistener for fullscreen
    cardItem.querySelector('.card__image').addEventListener('click', function(e) {
      fullScreenImage.src = e.target.closest('.card__image').src;
      fullScreenImage.alt = e.target.closest('.card__image').alt;
      fullScreenHeading.textContent = e.target.closest('.card__image').nextElementSibling.textContent;
      openPopup(fullScreen);
    });
    return cardItem;
  } else {
    return '';
  }
  }

// Function for submit for card
function formSubmitCards(e) {
  e.preventDefault();
  const nameValue = inputCardName.value;
  const linkValue = inputCardLink.value;
  const newCard = createCard(nameValue, linkValue);

  if (newCard) {
    cards.prepend(newCard);
  }

  closePopup(popupTypeCard);
}
// Eventlistener for submit
popupFormSubmit.addEventListener('submit', formSubmitCards);

  //InitialCards
  function addInitialCards() {
    for (let i = 0; i < initialCards.length; i++) {
      const nameValue = initialCards[i].name;
      const linkValue = initialCards[i].link;
      const newCard = createCard(nameValue, linkValue);
      cards.prepend(newCard);
    }
  }
  addInitialCards();

