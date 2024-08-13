import React from 'react'
import Asidemenu from './Asidemenu';

function ktaside({ isAsideOpen }) {
  return (
    <div
    id="kt_aside"
    className={`aside ${isAsideOpen ? 'drawer drawer-start drawer-on px-3 px-lg-6' : ''}`}
    style={isAsideOpen ? { width: '250px' } : {}}
    
  >
    <div
      className="aside-logo flex-column-auto pt-9 pb-7 px-9"
      id="kt_aside_logo"
    >
      <a href="/">
        <img
          alt="Logo"
          src="/assets/media/logos/logo-default.svg"
          className="max-h-50px logo-default"
        />
        <img
          alt="Logo"
          src="/assets/media/logos/logo-compact.svg"
          className="max-h-50px logo-minimize"
        />
      </a>
    </div>

    <div className="aside-menu " />
    <Asidemenu />
  </div>
  )
}

export default ktaside