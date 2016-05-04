/**
 * nginx-audience-targeting.js
 *
 * Audience-targeting JS customizations for Nginx theme. "Localized" vars
 * are available in nginxAudienceTargetingVars object.
 */
(function($) {

	var nginxAudienceTargeting = {

		/**
		 * Number of visits for this user.
		 *
		 * Use getCurrentVisitCount() to access this value rather than calling
		 * directly. Should only be set in incrementVisitCount().
		 */
		_visitCount: undefined,

		/**
		 * Audience group for current user.
		 *
		 * Use getCurrentAudience() to access this value rather than calling
		 * directly. Should only be set in incrementVisitCount().
		 */
		_audience: undefined,

		/**
		 * Sets the current visit count based on cookie.
		 *
		 * This should only be called once per page view, but
		 * will not increment _visitCount if called again.
		 *
		 * @returns {Number} Incremented value (the current visit count)
		 */
		incrementVisitCount: function() {

            var current_url = window.location.href;
            var home_url = window.location.protocol + "//" + window.location.host + "/";
            /**
             *  Current URL checking with home URL
             * */
            if(current_url == home_url){
                var prevCount = $.cookie('_nx_visits'),
                    newCount;

                // If _visitCount has already been set for this request,
                // just return it to avoid re-running this.
                if (undefined != nginxAudienceTargeting._visitCount) {
                    return nginxAudienceTargeting._visitCount;
                }

                // If no previous visits, set the cookie to 1.
                if (!prevCount) {
                    newCount = 1;
                } else {
                    // Otherwise get incremented value.
                    newCount = parseInt(prevCount, 10) + 1;
                }

                // Set/update cookie
                $.cookie('_nx_visits', newCount, {
                    expires: 30,
                    path: '/'
                });

                // Set our visit count property.
                // (it shouldn't be set anywhere else but here)
                nginxAudienceTargeting._visitCount = newCount;
            }


			// Return the new value.
			return newCount;
		},

		/**
		 * The number of the current visit for this user.
		 *
		 */
		getCurrentVisitCount: function() {
			// If _visitCount hasn't been set, we know we need to increment the cookie
			// value. Otherwise we know it's already been set for this call and we can
			// return it.
			if (!nginxAudienceTargeting._visitCount) {
				nginxAudienceTargeting.incrementVisitCount();
			}
			return nginxAudienceTargeting._visitCount;
		},

		/**
		 * The "audience" group of the current based on current visit number.
		 */
		getCurrentAudience: function() {
			// If _audience hasn't been set, we know we need to set it. Otherwise we know
			// we can just return it.
			if (!nginxAudienceTargeting._audience) {
				nginxAudienceTargeting.setCurrentAudience();
			}
			return nginxAudienceTargeting._audience;
		},

		/**
		 * Set the current "audience" group based on visit number.
		 *
		 * @return {String}
		 */
		setCurrentAudience: function() {
			// We only set this once.
			if (!nginxAudienceTargeting._audience) {
				nginxAudienceTargeting._audience = nginxAudienceTargeting.audienceByVisits(
					nginxAudienceTargeting.getCurrentVisitCount()
				);
			}
			return nginxAudienceTargeting._audience;
		},

		/**
		 * Get the "audience" key for a number of visits.
		 *
		 * @param {Number} visits
		 * @returns {Number}
		 */
		audienceByVisits: function(visits) {

			visits = parseInt(visits, 10);

			if (visits <= 3 ) {
				return 'newbie';
			} else if (visits <= 10 ) {
				return 'repeat';
			}
			return 'expert';
		},

		/**
		 * Update audience class on body tag.
		 *
		 * This needs to happen asap, so it gets its own method. If other
		 * changes to the DOM end up being needed, do them in a separate
		 * method (which may need to go in document.ready()).
		 */
		updateBodyClassForCurrentAudience: function() {

			// @see functions.php/nginx_theme_body_classes()
			var defaultClass = 'audience-group-none',
				audience = nginxAudienceTargeting.getCurrentAudience();

			switch(audience) {
				case 'newbie':
				case 'repeat':
				case 'expert':
					$('body').removeClass(defaultClass).addClass('audience-group-'+audience);
					break;
				default:
					// no default action required ATM.
					break;
			}
		},

		/**
		 * Apply misc DOM updates based on audience.
		 *
		 * This needs to run after the DOM is loaded, so use document.ready().
		 */
		updateDomForCurrentAudience: function() {
			var audience = nginxAudienceTargeting.getCurrentAudience();

			// Manually calling each of these (rather than dynamically) to avoid
			// potential errors if audience groups are added or removed.
			// -----------------------------------------------------------------
			// Also, these methods are intended to accommodate arbitrary variations
			// between groups as requirements change. So, code that's repetitive
			// is expected at this point.
			switch(audience) {
				case 'newbie':
					nginxAudienceTargeting._updateDomForAudienceNewbie();
					break;
				case 'repeat':
					nginxAudienceTargeting._updateDomForAudienceRepeat();
					break;
				case 'expert':
					nginxAudienceTargeting._updateDomForAudienceExpert();
					break;
			}
		},

		/**
		 * Generate an img node.
		 *
		 * @param {String} src
		 * @param {String} alt
		 * @param {String} title
		 * @returns {Element|null}
		 */
		generateImgTag: function(src, alt, title) {
			if (src) {
				var img     = document.createElement('img');
				img.src     = src;
				img.alt     = (alt) ? alt : '';
				img.title   = (title) ? title : '';
				console.log('returning img:', img);
				return img;
			}
			return null;
		},

		/**
		 * DOM updates for "newbie" audience group.
		 *
		 * @see updateDomForCurrentAudience()
		 */
		_updateDomForAudienceNewbie: function() {

			// Show the bg image, if there is one.
			var bgImgDiv = document.querySelector('.for-audience-group-newbie .athp-audience-banner');
			if (bgImgDiv) {
				// Create an element for the actual img tag.
				var img = nginxAudienceTargeting.generateImgTag(
					bgImgDiv.getAttribute('data-athp-banner-src'), '', ''
				);
				// If that worked, append it to the div that defined it.
				if (img) {
					console.log('appending:', img);
					console.log('to bgImgDiv:', bgImgDiv);
					bgImgDiv.appendChild(img);
				}
			}
		},

		/**
		 * DOM updates for "repeat" audience group.
		 *
		 * @see updateDomForCurrentAudience()
		 */
		_updateDomForAudienceRepeat: function() {

			// Show the bg image, if there is one.
			var bgImgDiv = document.querySelector('.for-audience-group-repeat .athp-audience-banner');
			if (bgImgDiv) {
				// Create an element for the actual img tag.
				var img = nginxAudienceTargeting.generateImgTag(
					bgImgDiv.getAttribute('data-athp-banner-src'), '', ''
				);
				// If that worked, append it to the div that defined it.
				if (img) {
					console.log('appending:', img);
					console.log('to bgImgDiv:', bgImgDiv);
					bgImgDiv.appendChild(img);
				}
			}
		},

		/**
		 * DOM updates for "expert" audience group.
		 *
		 * @see updateDomForCurrentAudience()
		 */
		_updateDomForAudienceExpert: function() {

			// Show the bg image, if there is one.
			var bgImgDiv = document.querySelector('.for-audience-group-expert .athp-audience-banner');
			if (bgImgDiv) {
				// Create an element for the actual img tag.
				var img = nginxAudienceTargeting.generateImgTag(
					bgImgDiv.getAttribute('data-athp-banner-src'), '', ''
				);
				// If that worked, append it to the div that defined it.
				if (img) {
					console.log('appending:', img);
					console.log('to bgImgDiv:', bgImgDiv);
					bgImgDiv.appendChild(img);
				}
			}
		},

	}; // ends nginxAudienceTargeting

	// Get/set visit and audience settings. (don't wait for document.ready())
	nginxAudienceTargeting.incrementVisitCount();
	nginxAudienceTargeting.updateBodyClassForCurrentAudience();

	$(document).ready(function() {

		// Apply our DOM updates based on audience.
		nginxAudienceTargeting.updateDomForCurrentAudience();

	});
        
        
        // Form validation and MixPanel Tracking
        $(document).ready(function() {
            
            function mf3() {
                var _form = $( '.mf3_form' );
                _form.find( '#mb3' ).click( function( e ){
                    e.preventDefault();
                    var is_valid = true;
                    var is_valid_email = true;
                    var target = '';
                    var distance = '';
                    
                    $( '.errMSG' ).remove();
                    
                    if( _form.find( '.mf3_form_fname' ).val() == '' ) {
                        is_valid = false;
                        target = _form.find( '.mf3_form_fname' );
                    }else if( _form.find( '.mf3_form_lname' ).val() == '' ) {
                        is_valid = false;
                        target = _form.find( '.mf3_form_lname' );
                    }else if( _form.find( '.mf3_form_email' ).val() == '' ) {
                        is_valid = false;
                        target = _form.find( '.mf3_form_email' );
                    }else if( ! isEmail( _form.find( '.mf3_form_email' ).val() ) ) {
                        is_valid = false;
                        is_valid_email = false;
                        target = _form.find( '.mf3_form_email' );
                    }else if( _form.find( '.mf3_form_company' ).val() == '' ) {
                        is_valid = false;
                        target = _form.find( '.mf3_form_company' );
                    }else if( _form.find( '.mf3_form_phone' ).val() == '' ) {
                        is_valid = false;
                        target = _form.find( '.mf3_form_phone' );
                    }
                    
                    if( ! is_valid_email ) {
                        var errMSG = '<div class="errMSG" style="background: #fff; color: #333; font-size: 12px; padding: 0px 8px 8px; position: absolute; left: 10px; top: TOP"><div style="width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 8px solid #fff; position: relative; top: -8px"></div>Please provide a correct email address.</div>';
                    }else{
                        var errMSG = '<div class="errMSG" style="background: #fff; color: #333; font-size: 12px; padding: 0px 8px 8px; position: absolute; left: 10px; top: TOP"><div style="width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 8px solid #fff; position: relative; top: -8px"></div>This field is required.</div>';
                    }
                    
                    if( ! is_valid ) {
                        distance = target.offset().top - target.parent().offset().top - target.parent().scrollTop() + 40;
                        errMSG = errMSG.replace( 'TOP', distance + 'px' );
                        target.after( errMSG );
                        return false;
                    }
					
					if (typeof mixpanel != "undefined"){//check : is mixpanel exists
						var marketo_form_id = _form.find( "input[name='formid']").val();
						var p_email = _form.find( 'input[name="Email"]' ).val();
						var fname = _form.find( 'input[name="FirstName"]' ).val();
						var lname = _form.find( 'input[name="LastName"]' ).val();
						var p_name = fname + lname;
						var p_phone = _form.find( 'input[name="Phone"]' ).val();
						var p_company = _form.find( 'input[name="Company"]' ).val();
						var post_title = _form.find( 'span[name="post_title"]' ).html();
						var post_type = _form.find( 'span[name="post_type"]' ).html();
						
						var mp_event_name = "";
						if( post_type == 'nx_webinars' ){ mp_event_name = "Webinar Registration"; }
						else if( post_type == 'nx_info' ){ mp_event_name = "Content Download"; }
						
						if( mp_event_name !="" ){
							mixpanel.people.set({ //REFERENCE : https://mixpanel.com/report/626975/setup/people/
								"$first_name": fname, // only special properties need the $ . https://mixpanel.com/docs/people-analytics/special-properties
								"$last_name" : lname,
								"$email" : p_email,
								"$phone" : p_phone,
								"Company" : p_company
							});
							mixpanel.identify( p_email );
							mixpanel.track( mp_event_name, {"Name" : post_title} );
							
							setTimeout( function() {	$('#mf3').submit();}, 300 );
						
							return false;
						}
						else
						{
							$('#mf3').submit();
							return true;
						}
					}
					else
					{
                   		$('#mf3').submit();
						return true;
					}
                    
                    
                } );
                
                _form.find( 'input' ).keyup( function() {
                    $( '.errMSG' ).remove();
                } );
            }
            
            function isEmail( email ) {
                var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                return regex.test( email );
            }
            
            mf3();
            
        });
        
        

})(jQuery);
