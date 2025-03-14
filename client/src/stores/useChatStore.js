import { create } from "zustand";
import toast from "react-hot-toast";
import MessageServices from "../services/message.service";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  users: [],
  messages: [],
  selectedUser: null,
  isMessagesLoading: false,
  isUsersLoading: false,
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      MessageServices.getOnlineUsers().then((res) => {
        set({ users: res.data });
      });
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Something went wrong while fetching users"
      );
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      MessageServices.getMessages(userId).then((res) => {
        set({ messages: res.data });
      });
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Something went wrong while fetching messages"
      );
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  setMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      MessageServices.sendMessage(selectedUser._id, messageData).then((res) => {
        set({ messages: [...messages, res.data] });
      });
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Something went wrong while sending message"
      );
    }
  },
  subscribeToMessage: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState.socket;
    socket.on("newMessage", (newMessage) => {
      const isMessageSendFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSendFromSelectedUser) return;
      set({ messages: [...messages, newMessage] });
    });
  },
  unsubscribeFromMessage: () => {
    const socket = useAuthStore.getState.socket;
    socket.off("newMessage");
  },
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
