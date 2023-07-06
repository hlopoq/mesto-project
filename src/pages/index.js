import "./index.css";
import { createCard } from "../components/Card.js";
import { api } from "../components/Api.js";
import {
  cardsContainer,
  profileNameList,
  profileCaptionList,
  profileAvatarList,
} from "../components/modal.js";

export let ownerId = "";

Promise.all([api.getUserInformation(), api.getInitialCards()])
  .then(([updatedData, cards]) => {
    console.log(updatedData);
    console.log(cards);
    profileNameList.textContent = updatedData.name;
    profileCaptionList.textContent = updatedData.about;
    profileAvatarList.src = updatedData.avatar;
    ownerId = updatedData._id;
    cards.reverse();
    cards.forEach((cardData) => {
      const newCard = createCard(
        cardData.name,
        cardData.link,
        cardData._id,
        cardData.likes,
        cardData.owner
      );
      cardsContainer.prepend(newCard);
    });
  })
  .catch((err) => {
    console.log(err);
  });
