import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import Message from "./Message";

const socket = io("https://hchaichi-bmqq.vercel.app");

const Chat = ({ currentUser, chatUser }) => {
  /*     console.log("currentUser :" + currentUser);
      console.log("chatUser :" + chatUser); */
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [PerPage, setPerPage] = useState(5);
  const [thelimit, setTheLimit] = useState(PerPage);
  const [lastmessage, setLastMessage] = useState(false);
  const messageContainerRef = useRef(null);
  const [totalMessages, settotalMessages] = useState(0);
  const [firstScroll, setfirstScroll] = useState(false);
  const [showNewMessage, setShowNewMessage] = useState(false);

  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);

  const btnRef1 = useRef(null);
  const btnRef2 = useRef(null);

  useEffect(() => {
    if (chatUser && chatUser._id) {
      // Fetch initial chat messages
      const fetchMessages = async () => {
        try {
          const { scrollTop, scrollHeight, clientHeight } =
            messageContainerRef.current;
          const isBottom = scrollTop + clientHeight >= scrollHeight;
          if (isBottom && showNewMessage) {
            setShowNewMessage(false);
          }
          const container = document.getElementsByClassName(
            "themessagecontainers"
          )[0];
          const response = await axios.get(
            `https://hchaichi-bmqq.vercel.app/chat/user/get/${chatUser._id}`,
            {
              params: { limit: thelimit },
              withCredentials: true,
            }
          );
          const fetchedMessages = response.data.messages;
          setMessages(fetchedMessages);
          settotalMessages(response.data.totalMessages);

          if (container && !firstScroll) {
            container.scrollIntoView({ behavior: "smooth" });
            setfirstScroll(true);
          }

          // Update read status for each unread message
          fetchedMessages.forEach(async (message) => {
            if (!message.read && currentUser._id != message.sender) {
              await markMessageAsRead(message._id);
            }
          });
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
      fetchMessages();
    }
  }, [chatUser]);

  useEffect(() => {
    if (chatUser && chatUser._id) {
      // Fetch initial chat messages
      const fetchMessages = async () => {
        try {
          const container = document.getElementsByClassName(
            "themessagecontainers"
          )[0];
          const response = await axios.get(
            `https://hchaichi-bmqq.vercel.app/chat/user/get/${chatUser._id}`,
            { params: { limit: thelimit }, withCredentials: true }
          );
          setMessages(response.data.messages);
          settotalMessages(response.data.totalMessages);

          if (container) {
            container.scrollIntoView({ behavior: "smooth" });
          }
          const fetchedMessages = response.data.messages;
          // Update read status for each unread message
          fetchedMessages.forEach(async (message) => {
            if (!message.read && currentUser._id != message.sender) {
              await markMessageAsRead(message._id);
            }
          });
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
      fetchMessages();
    }
  }, [thelimit, lastmessage]);

  const markMessageAsRead = async (messageId) => {
    try {
      await axios.put(
        `https://hchaichi-bmqq.vercel.app/chat/user/read/${messageId}`,
        {},
        { withCredentials: true }
      );
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, read: true } : msg
        )
      );
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };
  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);

      if (message.receiver == currentUser._id) {
        if (messageContainerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } =
            messageContainerRef.current;
          const isBottom = scrollTop + clientHeight >= scrollHeight;
          const isNotBottom = scrollTop + clientHeight < scrollHeight;

          if (isNotBottom) {
            setShowNewMessage(true);
          }

          if (isBottom) {
            setShowNewMessage(false);
          }
        }
      }
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = async () => {
    /*     const message = { sender: currentUser._id, receiver: chatUser._id, content: newMessage };
    try {
      socket.emit('sendMessage', message);
      setNewMessage('');
      setLastMessage(true);
      const container = document.getElementsByClassName('themessagecontainers')[0];
      if (container) {
        container.scrollIntoView({ behavior: 'smooth' });
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
    } */
    btnRef1.current.style.display = "none";
    btnRef2.current.style.display = "inline-block";

    const message = {
      sender: currentUser._id,
      receiver: chatUser._id,
      content: newMessage,
    };

    try {
      const formData = new FormData();
      formData.append("sender", message.sender);
      formData.append("receiver", message.receiver);
      formData.append("content", message.content);

      if (file) {
        formData.append("attachment", file);
      }

      const response = await axios.post(
        "https://hchaichi-bmqq.vercel.app/chat/user/post",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      socket.emit("sendMessage", response.data);
      setNewMessage("");
      setFile(null);
      setLastMessage(true);
      handleRemoveFile();
      const container = document.getElementsByClassName(
        "themessagecontainers"
      )[0];
      if (container) {
        container.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
    btnRef1.current.style.display = "inline-block";
    btnRef2.current.style.display = "none";
  };

  const handleScroll = () => {
    const container = messageContainerRef.current;
    const { scrollTop, scrollHeight, clientHeight } =
      messageContainerRef.current;
    if (container) {
      const isScrolledToTop = container.scrollTop === 0;
      const nbmessage = thelimit + PerPage;
      if (isScrolledToTop && thelimit < totalMessages) {
        console.log("Scrolled to the top");
        setTheLimit(nbmessage);
        // Load more messages here if needed
      }

      const isBottom = scrollTop + clientHeight >= scrollHeight;
      if (isBottom) {
        setShowNewMessage(false);
      }
    }
  };

  /*   const NewhandleScroll = () => {
    if (messageContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messageContainerRef.current;
      const isBottom = scrollTop + clientHeight >= scrollHeight;
      const isNotBottom = scrollTop + clientHeight < scrollHeight;

      if (isNotBottom) {
        setShowNewMessage(true);
      }

      if (isBottom) {
        setShowNewMessage(false);
      }
    }
  };
  useEffect(() => {
    const parentDiv = messageContainerRef.current;
    if (parentDiv) {
      parentDiv.addEventListener('scroll', NewhandleScroll);
    }

    return () => {
      if (parentDiv) {
        parentDiv.removeEventListener('scroll', NewhandleScroll);
      }
    };
  }, []); */

  useEffect(() => {
    const container = messageContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    /*     return () => {
          if (container) {
            container.removeEventListener('scroll', handleScroll);
          } 
        }; */
  });

  const handleEdit = (updatedMessage) => {
    setMessages(
      messages.map((msg) =>
        msg._id === updatedMessage._id ? updatedMessage : msg
      )
    );
  };

  const handleDelete = (messageId) => {
    setMessages(messages.filter((msg) => msg._id !== messageId));
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith("image/")) {
        setFileURL(URL.createObjectURL(selectedFile));
      } else {
        setFileURL(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileURL(null);
    fileInputRef.current.value = null;
  };

  const renderFilePreview = () => {
    if (!file) {
      return null;
    }

    if (file.type.startsWith("image/")) {
      return (
        <div className="file-preview d-flex align-items-center ">
          <div>
            <button className="btn btn-danger me-4" onClick={handleRemoveFile}>
              <i className="ki-duotone ki-trash fs-1 ">
                {" "}
                <span className="path1"></span> <span className="path2"></span>{" "}
                <span className="path3"></span> <span className="path4"></span>{" "}
                <span className="path5"></span>{" "}
              </i>
            </button>
          </div>

          <img
            src={fileURL}
            style={{ maxWidth: "140px", height: "auto" }}
            alt={file.name}
            className="file-preview-image shadow-lg  rounded"
          />
        </div>
      );
    } else if (file.type === "application/pdf") {
      return (
        <div className="file-preview d-flex align-items-center">
          <div>
            <button className="btn btn-danger me-4" onClick={handleRemoveFile}>
              <i className="ki-duotone ki-trash fs-1 ">
                {" "}
                <span className="path1"></span> <span className="path2"></span>{" "}
                <span className="path3"></span> <span className="path4"></span>{" "}
                <span className="path5"></span>{" "}
              </i>
            </button>
          </div>
          <i className="ki-duotone ki-file fs-1">
            {" "}
            <span className="path1"></span> <span className="path2"></span>{" "}
          </i>
          <span className="file-name">{file.name}</span>
        </div>
      );
    } else {
      return (
        <div className="file-preview d-flex align-items-center">
          <div>
            <button className="btn btn-danger me-4" onClick={handleRemoveFile}>
              <i className="ki-duotone ki-trash fs-1 ">
                {" "}
                <span className="path1"></span> <span className="path2"></span>{" "}
                <span className="path3"></span> <span className="path4"></span>{" "}
                <span className="path5"></span>{" "}
              </i>
            </button>
          </div>
          <i className="ki-duotone ki-file fs-1">
            {" "}
            <span className="path1"></span> <span className="path2"></span>{" "}
          </i>
          <span className="file-name">{file.name}</span>
        </div>
      );
    }
  };

  return (
    <>
      <div className="card-header" id="kt_chat_messenger_header">
        <div className="card-title">
          <div className="d-flex justify-content-center flex-column me-3">
            <p className="fs-4 fw-bold text-gray-900  me-1 mb-2 lh-1">
              {chatUser && chatUser.username
                ? chatUser.username
                : "No User Selected"}
            </p>
            <div className="mb-0 lh-1">
              {chatUser && chatUser.status ? (
                <>
                  <span className="badge badge-success badge-circle w-10px h-10px me-1"></span>
                  <span className="fs-7 fw-semibold text-muted">Online</span>
                </>
              ) : (
                <span className="fs-7 fw-semibold text-muted">Offline</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card-body" id="kt_chat_messenger_body">
        <div
          className="scroll-y me-n5 pe-5 h-300px "
          data-kt-element="messages"
          ref={messageContainerRef}
        >
          <div className="d-flex flex-column-reverse">
            {file && (
              <div className="d-flex justify-content-end mb-10 ">
                <div className="d-flex flex-column align-items-end">
                  <div className="d-flex align-items-center mb-2">
                    <div className="me-3">
                      <a className="fs-5 fw-bold text-gray-900 text-hover-primary ms-1">
                        You
                      </a>
                    </div>
                    <div className="symbol  symbol-35px symbol-circle ">
                      <img alt="Pic" src={currentUser.image} />
                    </div>
                  </div>

                  <div className="d-flex">
                    <div
                      className="p-5 rounded bg-light-primary text-gray-900 fw-semibold mw-lg-400px text-end"
                      data-kt-element="message-text"
                    >
                      {renderFilePreview()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {Array.isArray(messages) && messages.length === 0 ? (
              <>
                <div className="d-flex justify-content-center mb-10 ">
                  <div className="d-flex flex-column align-items-center">
                    <div className="p-5">No message found ...</div>
                  </div>
                </div>
              </>
            ) : (
              Array.isArray(messages) &&
              messages.length > 0 &&
              messages.map((msg, index) => (
                <>
                  {currentUser && msg.sender === currentUser._id && (
                    <>
                      <div
                        key={index}
                        className="d-flex justify-content-end mb-10 "
                      >
                        <div className="d-flex flex-column align-items-end">
                          <div className="d-flex align-items-center mb-2">
                            <div className="me-3">
                              <span className="text-muted fs-7 mb-1">
                                {new Date(msg.timestamp).toLocaleString()}
                              </span>
                              <a className="fs-5 fw-bold text-gray-900 text-hover-primary ms-1">
                                You
                              </a>
                            </div>
                            <div className="symbol  symbol-35px symbol-circle ">
                              <img alt="Pic" src={currentUser.image} />
                            </div>
                          </div>
                          <div className="d-flex">
                            <Message
                              key={msg._id}
                              message={msg}
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                            />
                            <div
                              className="p-5 rounded bg-light-primary text-gray-900 fw-semibold mw-lg-400px text-end"
                              data-kt-element="message-text"
                            >
                              {!msg.isDeleted && <p>{msg.content}</p>}
                              {msg.isDeleted && (
                                <small>
                                  <i>{msg.content}</i>
                                </small>
                              )}

                              {msg.attachment && (
                                <>
                                  {msg.attachment.path
                                    .toLowerCase()
                                    .endsWith(".jpg") ||
                                  msg.attachment.path
                                    .toLowerCase()
                                    .endsWith(".png") ||
                                  msg.attachment.path
                                    .toLowerCase()
                                    .endsWith(".jpeg") ||
                                  msg.attachment.path
                                    .toLowerCase()
                                    .endsWith(".svg") ? (
                                    <img
                                      src={`https://hchaichi-bmqq.vercel.app/chat/image/${msg.attachment.path}`}
                                      style={{
                                        maxWidth: "140px",
                                        height: "auto",
                                      }}
                                      alt={msg.attachment.originalname}
                                      className="shadow-lg     rounded"
                                    />
                                  ) : (
                                    <a
                                      href={`https://hchaichi-bmqq.vercel.app/chat/image/${msg.attachment.path}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <i className="ki-duotone ki-trash fs-1 ">
                                        {" "}
                                        <span className="path1"></span>{" "}
                                        <span className="path2"></span>{" "}
                                        <span className="path3"></span>{" "}
                                        <span className="path4"></span>{" "}
                                        <span className="path5"></span>{" "}
                                      </i>

                                      {msg.attachment.originalname}
                                    </a>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          <small>
                            {msg.createdAt < msg.timestamp ? "(Modified)" : ""}
                          </small>{" "}
                          <small>{msg.read ? "Read" : "Unread"}</small>
                        </div>
                      </div>
                    </>
                  )}
                  {chatUser && msg.sender === chatUser._id && (
                    <>
                      <div
                        key={index}
                        className="d-flex justify-content-start mb-10 "
                      >
                        <div className="d-flex flex-column align-items-start">
                          <div className="d-flex align-items-center mb-2">
                            <div className="symbol  symbol-35px symbol-circle ">
                              <img alt="Pic" src={chatUser.image} />
                            </div>
                            <div className="ms-3">
                              <a className="fs-5 fw-bold text-gray-900 text-hover-primary me-1">
                                {chatUser.username}
                              </a>
                              <span className="text-muted fs-7 mb-1">
                                {new Date(msg.timestamp).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div
                            className="p-5 rounded bg-light-info text-gray-900 fw-semibold mw-lg-400px text-start"
                            data-kt-element="message-text"
                          >
                            {!msg.isDeleted && <p>{msg.content}</p>}
                            {msg.isDeleted && (
                              <small>
                                <i>{msg.content}</i>
                              </small>
                            )}

                            <br></br>

                            {msg.attachment && (
                              <>
                                {msg.attachment.path
                                  .toLowerCase()
                                  .endsWith(".jpg") ||
                                msg.attachment.path
                                  .toLowerCase()
                                  .endsWith(".png") ||
                                msg.attachment.path
                                  .toLowerCase()
                                  .endsWith(".jpeg") ||
                                msg.attachment.path
                                  .toLowerCase()
                                  .endsWith(".svg") ? (
                                  <img
                                    src={`https://hchaichi-bmqq.vercel.app/chat/image/${msg.attachment.path}`}
                                    style={{
                                      maxWidth: "140px",
                                      height: "auto",
                                    }}
                                    alt={msg.attachment.originalname}
                                    className="shadow-lg  rounded"
                                  />
                                ) : (
                                  <a
                                    href={`https://hchaichi-bmqq.vercel.app/chat/image/${msg.attachment.path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <i className="ki-duotone ki-trash fs-1 ">
                                      {" "}
                                      <span className="path1"></span>{" "}
                                      <span className="path2"></span>{" "}
                                      <span className="path3"></span>{" "}
                                      <span className="path4"></span>{" "}
                                      <span className="path5"></span>{" "}
                                    </i>

                                    {msg.attachment.originalname}
                                  </a>
                                )}
                              </>
                            )}
                          </div>
                          <small>
                            {msg.createdAt < msg.timestamp ? "(Modified)" : ""}
                          </small>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ))
            )}
          </div>

          <div className="themessagecontainers py-5"></div>
        </div>
      </div>

      {chatUser !== null && chatUser !== undefined ? (
        <>
          {showNewMessage && (
            <div
              className="text-center fw-bold py-1 bg-primary"
              style={{ color: "white" }}
            >
              New Message
            </div>
          )}

          <div className="card-footer pt-4" id="kt_chat_messenger_footer">
            <textarea
              className="form-control form-control-flush mb-3"
              rows="1"
              value={newMessage}
              placeholder="Type a message...."
              onChange={(e) => setNewMessage(e.target.value)}
            ></textarea>
            <div className="d-flex flex-stack">
              <div className="d-flex align-items-center me-2">
                <button
                  className="btn btn-sm btn-icon btn-active-light-primary me-1"
                  type="button"
                  onClick={handleButtonClick}
                  title="Attachement"
                >
                  <i className="ki-duotone ki-paper-clip fs-1"></i>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </button>
              </div>

              <button
                className="btn btn-primary"
                type="button"
                onClick={sendMessage}
              >
                <span ref={btnRef1} className="indicator-label">
                  Send
                  <i className="ki-duotone ki-send fs-3 ms-2 me-0">
                    {" "}
                    <span className="path1"></span>{" "}
                    <span className="path2"></span>{" "}
                  </i>
                </span>

                <span ref={btnRef2} className="indicator-progress">
                  Please wait...{" "}
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              </button>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Chat;
