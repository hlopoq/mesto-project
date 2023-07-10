import "./index.css";
import Card from "../components/Card";
import Api from "../components/Api";
import PopupWithForm from "../components/PopupWithForm";
import PopupWithImage from "../components/PopupWithImage";
import Section from "../components/Section";
import UserInfo from "../components/UserInfo";
import FormValidator from "../components/FormValidator";
import { handleFormSubmit } from "../utils/utils";
import { popupValidator } from "../utils/constants";

export let ownerId = "";

const api = new Api({
  baseUrl: "https://mesto.nomoreparties.co/v1/plus-cohort-25",
  headers: {
    authorization: "e00bece1-051d-4122-9ac3-6b73976b703d",
    "Content-Type": "application/json",
  },
});

const userInfo = new UserInfo(
  ".profile__name",
  ".profile__caption",
  ".profile__avatar"
);

Promise.all([api.getUserInformation(), api.getInitialCards()])
  .then(([updatedData, cards]) => {
    console.log(updatedData);
    console.log(cards);
    userInfo.setUserInfo(updatedData);
    ownerId = updatedData._id;
    cards.reverse();
    cardSection.renderItems(cards, ownerId);
  })
  .catch((err) => {
    console.log(err);
  });

const imagePopup = new PopupWithImage(".popup__fullscreen");
imagePopup.setEventListeners();

const addCardPopup = new PopupWithForm(".popup_type-card", handleAddCardPopup);
addCardPopup.setEventListeners();

const avatarPopup = new PopupWithForm(".popup_edit-avatar", handleAvatarPopup);
avatarPopup.setEventListeners();

const profilePopup = new PopupWithForm(
  ".popup_edit-profile",
  handleProfilePopup
);
profilePopup.setEventListeners();

const cardSection = new Section(
  {
    renderer: (cardItem, id) => {
      cardSection.addItem(createCard(cardItem, id));
    },
  },
  ".cards"
);

const popupProfileEditButton = document.querySelector(".profile__edit-button");
const popupCardSelector = document.querySelector(".popup_type-card");
const popupAvatarSelector = document.querySelector(".popup_edit-avatar");
const popupProfileSelector = document.querySelector(".popup_edit-profile");

const addCardPopupValidator = new FormValidator(
  popupValidator,
  popupCardSelector
);
const avatarPopupValidator = new FormValidator(
  popupValidator,
  popupAvatarSelector
);
const editProfilePopupValdiator = new FormValidator(
  popupValidator,
  popupProfileSelector
);

addCardPopupValidator.enableValidation();
avatarPopupValidator.enableValidation();
editProfilePopupValdiator.enableValidation();

popupProfileEditButton.addEventListener("click", () => {
  profilePopup.open();
  editProfilePopupValdiator.resetButtonState();
  profilePopup.setInputValues(userInfo.getUserInfo());
});

function handleProfilePopup(data, evt) {
  function sendRequest() {
    return api
      .changeUserInformation(data.name, data.about)
      .then((updatedData) => {
        userInfo.setUserInfo(updatedData);
        profilePopup.close();
      });
  }
  handleFormSubmit(sendRequest, evt);
}

const openAvatarPopupButton = document.querySelector(".profile__avatar-button");
openAvatarPopupButton.addEventListener("click", () => {
  avatarPopup.open();
  avatarPopupValidator.resetButtonState();
});

function handleAvatarPopup(data, evt) {
  function sendRequest() {
    return api.changeUserAvatar(data["link"]).then((avatarData) => {
      userInfo.setAvatar(avatarData);
      avatarPopup.close();
    });
  }
  handleFormSubmit(sendRequest, evt);
}

const openCardPopupButton = document.querySelector(".profile__add-button");
openCardPopupButton.addEventListener("click", () => {
  addCardPopup.open();
  addCardPopupValidator.resetButtonState();
});

function handleAddCardPopup(data, evt) {
  function sendRequest() {
    return api
      .postNewCard(data["card-heading"], data["link"])
      .then((cardData) => {
        const newCard = createCard(cardData, ownerId);
        cardSection.addItem(newCard);
        addCardPopup.close();
      });
  }
  handleFormSubmit(sendRequest, evt);
}

function createCard(dataCard, id) {
  const card = new Card(
    {
      data: dataCard,
      handleLikeClick,
      handleDeleteClick,
      handleCardClick,
    },
    "#card",
    id
  );
  const newCard = card.generate();
  return newCard;
}

function handleLikeClick(id, currentLikes, card) {
  if (!currentLikes) {
    api
      .likeCardToServer(id)
      .then((res) => {
        card.toggleLike(res.likes);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    api
      .deleteLikeCardFromServer(id)
      .then((res) => {
        card.toggleLike(res.likes);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

function handleDeleteClick(id, card) {
  api
    .deleteCardFromServer(id)
    .then((res) => {
      console.log(res);
      card.deleteCard();
    })
    .catch((err) => {
      console.log(err);
    });
}

function handleCardClick(name, link) {
  imagePopup.open(name, link);
}
