// Asidemenu.js
import React, { useState, useContext } from 'react';
import { AuthContext } from './../../../AuthContext';

function Asidemenu() {
    const [activeMenu, setActiveMenu] = useState(null);
    const { userRole } = useContext(AuthContext);

    const handleMenuClick = (menu) => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    const renderMenuForRole = (role) => {
        switch (role) {
            case 'client':
                return (
                    <>
                        <div className="menu-item">
                            <a className="menu-link" href="/user/addorder">
                                <span className="menu-icon">
                                    <i className="ki-duotone ki-add-item fs-2"> <span className="path1"></span> <span className="path2"></span> <span className="path3"></span> </i>
                                </span>
                                <span className="menu-title">Add Order</span>
                            </a>
                        </div>

                        <div className="menu-item">
                            <a className="menu-link" href="/user/allorders">
                                <span className="menu-icon">
                                    <i className="ki-duotone ki-package fs-2"> <span className="path1"></span> <span className="path2"></span> <span className="path3"></span> </i>
                                </span>
                                <span className="menu-title">My Orders</span>
                            </a>
                        </div>

                        <div className="menu-item">
                            <a className="menu-link" href="/chat/client">
                                <span className="menu-icon">
                                    <i className="ki-duotone ki-messages fs-2"> <span className="path1"></span> <span className="path2"></span> <span className="path3"></span> <span className="path4"></span> <span className="path5"></span> </i>
                                </span>
                                <span className="menu-title">Private Chat</span>
                            </a>
                        </div>

                        <div className="menu-item">
                            <a className="menu-link" href="/faq">
                                <span className="menu-icon">
                                    <i className="ki-duotone ki-messages fs-2"> <span className="path1"></span> <span className="path2"></span> <span className="path3"></span> <span className="path4"></span> <span className="path5"></span> </i>
                                </span>
                                <span className="menu-title">FAQ</span>
                            </a>
                        </div>

                        <div className="menu-item">
                        <a className="menu-link" href="/aboutus">
                            <span className="menu-icon">
                                <i className="ki-duotone ki-messages fs-2"> <span className="path1"></span> <span className="path2"></span> <span className="path3"></span> <span className="path4"></span> <span className="path5"></span> </i>
                            </span>
                            <span className="menu-title">About Us</span>
                        </a>
                        </div>
                    </>
                );
            case 'admin':
                return (
                    <>
                        <div className="menu-item">
                            <a className="menu-link" href="/dashboard">
                                <span className="menu-icon">
                                    <i className="ki-duotone ki-element-11 fs-2">
                                        <span className="path1"></span>
                                        <span className="path2"></span>
                                        <span className="path3"></span>
                                        <span className="path4"></span>
                                    </i>
                                </span>
                                <span className="menu-title">Dashboard</span>
                            </a>
                        </div>

                        <div className="menu-item">
                            <a className="menu-link" href="/admin/clients">
                                <span className="menu-icon">
                                    <i className="ki-duotone ki-security-user fs-2"> <span className="path1"></span> <span className="path2"></span> </i>
                                </span>
                                <span className="menu-title">Clients</span>
                            </a>
                        </div>
                        <div className="menu-item">
                            <a className="menu-link" href="/admin/allorders">
                                <span className="menu-icon">
                                    <i className="ki-duotone ki-package fs-2"> <span className="path1"></span> <span className="path2"></span> <span className="path3"></span> </i>
                                </span>
                                <span className="menu-title">Orders</span>
                            </a>
                        </div>

                        <div className="menu-item">
                            <a className="menu-link" href="/admin/users">
                                <span className="menu-icon">
                                    <i className="ki-duotone ki-profile-user fs-2"> <span className="path1"></span> <span className="path2"></span> <span className="path3"></span> <span className="path4"></span> </i>
                                </span>
                                <span className="menu-title">Users</span>
                            </a>
                        </div>

                        <div className="menu-item">
                            <a className="menu-link" href="/chat/staff">
                                <span className="menu-icon">
                                    <i className="ki-duotone ki-messages fs-2"> <span className="path1"></span> <span className="path2"></span> <span className="path3"></span> <span className="path4"></span> <span className="path5"></span> </i>
                                </span>
                                <span className="menu-title">Private Chat</span>
                            </a>
                        </div>

                        <div data-kt-menu-trigger="click"
                            className={`menu-item menu-accordion mb-1 ${activeMenu === 'MaterialType' ? 'hover show' : ''}`}
                            onClick={() => handleMenuClick('MaterialType')}>
                            <span className="menu-link">
                                <span className="menu-icon">
                                    <i className="ki-duotone ki-cube-2 fs-2"> <span className="path1"></span> <span className="path2"></span> <span className="path3"></span> </i>
                                </span>
                                <span className="menu-title">Material Type</span>
                                <span className="menu-arrow"></span>
                            </span>
                            <div className="menu-sub menu-sub-accordion">
                                <div className="menu-item">
                                    <a className="menu-link" href="/admin/addMaterialType">
                                        <span className="menu-bullet">
                                            <span className="bullet bullet-dot" />
                                        </span>
                                        <span className="menu-title">Add</span>
                                    </a>
                                </div>
                                <div className="menu-item">
                                    <a className="menu-link" href="/admin/allMaterialType">
                                        <span className="menu-bullet">
                                            <span className="bullet bullet-dot" />
                                        </span>
                                        <span className="menu-title">All</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div data-kt-menu-trigger="click"
                            className={`menu-item menu-accordion mb-1 ${activeMenu === 'Edges' ? 'hover show' : ''}`}
                            onClick={() => handleMenuClick('Edges')}>

                            <span className="menu-link">
                                <span className="menu-icon">
                                    <i className="ki-duotone ki-cube-2 fs-2"> <span className="path1"></span> <span className="path2"></span> <span className="path3"></span> </i>
                                </span>
                                <span className="menu-title">Edges</span>
                                <span className="menu-arrow"></span>
                            </span>

                            <div className="menu-sub menu-sub-accordion">
                                <div className="menu-item">
                                    <a className="menu-link" href="/admin/addedge">
                                        <span className="menu-bullet">
                                            <span className="bullet bullet-dot" />
                                        </span>
                                        <span className="menu-title">Add</span>
                                    </a>
                                </div>
                                <div className="menu-item">
                                    <a className="menu-link" href="/admin/alledges">
                                        <span className="menu-bullet">
                                            <span className="bullet bullet-dot" />
                                        </span>
                                        <span className="menu-title">All</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div data-kt-menu-trigger="click"
                            className={`menu-item menu-accordion mb-1 ${activeMenu === 'Shapes' ? 'hover show' : ''}`}
                            onClick={() => handleMenuClick('Shapes')}>

                            <span className="menu-link">
                                <span className="menu-icon">
                                    <i className="ki-duotone ki-cube-2 fs-2"> <span className="path1"></span> <span className="path2"></span> <span className="path3"></span> </i>
                                </span>
                                <span className="menu-title">Shapes</span>
                                <span className="menu-arrow"></span>
                            </span>

                            <div className="menu-sub menu-sub-accordion">
                                <div className="menu-item">
                                    <a className="menu-link" href="/admin/addshape">
                                        <span className="menu-bullet">
                                            <span className="bullet bullet-dot" />
                                        </span>
                                        <span className="menu-title">Add</span>
                                    </a>
                                </div>
                                <div className="menu-item">
                                    <a className="menu-link" href="/admin/allshapes">
                                        <span className="menu-bullet">
                                            <span className="bullet bullet-dot" />
                                        </span>
                                        <span className="menu-title">All</span>
                                    </a>
                                </div>

                            </div>
                        </div>

                        <div data-kt-menu-trigger="click"
                            className={`menu-item menu-accordion mb-1 ${activeMenu === 'Angles' ? 'hover show' : ''}`}
                            onClick={() => handleMenuClick('Angles')}>

                            <span className="menu-link">
                                <span className="menu-icon">
                                    <i className="ki-duotone ki-cube-2 fs-2"> <span className="path1"></span> <span className="path2"></span> <span className="path3"></span> </i>
                                </span>
                                <span className="menu-title">Angles</span>
                                <span className="menu-arrow"></span>
                            </span>

                            <div className="menu-sub menu-sub-accordion">
                                <div className="menu-item">
                                    <a className="menu-link" href="/admin/addangle">
                                        <span className="menu-bullet">
                                            <span className="bullet bullet-dot" />
                                        </span>
                                        <span className="menu-title">Add</span>
                                    </a>
                                </div>
                                <div className="menu-item">
                                    <a className="menu-link" href="/admin/allangles">
                                        <span className="menu-bullet">
                                            <span className="bullet bullet-dot" />
                                        </span>
                                        <span className="menu-title">All</span>
                                    </a>
                                </div>

                            </div>
                        </div>

                        <div data-kt-menu-trigger="click"
                            className={`menu-item menu-accordion mb-1 ${activeMenu === 'Material' ? 'hover show' : ''}`}
                            onClick={() => handleMenuClick('Material')}>

                            <span className="menu-link">
                                <span className="menu-icon">
                                    <i className="ki-duotone ki-cube-2 fs-2"> <span className="path1"></span> <span className="path2"></span> <span className="path3"></span> </i>
                                </span>
                                <span className="menu-title">Material</span>
                                <span className="menu-arrow"></span>
                            </span>

                            <div className="menu-sub menu-sub-accordion">
                                <div className="menu-item">
                                    <a className="menu-link" href="/admin/addmaterial">
                                        <span className="menu-bullet">
                                            <span className="bullet bullet-dot" />
                                        </span>
                                        <span className="menu-title">Add</span>
                                    </a>
                                </div>
                                <div className="menu-item">
                                    <a className="menu-link" href="/admin/allmaterials">
                                        <span className="menu-bullet">
                                            <span className="bullet bullet-dot" />
                                        </span>
                                        <span className="menu-title">All</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="menu-item">
                            <a className="menu-link" href="/admin/settings">
                                <span className="menu-icon">
                                <i className="ki-duotone ki-setting-2 fs-2"> <span className="path1"></span> <span className="path2"></span> </i>
                                </span>
                                <span className="menu-title">Settings</span>
                            </a>
                        </div>

                        
                    </>
                );
            case 'assistance':
                return (
                    <>
                    <div className="menu-item">
                        <a className="menu-link" href="/chat/staff">
                            <span className="menu-icon">
                                <i className="ki-duotone ki-messages fs-2"> <span className="path1"></span> <span className="path2"></span> <span className="path3"></span> <span className="path4"></span> <span className="path5"></span> </i>
                            </span>
                            <span className="menu-title">Private Chat</span>
                        </a>
                    </div>
                    </>
                );
            case 'technician':
                return (
                    <>
                    <div data-kt-menu-trigger="click"
                        className={`menu-item menu-accordion mb-1 ${activeMenu === 'MaterialType' ? 'hover show' : ''}`}
                        onClick={() => handleMenuClick('MaterialType')}>
                        <span className="menu-link">
                            <span className="menu-icon">
                                <i className="ki-duotone ki-cube-2 fs-2"> <span className="path1"></span> <span className="path2"></span> <span className="path3"></span> </i>
                            </span>
                            <span className="menu-title">Material Type</span>
                            <span className="menu-arrow"></span>
                        </span>
                        <div className="menu-sub menu-sub-accordion">
                            <div className="menu-item">
                                <a className="menu-link" href="/admin/addMaterialType">
                                    <span className="menu-bullet">
                                        <span className="bullet bullet-dot" />
                                    </span>
                                    <span className="menu-title">Add</span>
                                </a>
                            </div>
                            <div className="menu-item">
                                <a className="menu-link" href="/admin/allMaterialType">
                                    <span className="menu-bullet">
                                        <span className="bullet bullet-dot" />
                                    </span>
                                    <span className="menu-title">All</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div data-kt-menu-trigger="click"
                        className={`menu-item menu-accordion mb-1 ${activeMenu === 'Edges' ? 'hover show' : ''}`}
                        onClick={() => handleMenuClick('Edges')}>

                        <span className="menu-link">
                            <span className="menu-icon">
                                <i className="ki-duotone ki-cube-2 fs-2"> <span className="path1"></span> <span className="path2"></span> <span className="path3"></span> </i>
                            </span>
                            <span className="menu-title">Edges</span>
                            <span className="menu-arrow"></span>
                        </span>

                        <div className="menu-sub menu-sub-accordion">
                            <div className="menu-item">
                                <a className="menu-link" href="/admin/addedge">
                                    <span className="menu-bullet">
                                        <span className="bullet bullet-dot" />
                                    </span>
                                    <span className="menu-title">Add</span>
                                </a>
                            </div>
                            <div className="menu-item">
                                <a className="menu-link" href="/admin/alledges">
                                    <span className="menu-bullet">
                                        <span className="bullet bullet-dot" />
                                    </span>
                                    <span className="menu-title">All</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div data-kt-menu-trigger="click"
                        className={`menu-item menu-accordion mb-1 ${activeMenu === 'Shapes' ? 'hover show' : ''}`}
                        onClick={() => handleMenuClick('Shapes')}>

                        <span className="menu-link">
                            <span className="menu-icon">
                                <i className="ki-duotone ki-cube-2 fs-2"> <span className="path1"></span> <span className="path2"></span> <span className="path3"></span> </i>
                            </span>
                            <span className="menu-title">Shapes</span>
                            <span className="menu-arrow"></span>
                        </span>

                        <div className="menu-sub menu-sub-accordion">
                            <div className="menu-item">
                                <a className="menu-link" href="/admin/addshape">
                                    <span className="menu-bullet">
                                        <span className="bullet bullet-dot" />
                                    </span>
                                    <span className="menu-title">Add</span>
                                </a>
                            </div>
                            <div className="menu-item">
                                <a className="menu-link" href="/admin/allshapes">
                                    <span className="menu-bullet">
                                        <span className="bullet bullet-dot" />
                                    </span>
                                    <span className="menu-title">All</span>
                                </a>
                            </div>

                        </div>
                    </div>

                    <div data-kt-menu-trigger="click"
                        className={`menu-item menu-accordion mb-1 ${activeMenu === 'Angles' ? 'hover show' : ''}`}
                        onClick={() => handleMenuClick('Angles')}>

                        <span className="menu-link">
                            <span className="menu-icon">
                                <i className="ki-duotone ki-cube-2 fs-2"> <span className="path1"></span> <span className="path2"></span> <span className="path3"></span> </i>
                            </span>
                            <span className="menu-title">Angles</span>
                            <span className="menu-arrow"></span>
                        </span>

                        <div className="menu-sub menu-sub-accordion">
                            <div className="menu-item">
                                <a className="menu-link" href="/admin/addangle">
                                    <span className="menu-bullet">
                                        <span className="bullet bullet-dot" />
                                    </span>
                                    <span className="menu-title">Add</span>
                                </a>
                            </div>
                            <div className="menu-item">
                                <a className="menu-link" href="/admin/allangles">
                                    <span className="menu-bullet">
                                        <span className="bullet bullet-dot" />
                                    </span>
                                    <span className="menu-title">All</span>
                                </a>
                            </div>

                        </div>
                    </div>

                    <div data-kt-menu-trigger="click"
                        className={`menu-item menu-accordion mb-1 ${activeMenu === 'Material' ? 'hover show' : ''}`}
                        onClick={() => handleMenuClick('Material')}>

                        <span className="menu-link">
                            <span className="menu-icon">
                                <i className="ki-duotone ki-cube-2 fs-2"> <span className="path1"></span> <span className="path2"></span> <span className="path3"></span> </i>
                            </span>
                            <span className="menu-title">Material</span>
                            <span className="menu-arrow"></span>
                        </span>

                        <div className="menu-sub menu-sub-accordion">
                            <div className="menu-item">
                                <a className="menu-link" href="/admin/addmaterial">
                                    <span className="menu-bullet">
                                        <span className="bullet bullet-dot" />
                                    </span>
                                    <span className="menu-title">Add</span>
                                </a>
                            </div>
                            <div className="menu-item">
                                <a className="menu-link" href="/admin/allmaterials">
                                    <span className="menu-bullet">
                                        <span className="bullet bullet-dot" />
                                    </span>
                                    <span className="menu-title">All</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className="menu menu-column menu-sub-indention menu-active-bg menu-pill menu-title-gray-600 menu-icon-gray-500 menu-state-primary menu-arrow-gray-500 fw-semibold fs-5 my-5 mt-lg-2 mb-lg-0"
                id="kt_aside_menu" data-kt-menu="true">
                <div className="hover-scroll-y me-n3 pe-3" id="kt_aside_menu_wrapper" data-kt-scroll="true"
                    data-kt-scroll-activate="{default: false, lg: true}" data-kt-scroll-height="auto"
                    data-kt-scroll-wrappers="#kt_aside_menu"
                    data-kt-scroll-dependencies="#kt_aside_logo, #kt_aside_footer" data-kt-scroll-offset="20px">

                    {renderMenuForRole(userRole)}

                </div>
            </div>
        </>
    );
}

export default Asidemenu;
