import React, { useContext,useState, useEffect, useRef } from 'react';

import { useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from './../../AuthContext';

import './fonts/icomoon/style.css';
import './fonts/flaticon/font/flaticon.css';
import './style.css';

import AOS from 'aos';
import 'aos/dist/aos.css';


import img1 from './images/graphs-statistics_outline.svg';
import img2 from './images/dashboard.jpg';
import img3 from './images/undraw_getting_coffee_re_f2do.svg';


function Homevitrine() {
  const { isAuthenticated} = useContext(AuthContext);


  const btnRef1 = useRef(null);
  const btnRef2 = useRef(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    btnRef1.current.style.display = 'none';
    btnRef2.current.style.display = 'block';
    try {
      const response = await axios.post('http://localhost:4000/form/sendemail', data, {withCredentials: true});
      Swal.fire('Success', response.data.message, 'success');
      reset(); 
    } catch (error) {
      Swal.fire('Error!', 'Error sending email', 'error');
    }
    btnRef2.current.style.display = 'none';
    btnRef1.current.style.display = 'block';
  };
  const [isActive, setIsActive] = useState(false);
  const [isSubActive, setIsSubActive] = useState(false);
  const [isSubSubActive, setIsSubSubActive] = useState(false);

  const cloneNavRef = useRef(null);
  const mobileMenuBodyRef = useRef(null);


  const toggleMenu = () => {
    setIsActive(!isActive);
  };

  const toggleSubActive = () => {
    setIsSubActive(!isSubActive);
  };

  const toggleSubSubActive = () => {
    setIsSubSubActive(!isSubSubActive);
  };



  useEffect(() => {
    if (window.jQuery('.owl-single').length > 0) {
      var owl = window.jQuery('.owl-single').owlCarousel({
        loop: true,
        autoHeight: true,
        margin: 0,
        autoplay: true,
        smartSpeed: 800,
        mouseDrag: false,
        touchDrag: false,
        items: 1,
        nav: false,
        navText: ['<span className="icon-keyboard_backspace"></span>', '<span className="icon-keyboard_backspace"></span>'],
        onChanged: changed,
      });

      function changed(event) {
        var i = event.item.index;
        if (i == 0 || i == null) {
          i = 1;
        } else {
          i = i - 1;

          window.jQuery('.js-custom-dots a').removeClass('active');
          window.jQuery('.js-custom-dots a[data-index="' + i + '"]').addClass('active');
        }
      }

      window.jQuery('.js-custom-dots a').each(function (i) {
        var i = i + 1;
        window.jQuery(this).attr('data-index', i);
      });

      window.jQuery('.js-custom-dots a').on('click', function (e) {
        e.preventDefault();
        owl.trigger('stop.owl.autoplay');
        var k = window.jQuery(this).data('index');
        k = k - 1;
        owl.trigger('to.owl.carousel', [k, 500]);
      })

    }

    window.jQuery(window).scroll(function () {
      var $w = window.jQuery(this),
        st = $w.scrollTop(),
        navbar = window.jQuery('.js-site-navbar'),
        sd = window.jQuery('.js-scroll-wrap'),
        toggle = window.jQuery('.site-menu-toggle');

      // if ( toggle.hasClass('open') ) {
      //   window.jQuery('.site-menu-toggle').trigger('click');
      // }


      if (st > 150) {
        if (!navbar.hasClass('scrolled')) {
          navbar.addClass('scrolled');
        }
      }
      if (st < 150) {
        if (navbar.hasClass('scrolled')) {
          navbar.removeClass('scrolled sleep');
        }
      }
      if (st > 350) {
        if (!navbar.hasClass('awake')) {
          navbar.addClass('awake');
        }

        if (sd.length > 0) {
          sd.addClass('sleep');
        }
      }
      if (st < 350) {
        if (navbar.hasClass('awake')) {
          navbar.removeClass('awake');
          navbar.addClass('sleep');
        }
        if (sd.length > 0) {
          sd.removeClass('sleep');
        }
      }
    });

    /*           var navToggler = window.jQuery('.site-menu-toggle');
              window.jQuery("body").on("click", ".site-nav .site-menu li a[href^='#'], .smoothscroll[href^='#'], .site-mobile-menu .site-nav-wrap li a", function(e) {
             e.preventDefault();
             var hash = this.hash;
             
               window.jQuery('html, body').animate({
       
                 scrollTop: window.jQuery(hash).offset().top
               }, 400, 'easeInOutExpo', function(){
                 window.location.hash = hash;
               });
       
           });
           window.jQuery('#vitrinePart').on('activate.bs.scrollspy', function () {  }); */

    AOS.init({
      duration: 800,
      easing: 'slide',
      once: true
    });


  }, [])



  return (
    <>
      <div id="vitrinePart" data-spy="scroll" data-target=".site-navbar-target" data-offset="100" data-aos-easing="slide" data-aos-duration="800" data-aos-delay="0" className={isActive ? 'offcanvas-menu' : ''}>
        <div className="site-mobile-menu site-navbar-target" style={isActive ? { transform: "translateX(0%)", WebkitTransform: "translateX(0%)", msTransform: "translateX(0%)", } : {}}>
          <div className="site-mobile-menu-header">
            <div className="site-mobile-menu-close">
              <span className={`icofont-close js-menu-toggle ${isActive ? 'active' : ''}`} onClick={toggleMenu} ></span>
            </div>
          </div>
          <div className="site-mobile-menu-body" ref={mobileMenuBodyRef}>
              <ul className="site-nav-wrap">
                <li className="active"><a href="#home-section" className="nav-link active">Home</a></li>
                <li className="has-children"><span className={`arrow-collapse ${isSubActive ? 'collapsed' : ''}`} onClick={toggleSubActive}></span>
                  <a href="#" className="nav-link">Dropdown</a>
                  <ul className={`collapse ${isSubActive ? 'show' : ''}`}>
                    <li><a href="#testimonials-section" className="nav-link">Testimonials</a></li>
                    <li><a href="elements.html" className="nav-link">Elements</a></li>
                    <li className="has-children"><span className={`arrow-collapse ${isSubSubActive ? 'collapsed' : ''}`} onClick={toggleSubSubActive}></span>
                      <a href="#">Menu Two</a>
                      <ul className={`collapse ${isSubSubActive ? 'show' : ''}`}>
                        <li><a href="#" className="nav-link">Sub Menu One</a></li>
                        <li><a href="#" className="nav-link">Sub Menu Two</a></li>
                        <li><a href="#" className="nav-link">Sub Menu Three</a></li>
                      </ul>
                    </li>
                    <li><a href="#" className="nav-link">Menu Three</a></li>
                  </ul>
                </li>
                <li><a href="#features-section" className="nav-link">Features</a></li>
                <li><a href="#pricing-section" className="nav-link">Pricing</a></li>
                <li><a href="#about-section" className="nav-link">About</a></li>
                <li><a href="#contact-section" className="nav-link">Contact</a></li>
              </ul>

{!isAuthenticated && (
                <ul className="site-nav-wrap">
                  <li className="cta-button-outline"><a href="/auth/signin">Sign in</a></li>
                  <li className="cta-primary"><a href="/auth/signup">Register</a></li>
              </ul>
            )}



          </div>
        </div>

        <nav className="site-nav dark js-site-navbar mb-5 site-navbar-target">
          <div className="container">
            <div className="site-navigation" ref={cloneNavRef}>
              <a href="/" className="logo m-0 float-left">Landing<span className="text-primary">.</span></a>

              <ul className="js-clone-nav d-none d-lg-inline-block site-menu float-left">
                <li className="active"><a href="#home-section" className="nav-link">Home</a></li>
                <li className="has-children">
                  <a href="#" className="nav-link">Dropdown</a>
                  <ul className="dropdown">
                    <li><a href="#testimonials-section" className="nav-link">Testimonials</a></li>
                    <li><a href="elements.html" className="nav-link">Elements</a></li>
                    <li className="has-children">
                      <a href="#">Menu Two</a>
                      <ul className="dropdown">
                        <li><a href="#" className="nav-link">Sub Menu One</a></li>
                        <li><a href="#" className="nav-link">Sub Menu Two</a></li>
                        <li><a href="#" className="nav-link">Sub Menu Three</a></li>
                      </ul>
                    </li>
                    <li><a href="#" className="nav-link">Menu Three</a></li>
                  </ul>
                </li>
                <li><a href="#features-section" className="nav-link">Features</a></li>
                <li><a href="#pricing-section" className="nav-link">Pricing</a></li>
                <li><a href="#about-section" className="nav-link">About</a></li>
                <li><a href="#contact-section" className="nav-link">Contact</a></li>
              </ul>

{!isAuthenticated &&(              <ul className="js-clone-nav d-none mt-1 d-lg-inline-block site-menu float-right">
                <li className="cta-button-outline"><a href="/auth/signin">Sign in</a></li>
                <li className="cta-primary"><a href="/auth/signup">Register</a></li>
              </ul>)}

              <a href="#" className={`burger ml-auto float-right site-menu-toggle js-menu-toggle d-inline-block dark d-lg-none ${isActive ? 'active' : ''}`} onClick={toggleMenu} data-toggle="collapse" data-target="#main-navbar">
                <span></span>
              </a>

            </div>
          </div>
        </nav>

        <div className="untree_co-hero pb-0" id="home-section">
          <div className="container">
            <div className="row">

              <div className="col-12">
                <div className="dots"></div>
                <div className="row justify-content-center">
                  <div className="col-md-7 text-center mb-5">
                    <h1 className="heading" data-aos="fade-up" data-aos-delay="0">Free Bootstrap 4 Landing Page for SaaS Websites <span className="d-block">by <a href="https://untree.co">Untree.co</a></span></h1>
                  </div>
                </div>
                <div className="row align-items-center">

                  <div className="col-lg-4">
                    <div className="intro">

                      <div className="excerpt" data-aos="fade-up" data-aos-delay="100">
                        <span className="caption">Welcome to landing</span>
                        <h2 className="font-weight-bold">Explore The Platform</h2>
                        <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast</p>
                      </div>
                      <p data-aos="fade-up" data-aos-delay="200">
                        <a href="#features-section" className="btn btn-primary smoothscroll mr-1">See Features</a>
                        <a href="#pricing-section" className="btn btn-outline-primary smoothscroll">Pricing</a>
                      </p>
                    </div>

                  </div>
                  <div className="col-lg-8">
                    <div className="illustration">
                      <img src={img1} alt="Image" className="img-fluid" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="untree_co-section">
          <div className="container">

            <div className="row mb-5">
              <div className="col-12 text-center" data-aos="fade-up" data-aos-delay="0">
                <span className="caption">Features</span>
                <h2 className="heading">Advantage of using our products</h2>
                <p>Far from the countries Vokalia and Consonantia</p>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-6 mb-4" data-aos="fade-up" data-aos-delay="100">
                <div className="service horizontal d-flex">
                  <div className="service-icon color-1 mb-4">
                    <svg className="bi bi-app-indicator" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5.5 2A3.5 3.5 0 0 0 2 5.5v5A3.5 3.5 0 0 0 5.5 14h5a3.5 3.5 0 0 0 3.5-3.5V8a.5.5 0 0 1 1 0v2.5a4.5 4.5 0 0 1-4.5 4.5h-5A4.5 4.5 0 0 1 1 10.5v-5A4.5 4.5 0 0 1 5.5 1H8a.5.5 0 0 1 0 1H5.5z" />
                      <path d="M16 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    </svg>
                  </div>
                  <div className="service-contents">
                    <h3>Built for Developers</h3>
                    <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
                    <p><a href="#" className="read-more">Learn More</a></p>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 mb-4" data-aos="fade-up" data-aos-delay="200">
                <div className="service horizontal d-flex">
                  <div className="service-icon color-2 mb-4">
                    <svg className="bi bi-arrow-repeat" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M2.854 7.146a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L2.5 8.207l1.646 1.647a.5.5 0 0 0 .708-.708l-2-2zm13-1a.5.5 0 0 0-.708 0L13.5 7.793l-1.646-1.647a.5.5 0 0 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0 0-.708z" />
                      <path fillRule="evenodd" d="M8 3a4.995 4.995 0 0 0-4.192 2.273.5.5 0 0 1-.837-.546A6 6 0 0 1 14 8a.5.5 0 0 1-1.001 0 5 5 0 0 0-5-5zM2.5 7.5A.5.5 0 0 1 3 8a5 5 0 0 0 9.192 2.727.5.5 0 1 1 .837.546A6 6 0 0 1 2 8a.5.5 0 0 1 .501-.5z" />
                    </svg>
                  </div>
                  <div className="service-contents">
                    <h3>Modern Design</h3>
                    <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
                    <p><a href="#" className="read-more">Learn More</a></p>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 mb-4" data-aos="fade-up" data-aos-delay="300">
                <div className="service horizontal d-flex">
                  <div className="service-icon color-3 mb-4">
                    <svg className="bi bi-briefcase" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M0 12.5A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-6h-1v6a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-6H0v6z" />
                      <path fillRule="evenodd" d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5v2.384l-7.614 2.03a1.5 1.5 0 0 1-.772 0L0 6.884V4.5zM1.5 4a.5.5 0 0 0-.5.5v1.616l6.871 1.832a.5.5 0 0 0 .258 0L15 6.116V4.5a.5.5 0 0 0-.5-.5h-13zM5 2.5A1.5 1.5 0 0 1 6.5 1h3A1.5 1.5 0 0 1 11 2.5V3h-1v-.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V3H5v-.5z" />
                    </svg>
                  </div>
                  <div className="service-contents">
                    <h3>Build Stunning Websites</h3>
                    <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
                    <p><a href="#" className="read-more">Learn More</a></p>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 mb-4" data-aos="fade-up" data-aos-delay="400">
                <div className="service horizontal d-flex">
                  <div className="service-icon color-4 mb-4">
                    <svg className="bi bi-collection" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M14.5 13.5h-13A.5.5 0 0 1 1 13V6a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5zm-13 1A1.5 1.5 0 0 1 0 13V6a1.5 1.5 0 0 1 1.5-1.5h13A1.5 1.5 0 0 1 16 6v7a1.5 1.5 0 0 1-1.5 1.5h-13zM2 3a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 0-1h-11A.5.5 0 0 0 2 3zm2-2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7A.5.5 0 0 0 4 1z" />
                    </svg>
                  </div>
                  <div className="service-contents">
                    <h3>Bring Ideas to Life</h3>
                    <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
                    <p><a href="#" className="read-more">Learn More</a></p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="untree_co-section" id="features-section">
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-lg-4">
                <span className="caption" data-aos="fade-up" data-aos-delay="0">Digital Services</span>
                <h3 className="heading mb-4" data-aos="fade-up" data-aos-delay="100">A complete solution for your business website.</h3>
                <div className="mb-4" data-aos="fade-up" data-aos-delay="200">
                  <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>

                  <ul className="list-unstyled ul-check primary">
                    <li>There live the blind texts</li>
                    <li>Far far away behind the word</li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-7" data-aos="fade-up" data-aos-delay="400">
                <a href="https://vimeo.com/342333493" className="btn-video" data-fancybox>

                  <span className="wrap-icon-play">
                    <svg className="bi bi-play-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                    </svg>
                  </span>
                  <img src={img2} alt="Image" className="img-fluid img-shadow" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="untree_co-section bg-light">
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-lg-5 order-lg-2 js-custom-dots">

                <a href="#" className="service link horizontal d-flex active" data-aos="fade-left" data-aos-delay="0">
                  <div className="service-icon color-1 mb-4">
                    <svg className="bi bi-app-indicator" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5.5 2A3.5 3.5 0 0 0 2 5.5v5A3.5 3.5 0 0 0 5.5 14h5a3.5 3.5 0 0 0 3.5-3.5V8a.5.5 0 0 1 1 0v2.5a4.5 4.5 0 0 1-4.5 4.5h-5A4.5 4.5 0 0 1 1 10.5v-5A4.5 4.5 0 0 1 5.5 1H8a.5.5 0 0 1 0 1H5.5z" />
                      <path d="M16 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    </svg>
                  </div>
                  <div className="service-contents">
                    <h3>Built for Developers</h3>
                    <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia.</p>
                  </div>
                </a>

                <a href="#" className="service link horizontal d-flex" data-aos="fade-left" data-aos-delay="100">
                  <div className="service-icon color-2 mb-4">
                    <svg className="bi bi-arrow-repeat" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M2.854 7.146a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L2.5 8.207l1.646 1.647a.5.5 0 0 0 .708-.708l-2-2zm13-1a.5.5 0 0 0-.708 0L13.5 7.793l-1.646-1.647a.5.5 0 0 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0 0-.708z" />
                      <path fillRule="evenodd" d="M8 3a4.995 4.995 0 0 0-4.192 2.273.5.5 0 0 1-.837-.546A6 6 0 0 1 14 8a.5.5 0 0 1-1.001 0 5 5 0 0 0-5-5zM2.5 7.5A.5.5 0 0 1 3 8a5 5 0 0 0 9.192 2.727.5.5 0 1 1 .837.546A6 6 0 0 1 2 8a.5.5 0 0 1 .501-.5z" />
                    </svg>
                  </div>
                  <div className="service-contents">
                    <h3>Modern Design</h3>
                    <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia.</p>
                  </div>
                </a>


                <a href="#" className="service link horizontal d-flex" data-aos="fade-left" data-aos-delay="200">
                  <div className="service-icon color-3 mb-4">
                    <svg className="bi bi-briefcase" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M0 12.5A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-6h-1v6a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-6H0v6z" />
                      <path fillRule="evenodd" d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5v2.384l-7.614 2.03a1.5 1.5 0 0 1-.772 0L0 6.884V4.5zM1.5 4a.5.5 0 0 0-.5.5v1.616l6.871 1.832a.5.5 0 0 0 .258 0L15 6.116V4.5a.5.5 0 0 0-.5-.5h-13zM5 2.5A1.5 1.5 0 0 1 6.5 1h3A1.5 1.5 0 0 1 11 2.5V3h-1v-.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V3H5v-.5z" />
                    </svg>
                  </div>
                  <div className="service-contents">
                    <h3>Build Stunning Websites</h3>
                    <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia.</p>
                  </div>
                </a>


              </div>
              <div className="col-lg-7">
                <div className="img-shadow">
                  <div className="owl-single no-dots owl-carousel">
                    <div className="item">
                      <span className="number">1/3</span>
                      <img src={img2} alt="Image" className="img-fluid" />
                    </div>
                    <div className="item">
                      <span className="number">2/3</span>
                      <img src={img2} alt="Image" className="img-fluid" />
                    </div>
                    <div className="item">
                      <span className="number">3/3</span>
                      <img src={img2} alt="Image" className="img-fluid" />
                    </div>

                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="untree_co-section">
          <div className="container">

            <div className="row">
              <div className="col-12 mb-5" data-aos="fade-up">
                <span className="caption">Features</span>
                <h2 className="heading">More Features</h2>
              </div>

              <div className="col-md-6 mb-4 mb-lg-0 col-lg-3" data-aos="fade-up" data-aos-delay="0">
                <div className="service">
                  <div className="service-icon color-1 mb-4">
                    <svg className="bi bi-app-indicator" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5.5 2A3.5 3.5 0 0 0 2 5.5v5A3.5 3.5 0 0 0 5.5 14h5a3.5 3.5 0 0 0 3.5-3.5V8a.5.5 0 0 1 1 0v2.5a4.5 4.5 0 0 1-4.5 4.5h-5A4.5 4.5 0 0 1 1 10.5v-5A4.5 4.5 0 0 1 5.5 1H8a.5.5 0 0 1 0 1H5.5z" />
                      <path d="M16 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    </svg>
                  </div>
                  <div className="service-contents">
                    <h3>Built for Developers</h3>
                    <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-4 mb-lg-0 col-lg-3" data-aos="fade-up" data-aos-delay="100">
                <div className="service">
                  <div className="service-icon color-2 mb-4">
                    <svg className="bi bi-arrow-repeat" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M2.854 7.146a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L2.5 8.207l1.646 1.647a.5.5 0 0 0 .708-.708l-2-2zm13-1a.5.5 0 0 0-.708 0L13.5 7.793l-1.646-1.647a.5.5 0 0 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0 0-.708z" />
                      <path fillRule="evenodd" d="M8 3a4.995 4.995 0 0 0-4.192 2.273.5.5 0 0 1-.837-.546A6 6 0 0 1 14 8a.5.5 0 0 1-1.001 0 5 5 0 0 0-5-5zM2.5 7.5A.5.5 0 0 1 3 8a5 5 0 0 0 9.192 2.727.5.5 0 1 1 .837.546A6 6 0 0 1 2 8a.5.5 0 0 1 .501-.5z" />
                    </svg>
                  </div>
                  <div className="service-contents">
                    <h3>Modern Design</h3>
                    <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-4 mb-lg-0 col-lg-3" data-aos="fade-up" data-aos-delay="200">
                <div className="service">
                  <div className="service-icon color-3 mb-4">
                    <svg className="bi bi-briefcase" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M0 12.5A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-6h-1v6a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-6H0v6z" />
                      <path fillRule="evenodd" d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5v2.384l-7.614 2.03a1.5 1.5 0 0 1-.772 0L0 6.884V4.5zM1.5 4a.5.5 0 0 0-.5.5v1.616l6.871 1.832a.5.5 0 0 0 .258 0L15 6.116V4.5a.5.5 0 0 0-.5-.5h-13zM5 2.5A1.5 1.5 0 0 1 6.5 1h3A1.5 1.5 0 0 1 11 2.5V3h-1v-.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V3H5v-.5z" />
                    </svg>
                  </div>
                  <div className="service-contents">
                    <h3>Build Stunning Websites</h3>
                    <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-4 mb-lg-0 col-lg-3" data-aos="fade-up" data-aos-delay="300">
                <div className="service">
                  <div className="service-icon color-4 mb-4">
                    <svg className="bi bi-collection" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M14.5 13.5h-13A.5.5 0 0 1 1 13V6a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5zm-13 1A1.5 1.5 0 0 1 0 13V6a1.5 1.5 0 0 1 1.5-1.5h13A1.5 1.5 0 0 1 16 6v7a1.5 1.5 0 0 1-1.5 1.5h-13zM2 3a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 0-1h-11A.5.5 0 0 0 2 3zm2-2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7A.5.5 0 0 0 4 1z" />
                    </svg>
                  </div>
                  <div className="service-contents">
                    <h3>Bring Ideas to Life</h3>
                    <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="untree_co-section bg-light" id="pricing-section">
          <div className="container">

            <div className="row pricing-title">
              <div className="col-12 text-center" data-aos="fade-up" data-aos-delay="0">
                <span className="caption">Plans</span>
                <h2 className="heading">Pricing</h2>
                <p>Pricing for everyone. Choose your plan now!</p>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="row">
                  <div className="col-lg-4" data-aos="fade-up" data-aos-delay="100">
                    <div className="pricing">
                      <div className="body">
                        <div className="price">
                          <span className="price"><sup>$</sup><span>0</span></span>
                          <span className="d-block plan mb-4">Free</span>
                        </div>
                        <ul className="list-unstyled ul-check primary mb-5">
                          <li>There live the blind texts</li>
                          <li>Far far away behind the word</li>
                          <li>Far from the countries Vokalia and Consonantia</li>
                        </ul>
                        <p className="text-center mb-0"><a href="#" className="btn btn-outline-primary">Get Started</a></p>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4" data-aos="fade-up" data-aos-delay="200">
                    <div className="pricing active">
                      <div className="body">
                        <div className="price">
                          <span className="price"><sup>$</sup><span>19.99</span></span>
                          <span className="d-block plan mb-4">Standard</span>
                        </div>
                        <ul className="list-unstyled ul-check primary mb-5">
                          <li>There live the blind texts</li>
                          <li>Far far away behind the word</li>
                          <li>Far from the countries Vokalia and Consonantia</li>
                        </ul>
                        <p className="text-center mb-0"><a href="#" className="btn btn-primary">Get Started</a></p>
                      </div>
                    </div>

                  </div>

                  <div className="col-lg-4" data-aos="fade-up" data-aos-delay="300">
                    <div className="pricing">

                      <div className="body">
                        <div className="price">
                          <span className="price"><sup>$</sup><span>79.99</span></span>
                          <span className="d-block plan mb-4">Premium</span>
                        </div>
                        <ul className="list-unstyled ul-check primary mb-5">
                          <li>There live the blind texts</li>
                          <li>Far far away behind the word</li>
                          <li>Far from the countries Vokalia and Consonantia</li>
                        </ul>
                        <p className="text-center mb-0"><a href="#" className="btn btn-outline-primary">Get Started</a></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="untree_co-section" id="about-section">
          <div className="container">
            <div className="row justify-content-between mb-5">
              <div className="col-lg-8 mb-4 mb-lg-0" data-aos="fade-up" data-aos-delay="100">
                <img src={img3} alt="Image" className="img-fluid" />
              </div>
              <div className="col-lg-4">
                <div className="mb-4" data-aos="fade-up" data-aos-delay="0">
                  <span className="caption">About</span>
                  <h2 className="heading">The Company</h2>
                </div>
                <div className="mb-4" data-aos="fade-up" data-aos-delay="100">
                  <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast</p>
                  <p>Separated they <span className="highlight">live in Bookmarksgrove right at the coast of the Semantics</span>, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia.</p>
                </div>

                <ul className="list-unstyled ul-check primary mb-4" data-aos="fade-up" data-aos-delay="200">
                  <li>There live the blind texts</li>
                  <li>Far far away behind the word</li>
                  <li>Their place and supplies</li>
                </ul>


                <div className="row count-numbers">
                  <div className="col-6 col-lg-6" data-aos="fade-up" data-aos-delay="0">
                    <span className="counter d-block"><span data-number="24">24</span><span>M</span></span>
                    <span className="caption-2">Members</span>
                  </div>
                  <div className="col-6 col-lg-6" data-aos="fade-up" data-aos-delay="100">
                    <span className="counter d-block"><span data-number="121">121</span><span></span></span>
                    <span className="caption-2">Team</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="untree_co-section" id="contact-section">
          <div className="container">
            <div className="row mb-5" data-aos="fade-up" data-aos-delay="0">
              <div className="col-12 text-center">
                <span className="caption">Contact</span>
                <h2 className="heading">Get In Touch</h2>
                <p>Far from the countries Vokalia and Consonantia</p>
              </div>
            </div>
            <div className="row">

              <div className="col-lg-7">


                <form className="contact-form" data-aos="fade-up" data-aos-delay="100" onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <label className="" htmlFor="fname">First name</label>
                        <input type="text" className="form-control" id="fname" {...register('fname', { required: true })}/>
                        {errors.fname && <span className='text-danger'>First name is required</span>}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label className="" htmlFor="lname">Last name</label>
                        <input type="text" className="form-control" id="lname" {...register('lname', { required: true })}/>
                        {errors.lname && <span className='text-danger'>Last name is required</span>}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="" htmlFor="email">Email address</label>
                    <input type="email" className="form-control" id="email" {...register('email', { required: true })}/>
                    {errors.email && <span className='text-danger'>Email is required</span>}
                  </div>

                  <div className="form-group">
                    <label className="" htmlFor="message">Message</label>
                    <textarea name="" className="form-control" id="message" cols="30" rows="5" {...register('message', { required: true })}></textarea>
                    {errors.message && <span className='text-danger'>Message is required</span>}
                  </div>

                  <button type="submit" className="btn btn-primary">
                  <span className="indicator-label" ref={btnRef1} >
                  <span className=' d-flex align-items-center'>                  Send Message
                  <i className="ki-duotone ki-arrow-right fs-2 me-0 ms-2">
                      <span className="path1"></span>
                      <span className="path2"></span>
                  </i></span>

                  </span>
          
              <span ref={btnRef2} className="indicator-progress">
                  Please wait... <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>

                  </button>
                </form>
              </div>
              <div className="col-lg-4 ml-auto" data-aos="fade-up" data-aos-delay="200">
                <div className="quick-contact">
                  <h3 className="h5 mb-4">Contact Info</h3>
                  <address className="text-black d-flex"><span className="mt-1 icon-room mr-2"></span><span>43 Raymouth Rd. Baltemoer, London 3910</span></address>
                  <ul className="list-unstyled ul-links mb-4">
                    <li><a href="tel://11234567890" className="d-flex"><span className="mt-1 icon-phone mr-2"></span><span>+1(123)-456-7890</span></a></li>

                    <li><a href="tel://11234567890" className="d-flex"><span className="mt-1 icon-phone mr-2"></span><span>+1(123)-456-7890</span></a></li>

                    <li><a href="mailto:info@mydomain.com" className="d-flex"><span className="mt-1 icon-envelope mr-2"></span><span>info@mydomain.com</span></a></li>

                    <li><a href="https://untree.co/" target="_blank" className="d-flex"><span className="mt-1 icon-globe mr-2"></span><span>https://untree.co/</span></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="site-footer">

          <div className="footer-dots"></div>
          <div className="container">

            <div className="row">
              <div className="col-lg-4">
                <div className="widget">
                  <h3>About Launch<span className="text-primary">.</span> </h3>
                  <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
                </div>
                <div className="widget">
                  <h3>Follow Us</h3>
                  <ul className="list-unstyled social">
                    <li><a href="#"><span className="icon-instagram"></span></a></li>
                    <li><a href="#"><span className="icon-twitter"></span></a></li>
                    <li><a href="#"><span className="icon-facebook"></span></a></li>
                    <li><a href="#"><span className="icon-linkedin"></span></a></li>
                    <li><a href="#"><span className="icon-pinterest"></span></a></li>
                    <li><a href="#"><span className="icon-dribbble"></span></a></li>
                  </ul>
                </div>
              </div>

              <div className="col-lg-2 ml-auto">
                <div className="widget">
                  <h3>Projects</h3>
                  <ul className="list-unstyled float-left links">
                    <li><a href="#">Home</a></li>
                    <li><a href="#">Services</a></li>
                    <li><a href="#">Features</a></li>
                    <li><a href="#">Pricing</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Contact</a></li>
                  </ul>
                </div>
              </div>

              <div className="col-lg-2">
                <div className="widget">
                  <h3>Services</h3>
                  <ul className="list-unstyled float-left links">
                    <li><a href="#">Built for Developers</a></li>
                    <li><a href="#">Modern Design</a></li>
                    <li><a href="#">Building Stunning Websites</a></li>
                    <li><a href="#">Bring Ideas To Life</a></li>
                  </ul>
                </div>
              </div>


              <div className="col-lg-3">
                <div className="widget">
                  <h3>Quick Contact</h3>
                  <address>43 Raymouth Rd. Baltemoer, London 3910</address>
                  <ul className="list-unstyled links mb-4">
                    <li><a href="tel://11234567890">+1(123)-456-7890</a></li>
                    <li><a href="tel://11234567890">+1(123)-456-7890</a></li>
                    <li><a href="mailto:info@mydomain.com">info@mydomain.com</a></li>
                  </ul>
                </div>
              </div>

            </div>

            <div className="row mt-5">
              <div className="col-12 text-center">
                <p className="copyright">Copyright &copy;<script>document.write(new Date().getFullYear());</script>. All Rights Reserved. &mdash; Designed with love by <a href="https://untree.co">Untree.co</a>
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default Homevitrine;