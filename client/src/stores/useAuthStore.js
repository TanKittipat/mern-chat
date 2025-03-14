import { create } from "zustand";
import AuthServices from "../services/auth.service";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useChatStore } from "./useChatStore";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  socket: null,
  onlineUsers: [],
  checkAuth: async () => {
    try {
      AuthServices.checkAuth().then((res) => set({ authUser: res.data }));
      get().connectSocket();
    } catch (error) {
      console.log("Error in check auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      AuthServices.signUp(data).then((res) => {
        set({ authUser: res.data });
        get().connectSocket();
        toast.success("Account create successfully!");
      });
    } catch (error) {
      console.log("Error in signUp", error);
      toast.error("Failed to create new user!");
    } finally {
      set({ isSigningUp: false });
    }
  },
  signIn: async (data) => {
    set({ isLoggingIn: true });
    try {
      AuthServices.signIn(data).then((res) => {
        set({ authUser: res.data });
        get().connectSocket();
        toast.success("Logged in successfully!");
      });
    } catch (error) {
      console.log("Error in signIn", error);
      toast.error("Failed to logging in user!");
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      AuthServices.logout().then(() => {
        toast.success("Logged out successfully!");
        window.location.reload();
      });
      get().disconnectSocket();
    } catch (error) {
      console.log("Error in logout", error);
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      AuthServices.updateProfile(data).then((res) => {
        set({ authUser: res.data });
        toast.success("Update profile successfully!");
      });
    } catch (error) {
      console.log("Error in updateProfile", error);
      toast.error("Failed to update profile!");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;
    const socketUrl = import.meta.env.VITE_SOCKETURL;
    const newSocket = io(socketUrl, {
      query: {
        userId: authUser._id,
      },
    });
    newSocket.connect();
    set({ socket: newSocket });
    // listen for online users
    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    newSocket.on("friendReqReceived", (friendId) => {
      const selectedUser = useChatStore.getState().selectedUser;
      if (friendId === selectedUser._id) {
        useChatStore.getState().setFriendReqReceived(true);
      }
    });

    newSocket.on("friendReqSent", (friendId) => {
      const selectedUser = useChatStore.getState().selectedUser;
      if (friendId === selectedUser._id) {
        useChatStore.getState().setFriendReqReceived(false);
      }
    });

    newSocket.on("friendReqAccepted", (friendId) => {
      const selectedUser = useChatStore.getState().selectedUser;
      if (friendId === selectedUser._id) {
        useChatStore.getState().setFriendReqReceived(false);
        useChatStore.getState().setFriendReqSent(false);
        useChatStore.getState().setIsFriend(true);
      }
    });
  },
  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
