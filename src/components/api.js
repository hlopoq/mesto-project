class Api {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  _getResponseData(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  _request(url, options) {
    return fetch(url, options).then((res) => this._getResponseData(res));
  }

  getUserInformation() {
    return this._request(`${this.baseUrl}/users/me`, {
      headers: this.headers,
    });
  }

  getInitialCards() {
    return this._request(`${this.baseUrl}/cards`, {
      headers: this.headers,
    });
  }

  changeUserInformation(name, about) {
    return this._request(`${this.baseUrl}/users/me`, {
      method: "PATCH",
      body: JSON.stringify({
        name: `${name}`,
        about: `${about}`,
      }),
      headers: this.headers,
    });
  }

  postNewCard(name, link) {
    return this._request(`${this.baseUrl}/cards`, {
      method: "POST",
      body: JSON.stringify({
        name: `${name}`,
        link: `${link}`,
      }),
      headers: this.headers,
    });
  }

  deleteCardFromServer(cardId) {
    return this._request(`${this.baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this.headers,
    });
  }

  likeCardToServer(cardId) {
    return this._request(`${this.baseUrl}/cards/likes/${cardId}`, {
      method: "PUT",
      headers: this.headers,
    });
  }

  deleteLikeCardFromServer(cardId) {
    return this._request(`${this.baseUrl}/cards/likes/${cardId}`, {
      method: "DELETE",
      headers: this.headers,
    });
  }

  changeUserAvatar(link) {
    return this._request(`${this.baseUrl}/users/me/avatar`, {
      method: "PATCH",
      body: JSON.stringify({
        avatar: `${link}`,
      }),
      headers: this.headers,
    });
  }
}

const api = new Api({
  baseUrl: "https://mesto.nomoreparties.co/v1/plus-cohort-25",
  headers: {
    authorization: "e00bece1-051d-4122-9ac3-6b73976b703d",
    "Content-Type": "application/json",
  },
});

export { api };
