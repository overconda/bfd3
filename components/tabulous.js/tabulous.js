/*!
 * strength.js
 * Original author: @aaronlumsden
 * Further changes, comments: @aaronlumsden
 * Licensed under the MIT license
 */
;(function ( $, window, document, undefined ) {

    var pluginName = "tabulous",
        defaults = {
            effect: 'scale'
        };

    function Plugin( element, options ) {
        this.element = element;
        this.$elem = $(this.element);
        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {

        init: function() {

            var links = this.$elem.find('.base-marker');
            var lastchild = this.$elem.find('.route-svg-content > g:last-child').after('<span class="tabulousclear"></span>');

            if (this.options.effect == 'scale') {
             tab_content = this.$elem.find('.route-info-wrapper').not(':first').not(':nth-child(1)').addClass('hidescale');
            } else if (this.options.effect == 'slideLeft') {
                 tab_content = this.$elem.find('.route-info-wrapper').not(':first').not(':nth-child(1)').addClass('hideleft');
            } else if (this.options.effect == 'scaleUp') {
                 tab_content = this.$elem.find('.route-info-wrapper').not(':first').not(':nth-child(1)').addClass('hidescaleup');
            } else if (this.options.effect == 'flip') {
                 tab_content = this.$elem.find('.route-info-wrapper').not(':first').not(':nth-child(1)').addClass('hideflip');
            } else if (this.options.effect == 'slideRight') {
                 tab_content = this.$elem.find('.route-info-wrapper').not(':first').not(':nth-child(1)').addClass('hideright');
            } else if (this.options.effect == 'custom') {
                 tab_content = this.$elem.find('.route-info-wrapper').not(':first').not(':nth-child(1)').addClass('hidecustom');
            }

            var firstdiv = this.$elem.find('.tabs_container');
            var firstdivheight = firstdiv.find('.route-info-wrapper:first').height();

			var alldivs = this.$elem.find('.route-info-wrapper');
			
            alldivs.css({'position': 'absolute'});

            firstdiv.css('height',firstdivheight+'px');

            links.bind('click', {myOptions: this.options}, function(e) {

                var $options = e.data.myOptions;
                var effect = $options.effect;

                var mythis = $(this);
                var thisform = $('.tabs_container');
				
				var baseClass = mythis.attr('class');
				var st = baseClass.split(' ');
				var thislink = st[0];

                firstdiv.addClass('transition');

                thisdivwidth = thisform.find('.route-info-wrapper'+ '#' + thislink).height();
								
                if (effect == 'scale') {
                    alldivs.removeClass('showscale').addClass('make_transist').addClass('hidescale');
                    thisform.find('.route-info-wrapper'+'#'+thislink).addClass('make_transist').addClass('showscale');
                } else if (effect == 'slideLeft') {
                    alldivs.removeClass('showleft').addClass('make_transist').addClass('hideleft');
                    thisform.find('.route-info-wrapper'+'#'+thislink).addClass('make_transist').addClass('showleft');
                } else if (effect == 'scaleUp') {
                    alldivs.removeClass('showscaleup').addClass('make_transist').addClass('hidescaleup');
                    thisform.find('.route-info-wrapper'+'#'+thislink).addClass('make_transist').addClass('showscaleup');
                } else if (effect == 'flip') {
                    alldivs.removeClass('showflip').addClass('make_transist').addClass('hideflip');
                    thisform.find('.route-info-wrapper'+'#'+thislink).addClass('make_transist').addClass('showflip');
                } else if (effect == 'slideRight') {
                    alldivs.removeClass('showright').addClass('make_transist').addClass('hideright');
                    thisform.find('.route-info-wrapper'+'#'+thislink).addClass('make_transist').addClass('showright');
                } else if (effect == 'custom') {
                    alldivs.removeClass('showcustom').addClass('hidecustom');
                    thisform.find('.route-info-wrapper'+'#'+thislink).removeClass('hidecustom').addClass('showcustom');
                }

                firstdiv.css('height',thisdivwidth+'px');

            });
  
        },

        yourOtherFunction: function(el, options) {
            // some logic
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            new Plugin( this, options );
        });
    };

})( jQuery, window, document );