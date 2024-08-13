import React, { Component } from "react";
import { Outlet } from "react-router";

import Scrolltop from "./commun/Scrolltop";
import Viewuser from "./commun/Viewuser";
import Userssearch from "./commun/Userssearch";
import Ktaside from "./commun/Ktaside";
import Ktfooter from "./commun/Ktfooter";

import Headercompo from "./commun/Headercompo";
//Dashboard: old class name before Admindashboard
class Dashboard extends Component {
  state = {
    isAsideOpen: false,
  };

  toggleAside = () => {
    this.setState((prevState) => ({ isAsideOpen: !prevState.isAsideOpen }));
  };


  render() {
    const { isAsideOpen } = this.state;

    const breadcrumb = this.props.breadcrumb;
    const lastbreadcrumbItem =this.props.lastbreadcrumbItem;
    return (
      <div
        id="kt_body"
        className="header-fixed header-tablet-and-mobile-fixed aside-fixed"
      >
        <div className="d-flex flex-column flex-root">
          <div className="page d-flex flex-row flex-column-fluid">
            <Ktaside isAsideOpen={isAsideOpen}/>
            <div
              className="wrapper d-flex flex-column flex-row-fluid"
              id="kt_wrapper"
            >
             <Headercompo breadcrumb={breadcrumb} lastbreadcrumbItem={lastbreadcrumbItem}  onToggleAside={this.toggleAside}/>
              <div
                className="content d-flex flex-column flex-column-fluid fs-6"
                id="kt_content"
              >
                <div className=" container-xxl " id="kt_content_container">
                <Outlet />
                </div>
              </div>
              <Ktfooter />
            </div>
          </div>
        </div>

        <Scrolltop />
        <Viewuser />
        <Userssearch />
        {isAsideOpen && <div style={{ zIndex: 109 }} className="drawer-overlay" onClick={this.toggleAside}></div>}
      </div>
    );
  }
}

export default Dashboard;