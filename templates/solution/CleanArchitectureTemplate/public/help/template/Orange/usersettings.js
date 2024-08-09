//Variables to override in settings

var useTOC = true;
var useGLO = true;
var useIDX = true;
var useFilter = true;
var fontFamily = "sans-serif";

var delayLoadIdx = true;
var delayLoadGlo = true;
var useSocial = true;
var maxResults = 15;
var titleColor = "#ffffff";
var backgroundColor = "#509de6";

(function () {
	var rh = window.rh,
		model = rh.model
	
	model.publish(rh.consts('KEY_SEARCH_HIGHLIGHT_COLOR'), "#000000")
	model.publish(rh.consts('KEY_SEARCH_BG_COLOR'), "#ffff00")
	model.publish(rh.consts('DATA_TOC_IMG_DATA_SET'),["template/Orange/Purchase Order.png","template/Orange/Purchase Order.png","template/Orange/Dashboard.png","template/Orange/maintenance2.png","template/Orange/Purchase Order.png","template/Orange/Shipment.png","template/Orange/Dashboard.png"]);
	model.publish(rh.consts('SHOW_SKIN_BCRUMBS'), true);
	model.publish(rh.consts('KEY_SHOW_ACCORDIAN'), false);
	model.publish(rh.consts('KEY_TOOLBAR_SEARCH'), false);
	model.publish(rh.consts('KEY_TOP_NAVIGATION'), false);
	model.publish(rh.consts('KEY_SHOW_TOC'), true);
	model.publish(rh.consts('KEY_SHOW_GLOSSARY'), true);
	model.publish(rh.consts('KEY_SHOW_INDEX'), true);
	rh.model.publish(rh.consts('KEY_DEFAULT_TAB'), "toc");

	rh.model.publish(rh.consts('KEY_SHOW_FULL_SCREEN'), true);
	rh.model.publish(rh.consts('KEY_SHOW_TO_TOP'), true);
	
	model.publish(rh.consts('KEY_DRILL_DOWN'), true);
	model.publish(rh.consts('SHOW_CUSTOM_BUTTON_LABELS'), false);
	model.publish(rh.consts('KEY_GDPR_COMPLIANT'), false);
	model.publish(rh.consts('KEY_IS_RESPONSIVE'), true);
	model.publish(rh.consts('SHOW_PDF_DOWNLOAD'), "");

	model.publish(rh.consts('MINITOC_FROM_LEVEL'), 2)
	model.publish(rh.consts('MINITOC_TO_LEVEL'), 4)
	model.publish(rh.consts('MINITOC_CAPTION'), "")


	var phone_max_width = 1000;
	var tablet_max_width = 1000;
	var screens = {
		ios: {
			user_agent: /(iPad|iPhone|iPod)/g
		}
	};

	screens.phone = {
		media_query: 'screen and (max-width: ' + phone_max_width + 'px)'
	};
	if (phone_max_width === 0) {
		screens.tablet = {
			media_query: 'screen and (max-width: ' + tablet_max_width + 'px)'
		};
	} else {
		screens.tablet = {
			media_query: 'screen and (min-width: ' + (phone_max_width + 1) + 'px) and (max-width: ' +
				tablet_max_width + 'px)'
		};
	}
	if (tablet_max_width === 0) {
		screens.desktop = {
			media_query: 'screen and (min-width: ' + (phone_max_width || 1) + 'px)'
		};
	} else {
		screens.desktop = {
			media_query: 'screen and (min-width: ' + (tablet_max_width + 1) + 'px)'
		};
	}
	model.publish(rh.consts('KEY_SCREEN'), screens);
	model.publish(rh.consts('KEY_DEFAULT_SCREEN'), "phone");
}.call(this));

(function () {
	var mobileMenu, rh, features;

	rh = window.rh;


	//If there are are no panes available
	if (!useTOC && !useGLO && !useIDX) {
		mobileMenu = false;
	} else {
		mobileMenu = true;
	}


	//Number of search results to be loaded at once.

	//Choose whether to use the AND search option in the layout

	/* This layout has single page and so handles search */

	//Social widgets
	}.call(this));