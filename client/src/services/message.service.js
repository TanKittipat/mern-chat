import api from "./api";
const baseUrl = "/messages";

const getOnlineUsers = async () => {
  return await api.get(`${baseUrl}/users`);
};

const sendMessage = async (id, data) => {
  return await api.post(`${baseUrl}/send/${id}`, data);
};

const getMessages = async (id) => {
  return await api.get(`${baseUrl}/${id}`);
};

const MessageServices = {
  getOnlineUsers,
  getMessages,
  sendMessage,
};

export default MessageServices;
