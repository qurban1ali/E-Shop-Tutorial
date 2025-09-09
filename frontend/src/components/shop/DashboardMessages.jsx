import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { backend_url, server } from "../../server";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import styles from "../../styles/style";
import { TfiGallery } from "react-icons/tfi";
import { format } from "timeago.js";
import socketIO from "socket.io-client";
const ENDPOINT = "https://socket-ecommerce-tu68.onrender.com/";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const DashboardMessages = () => {
  const { seller } = useSelector((state) => state.seller);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeStatus, setActiveStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState();

  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    axios
      .get(`${server}/conversation/get-all-conversation-seller/${seller._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setConversations(res.data.conversations);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [seller]);

  useEffect(() => {
    if (seller) {
      const userId = seller?._id;
      socketId.emit("addUser", userId);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [seller]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== seller._id);
    const online = onlineUsers.find((user) => user.userId === chatMembers);
    return online ? true : false;
  };

  //  get messages
  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.get(
          `${server}/message/get-all-messages/${currentChat?._id}`
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [currentChat]);

  // create new messages

  const sendMessageHandler = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return; // prevent empty messages

    const message = {
      sender: seller._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== seller._id
    );

    socketId.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post(
        `${server}/message/create-new-message`,
        message
      );
      setMessages((prev) =>
        Array.isArray(prev) ? [...prev, res.data.message] : [res.data.message]
      );
      updateLastMessage();
      setNewMessage(""); // ✅ clear input box
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessage = async () => {
    socketId.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: seller._id,
    });
    await axios
      .put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: seller._id,
      })
      .then((res) => {
        console.log(res.data.conversation);
        setNewMessage("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    setImages(file);
    imageSendingHandler(file);
  };

  const imageSendingHandler = async (e) => {
    const formData = new FormData();

    formData.append("images", e);
    formData.append("sender", seller._id);
    formData.append("text", newMessage);
    formData.append("conversationId", currentChat._id);

    const receiverId = currentChat.members.find(
      (member) => member !== seller._id
    );
    socketId.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      images: e,
    });

    try {
      await axios
        .post(`${server}/message/create-new-message`, formData)
        .then((res) => {
          setImages();
          setMessages([...messages, res.data.message]);
          updateLastMessageForImage();
        });
    } catch (error) {
      console.log(error);
    }
  };
  const updateLastMessageForImage = async () => {
    await axios.put(
      `${server}/conversation/update-last-message/${currentChat._id}`,
      {
        lastMessage: "Photo",
        lastMessageId: seller._id,
      }
    );
  };
  return (
    <div className="w-[90%] bg-white m-5 h-[85vh] overflow-y-scroll rounded">
      {!open && (
        <>
          <h1 className="text-center text-[30px] py-3 font-Poppins ">
            All Messages
          </h1>
          {/* all messeges list */}
          {conversations &&
            conversations.map((item, index) => {
              return (
                <MessageList
                  data={item}
                  key={index}
                  index={index}
                  setOpen={setOpen}
                  setCurrentChat={setCurrentChat}
                  me={seller._id}
                  userData={userData}
                  setUserData={setUserData}
                  online={onlineCheck(item)}
                  setActiveStatus={setActiveStatus}
                />
              );
            })}
        </>
      )}

      {open && (
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          sellerId={seller._id}
          userDat={userData}
          activeStatus={activeStatus}
          handleImageUpload={handleImageUpload}
        />
      )}
    </div>
  );
};

const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  userData,
  setUserData,
  online,
  setActiveStatus,
}) => {
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`?${id}`);
    setOpen(true);
  };
  const [active, setActive] = useState(0);

  useEffect(() => {
    //// setActiveStatus(online)
    const userId = data.members.find((user) => user !== me);

    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/user/user-info/${userId} `);
        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [me, data]);
  return (
    <div
      className={`w-full flex p-3  px-3 ${
        active === index ? "bg-[#00000010]" : "bg-transparent"
      } cursor-pointer`}
      onClick={(e) =>
        setActive(index) ||
        handleClick(data._id) ||
        setCurrentChat(data) ||
        setUserData(user) ||
        setActiveStatus(online)
      }
    >
      <div className="relative">
        <img
          src={`${backend_url}${user?.avatar?.url}`}
          alt=""
          className="w-[50px] h-[50px] rounded-full"
        />
        {online ? (
          <div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[2px] right-[2px]" />
        ) : (
          <div className="w-[12px] h-[12px] bg-[#ece8e8ef] rounded-full absolute top-[2px] right-[2px]" />
        )}
      </div>
      <div className="pl-3">
        <h1 className="text-[18px]">{user?.name}</h1>
        <p className="text-[16px] text-[#0000008f]">
          {data.lastMessageId !== user?._id
            ? "You:"
            : userData?.name.split(" ")[0] + ":"}{" "}
          {data?.lastMessage}
        </p>
      </div>
    </div>
  );
};

