import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import { useAuthStore } from "../stores/useAuthStore";
import { useChatStore } from "../stores/useChatStore";
import { useEffect, useRef } from "react";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../libs/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessageLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    isFriend,
    friendReqSent,
    friendReqReceived,
    setIsFriend,
    setFriendReqSent,
    setFriendReqReceived,
    addFriend,
    acceptFriendReq,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messagesEndRef = useRef(null);

  console.log("friend sent", friendReqSent);

  useEffect(() => {
    // get history message
    getMessages(selectedUser._id);
    // listen to socket
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    subscribeToMessages,
    unsubscribeFromMessages,
    getMessages,
  ]);

  useEffect(() => {
    if (messagesEndRef.current && messages) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (authUser && selectedUser) {
      setIsFriend(authUser.friends.includes(selectedUser._id));
      setFriendReqReceived(authUser.friendsReq.includes(selectedUser._id));
      setFriendReqSent(selectedUser.friendsReq.includes(authUser._id));
    }
  }, [
    setIsFriend,
    setFriendReqSent,
    setFriendReqReceived,
    authUser,
    selectedUser,
  ]);

  if (isMessageLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageInput />
        <MessageSkeleton />
      </div>
    );
  }

  const handleAddFriend = () => {
    addFriend(selectedUser._id);
    setFriendReqSent(true);
  };

  const handleAcceptReq = () => {
    acceptFriendReq(selectedUser._id);
    setFriendReqReceived(false);
    setIsFriend(true);
    getMessages(selectedUser._id);
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messagesEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePicture || "/avatar.jpg"
                      : selectedUser.profilePicture || "/avatar.jpg"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      {!isFriend && !friendReqSent && !friendReqReceived && (
        <div className="p-4 text-center text-rose-500">
          You must be friend with this user to send messages!
          <button onClick={handleAddFriend} className="btn btn-sm ml-2">
            Add friend
          </button>
        </div>
      )}
      {!isFriend && friendReqSent && !friendReqReceived && (
        <div className="p-4 text-center text-amber-500">
          You have sent a friend request. Waiting for acceptance!
        </div>
      )}
      {!isFriend && !friendReqSent && friendReqReceived && (
        <div className="p-4 text-center text-emerald-500">
          {selectedUser.name} have sent you a friend request. Waiting for your
          response!
          <button onClick={handleAcceptReq} className="btn btn-sm ml-2">
            Accept friend
          </button>
        </div>
      )}

      <MessageInput disabled={!isFriend} />
    </div>
  );
};

export default ChatContainer;
