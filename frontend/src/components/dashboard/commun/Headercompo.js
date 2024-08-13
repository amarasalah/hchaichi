import React, { useContext,useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './../../../AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';



function Headercompo({ breadcrumb,lastbreadcrumbItem, onToggleAside }) {
  const {  userEmail , signOut, userImageUrl, userImage,userFirstName,userLastName,userID, toggleTheme ,userRole} = useContext(AuthContext);
  const navigate = useNavigate();
  const [notificationMenuVisible, setNotificationMenuVisible] = useState(false);

  
  const [notifications, setNotifications] = useState([]);
  const [perPage, setPerPage] = useState(15);
  const [currentLimit, setCurrentLimit] = useState(15);
  const [totalNotifications, setTotalNotifications] = useState(1);
  const [unreadCount, setUnReadCount] = useState(0);

  const baseURL = "http://localhost:4000/api/image/profile/";
  const NotificationImage = ({ notification, baseURL }) => {
    const theImage =
      notification.sender.image
        ? baseURL + notification.sender.image
        : notification.sender.imageUrl
        ? baseURL + notification.sender.imageUrl
        : '/assets/images/Default-profile.jpg';
  
    return (
      <span className="symbol-label bg-light-info">
        <img src={theImage} className='w-100 h-auto rounded-circle' alt="image" />
      </span>
    );
  };


  const [searchMenuVisible, setSearchMenuVisible] = useState(false);
  const toggleSearchMenu = () => {
    setSearchMenuVisible(!searchMenuVisible);
  };
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [userLimit, setUserLimit] = useState(2);
  const [userPerPage, setUserPerPage] = useState(2);
  const [totalClients, setTotalClients] = useState(0);
  const fetchClientsData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/api/getclients', {
        params: {
          limit: userLimit,
          search: searchInput,
        },
      });
      setData(response.data.clients);
      setTotalClients(response.data.totalClients);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchClientsData();
  }, [userLimit, searchInput]);
  const handleUserShowMore = () => {
    setUserLimit((prevLimit) => prevLimit + userPerPage);
  };
  const handleSendMessageUser = async (userId) => {
    const { value: formValues } = await Swal.fire({
      title: 'Send Message',
      input: 'textarea',
      inputLabel: 'Message',
      inputPlaceholder: 'Type your message here...',
      inputAttributes: {
        'aria-label': 'Type your message here'
      },
      showCancelButton: true,
      confirmButtonText: 'Send',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!';
        }
      }
    });
    if (formValues) {
      try {
        await axios.post('http://localhost:4000/chat/user/post', {
          receiver: userId,
          content: formValues
        }, { withCredentials: true });

        Swal.fire('Sent!', 'Your message has been sent.', 'success');
      } catch (error) {
        console.error('Error sending message:', error);
        Swal.fire('Error!', 'There was an error sending the message.', 'error');
      }
    }
  };















  

  useEffect(() => {
    fetchNotifications();
  }, [currentLimit]);

  useEffect(() => {
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
}, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:4000/notifications/get', {
        params: {
          userId: userID,
          limit: currentLimit,
        },
      });
      setNotifications(response.data.notifications);
      setTotalNotifications(response.data.totalNotifications);
      setUnReadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markNotificationsAsRead = async (notificationIds) => {
    try {
      await axios.post('http://localhost:4000/notifications/read', { notificationIds });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  const handleShowMore = () => {
    setCurrentLimit((prevLimit) => prevLimit + perPage );
  };

  const handleNotificationClick = (notificationId) => {
    markNotificationsAsRead([notificationId]);
  };





  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/signin');
  };
  const [isProfileVisible, setProfileVisible] = useState(false);
  const toggleProfile = () => {
    setProfileVisible(!isProfileVisible);
  };
  const [menuVisible, setMenuVisible] = useState(false);
  const handleThemeChange = (newTheme) => {
    toggleTheme(newTheme);
    toggleMenu();
  };
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const toggleNotificationMenu = () => {
    setNotificationMenuVisible(!notificationMenuVisible);
  };

  return (
    <div
    id="kt_header"
    className="header d-print-none"
    data-kt-sticky="true"
    data-kt-sticky-name="header"
    data-kt-sticky-offset="{default: '200px', lg: '300px'}"
  >
    <div
      className=" container-fluid  d-flex align-items-stretch justify-content-between"
      id="kt_header_container"
    >
      <div
        className="page-title d-flex flex-column align-items-start justify-content-center flex-wrap me-2 mb-5 mb-lg-0"
        data-kt-swapper="true"
        data-kt-swapper-mode="prepend"
        data-kt-swapper-parent="{default: '#kt_content_container', lg: '#kt_header_container'}"
      >
        <h1 className="text-gray-900 fw-bold mt-1 mb-1 fs-2">
          {lastbreadcrumbItem}
          <small className="text-muted fs-6 fw-normal ms-1" />
        </h1>

        <ul className="breadcrumb fw-semibold fs-base mb-1">
          <li className="breadcrumb-item text-muted">
            <a
              href="/"
              className="text-muted text-hover-primary"
            >
              Home
            </a>
          </li>



          {breadcrumb.map((pathObj, index) => (
            <li key={index} className="breadcrumb-item text-muted">
            <a href={Object.keys(pathObj)[0]} className="text-muted text-hover-primary">
              {Object.values(pathObj)[0]}
              </a>
            </li>
          ))}

        <li className="breadcrumb-item text-gray-900">
           {lastbreadcrumbItem}
        </li>


          
        </ul>
      </div>

      <div className="d-flex d-lg-none align-items-center flex-grow-1">
        <div
          className="btn btn-icon btn-circle btn-active-light-primary ms-n2 me-1"
          id="kt_aside_toggle"
          onClick={onToggleAside}
        >
          <i className="ki-duotone ki-abstract-14 fs-1">
            <span className="path1" />
            <span className="path2" />
          </i>
        </div>

        <a href="/" className="d-lg-none">
          <img
            alt="Logo"
            src="/assets/media/logos/logo-compact.svg"
            className="max-h-40px"
          />
        </a>
      </div>
      <div className="d-flex align-items-center flex-shrink-0">









        <div className="d-flex align-items-stretch ms-2 ms-lg-3">
          <div
            id="kt_header_search"
            className="header-search d-flex align-items-stretch"
            data-kt-search-keypress="true"
            data-kt-search-min-length="2"
            data-kt-search-enter="enter"
            data-kt-search-layout="menu"
            data-kt-menu-trigger="auto"
            data-kt-menu-overflow="false"
            data-kt-menu-permanent="true"
            data-kt-menu-placement="bottom-end"
            style={{position : "relative"}}
          >
            <div
              className="d-flex align-items-center"
              data-kt-search-element="toggle"
              id="kt_header_search_toggle"
              onClick={toggleSearchMenu}
            >
              <div className="btn btn-icon btn-active-light-primaryw-35px h-35px w-md-40px h-md-40px">
                <i className="ki-duotone ki-magnifier fs-1">
                  <span className="path1" />
                  <span className="path2" />
                </i>
              </div>
            </div>

            <div
              data-kt-search-element="content"
              className={`menu menu-sub menu-sub-dropdown p-7 w-325px w-md-375px ${searchMenuVisible ? 'show' : ''}`}
              style={{zIndex: 107, position: "absolute", inset: "0px 0px auto auto", margin: 0, transform: "translate(-15px, 35px)"}}
            >
              <div data-kt-search-element="wrapper">
                <form
                  data-kt-search-element="form"
                  className="w-100 position-relative mb-3"
                  autoComplete="off"
                >
                      <i className="ki-duotone ki-magnifier fs-2 text-gray-500 position-absolute top-50 translate-middle-y ms-0">
                        <span className="path1" />
                        <span className="path2" />
                      </i>

                      <input
                        type="text"
                        className="search-input  form-control form-control-flush ps-10"
                        name="search"
                        placeholder="Search user..."
                        value={searchInput} onChange={e => setSearchInput(e.target.value)}
                      />

                </form>

                <div className="separator border-gray-200 mb-6" />

                <div className="mb-5" data-kt-search-element="main">
                  <div className="scroll-y mh-200px mh-lg-325px">
                      {loading ? (
                      <div>Loading...</div>
                      ) : (
                        data.map(client => (
                          <div className="d-flex align-items-center mb-5" key={client._id}>
                              <div className="symbol symbol-40px me-4">
                                  <span className="symbol-label bg-light">
                                      <i className="ki-duotone ki-laptop fs-2 text-primary">
                                          <span className="path1" />
                                          <span className="path2" />
                                      </i>
                                  </span>
                              </div>
                      
                              <div className="d-flex flex-column">
                                  <span
                                      className="fs-6 text-gray-800 fw-semibold"
                                  >
                                  {client.firstName} {client.lastName !== "its$fromgoogle" ? client.lastName : ""} <button className="btn btn-icon me-2" onClick={() => handleSendMessageUser(client._id)}> <i className="ki-duotone ki-messages fs-1 "> <span className="path1"></span> <span className="path2"></span> <span className="path3"></span> <span className="path4"></span> <span className="path5"></span> </i> </button>
                                  </span>
                                  <span className="fs-7 text-muted fw-semibold">
                                  ID: {client._id}
                                  </span>
                      
                      
                              </div>
                          </div>
                        ))
                      )}
                  </div>
                </div>

                {userLimit < totalClients   &&(
                    <div className="card-footer text-center py-5">
                      <button className="btn btn-light btn-active-light-primary btn-sm" onClick={handleUserShowMore}>
                          Show More Clients
                      </button>
                    </div>
                )}

                {data.length === 0 && !loading && (
                  <div data-kt-search-element="empty" className="text-center">
                      <div className="pt-10 pb-10">
                      <i className="ki-duotone ki-search-list fs-4x opacity-50">
                          <span className="path1" />
                          <span className="path2" />
                          <span className="path3" />
                      </i>
                      </div>
                      <div className="pb-15 fw-semibold">
                      <h3 className="text-gray-600 fs-5 mb-2">No result found</h3>
                      <div className="text-muted fs-7">Please try again with a different query</div>
                      </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>























        { (userRole == 'admin' || userRole == 'assistance')  && (
            <div className="d-flex align-items-center ms-2 ms-lg-3"             style={{position : "relative"}}>
            <div
            className={`btn btn-icon btn-active-light-primary position-relative w-35px h-35px w-md-40px h-md-40px ${notificationMenuVisible ? 'show' : ''}`}
            onClick={toggleNotificationMenu}
            >
              <i className="ki-duotone ki-notification-on fs-1"> <span className="path1"></span> <span className="path2"></span> <span className="path3"></span> <span className="path4"></span> <span className="path5"></span> </i>
        { unreadCount > 0 &&    (            <span className="bullet bullet-dot bg-success h-6px w-6px position-absolute translate-middle top-0 start-50 animation-blink">
              </span>)}
            </div>

            <div
              className={`menu menu-sub menu-sub-dropdown menu-column w-350px ${notificationMenuVisible ? 'show' : ''}`}
              style={{zIndex: 107, position: "absolute", inset: "0px 0px auto auto", margin: 0, transform: "translate(-15px, 40px)"}}
            >
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    Notifications
                    <span className="badge badge-light-danger fs-7 fw-500 ms-3">
                      {unreadCount} unread notification
                    </span>
                  </h3>
                </div>

                <div className="card-body p-0">
                  <div className="mh-350px scroll-y py-3">

                    {notifications.map((notification) => (


                        notification.type === "order" && userRole == 'admin' &&   (
                      <div key={notification._id} className={`d-flex align-items-center bg-hover-lighten py-3 px-9 pointer`}    onClick={() => handleNotificationClick(notification._id)}  style={notification.status === 'unread' ? { backgroundColor: "rgba(211, 211, 211, 0.5)" } : {}}>


                        <div className="symbol symbol-40px symbol-circle me-5">
                        <span className="symbol-label bg-light-primary">
                          <i className="ki-duotone ki-basket text-primary fs-1">
                            <span className="path1" />
                            <span className="path2" />
                            <span className="path3" />
                            <span className="path4" />
                          </i>
                        </span>
                      </div>

                        <div className="mb-1 pe-3 flex-grow-1">
                          <a
                            href={`/admin/orderView/${notification.orderId}/${notification.sender._id}`}
                            className="fs-6 text-gray-900 text-hover-primary fw-semibold"
                          >
                          {notification.content}
                          </a>
                          <div className="text-gray-500 fw-semibold fs-7">
                          {new Date(notification.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                        ) ||

                        notification.type === "message" &&   (
                        
                        <div key={notification._id} className={`d-flex align-items-center bg-hover-lighten py-3 px-9 pointer`}    onClick={() => handleNotificationClick(notification._id)}  style={notification.status === 'unread' ? { backgroundColor: "rgba(211, 211, 211, 0.5)" } : {}}>


                        <div className="symbol symbol-40px symbol-circle me-5">
                        <div className="symbol-label bg-light-info">

                          <NotificationImage notification={notification} baseURL={baseURL} />

                        </div>
                      </div>

                          <div className="mb-1 pe-3 flex-grow-1">
                            <a
                              
                              className="fs-6 text-gray-900 fw-semibold"
                            >
                            {notification.content}
                            </a>
                            <p className='fs-7 '>from {notification.sender.firstName}</p>
                            <div className="text-gray-500 fw-semibold fs-7">
                            {new Date(notification.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                          )

                    ))}
                  
                  </div>
                </div>

                {currentLimit < totalNotifications && (
                  <div className="card-footer text-center py-5">
                    <button className="btn btn-light btn-active-light-primary btn-sm" onClick={handleShowMore}>
                      Show More Notifications
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        <div className="d-flex align-items-center ms-2 ms-lg-3"             style={{position : "relative"}}>
          <a
            href="#"
            className="btn btn-icon btn-active-light-primaryw-35px h-35px w-md-40px h-md-40px"
            data-kt-menu-trigger="{default:'click', lg: 'hover'}"
            data-kt-menu-attach="parent"
            data-kt-menu-placement="bottom-end"
            onClick={toggleMenu}
          >
            <i className="ki-duotone ki-night-day theme-light-show fs-2">
              <span className="path1" />
              <span className="path2" />
              <span className="path3" />
              <span className="path4" />
              <span className="path5" />
              <span className="path6" />
              <span className="path7" />
              <span className="path8" />
              <span className="path9" />
              <span className="path10" />
            </i>{" "}
            <i className="ki-duotone ki-moon theme-dark-show fs-2">
              <span className="path1" />
              <span className="path2" />
            </i>
          </a>

          <div
            className={`menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-title-gray-700 menu-icon-gray-500 menu-active-bg menu-state-color fw-semibold py-4 fs-base w-150px ${menuVisible ? 'show' : ''}`}
            style={{zIndex: 107, position: "absolute", inset: "0px 0px auto auto", margin: 0, transform: "translate(-15px, 35px)"}}
          >
            <div className="menu-item px-3 my-0">
              <a
                href="#"
                className="menu-link px-3 py-2"
                data-kt-element="mode"
                data-kt-value="light"
                onClick={() => handleThemeChange('light')}
              >
                <span className="menu-icon" data-kt-element="icon">
                  <i className="ki-duotone ki-night-day fs-2">
                    <span className="path1" />
                    <span className="path2" />
                    <span className="path3" />
                    <span className="path4" />
                    <span className="path5" />
                    <span className="path6" />
                    <span className="path7" />
                    <span className="path8" />
                    <span className="path9" />
                    <span className="path10" />
                  </i>{" "}
                </span>
                <span className="menu-title">Light</span>
              </a>
            </div>

            <div className="menu-item px-3 my-0">
              <a
                href="#"
                className="menu-link px-3 py-2"
                data-kt-element="mode"
                data-kt-value="dark"
                onClick={() => handleThemeChange('dark')}
              >
                <span className="menu-icon" data-kt-element="icon">
                  <i className="ki-duotone ki-moon fs-2">
                    <span className="path1" />
                    <span className="path2" />
                  </i>{" "}
                </span>
                <span className="menu-title">Dark</span>
              </a>
            </div>

          </div>
        </div>

        <div
          className="d-flex align-items-center ms-2 ms-lg-3"
          id="kt_header_user_menu_toggle"
        >
          <div
            className="cursor-pointer symbol symbol-circle symbol-35px symbol-md-40px"



            onClick={toggleProfile}
          >
            <img
            src={   userImage || userImageUrl || '/assets/images/Default-profile.jpg'} alt={userFirstName}
            />
          </div>

          <div
            className={`menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-color fw-semibold py-4 fs-6 w-275px ${isProfileVisible ? 'show' : ''}`}
            data-kt-menu="true" style={{zIndex: 107, position: "absolute", inset: "0px 0px auto auto", margin: 0, transform: "translate3d(-35.4px, 69.8px, 0px)"}}
          >
            <div className="menu-item px-3">
              <div className="menu-content d-flex align-items-center px-3">
                <div className="symbol symbol-50px me-5">
                  <img

                  src={   userImage || userImageUrl || '/assets/images/Default-profile.jpg'} alt={userFirstName}

                  />
                </div>

                <div className="d-flex flex-column">
                  <div className="fw-bold d-flex align-items-center fs-5">
                  {userFirstName} {userLastName !== "its$fromgoogle" ? userLastName : ""}
                  </div>

                  <a
                    href="#"
                    className="fw-semibold text-muted text-hover-primary fs-7"
                  >
                  {userEmail}
                  </a>
                </div>
              </div>
            </div>


            <div className="menu-item px-5 my-1">
              <a
                href={"/user/profile/" + userID}
                className="menu-link px-5"
              >
                Account Settings
              </a>
            </div>

            <div className="menu-item px-5">
              <a
              onClick={handleSignOut}
                className="menu-link px-5"
              >
                Sign Out
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Headercompo;