const SellerInbox = ({
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  activeStatus,
  userData,
  handleImageUpload,
}) => (
  <div className="w-full min-h-full flex flex-col justify-between">
    {/* message header */}
    <div className="w-full flex p-3 items-center justify-between bg-[#0000002c]">
      <div className="flex">
        <img
          src="http://localhost:8000/uploads/shoes_1756707286260_979186652.jpg"
          alt=""
          className="rounded-full w-[60px] h-[60px]"
        />
        <div className="pl-3">
          <h1 className="text-[18px] font-[600]">Maher Qurban</h1>
          <h1>{activeStatus ? "Active Now" : ""}</h1>
        </div>
      </div>

      <AiOutlineArrowRight
        size={20}
        onClick={() => setOpen(false)}
        className="cursor-pointer"
      />
    </div>

    {/* masseges */}
    <div className="px-3 h-[65vh] py-3 overflow-y-scroll">
      {messages &&
        messages.map((item, index) => {
          return (
            <div
              className={`flex w-full my-2 ${
                item.sender === sellerId ? "justify-end" : "justify-start"
              }`}
            >
              {item.sender !== sellerId && (
                <img
                  src="http://localhost:8000/uploads/shoes_1756707286260_979186652.jpg"
                  alt=""
                  className="w-[40px] h-[40px] rounded-full mr-3"
                />
              )}
              {item.images && (
                <img
                  src={`${backend_url}${item.images}`}
                  alt=""
                  className="h-[300px] object-cover w-[300px] rounded-[10px] mr-2"
                />
              )}
              {item.text !== "" && (
                <div>
                  <div
                    className={`w-max p-2 rounded ${
                      item.sender === sellerId ? "bg-[#000]" : "bg-[#4dd684]"
                    }  text-[#fff] h-min`}
                  >
                    <p>{item.text}</p>
                  </div>
                  <p className="text-[12px] text-[#000000d2] pt-1">
                    {format(item.createdAt)}
                  </p>
                </div>
              )}
            </div>
          );
        })}
    </div>

    {/* send message input */}
    <form
      aria-required={true}
      className="p-3 relative w-full flex justify-between items-center"
      onSubmit={sendMessageHandler}
    >
      <div className="w-[3%]">
        <input
          type="file"
          id="image"
          className="hidden"
          onChange={handleImageUpload}
        />
        <label htmlFor="image">
          <TfiGallery className="cursor-pointer" size={20} />
        </label>
      </div>
      <div className="w-[97%]">
        <input
          type="text"
          required
          placeholder="Enter Your message ...."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className={`${styles.input}`}
        />
        <input type="submit" value="Send" className="hidden" id="send" />
        <label htmlFor="send">
          <AiOutlineSend
            size={20}
            className="absolute right-4 top-5 cursor-pointer"
          />
        </label>
      </div>
    </form>
  </div>
);

export default DashboardMessages;
