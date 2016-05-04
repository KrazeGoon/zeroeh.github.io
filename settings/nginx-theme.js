/**
 * nginx-theme.js
 *
 * General JS customizations for Nginx theme. "Localized" vars
 * are available in nginxThemeVars object.
 */
(function($) {

    var nginxTheme = {

        /**
         * Expand/collapse the header for mobile.
         */
        mobileHeaderToggle: function() {
            var expandedClass = 'mobile-expanded',
                $header = $('#masthead');

            $header.stop(true, true);
            if (!$header.hasClass(expandedClass)) {
                $header.addClass(expandedClass);
            } else {
                $header.removeClass(expandedClass);
            }
        },

        /**
         * Toggle expansion of a primary menu item that has children (mobile display only).
         *
         * @param triggerElement
         */
        mobilePrimaryMenuItemToggle: function(triggerElement) {
            var expandedClass = 'item-mobile-expanded',
                $item = $(triggerElement).closest('.menu-item'),
                $iconElement = $item.find('.icon').first();

            $item.stop(true, true);
            if (!$item.hasClass(expandedClass)) {
                $item.addClass(expandedClass);
                $iconElement.removeClass('icon-arrow-down').addClass('icon-arrow-up');
            } else {
                $item.removeClass(expandedClass);
                $iconElement.removeClass('icon-arrow-up').addClass('icon-arrow-down');
            }
        },

        /**
         * Apply modals for image links within the provided selector.
         *
         * @param {string} containerSelector A selector such as '.entry-content'.
         */
        applyImageModals: function(containerSelector) {

            var imgFileExtensions = [ 'png', 'jpg', 'jpeg', 'gif', 'svg', 'tif' ];

            // We're targeting all links that lead directly to an image file.
            var $links = $(containerSelector).find('a').filter(function() {
                // Do a case-insensitive check on the file extension of each link.
                if (_.isString(this.href)) {
                    var href = this.href.toLowerCase(), fileExt = href.substr(href.lastIndexOf('.') + 1);
                    if ($.inArray(fileExt, imgFileExtensions) > -1) {
                        return true;
                    }
                }
                return false;
            });

            // Apply modal to each matching link.
            $links.each(function() {
                $(this).magnificPopup({
                    'type': 'image'
                });
            });
        },

        toggleFreeTrial: function() {
            $('.free-trial-wrap').toggleClass('visible');
        },

        toggleContactUs: function() {
            $('.contact-us-wrap').toggleClass('visible');
        },

        toggleFreeShirt: function() {
            $('.freeshirt-modal-wrap').toggleClass('visible');
        },
        
        toggleFreeShirtV2: function() {
            $('.freeshirt-v2-modal-wrap').toggleClass('visible');
        },
        
        togglePartnerCredit: function() {
            if( $( '.page-id-13797' ).length || $( '.postid-13992' ).length || $( '.postid-16722' ).length || $( '.postid-8981' ).length ) {
                $('.partner-credit-wrap').toggleClass('visible');
            }
        }

    };

    $(document).ready(function() {
        // FREE TRIAL MODAL JS

        $('.free-trial-inner-wrap').click(function(e) {
            if(e.target == this) {
                nginxTheme.toggleFreeTrial();
            }
        });

        $('.free-trial-wrap .close-button').click(nginxTheme.toggleFreeTrial);
        $('a[href="#free-trial"]').click(function(e) {
            e.preventDefault();
            nginxTheme.toggleFreeTrial();
        });

        if(window.location.hash == "#free-trial") {
            nginxTheme.toggleFreeTrial();
        }

        if(window.location.hash == "#hack") {
            nginxTheme.toggleFreeTrial();
        }


        // CONTACT US MODAL JS
        $('.contact-us-inner-wrap').click(function(e) {
            if(e.target == this) {
                nginxTheme.toggleContactUs();
            }
        });

        $('.contact-us-wrap .close-button').click(nginxTheme.toggleContactUs);
        $('a[href="#contact-us"]').click(function(e) {
            e.preventDefault();
            nginxTheme.toggleContactUs();
        });


        if(window.location.hash == "#contact-us") {
            nginxTheme.toggleContactUs();
        }

        // FREE SHIRT MODAL JS
        $('.freeshirt-modal-inner-wrap').click(function(e) {
            if(e.target == this) {
                nginxTheme.toggleFreeShirt();
            }
        });

        $('.freeshirt-modal-wrap .close-button').click(nginxTheme.toggleFreeShirt);
        $('a[href="#trial-shirt"]').click(function(e) {
            e.preventDefault();
            nginxTheme.toggleFreeShirt();
        });


        if(window.location.hash == "#trial-shirt") {
            nginxTheme.toggleFreeShirt();
        }
        
        
        // FREE SHIRT MODAL JS V2
        $('.freeshirt-v2-modal-inner-wrap').click(function(e) {
            if(e.target == this) {
                nginxTheme.toggleFreeShirtV2();
            }
        });

        $('.freeshirt-v2-modal-wrap .close-button').click(nginxTheme.toggleFreeShirtV2);
        $('a[href="#trial-shirt-v2"]').click(function(e) {
            e.preventDefault();
            nginxTheme.toggleFreeShirtV2();
        });


        if(window.location.hash == "#trial-shirt-v2") {
            nginxTheme.toggleFreeShirtV2();
        }
        
        
        // PARTNER CREDIT MODAL JS
        $('.partner-credit-inner-wrap').click(function(e) {
            if(e.target == this) {
                nginxTheme.togglePartnerCredit();
            }
        });

        $('.partner-credit-wrap .close-button').click(nginxTheme.togglePartnerCredit);
        $('a[href="#partner-credit"]').click(function(e) {
            e.preventDefault();
            nginxTheme.togglePartnerCredit();
        });
        
        if(window.location.hash == "#partner-credit") {
            nginxTheme.togglePartnerCredit();
        }


        // Toggle mobile header.
        $('.mobile-menu-button').on('click', function(e) {
            e.preventDefault();
            nginxTheme.mobileHeaderToggle();
        });

        // Toggle mobile menu item.
        $('#page').on('click', '#masthead.mobile-expanded #menu-primary > li.menu-item-has-children > a .icon', function(e) {
            e.preventDefault();
            nginxTheme.mobilePrimaryMenuItemToggle(this);
        });

        // Toggle menu search
        $('.search-field')
            .on('focus', function() {
                $(this).closest('.search-form-wrapper').addClass('focused');
                if(!$("#masthead").hasClass("sticky-menu")) {
                    $('.header-extras-wrapper').not('.mobile-expanded .header-extras-wrapper').toggle();
                }
            })
            .on('blur', function() {
                $(this).closest('.search-form-wrapper').removeClass('focused');
                if(!$("#masthead").hasClass("sticky-menu")) {
                    setTimeout(function () {
                        $('.header-extras-wrapper').not('.mobile-expanded .header-extras-wrapper').fadeToggle();
                    }, 1000);
                }
            });

        // Apply image link modals.
        nginxTheme.applyImageModals('.entry-content');

        $(".icon-arrow-disc").css("cursor","pointer").on("click",function(){
            if($(this).prev("a")[0]) {
                $(this).prev("a")[0].click();
            }
        });

    });

    scroll_effect();


    function scroll_effect() {
        "use strict";
        var headerBar = $("#masthead.site-header");
        var lastScrollTop = 0;
        $(window).scroll(function () {
            var currentScrollValue = $(this).scrollTop();
            //console.log(currentScrollValue);
            if(headerBar.hasClass('mobile-expanded')) { return; }

            if (currentScrollValue > 150) {
                headerBar.addClass('sticky-menu');
                if($(".post").length>0 ){
                    //if(currentScrollValue>600){
                    //    $("#asidewrapper aside:eq(0)").hide(200);
                    //}else if(currentScrollValue<600){
                    //    $("#asidewrapper aside:eq(0)").show(200);
                    //}
                }else if($("article.nx_info_types-admin-guide").length>0){
                    if(currentScrollValue>400){
                        $("#asidewrapper aside:eq(1)").hide(200);
                    }else if(currentScrollValue<400){
                        $("#asidewrapper aside:eq(1)").show(200);
                    }
                }

                if (currentScrollValue > 200) {
                    headerBar.addClass('show-sticky-menu');
                    $("#menu-header-actions .menu-item a[href$='/products/pricing/']").hide();
                }
            }
            if (currentScrollValue < 200) {
                headerBar.removeClass('show-sticky-menu');
                $("#asidewrapper").css("paddingTop",0);
                if (currentScrollValue < 150) {
                    headerBar.removeClass('sticky-menu');
                    $("#menu-header-actions .menu-item a[href$='/products/pricing/']").show();
                }
            }
            lastScrollTop = currentScrollValue;
        });
    }


    $('a[href^=#]').not('#respg-filters a[href^=#]').smoothScroll({offset: -120});
    
    $.fn.nginx_form_custom_validation_plg = function( options ) {
        
        var $this = this;
        
        var settings = $.extend( {
            button_id           : '#submit',
            required            : new Array(),
            theme               : 'white',
            email_class         : '.email',
            single              : false
        }, options );
        
        return $this.each( function() {
            if( settings.theme == 'black' ) {
                var start_div = '<div class="errMSG" style="background: #fff; color: #333; font-size: 12px; padding: 0px 8px 8px; position: absolute; z-index: 999999; left: LEFT; top: TOP"><div style="width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 8px solid #fff; position: relative; top: -8px"></div>';
            }else{
                var start_div = '<div class="errMSG" style="background: #000; color: #fff; font-size: 12px; padding: 0px 8px 8px; position: absolute; z-index: 999999; left: LEFT; top: TOP"><div style="width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 8px solid #000; position: relative; top: -8px"></div>';
            }
            
            var end_div = '</div>';
            
            var _form = $( $this  );
            $( '.errMSG' ).remove();
            
            _form.css( {
                position: 'relative'
            } );
            
            $( settings.button_id ).click( function( e ){
                
                var is_valid = true;
                var is_valid_email = true;
                var target = '';
                var distance = '';
                var left = '';
                
                required_length = settings.required.length;
                
                for( var i = 0; i < required_length; i++ ) {
                    
                    if( _form.find( settings.required[i] ).val() == '' ) {
                        is_valid = false;
                        target = _form.find( settings.required[i] );
                    }
                    
                    if( is_valid && settings.email_class != '' && settings.required[i] == settings.email_class ) {
                        if( ! is_NGINX_form_valid_Email( _form.find( settings.email_class ).val() ) ) {
                            is_valid = false;
                            is_valid_email = false;
                            target = _form.find( settings.email_class );
                        }
                    }
                    
                    if( ! is_valid ) break;
                    
                }
                
                if( _form.find( '#Country' ).length ) {
                    if( _form.find( '#Country' ).val() == null ) {
                        is_valid = false;
                        target = _form.find( '.select2-container' );
                    }
                }
                
                if( ! is_valid_email ) {
                    var errMSG = start_div + 'Please provide a correct email address.' + end_div;
                }else{
                    var errMSG = start_div + 'This field is required.' + end_div;
                }
                
                if( ! is_valid ) {
                    distance = target.offset().top - target.parent().offset().top - target.parent().scrollTop() + 40;
                    errMSG = errMSG.replace( 'TOP', distance + 'px' );
                    
                    if( settings.single ) {
                        left = target.offset().left;
                    }else{
                        left = '10px';
                    }
                    errMSG = errMSG.replace( 'LEFT', left + 'px' );
                    
                    _form.prepend( errMSG );
                    return false;
                }
                
                if( _form.hasClass( 'nginx_contact_sales_pop' ) ) {
                    var data = {
                        action: 'post_to_slack',
                        _wpnonce: nginxThemeVars.nonce,
                        name: $('.nginx_contact_fname').val() + ' ' + $('.nginx_contact_lname').val(),
                        email: $('.nginx_contact_email').val(),
                        company: $('.nginx_contact_company').val(),
                        phone: $('.nginx_contact_phone').val(),
                        inquiry: $('.nginx_contact_inq').val()
                    };
                    
                    $.post(
                        nginxThemeVars.ajaxurl,
                        data,
                        function( response ) {
                            
                        }
                    );
                }
                
                $( settings.button_id ).submit();
                return true;
                
            } );
            
            _form.find( 'input' ).keyup( function() {
                $( '.errMSG' ).remove();
            } );
            
        });
    };
    
    function is_NGINX_form_valid_Email( email ) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test( email );
    }
    
    
    
    // Contact sales form validation
    var contact_required = new Array( '.nginx_contact_fname', '.nginx_contact_lname', '.nginx_contact_email', '.nginx_contact_company', '.nginx_contact_phone', '.nginx_contact_inq' );
    $( '.nginx_contact_sales_pop' ).nginx_form_custom_validation_plg( {
        button_id           : '#nginx_contact_sales_pop_submit',
        required            : contact_required,
        theme               : 'white',
        email_class         : '.nginx_contact_email'
    } );
    
    // Free trial form validation
    var trial_required = new Array( '.mf3_form_fname', '.mf3_form_lname', '.mf3_form_email', '.mf3_form_company', '.mf3_form_job_title', '.mf3_form_phone', '#Country' );
    $( '.nginx_free_trial_form' ).nginx_form_custom_validation_plg( {
        button_id           : '#submit_free_trial',
        required            : trial_required,
        theme               : 'white',
        email_class         : '.mf3_form_email'
    } );
    
    // Product OSS form validation
    var prod_required = new Array( '.prod_dw_form_email' );
    $( '.prod_dw_form' ).nginx_form_custom_validation_plg( {
        button_id           : '#download_button_prod_oss',
        required            : prod_required,
        theme               : 'white',
        email_class         : '.prod_dw_form_email',
        single              : true
    } );
    
    // HTTP2 form validation
    var http2_required = new Array( '.nginx_http2_fname', '.nginx_http2_lname', '.nginx_http2_email', '.nginx_http2_company', '.nginx_http2_phone' );
    $( '.nginx_http2' ).nginx_form_custom_validation_plg( {
        button_id           : '#nginx_mb1',
        required            : http2_required,
        theme               : 'black',
        email_class         : '.nginx_http2_email'
    } );
    
    // Landing form validation
    var land_required = new Array( '.nginx_land_fname', '.nginx_land_lname', '.nginx_land_email', '.nginx_land_company', '.nginx_land_phone' );
    $( '.nginx_landing_form' ).nginx_form_custom_validation_plg( {
        button_id           : '#nginx_land_mb1',
        required            : land_required,
        theme               : 'black',
        email_class         : '.nginx_land_email'
    } );
    
    // Micro form validation
    var micro_required = new Array( '.nginx_micro_fname', '.nginx_micro_lname', '.nginx_micro_email', '.nginx_micro_company', '.nginx_micro_phone' );
    $( '.nginx_micro' ).nginx_form_custom_validation_plg( {
        button_id           : '#nginx_micro_mb1',
        required            : micro_required,
        theme               : 'black',
        email_class         : '.nginx_micro_email'
    } );
    
    // Partner credit form validation
    var partner_required = new Array( '.nginx_partner_fname', '.nginx_partner_lname', '.nginx_partner_email', '.nginx_partner_company', '.nginx_partner_phone' );
    $( '.nginx_partner_sales_pop' ).nginx_form_custom_validation_plg( {
        button_id           : '#nginx_partner_pop_submit',
        required            : partner_required,
        theme               : 'white',
        email_class         : '.nginx_partner_email'
    } );
    
    // Free t-shirt V1
    var free_t_shirt_v1 = new Array( '.ngx_tshirt_fname', '.ngx_tshirt_lname', '.ngx_tshirt_email', '.ngx_tshirt_company', '.ngx_tshirt_job', '.ngx_tshirt_phone' );
    $( '.ngx_free_tshirt' ).nginx_form_custom_validation_plg( {
        button_id           : '#ngx_tshirt_btn',
        required            : free_t_shirt_v1,
        theme               : 'white',
        email_class         : '.ngx_tshirt_email'
    } );
    
    // Free t-shirt V2
    var free_t_shirt_v2 = new Array( '.ngx_tshirt_v2_fname', '.ngx_tshirt_v2_lname', '.ngx_tshirt_v2_email', '.ngx_tshirt_v2_company', '.ngx_tshirt_v2_job', '.ngx_tshirt_v2_phone' );
    $( '.ngx_free_tshirt_v2' ).nginx_form_custom_validation_plg( {
        button_id           : '#ngx_tshirt_v2_btn',
        required            : free_t_shirt_v2,
        theme               : 'white',
        email_class         : '.ngx_tshirt_v2_email'
    } );
    
    // Nice scroll
    $(window).load(function(){
        $(".jq_custom_scroll").mCustomScrollbar({
            theme: "light", //more theme http://manos.malihu.gr/repository/custom-scrollbar/demo/examples/scrollbar_themes_demo.html
			scrollButtons: {enable: true},
            mouseWheel: {
                scrollAmount: 25
            }
        });
		
        $(".jq_custom_scroll_dark").mCustomScrollbar({
            theme: "dark", //more theme http://manos.malihu.gr/repository/custom-scrollbar/demo/examples/scrollbar_themes_demo.html
			scrollButtons: {enable: true},
            mouseWheel: {
                scrollAmount: 25
            }
        });

    });
    
    $(document).on('keydown', 'input[type=tel], input[type=number], input[name=Phone]', function(e){-1!==$.inArray(e.keyCode,[46,8,9,27,13,110,190])||/65|67|86|88/.test(e.keyCode)&&(!0===e.ctrlKey||!0===e.metaKey)||35<=e.keyCode&&40>=e.keyCode||(e.shiftKey||48>e.keyCode||57<e.keyCode)&&(96>e.keyCode||105<e.keyCode)&&e.preventDefault()});
    

})(jQuery);


