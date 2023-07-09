export default class Card {
  constructor(
    { data, handleLikeClick, handleDeleteClick, handleCardClick },
    cardTemplateSelector,
    ownerId
  ) {
    this._nameValue = data.name;
    this._linkValue = data.link;
    this._cardId = data.id;
    this._cardLikes = data.likes;
    this._cardOwner = data.owner;
    this._handleLikeClick = handleLikeClick;
    this._handleDeleteClick = handleDeleteClick;
    this._handleCardClick = handleCardClick;
    this._cardTemplateSelector = cardTemplateSelector;
    this._ownerId = ownerId;
  }

  _getCardItem() {
    const cardTemplate = document.querySelector(
      this._cardTemplateSelector
    ).content;
    const cardItem = cardTemplate.querySelector(".card").cloneNode(true);
    return cardItem;
  }

  _checkCurrentUserLike() {
    const myLike = this._cardLikes.some((item) => {
      return item.id === this._ownerId;
    });
    if (myLike) {
      this._likeButton.classList.add("card__like-button_active");
    } else {
      this._likeButton.classList.remove("card__like-button_active");
    }
    return myLike;
  }

  _setEventListeners() {
    this._img.addEventListener("click", () => {
      this._handleCardClick(this._nameValue, this._linkValue);
    });

    this._likeButton.addEventListener("click", () => {
      this._handleLikeClick(this._cardId, this._checkCurrentUserLike(), this);
    });

    this._deleteButton.addEventListener("click", () => {
      this._handleDeleteClick(this._cardId, this);
    });
  }

  toggleLike(updatedLikes) {
    this._cardLikeValue.textContent = updatedLikes.length;
    this._cardLikes = updatedLikes;
    this._likeButton.classList.toggle(
      "card__like-active",
      updatedLikes.some((item) => item.id === this._ownerId)
    );
  }

  deleteCard() {
    this._item.remove();
  }

  generate() {
    this._item = this._getCardItem();
    this._img = this._item.querySelector(".card__image");
    this._img.alt = `img = ${this._nameValue}`;
    this._img.src = this._linkValue;
    this._heading = this._item.querySelector(".card__heading");
    this._heading.textContent = this._nameValue;
    this._cardLikeValue = this._item.querySelector(".card__like-counter");
    this._likeButton = this._item.querySelector(".card__like-button");
    this._deleteButton = this._item.querySelector(".card__trash");

    if (this._cardOwner.id !== this._ownerId) {
      this._deleteButton.classList.add("card__trash_hidden");
    }
    this.toggleLike(this._cardLikes);
    this._checkCurrentUserLike();
    this._setEventListeners();
    return this._item;
  }
}
