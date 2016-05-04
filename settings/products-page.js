/**
 * products-page.js
 *
 * JS for products page template. "Localized" vars
 * are available in nginxThemeProdspageVars object.
 */
(function($) {

	var prodspage = {

		/**
		 * Products Page: Expand/collapse the content of section 3.
		 *
		 * @param expand Whether to expand (true) or collapse (false) the content.
		 */
		sectionThreeToggleContent: function(expand) {
			var expandedClass = 'prodspage-third-expanded',
				$section = $('.prodspage-third-section');

			$section.stop(true, true);
			if (expand) {
				$section.addClass(expandedClass);
			} else {
				$section.removeClass(expandedClass);
			}
			// Update everyone's position.
			prodspage.repositioningForSectionThree();
		},

		/**
		 * Products Page: Repositioning to accommodate section three expand/collapse.
		 *
		 * Call this on window resizes and when section three is expanded/collapsed.
		 *
		 */
		repositioningForSectionThree: function() {
			var $sectionTitle = $('.prodspage-third-section-title'),
				titleHeight = $sectionTitle.outerHeight();

			// Set top of the expandable content based on the height
			// of the section title.
			var offset = 0 - (titleHeight/2);
			$('.prodspage-third-section-content').css('top', offset + 'px');

			// Set negative bottom margin on section container to accommodate
			// that what was removed from the relatively positioned content.
			$('.prodspage-third-section').css('margin-bottom', offset + 'px');
		}

	};

	$(document).ready(function() {

		// Reposition product page stuff for section three. Do on initial load and on resizes.
		prodspage.repositioningForSectionThree(); // (for initial load)
		var repositionForSectionThree;
		window.onresize = function() {
			clearTimeout(repositionForSectionThree);
			repositionForSectionThree = setTimeout(prodspage.repositioningForSectionThree(), 100);
		};

		// Expand/collapse products page content for section 3.
		$('.prodspage-third-expand-button').on('click', function(e) {
			e.preventDefault();
			prodspage.sectionThreeToggleContent(true);
		});
		$('.prodspage-third-collapse-button').on('click', function(e) {
			e.preventDefault();
			prodspage.sectionThreeToggleContent(false);
		});

		// Limit lines of text on section 5 article titles.
		$('.prodspage-fifth-article-link').each(function(i, el) {
			$clamp(el, {clamp:3});
		});

		// Make video 2 responsive.
		$('.prodspage-video-2-embed-wrapper').fitVids();

	});

})(jQuery);

