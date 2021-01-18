import axios from "axios";
import { GET_CHATS, AFTER_POST_MESSAGE } from "../constants/chatConstants";

export const getChats = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/chat/getChats");

    dispatch({
      type: GET_CHATS,
      payload: res.data,
    });
  } catch (error) {
    console.error(error);
  }
};

export const afterPostMessage = (data) => {
  return {
    type: AFTER_POST_MESSAGE,
    payload: data,
  };
};
