import { create } from "zustand";
import toast from "react-hot-toast";
import MessageServices from "../services/message.service";
import FriendServices from "../services/friend.service";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  users: [],
  messages: [],
  selectedUser: null,
  isMessagesLoading: false,
  isUsersLoading: false,
  isFriend: false,
  friendReqSent: false,
  friendReqReceived: false,
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
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    console.log("Messages", messageData);
    console.log("User", selectedUser);

    try {
      MessageServices.sendMessage(selectedUser._id, messageData).then((res) => {
        console.log(res);

        set({ messages: [...messages, res.data] });
      });
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Something went wrong while sending message"
      );
    }
  },
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (newMessage) => {
      const isMessageSendFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSendFromSelectedUser) return;
      set({ messages: [...get().messages, newMessage] });
    });
  },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
  addFriend: async (friendId) => {
    try {
      FriendServices.addFriend({ friendId }).then((res) => {
        toast.success(res.data.message);
      });
      const socket = useAuthStore.getState().socket;
      if (socket) {
        socket.emit("friendReqSent", friendId);
      }
      set({ friendReqSent: true });
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Something went wrong while sending request"
      );
    }
  },
  acceptFriendReq: async (friendId) => {
    try {
      FriendServices.acceptReq({ friendId }).then((res) => {
        toast.success(res.data.message);
      });
      useAuthStore.getState().socket.emit("friendReqAccepted", friendId);
      set({ isFriend: true, friendReqReceived: false });
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Something went wrong while accepting request"
      );
    }
  },
  setSelectedUser: (selectedUser) => set({ selectedUser }),
  setIsFriend: (isFriend) => set({ isFriend }),
  setFriendReqSent: (friendReqSent) => set({ friendReqSent }),
  setFriendReqReceived: (friendReqReceived) => set({ friendReqReceived }),
}));
