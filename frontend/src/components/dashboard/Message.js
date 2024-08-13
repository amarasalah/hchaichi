import React, { useState } from 'react';
import axios from 'axios';


const Message = ({ message, onEdit, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(message.content);

    const filterStyle = {
        zIndex: 107,
        position: 'absolute',
        inset: '0px 0px auto auto',
        margin: 0,
        transform: 'translate3d(-20px, 25px, 0px)'
    };

    const [isVisible, setIsVisible] = useState('');
    const toggleDropDown = (menuId) => {
        setIsVisible(prev => (prev === menuId ? '' : menuId));
    };

    const handleEdit = async () => {
        try {
            const response = await axios.put(`http://localhost:4000/chat/user/edit/${message._id}`, { content }, { withCredentials: true });
            onEdit(response.data);
            setIsEditing(false);
        } catch (error) {
            console.error('Error editing message:', error);
        }
        setIsVisible('');
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:4000/chat/user/delete/${message._id}`, { withCredentials: true });
            onDelete(message._id);
        } catch (error) {
            console.error('Error deleting message:', error);
        }
        setIsVisible('');
    };



    return (
        <>
        {isEditing  && (
            <div className='w-100 d-flex flex-column mt-2'>

                <div className="rounded border d-flex flex-column p-5">
                    <label htmlFor="" className="form-label">Modification</label>
                    <textarea className="form-control rounded-0" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
                </div>
                <div className='text-end'>
                    <a  className="btn btn-link btn-color-info btn-active-color-primary me-5 mb-2" onClick={handleEdit}>Save</a>
                    <a  className="btn btn-link btn-color-danger btn-active-color-primary me-5 mb-2" onClick={() => {setIsEditing(false);setIsVisible('');}}>Cancel</a>
                </div>

            </div>
        ) }
        
       
        <div className="message">
        {!isEditing && !message.isDeleted &&  (
            <div className="card-toolbar">
                <div className="me-n3" style={{ position: 'relative' }}>

                        <>
                            <button className="btn btn-sm btn-icon me-1 show" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end"  onClick={() => toggleDropDown("menu" + message._id)}>
                                <i className="ki-duotone ki-dots-square fs-2"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span></i>                </button>
                            

                            <div key={"menu" + message._id} className={`menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-semibold w-200px py-3 ${isVisible === "menu" + message._id ? 'show' : ''}`} data-kt-menu="true" style={filterStyle} >
                                <div className="menu-item px-3">
                                    <a className="menu-link px-3" onClick={() => setIsEditing(true)}>
                                        Edit
                                    </a>
                                </div>



                                <div className="menu-item px-3">
                                    <a className="menu-link flex-stack px-3" onClick={handleDelete}>
                                        Delete
                                    </a>
                                </div>
                            </div>

                        </>
                   
                </div>
            </div>
        )}
        </div>

        </>
    );
};

export default Message;
