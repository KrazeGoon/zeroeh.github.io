/**
 * nginx-mixpanel-tracker.js
 *
 * Tracking Code for MixPanel
 * ***Some Tracking Codes are written in nginx-audience-targeting.js.
 * Dependency : This file must be include after nginx-audience-targeting.js and nginx-theme.js
 *
 * Author: oneTarek
 */
 

if (typeof mixpanel != "undefined"){
	
	var mp_home_url =  NginxMixPanel.home_url;
	var mp_page_url = document.location.href;
	
	//CALCULATE PAGE TYPE
	var mp_page_type = "";
	if(mp_page_url == mp_home_url ){ mp_page_type = "Home"; }
	else if(mp_page_url.indexOf("/products/") != -1){ mp_page_type = "Products"; }
	else if(mp_page_url.indexOf("/solutions/") != -1){ mp_page_type = "Solutions"; }
	else if(mp_page_url.indexOf("/resources/") != -1){ mp_page_type = "Resources"; }
	else if(mp_page_url.indexOf("/blog/") != -1){ mp_page_type = "Blog"; }
	else { mp_page_type = "Others"; }

	
	( function($){
		$(document).ready(function(){			
			
			$('a[href="#free-trial"]').click(function(e) {
				mixpanel.track("Free Trial Button");
			});
	
			if(window.location.hash == "#free-trial") {
				 mixpanel.track("Free Trial Button");
			}
			
			$('a[href="#contact-us"]').click(function(e) {
				mixpanel.track("Contact Sales Button");
			});
	
			if(window.location.hash == "#contact-us") {
				 mixpanel.track("Contact Sales Button");
			}
			$('a[href="#trial-shirt"]').click(function(e) {
				mixpanel.track("Trial Shirt");
			});
	
			if(window.location.hash == "#trial-shirt") {
				 mixpanel.track("Trial Shirt");
			}	
			
			//FREE TRIAL REQUEST and Contact Sales Request and Partner Credit Modal: free-trial-modal.php , contact-us-modal.php , partner-credit-modal.php
			$("#submit_free_trial, #nginx_contact_sales_pop_submit, #nginx_partner_pop_submit").click(function(){ //this function must be call after form validation in nginx-theme.js.
				var btnid = $(this).attr('id');
				if( btnid == "submit_free_trial" )
				{
					var formclass = '.nginx_free_trial_form';
					var mp_event_name = "Free Trial Request";
				}
				else if( btnid == "nginx_contact_sales_pop_submit" )
				{
					var formclass = '.nginx_contact_sales_pop';
					var mp_event_name = "Contact Sales Request";
				}
				else if( btnid == "nginx_partner_pop_submit" )
				{
					var formclass = '.nginx_partner_sales_pop';
					var mp_event_name = "GCP Partner Credit Request";
				}
				
				var _form = $( formclass );
				if( _form.find( '.errMSG' ).length ){
					return false;
				}				
				
				var p_email = _form.find( 'input[name="Email"]' ).val();
				var fname = _form.find( 'input[name="FirstName"]' ).val();
				var lname = _form.find( 'input[name="LastName"]' ).val();
				var p_name = fname + lname;
				var p_phone = _form.find( 'input[name="Phone"]' ).val();
				var p_company = _form.find( 'input[name="Company"]' ).val();				
				
				mixpanel.people.set({ //REFERENCE : https://mixpanel.com/report/626975/setup/people/
					"$first_name": fname, // only special properties need the $ . https://mixpanel.com/docs/people-analytics/special-properties
					"$last_name" : lname,
					"$email" : p_email,
					"$phone" : p_phone,
					"Company" : p_company
				});
				mixpanel.identify( p_email );
				mixpanel.track( mp_event_name );
				setTimeout( function() {	$(_form).submit();}, 300 );
				
				return false;		
				
			});
			
			//LANDING PAGES landing-page-microservices.php , landing-page-http2.php , landing-page-cloud-native.php , landing-page-amplify.php , landing-page.php , landing-page-docker-networking.php
			$("#nginx_mb1, #nginx_land_mf1_mb1, #nginx_land_mb1, #nginx_micro_mb1").click(function(){ //this function must be call after form validation in nginx-theme.js.

				var mp_event_name = "Content Download";
				var formclass ="";
				if( $(this).attr('id') == "nginx_mb1" ){formclass = '.nginx_http2';}
				else if( $(this).attr('id') == "nginx_land_mf1_mb1" ){formclass = '.mf1_form';}
				else if( $(this).attr('id') == "nginx_land_mb1" ){formclass = '.nginx_landing_form';}
				else if( $(this).attr('id') == "nginx_micro_mb1" ){formclass = '.nginx_micro';}
				
				
				var _form = $( formclass );
				if( _form.find( '.errMSG' ).length ){
					return false;
				}				
				
				var p_email = _form.find( "input[name='Email']" ).val();
				var fname = _form.find( 'input[name="FirstName"]' ).val();
				var lname = _form.find( 'input[name="LastName"]' ).val();
				var p_name = fname + lname;
				var p_phone = _form.find( 'input[name="Phone"]' ).val();
				var p_company = _form.find( 'input[name="Company"]' ).val();				
				
				var post_title = _form.find( 'span[name="post_title"]' ).html();
				//set cookie for home page hero
				if( post_title == "Docker Networking" ){ 
				nginx_track_hero_banner('dockernet-banner');
				}
				//end set cookie 
				
				mixpanel.people.set({ //REFERENCE : https://mixpanel.com/report/626975/setup/people/
					"$first_name": fname, // only special properties need the $ . https://mixpanel.com/docs/people-analytics/special-properties
					"$last_name" : lname,
					"$email" : p_email,
					"$phone" : p_phone,
					"Company" : p_company
				});
				mixpanel.identify( p_email );
				mixpanel.track( mp_event_name, {"Name" : post_title} );
				setTimeout( function() {	$(_form).submit();}, 300 );
				
				return false;		
				
			});

			$("#trial_request_btn").click(function(){ //this function must be call after form validation in nginx-theme.js.

				var mp_event_name = "Free Trial Request";				
				var _form = $( this ).closest( "form" );
				
				if( _form.find( '.errMSG' ).length ){
					return false;
				}				
				
				
				mixpanel.track( mp_event_name );
				setTimeout( function() {	$(_form).submit();}, 300 );
				
				return false;		
				
			});
						
			// Product OSS form http://zeroeh.github.io/products/download-oss/
			
			$('#download_button_prod_oss').click(function(){

				var mp_event_name = "OSS Download";
				var _form = $( this ).parent();
				if( _form.find( '.errMSG' ).length ){
					return false;
				}				

				mixpanel.track( mp_event_name);
				setTimeout( function() {	$(_form).submit();}, 300 );
				
				return false;		
			
			});
			
			
			
			mixpanel.track("Page Loaded", {"Page Type": mp_page_type });
			
			//track when current page is Newsletter Signup Confirmation
			if( mp_page_url.indexOf("/confirmation/") != -1 ){
				mixpanel.track("Newsletter Request");
			}			
			
			
		}); //end document ready
	
	})(jQuery);
}//end if (typeof mixpanel