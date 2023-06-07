const config = {
  baseUrl: "https://mesto.nomoreparties.co/v1/plus-cohort-25",
  headers: {
    authorization: "e00bece1-051d-4122-9ac3-6b73976b703d",
    "Content-Type": "application/json",
  },
};

export function getResponseData(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
}

export function request(url, options) {
  return fetch(url, options).then(getResponseData);
}

export function getUserInformation() {
  return request(`${config.baseUrl}/users/me`, {
    headers: config.headers,
  });
}

export function getInitialCards() {
  return request(`${config.baseUrl}/cards`, {
    headers: config.headers,
  });
}

export function changeUserInformation(name, about) {
  return request(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    body: JSON.stringify({
      name: `${name}`,
      about: `${about}`,
    }),
    headers: config.headers,
  });
}

export function postNewCard(name, link) {
  return request(`${config.baseUrl}/cards`, {
    method: "POST",
    body: JSON.stringify({
      name: `${name}`,
      link: `${link}`,
    }),
    headers: config.headers,
  });
}

export function deleteCardFromServer(cardId) {
  return request(`${config.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  });
}

export function likeCardToServer(cardId) {
  return request(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "PUT",
    headers: config.headers,
  });
}

export function deleteLikeCardFromServer(cardId) {
  return request(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  });
}

export function changeUserAvatar(link) {
  return request(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    body: JSON.stringify({
      avatar: `${link}`,
    }),
    headers: config.headers,
  });
}
