import api from "./api";
const baseUrl = "/friend";

const addFriend = async (id) => {
  return await api.post(`${baseUrl}/add`, id);
};

const acceptReq = async (id) => {
  return await api.post(`${baseUrl}/accept`, id);
};

const FriendServices = {
  acceptReq,
  addFriend,
};

export default FriendServices;
