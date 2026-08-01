(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').css('top', '0px');
        } else {
            $('.sticky-top').css('top', '-100px');
        }
    });
    
    
    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";
    
    $(window).on("load resize", function() {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
            function() {
                const $this = $(this);
                $this.addClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "true");
                $this.find($dropdownMenu).addClass(showClass);
            },
            function() {
                const $this = $(this);
                $this.removeClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "false");
                $this.find($dropdownMenu).removeClass(showClass);
            }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        margin: 24,
        dots: true,
        loop: true,
        nav : false,
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
    
    // Global Authentication UI State Manager
    $(document).ready(function () {
        const currentUserStr = sessionStorage.getItem('currentUser');
        if (currentUserStr) {
            try {
                const currentUser = JSON.parse(currentUserStr);
                
                // 1. Change "Join Now" to "Logout"
                const joinBtn = $('.navbar .btn-primary');
                if (joinBtn.length > 0) {
                    joinBtn.html('Logout <i class="fa fa-sign-out-alt ms-3"></i>');
                    joinBtn.attr('href', '#');
                    joinBtn.click(function (e) {
                        e.preventDefault();
                        sessionStorage.removeItem('currentUser');
                        window.location.href = 'index.html';
                    });
                }

                // 2. Dynamically add "Products" link to the navbar
                const navNav = $('.navbar-nav');
                if (navNav.length > 0 && navNav.find('a[href="products.html"]').length === 0) {
                    const coursesLink = navNav.find('a[href="courses.html"]');
                    const productsLink = $('<a href="products.html" class="nav-item nav-link">Products</a>');
                    
                    // Set active class if viewing products.html
                    if (window.location.pathname.includes('products.html')) {
                        navNav.find('.active').removeClass('active');
                        productsLink.addClass('active');
                    }
                    
                    if (coursesLink.length > 0) {
                        coursesLink.after(productsLink);
                    } else {
                        navNav.append(productsLink);
                    }
                }
            } catch (e) {
                console.error('Error parsing currentUser session:', e);
            }
        }
    });
    
})(jQuery);

