/**
	Singha Beerfinder
 	Copyright 2017 Boon Rawd Brewery Company Limited.
	Author: Boon Rawd Brewery Company Limited.
**/


jQuery(document).ready(function() {

	"use strict";

	/* =============================================
	Page loading transition
	================================================ */
	var timeonLoad = 1300;

	$('#page-loading .across5').addClass("across-fade");

	setTimeout(function(){
		$('#page-loading').fadeOut(300);
	}, 1000);

	setTimeout(function(){
		$('.login-get-across .across5').addClass("across-fade");
	}, timeonLoad + 2500);


	/* =============================================
	Custom Data Attribute
	================================================ */
	var bgImage = ".bg-image";

	$(bgImage).css('background-image', function () {
		var bg = ('url(' + $(this).data("bg-image") + ')');
		return bg;
	});


	/* =============================================
	Change element position on large screen
	================================================ */
	$('#content-wrapper').before('<div id="desktop-header-load"></div>').after('<div id="desktop-footer-load"></div>');
	$('.login-top, .login-method').wrapAll('<div class="loginWrap"><div class="login-container"></div></div>');

	var msgBtnDetach = $('.msg-page .button-sticky .button').detach(),
		unlockBtnDetah = $('.unlock-page .button-sticky .button').detach();

	$(window).on("resize", function() {
		var lgImage = ".large-image";

		if ($(window).width() < 1200) {
			$('.header-desktop-wrapper').remove();
			$('#footer-desktop').remove();
			$('.msg-page .msg-content .button').remove();
			$('.msg-page .button-sticky').prepend(msgBtnDetach);
			$('.unlock-page .button-sticky').prepend(unlockBtnDetah);
			$(lgImage).css('background-image', function () {
				var bg = ('url(' + $(this).data("bg-image") + ')');
				return bg;
			});
		} else {
			$('#desktop-header-load').load("desktop-header.html");
			$('#desktop-footer-load').load("desktop-footer.html");
			$('.msg-page .msg-header').after(msgBtnDetach);
			$('.unlock-page .meta-wrapper').after(unlockBtnDetah);
			$('.msg-slide-inside .button').remove();
			$(lgImage).css('background-image', function () {
				var bg = ('url(' + $(this).data("large-image") + ')');
				return bg;
			});
		}

	}).resize();


	/* =============================================
	Bottom menu setting
	================================================ */
	var menuBottom = $('#menu-bottom li');

	menuBottom.on("click", function() {
		menuBottom.each(function() {
			$(this).removeClass("menu-active");
		});
		$(this).addClass("menu-active");
	});


	/* =============================================
	Modal setting
	================================================ */
	var modal = $('.modal'),
		modalContent = $('.modal-content'),
		modalOpen = $('.modal-open'),
		modalClose = $('.modal-close');

	modalOpen.on("click", function(event){
		event.preventDefault();
		modal.show();
	});

	modalClose.on("click", function(event){
		event.preventDefault();
		modal.hide();
	});

	modal.on("click", function(){
		modal.hide();
	});

	modalContent.on("click", function(event){
		event.stopPropagation();
	});


	/* =============================================
	Modal terms and condition setting
	================================================ */
	$(window).on("resize", function() {
		var windowHeight = $(window).height(),
			termBtnHeight = $('.modal-terms .button a').outerHeight(),
			termOffset = termBtnHeight + parseInt(40)
		$('.modal-content').outerHeight(windowHeight - 30);
		$('.modal-terms-box').outerHeight(windowHeight - termOffset);
	}).resize();


	/* =============================================
	Modal quiz fixed
	================================================ */
	var modalQuiz = $('.quiz-bg');

	modalQuiz.on("click", function(event){
		event.stopPropagation();
	});

	$(window).on("resize", function() {
		var modalQuizHeight = $('.modal-quiz .modal-content').height();

		if ($(window).width() < 1200) {
			$('.quiz-wrapper').css('height','auto');
		} else {
			$('.quiz-wrapper').css('height', modalQuizHeight);
		}
	}).resize();


	/* =============================================
	Profile route modal fixed
	================================================ */
	var ua = window.navigator.userAgent,
		msie = ua.indexOf("MSIE "),
		profileRouteModal = $('.profile-routes-modal .route-svg-content');

	if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))
	{
		setTimeout(function(){
			profileRouteModal.addClass("route-finished");
		}, 1200);
	}


	/* =============================================
	Quiz progress bar and number setting
	================================================ */
	var quizProgress = $('.quiz-progress'),
		progressBar = $('.progress-bar');

	$('.base-content .modal-open').on( "click", function() {
		var quizProgressWidth = quizProgress.width();

		progressBar.animate({
			width: quizProgressWidth
		}, 7000, function() {
			window.location = "notify-wrong-answer.html";
		});
	});

	$('.correct a').on( "click", function(e) {
		e.preventDefault();

		var changeNum = $('.your-quizzes > span').attr("data-number"),
			increaseNum = parseInt(changeNum) + parseInt(1),
			yourQuiz = $('.your-quizzes > span'),
			//yourQuizW = yourQuiz.width(),
			//yourQuizWDivide = parseInt(yourQuizW) / parseInt(2.5),
			quizAmount = $('.amount-num > span').attr("data-number");

		progressBar.stop().clearQueue().removeAttr('style');
		yourQuiz.removeClass("numSlideIn delay1 delay2 delay3 delay4 delay5").addClass("numSlideOut");

		setTimeout(function(){
			if (changeNum >= 9) {
				yourQuiz.css("left", - 5);
			}
			yourQuiz.removeClass("numSlideOut").addClass("numSlideIn");
			yourQuiz.attr("data-number", increaseNum);
		}, 400);
		/*
		setTimeout(function(){
			if (increaseNum >= quizAmount) {
				window.location = "be-guardian.html";
			}
		}, 1000);
		*/
	});


	/* =============================================
	Number animation
	================================================ */
	var numTransition = $('.num-transition');

	numTransition.wrap('<div class="numWrap"></div>');
	numTransition.html(function(i, v){
		return v.replace(/(\d)/g, '<span>$1</span>');
	});

	function numberAnimate() {
		var number = numTransition.find("span");

		number.each(function() {
			var numText = $(this).text(),
				numIndex = Math.floor((Math.random() * 5) + 1);

			$(this).attr("data-number", numText);
			$(this).attr('class','numAnimate numSlideIn delay' + numIndex);
		});
	}

	setTimeout(function(){
		numberAnimate();
	}, timeonLoad - 100);


	/* =============================================
	Fixed Route svg width on fixed container
	================================================ */
	$(window).on("resize", function() {
		setTimeout(function(){
			var routeSvgContainerWidth = $('.route-svg-container.parent-fixed').width(),
				routeSvgContent = $('.parent-fixed .route-svg-content');
			routeSvgContent.width(routeSvgContainerWidth);
		}, 400);
	});


	/* =============================================
	Route transition settings
	================================================ */
	$('.route-transition .base-marker').on("click", function() {
		$('.route-transition .base-marker').each(function() {
			$(this).removeClass("base-active")
		});
		$(this).addClass("base-active baseClick");

		var groupActive = $(".group-active").clone();
		var groupUnActive = $(".group-unactive:first").clone();

		$('.group-active').each(function() {
			$(this).replaceWith(groupUnActive);
		});
		$(this).find(".group-unactive").replaceWith(groupActive);
    });


	/* =============================================
	Notify quiz description height setting
	================================================ */
	$(window).on("resize", function() {
		var notifyPageHeight = $('.full-page-wrapper').outerHeight(),
			baseHeaderHeight = $('.base-header').outerHeight(),
			buttonStickyHeight = $('.button-sticky').outerHeight(),
			quizHeightOffset = parseInt(baseHeaderHeight) + parseInt(buttonStickyHeight);

		$('.notify-quiz-desc').height(notifyPageHeight - quizHeightOffset);
	}).resize();


	/* =============================================
	Route favorite button settings
	================================================ */
	$('.route-fav').on("click", function() {
		$(this).toggleClass('noFav addedFav');
	});


	/* =============================================
	Home news single body settings
	================================================ */
	$(window).on("resize", function() {
		var windowHeight = $(window).height(),
			newsWrapHeight = windowHeight - 64,
			authorHeight = $('.home-news-author').outerHeight();

		$('.home-news-body').css('min-height', newsWrapHeight - authorHeight);
	}).resize();


	/* =============================================
	MSG message slide settings
	================================================ */
	$('.msg-list').wrap('<div class="msg-wrapper"></div>').before('<div class="main-close"><span></span><span></span></div>').after('<div class="msg-slide-wrap"></div>');
	$('.msg-list').wrap('<div class="msg-list-wrap"></div>');
	$('.msg-slide-wrap').load( "msg-message-slide.html" );

	var msgLink = $('.msg-title a'),
		msgDirection = msgLink.attr('href');

	function msgOpen() {
		window.location = msgDirection;
	}

	$(window).on("resize", function() {
		if ($(window).width() < 768) {
			msgLink.on("click", function(e){
				e.preventDefault();
				$('body').on("click", ".msg-title a", msgOpen);
			});
		} else {
			msgLink.on("click", function(e){
				e.preventDefault();
				$('body').off("click", ".msg-title a", msgOpen);
				$('body').addClass('msgOpen');
			});
			$( ".msg-wrapper .main-close" ).on("click", function(){
				$('body').removeClass('msgOpen');
			});
		}
	}).resize();


	/* =============================================
	Slide menu setting
	================================================ */
	var $menu = $("#slide-menu").mmenu({
		offCanvas: {
			pageSelector: "#container-wrapper",
			position: "right"
		},
		extensions: [ "theme-dark","fx-menu-slide","shadow-page"]
	}, {
		classNames: {
            selected: "slide-menu-active"
		}
	});

	var $burger = $("#burger"),
		$menuTop = $("#menu-top"),
		wrapOffsetTop = $("#content-wrapper.offset-top"),
		eleTransparent = $(".element-transparent"),
		API = $menu.data( "mmenu" );

	$('#burger span:nth-child(2)').on( "click", function() {
		API.open();
	});

	$('#burger span:first-child').on( "click", function() {
		API.close();
	});

	API.bind( "open:finish", function() {
		$burger.addClass( "burger-close" );
		$menuTop.addClass( "move-top" );
		wrapOffsetTop.addClass("no-offset");
		eleTransparent.addClass("add-transparent");

		$('#slide-menu .mm-panel ul').append('<span class="notify-bg"></span>');

		$(window).on("resize", function() {
			var slideMenuHeight = $('#slide-menu').height(),
				menuList = $('#slide-menu .mm-panel ul'),
				menuListHeight = menuList.height();

			$('.notify-inset, .notify-bg').fadeIn();
			$('.notify-inset').slimScroll({
				distance: '3px',
				height: slideMenuHeight - menuListHeight - 50,
				touchScrollStep : 100
			});
			$('.notify-bg').height(slideMenuHeight - menuListHeight);
		}).resize();
	});

	API.bind( "close:finish", function() {
		$burger.removeClass( "burger-close" );
		$menuTop.removeClass( "move-top" );
		wrapOffsetTop.removeClass("no-offset");
		eleTransparent.removeClass("add-transparent");
		$('.notify-inset').hide();
		$('.notify-bg').remove();
	});

	var notifying = $('.notifying').detach();
	$('#slide-menu .mm-panel ul').after('<div class="menu-notify"></div>');
	$('.menu-notify').append(notifying);


	/* =============================================
	Input auto focus
	================================================ */
	$('.profile-edit form input[name="Name"]').focus();
	$('input.auto-focus').focus();

	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		var mobileInput = $('.profile-edit input');
		mobileInput.addClass("mobileInput");
		$('.profile-edit form input[name=Name]').addClass("autoFocus");
	}

	$('.mobileInput').on("click", function() {
		$('.mobileInput').each(function() {
			$(this).removeClass("autoFocus");
		});

		$(this).blur(function(){
			$(this).addClass("autoFocus");
		});
	});


	/* =============================================
	Change content wrapper position on desktop
	================================================ */
	var fullpageContent = $('.full-page #content-wrapper').detach(),
		profileMsg = $('.profile-msg').detach(),
		profileEdit = $('.profile-edit-btn').detach(),
		pointAct = $('.point-act-wrap').detach();

	$(window).on("resize", function() {
		if ($(window).width() < 1200) {
			$('#menu-bottom').after(fullpageContent);
			$('.profile #content-wrapper').prepend(profileMsg, profileEdit);
			$('.mins-stat').after(pointAct);
		} else {
			$('#desktop-header-load').after(fullpageContent);
			$('.profile-group1').prepend(profileMsg, profileEdit);
			$('.profile-main-section').after(pointAct);
			$('.profile-edit-wrapper').prepend(profileEdit);
		}
	}).resize();


	/* =============================================
	Add fixed elements after mmenu loaded
	================================================ */
	//$('body').prepend('<div id="page-move"></div>');
	//$('body').prepend('<div id="disable-devices"><div class="vertical-wrap"><div class="large-devices"><img src="images/svg/tablet.svg" alt=""/>not yet available<span>on this device</span></div><div class="rotate-device"><img src="images/svg/rotate-device.svg" alt=""/>Rotate your phone<span>for best experience with Singha Beerfinder</span></div></div></div>');


	/* =============================================
	SlimScroll setting
	================================================ */
	$(window).on("resize", function() {
		$('.custom-scroll').slimScroll({
			distance: '3px',
			height: 'auto',
			touchScrollStep : 100
		});
	}).resize();

	$('.route-box .modal-open').on( "click", function() {
		$(window).on("resize", function() {
			var pfRouteModalHeight = $('.profile-routes-modal .modal-content').height(),
				routeModalTopHeight = $('.route-modal-heading').outerHeight(),
				modalInnerHeight = pfRouteModalHeight - routeModalTopHeight;

			$('.profile-modal-scroll').slimScroll({
				distance: '3px',
				height: modalInnerHeight,
				touchScrollStep : 100
			});
		}).resize();
	});


	/* =============================================
	OWL carousel setting
	================================================ */
	$(".owl-carousel.home-carousel").owlCarousel({
		items: 1,
		loop: true,
		autoplay: true,
		autoplayTimeout: 7000
	});

	$(".owl-carousel.base-gallery").owlCarousel({
		loop: true,
		autoplay: true,
		dots: false,
		margin: 15,
		autoplayTimeout: 7000,
		responsive:{
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

	$(window).on("resize", function() {
		var windowHeight = $(window).height();

		$('.home-carousel .carousel-item a').outerHeight(windowHeight);

		setTimeout(function(){
			var galleryItemHeight = $('.gallery-item').height();
			$(".owl-carousel.home-carousel").trigger('refresh.owl.carousel');
			$(".owl-carousel.base-gallery").trigger('refresh.owl.carousel');
			$('.base-gallery-wrapper').height(galleryItemHeight);
		}, 400);
	}).resize();




	/* =============================================
	jQuery Isotope setting
	================================================ */
	var rewardItems = $('.reward-item-row');

	rewardItems.imagesLoaded( function(){
		rewardItems.isotope({
			itemSelector : '.reward-item-col',
			transitionDuration: '0.8s'
		});

		$(window).on("resize", function() {
			setTimeout(function(){
				rewardItems.isotope( 'reloadItems' ).isotope();
			}, 500);
		});
	});


	/* =============================================
	Route detail tabs setting
	================================================ */
	$('.route-details-container').tabulous({
		effect: 'custom'
    });

	$('.route-info-wrapper:first-child').addClass("showcustom");


	/* =============================================
	Route animation setting
	================================================ */
	function routeAnimate() {

		var routeSingle = $('.route-svg-single .route-svg-content'),
			routeList = $('.route-svg-list .route-svg-content');

		routeSingle.addClass("svgSingle");
		routeList.addClass("svgList");

		var baseCircle = $('.base-marker').find("circle");
		baseCircle.attr("data-ignore","true");

		var routeCallback = function (routeFinished) {
			routeFinished.el.classList.add('route-finished');
		};

		var routeSvgList = document.getElementsByClassName("svgList");

		for (var i = routeSvgList.length - 1; i >= 0; i--) {
			new Vivus(routeSvgList[i], {
				type: 'sync',
				duration: 80,
				animTimingFunction: Vivus.EASE_OUT,
				onReady: function (routeFit) {
					routeFit.el.setAttribute('width', '100%');
					routeFit.el.setAttribute('height', '100%');
				}
			}, routeCallback);
		}

		var routeSvgSingle = document.getElementsByClassName("svgSingle");

		for (var i = routeSvgSingle.length - 1; i >= 0; i--) {
			new Vivus(routeSvgSingle[i], {
				type: 'sync',
				duration: 80,
				animTimingFunction: Vivus.EASE_OUT,
				onReady: function (routeFit) {
					routeFit.el.setAttribute('width', '100%');
					routeFit.el.setAttribute('height', '100%');
				}
			});
		}

		setTimeout(function(){
			routeSingle.addClass("route-finished");
		}, 900);

		$(window).on("scroll", function(){
			var ua = window.navigator.userAgent,
				msie = ua.indexOf("MSIE "),
				svgRouteContent = $('.route-svg-list .route-svg-content:in-viewport');

			if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))
			{
				setTimeout(function(){
					svgRouteContent.addClass("route-finished");
				}, 1200);
			}
		}).scroll();

	}

	setTimeout(function(){
		routeAnimate();
	}, timeonLoad);


	/* =============================================
	Splash page and on location animation setting
	================================================ */
	window.pinAnimate = function() {
		$('.pin-location').addClass("pinEnable");
		$('.singha-bottle').addClass("bottleAnimate");

		var pinCallback = function (pinNotify) {

			pinNotify.stop();

			setTimeout(function(){
				pinNotify.play(-1);
			}, 300);

			setTimeout(function(){
				pinNotify.reset();
			}, 2300);

		};

		var pinReset = function (pinNotify) {
			pinNotify.reset();
		};

		var pinLocation = document.getElementsByClassName("pin-location");

		for (var i = pinLocation.length - 1; i >= 0; i--) {
			new Vivus(pinLocation[i], {
				type: 'delayed',
				duration: 100,
				animTimingFunction: Vivus.EASE_OUT,
				onReady: function (pinNotify) {
					pinNotify.el.setAttribute('width', '100%');
					pinNotify.el.setAttribute('height', '100%');
				}
			}, pinCallback);
		}

		var timeLoop = setTimeout(function(){
			pinAnimate();
		}, 5000);

		/*
		if($('body').hasClass('clear_pin')) {
			clearTimeout(timeLoop);
			$('.singha-bottle').removeClass("bottleAnimate");
		}
		*/
	}

	window.onLocation = function() {

		var disableLocation = $('.login-front, .unlock-now, .unlock-quiz, .challenge-now, .guardian-quizzes, .quiz-notify, .be-guardian, .extra-points, .thank-for-share, .profile, .msg-page');

		disableLocation.addClass("disable-location");
		//$('body').removeClass("clear_pin");
		$('body').append('<div class="onlocation-section"></div>');
		$('.disable-location .onlocation-section').remove();

		$('.onlocation-section').load('on-location.html', function() {

			var locationNotify = $('#on-location-notify'),
				notifyClose = locationNotify.find('.btn-close'),
				onLocationHeading1 = $('.on-location-box h1 span:first-child'),
				onLocationHeading2 = $('.on-location-box h1 span:last-child'),
				onLocationgroup = $('.on-location-group'),
				onLocationIcon = $('#on-location-icon');

			if(!$('body').hasClass('full-page')) {
				var pinIconsm = $(this).find('#on-location-icon').detach();
				$('#content-wrapper').after(pinIconsm);
			}

			/* ===== Check localStorage ===== */
			if($('body').hasClass('localStorage')) {
				//$('body').addClass("clear_pin");
				locationNotify.hide();
				setTimeout(function(){
					onLocationIcon.addClass("pinShow");
				}, timeonLoad + 300);
				setTimeout(function(){
					onLocationIcon.addClass("pinMove");
				}, timeonLoad + 700);
			}
			/* ===== Check localStorage END ===== */

			setTimeout(function(){
				locationNotify.addClass("zoomInCustom");
				onLocationHeading1.addClass("bounceInLeft").css("opacity", "1");
				onLocationHeading2.addClass("bounceInRight").css("opacity", "1");
				onLocationgroup.addClass("fadeIn").css("opacity", "1");
			}, timeonLoad);

			setTimeout(function(){
				pinAnimate();
			}, timeonLoad + 500);

			notifyClose.on( "click", function(e) {
				e.preventDefault();
				//$('body').addClass("clear_pin");
				locationNotify.removeClass("zoomInCustom");
				locationNotify.addClass("zoomOutCustom");
				onLocationIcon.removeClass("pinRemove");

				setTimeout(function(){
					onLocationIcon.addClass("pinShow");
				}, 300);
				setTimeout(function(){
					onLocationIcon.addClass("pinMove");
				}, 700);
			});

			onLocationIcon.on( "click", function() {
				//$('body').removeClass("clear_pin");
				$(this).removeClass("pinShow pinMove");
				$(this).addClass("pinRemove");
				locationNotify.show();
				locationNotify.removeClass("zoomOutCustom");
				locationNotify.addClass("zoomInCustom");
				pinReset();
				setTimeout(function(){
					pinAnimate();
				}, 500);
			});

			var ua = window.navigator.userAgent,
				msie = ua.indexOf("MSIE "),
				svgPaddingBottom = $('.svg-ms').attr("data-svg-bottom");

			if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))
			{
				$('.svg-ms').css('padding-bottom', svgPaddingBottom + '%').height(1);
			}

			$('.on-location-multiple .button:nth-child(odd)').addClass("fadeInLeft");
			$('.on-location-multiple .button:nth-child(even)').addClass("fadeInRight");
			$('.on-location-multiple .button.btn-close').removeClass("fadeInLeft fadeInRight");

		});
	}

	window.outLocation = function() {
		//$('body').addClass("clear_pin");
		$('#on-location-notify').removeClass("zoomInCustom");
		$('#on-location-notify').addClass("zoomOutCustom");
		$('#on-location-icon').removeClass("pinShow pinMove");
		$('#on-location-icon').addClass("pinRemove");
		setTimeout(function(){
		    $('.onlocation-section, #on-location-icon').remove();
		}, 1000);
	}

	var splashFade = $('.splash-fade'),
		splashLogoTop = $('.login-logo-top'),
		splashLogoBottom = $('.login-logo-bottom');

	setTimeout(function(){
		splashFade.addClass("fadeIn").css("opacity", "1");
		splashLogoTop.addClass("fadeInDown").css("opacity", "1");
		splashLogoBottom.addClass("fadeInUp").css("opacity", "1");
	}, timeonLoad);

	/*
	setTimeout(function(){
		onLocation();
	}, timeonLoad + 1000);
	*/


	/* =============================================
	Fixed svg dimensions on IE
	================================================ */
	$('.svg-ms').each(function() {
		var ua = window.navigator.userAgent,
			msie = ua.indexOf("MSIE "),
			svgPaddingBottom = $(this).attr("data-svg-bottom");

		if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))
		{
			$(this).css('padding-bottom', svgPaddingBottom + '%').height(1);
		}
	});

});

//window.onload = function() {};
window.onunload = function() {};
