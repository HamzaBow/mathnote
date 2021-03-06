import { fetchGetData, validateArray, validateString } from "api/utils";
import { CardData } from "api/types"

const baseUrl = `${process.env.REACT_APP_API_URL}/cards`;

export const fetchAllCards = async () => {
  return await fetchGetData({
    url: baseUrl,
  });
};

export const fetchCardsForUser = async (userId: string) => {
  validateString(userId, 'userId')
  return await fetchGetData({
    url: `${baseUrl}?userid=${userId}`,
  });
};

export const fetchCardsFromCardsIds = async (cardsIds: string[]) => {
  validateArray(cardsIds, 'cardsIds')
  return await fetchGetData({
    url: `${baseUrl}?cardsids=${cardsIds.join(',')}`,
  });
};

export const fetchCard = async (cardId: string) => {
  validateString(cardId, 'cardId')
  return await fetchGetData({
    url: `${baseUrl}/${cardId}`,
  });
};

export const fetchCreateCard = async (cardData: CardData, idToken: string) => {
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      authorization: "Bearer " + idToken,
    },
    body: JSON.stringify(cardData),
  });
  const data = await res.json();
  return data;

};

export const fetchUpdateCardPUT = async (cardId: string, cardData: CardData, idToken: string) => {
  validateString(cardId, 'cardId')
  const res = await fetch(`${baseUrl}/${cardId}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      authorization: "Bearer " + idToken,
    },
    body: JSON.stringify(cardData),
  });
  const data = await res.json();
  return data;
};

export const fetchDeleteCard = async (cardId: string, idToken: string) => {
  const res = await fetch(`${baseUrl}/${cardId}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      authorization: "Bearer " + idToken,
    }
  });
  const data = await res.json();
  return data;
};