//====================miscellaneous functions=======================

/*
WRITE COOKIE
Exaple use: writeCookie("myCookie", "my name", 24);
Stores the string "my name" in the cookie "myCookie" which expires after 24 hours.
*/
function writeCookie(name, value, hours)
{
  var expire = "";
  if(hours != null)
  {
    expire = new Date((new Date()).getTime() + hours * 3600000);
    expire = "; expires=" + expire.toGMTString();
	path =  "; path=/"; 
  }
  document.cookie = name + "=" + escape(value) + expire + path;
}

/*
READ COOKIE
Example use: alert( readCookie("myCookie") );
*/
function readCookie(name)
{
  var cookieValue = "";
  var search = name + "=";
  if(document.cookie.length > 0)
  { 
    offset = document.cookie.indexOf(search);
    if (offset != -1)
    { 
      offset += search.length;
      end = document.cookie.indexOf(";", offset);
      if (end == -1) end = document.cookie.length;
      cookieValue = unescape(document.cookie.substring(offset, end))
    }
  }
  return cookieValue;
}

function nginx_track_hero_banner( banner_file_name )
{
	var str = readCookie("hero_banners");
	
	if( str == "" )
	{
		var banners = [];
	}
	else
	{
		var banners = str.split(',');
	}
	var found = false;
	for ( i in banners )
	{
		if( banners[i] == banner_file_name ) {found = true; break;}
	}
	if( found == false )
	{
	banners.push(banner_file_name);
	str =  banners.join(',');
	}
	writeCookie("hero_banners", str, 8760); //365 day	
}

function nginx_get_tracked_hero_banners()
{
	var str = readCookie("hero_banners");
	
	if( str == "" )
	{
		var banners = [];
	}
	else
	{
		var banners = str.split(',');
	}
	
	
	return banners
}
