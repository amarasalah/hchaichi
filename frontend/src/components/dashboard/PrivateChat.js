import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from './../../AuthContext';
import Chat from './Chat';

import io from 'socket.io-client';
const socket = io('http://localhost:4000', { withCredentials: true });

function PrivateChat() {
    const {userFirstName,userLastName,userID, userRole, userImageUrl, userImage, isAuthenticated} = useContext(AuthContext);
    //console.log(userFirstName + "-----" + userLastName+ "-----" +userID+ "-----" +userRole);
    const [connectedStatus, setConnectedStatus] = useState({});
    // Function to check if a user is connected
    const isUserConnected = (userId) => connectedStatus[userId] || false;

    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [chatUser, setChatUser] = useState({});



    const currentUser = {
        _id: userID,
        username: userFirstName + (userLastName !== "its$fromgoogle" ? " " + userLastName : ""),
        role: userRole,
        image:userImage || userImageUrl || '/assets/images/Default-profile.jpg',
    };

    useEffect(() => {
        if (isAuthenticated && userID) {
            // Notify server about the user connection
            socket.emit('user_connected', userID);

            // Clean up user connection on unmount
            return () => {
                socket.emit('user_disconnected', userID);
            };
        }
    }, [isAuthenticated, userID]);

    useEffect(() => {
        // Fetch users with assistance role
        const fetchUsers = async () => {
            if(userID){
                try {
                    const response = await axios.get('http://localhost:4000/chat/users/assistance', { params: { recieverId: userID , }, withCredentials: true });
                    setUsers(response.data);
                    const firstUser = response.data[0];
                    if (firstUser) {
                        setChatUser({
                            _id: firstUser._id,
                            username: firstUser.firstName + (firstUser.lastName !== "its$fromgoogle" ? " " + firstUser.lastName : ""),
                            role: firstUser.role,
                            image: firstUser.image || firstUser.imageUrl || '/assets/images/Default-profile.jpg',
                            status: false,
                            unreadCount: firstUser.unreadCount
                        });
                    } else {
                        setChatUser(null);
                    }

                    
        
                    // Initialize connected status for users
                    const initialStatus = {};
                    const promises = response.data.map(user =>
                        axios.get(`http://localhost:4000/check_user_status/${user._id}`, { withCredentials: true })
                    );
                    const responses = await Promise.all(promises);
        
                    response.data.forEach((user, index) => {
                        initialStatus[user._id] = responses[index].data.isConnected;
                    });
        
                    setConnectedStatus(initialStatus);
        
                    if (firstUser && firstUser._id) {
                        setChatUser(prevChatUser => ({
                            ...prevChatUser,
                            status: initialStatus[firstUser._id]
                        }));
                    }
                } catch (error) {
                    console.error('Error fetching users:', error);
                }

            }

        };
    
        fetchUsers();
    }, []);

        
    // Handle search input changes
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };
    // Filter users based on the search term
    const filteredUsers = users.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle user click
    const handleUserClick = (user) => {
        setChatUser({
            _id: user._id,
            username: user.firstName + (user.lastName !== "its$fromgoogle" ? " " + user.lastName : ""),
            role: user.role,
            image:user.image || user.imageUrl || '/assets/images/Default-profile.jpg',
            status :  isUserConnected(user._id) || false, //user.status
            unreadCount: user.unreadCount
        });

    };

    // Poll server to check user connection status periodically
    /*         useEffect(() => {
        const checkUserStatus = async () => {
            try {
                const promises = users.map(user =>
                    axios.get(`http://localhost:4000/check_user_status/${user._id}`, { withCredentials: true })
                );
                const responses = await Promise.all(promises);
                const status = {};
                responses.forEach((response, index) => {
                    //console.log(response.data.isConnected)
                    status[users[index]._id] = responses[users[index]._id].data.isConnected;
                });
                setConnectedStatus(status);
                // Update chatUser status
                if (chatUser && chatUser._id) {
                    setChatUser(prevChatUser => ({
                        ...prevChatUser,
                        status: status[chatUser._id]
                    }));
                }
            } catch (error) {
                console.error('Error checking user status:', error);
            }

        };

        // Check every 5 seconds (adjust as needed)
        const interval = setInterval(checkUserStatus, 5000);

        return () => clearInterval(interval);
    }, [users]); */

    // Poll server to check user connection status periodically
    useEffect(() => {
        const checkUserStatus = async () => {
            if(userID){
                try {
                    const response = await axios.get('http://localhost:4000/chat/users/assistance', { params: { recieverId: userID , }, withCredentials: true });
                    setUsers(response.data);
                    const promises = users.map(user =>
                        axios.get(`http://localhost:4000/check_user_status/${user._id}`, { withCredentials: true })
                    );
                    const responses = await Promise.all(promises);
                    const status = {};
        
                    // Map the responses to user IDs
                    users.forEach((user, index) => {
                        status[user._id] = responses[index].data.isConnected;
                    });
        
                    setConnectedStatus(status);
        
                    // Update chatUser status
                    if (chatUser && chatUser._id) {
                        setChatUser(prevChatUser => ({
                            ...prevChatUser,
                            status: status[chatUser._id] || false
                        }));
                    }
                } catch (error) {
                    console.error('Error checking user status:', error);
                }
            }

        };

        // Check every 5 seconds (adjust as needed)
        const interval = setInterval(checkUserStatus, 5000);

        return () => clearInterval(interval);
    }, [users, chatUser]);



    return (
        <>


            <div className="d-flex flex-column flex-lg-row">
                <div className="flex-column flex-lg-row-auto w-100 w-lg-300px w-xl-400px mb-10 mb-lg-0">
                    <div className="card card-flush">
                        <div className="card-header pt-7" id="kt_chat_contacts_header">
                            <div className="w-100 position-relative">

                                <i
                                    className="ki-duotone ki-magnifier fs-3 text-gray-500 position-absolute top-50 ms-5 translate-middle-y"><span
                                        className="path1"></span><span className="path2"></span></i>
                                <input type="text" className="form-control form-control-solid px-13"
                                    name="search"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    placeholder="Search by username or email..." />

                            </div>
                        </div>

                        <div className="card-body pt-5" id="kt_chat_contacts_body">

                            <div className="scroll-y me-n5 pe-5 h-200px h-lg-auto" data-kt-scroll="true"
                                data-kt-scroll-activate="{default: false, lg: true}"
                                data-kt-scroll-max-height="auto"
                                data-kt-scroll-dependencies="#kt_header, #kt_app_header, #kt_toolbar, #kt_app_toolbar, #kt_footer, #kt_app_footer, #kt_chat_contacts_header"
                                data-kt-scroll-wrappers="#kt_content, #kt_app_content, #kt_chat_contacts_body"
                                data-kt-scroll-offset="5px">

                                {filteredUsers.map((user ) => (
                                    <>
                                        <div key={"user-box" +  user._id } className="d-flex flex-stack py-4 pointer" onClick={() => handleUserClick(user)}>
                                            <div className="d-flex align-items-center">
                                                <div className="symbol symbol-45px symbol-circle">
                                                    <img src={user.image || user.imageUrl || '/assets/images/Default-profile.jpg'} alt={user.firstName} />
                                                    <div className={`symbol-badge ${isUserConnected(user._id) ? 'bg-success' : 'bg-secondary'} start-100 top-100 border-4 h-8px w-8px ms-n2 mt-n2`}></div>
                                                </div>
                                                <div className="ms-5">
                                                    <span className="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">
                                                        {user.firstName} {user.lastName !== "its$fromgoogle" ? user.lastName : ""}
                                                    </span>
                                                    <div className="fw-semibold text-muted">{user.email}</div> {/* Display user email */}
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column align-items-end ms-2">
                                                { user.unreadCount  ? <span className="badge badge-sm badge-circle badge-light-danger">{user.unreadCount}</span> : ''}
                                            </div>

                                        </div>
                                        <div key={`separator-${user._id}`} className="separator separator-dashed d-none"></div>
                                    </>
                                ))}

                            </div>

                        </div>

                    </div>

                </div>

                <div className="flex-lg-row-fluid ms-lg-7 ms-xl-10">
                    <div className="card" id="kt_chat_messenger">

                        <Chat currentUser={currentUser} chatUser={chatUser} />

                    </div>
                </div>
            </div>
        </>
    )
}

export default PrivateChat;