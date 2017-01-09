jQuery(document).ready(function($){
	/*******************
		color swatch
	********************/
	//convert rgba color to hex color
	$.cssHooks.backgroundColor = {
	    get: function(elem) {
	        if (elem.currentStyle)
	            var bg = elem.currentStyle["background-color"];
	        else if (window.getComputedStyle)
	            var bg = document.defaultView.getComputedStyle(elem,
	                null).getPropertyValue("background-color");
	        if (bg.search("rgb") == -1)
	            return bg;
	        else {
	            bg = bg.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	            function hex(x) {
	                return ("0" + parseInt(x).toString(16)).slice(-2);
	            }
	            return "#" + hex(bg[1]) + hex(bg[2]) + hex(bg[3]);
	        }
	    }
	}
	//set a label for each color swatch
	$('.cd-color-swatch').each(function(){
		var actual = $(this);
		$('<b>'+actual.css("background-color")+'</b>').insertAfter(actual);
	});

	/*******************
		buttons
	********************/
	var buttonsWrapper = $('#buttons .cd-box'),
		buttonsHtml = buttonsWrapper.html(),
		containerHtml = $('<div class="cd-box"></div>').insertAfter(buttonsWrapper),
		buttonsHtmlText = buttonsHtml.split('</button>');

	$.map(buttonsHtmlText, function(value){
		if(value.indexOf('button') >= 0 ) {
			var splitText = value.split('class="'),
				block1 = splitText[0]+'class="';
				block2 = splitText[1].split('"');
				
			var wrapperElement = $('<p></p>').text(block1),
				spanElement = $('<span></span>').text(block2[0]);
			spanElement.appendTo(wrapperElement);
			wrapperElement.appendTo(containerHtml);
			wrapperElement.append('"'+block2[1]+'&lt;/button&gt;');
		}
	});

	/*******************
		typography
	********************/

	var type_elements = $('#typography .cd-box').children().toArray();
	var dict = [];

	type_elements.forEach(function(element) {
		var last = dict.push({
    		element:		$(element),
    		description: 	$(element).children('span').eq(0)
		});
		setTypography(dict[last-1].element, dict[last-1].description);
	}, this);
	
	$(window).on('resize', function(){
		dict.forEach(function(element) {
			setTypography(element.element, element.description);
		}, this);
	});

	function setTypography(element, textElement) {
		var fontSize = Math.round(element.css('font-size').replace('px',''))+'px',
			fontFamily = (element.css('font-family').split(','))[0].replace(/\'/g, '').replace(/\"/g, ''),
			fontWeight = element.css('font-weight');
		textElement.text(fontWeight + ' '+ fontFamily+' '+fontSize );
	}

	/*******************
		main  navigation
	********************/
	var contentSections = $('main section');
	contentSections.push($('#layouts').eq(0));
	//open navigation on mobile
	$('.cd-nav-trigger').on('click', function(){
		$('header').toggleClass('nav-is-visible');
	});
	//smooth scroll to the selected section
	$('.main-nav-js-ref a[href^="#"]').on('click', function(event){
        event.preventDefault();
        $('header').removeClass('nav-is-visible');
        var target= $(this.hash),
        	topMargin = target.css('marginTop').replace('px', ''),
        	hedearHeight = $('header').height();
        $('body,html').animate({'scrollTop': parseInt(target.offset().top - hedearHeight - topMargin )}, 200); 
    });
    //update selected navigation element
    $(window).on('scroll', function(){
    	updateNavigation();
		updateHeaderOpacity();
    });
	function updateHeaderOpacity() {
		var actual = $('#top'),
			actualHeight = actual.height(),
			topMargin = actual.css('marginTop').replace('px', '');

		if ( ( parseInt(actual.offset().top +  actualHeight - topMargin - actualHeight * .5 )  < $(window).scrollTop() +1 ) ) {
				$('header').css('opacity', 1);
			} else {
				$('header').css('opacity', .6);
			}
	}

    function updateNavigation() {
		contentSections.each(function(){
			var actual = $(this),
				actualHeight = actual.height(),
				topMargin = actual.css('marginTop').replace('px', ''),
				actualAnchor = $('#main-nav').find('a[href="#'+actual.attr('id')+'"]');

			if ( ( parseInt(actual.offset().top - $('#main-nav').height() - topMargin  ) <= $(window).scrollTop() ) && ( parseInt(actual.offset().top +  actualHeight - topMargin - 200)  > $(window).scrollTop() +1 ) ) {
				actualAnchor.addClass('selected');
			} else {
				actualAnchor.removeClass('selected');
			}
		});
	}
});

/*******************
	fx paralax scrolling 
********************/

	var paralaxElements = $('.fx-paralax');

	$(window).on('scroll', function(){
    	scrollParalax();
    });

	function scrollParalax() {
		paralaxElements.each(function() {
			var actual = $(this),
			actualHeight = actual.height();

			if( parseInt(actual.offset().top - $(window).scrollTop()) < 1 && parseInt( actual.offset().top + actualHeight) > $(window).scrollTop() ){
				var titleBlock = actual.children('.title-block').eq(0);
				var pad = parseInt($(window).scrollTop() - actual.offset().top) * .8;
				console.log( pad );

				actual.css('padding-bottom', pad + "px")
				//titleBlock.css('bottom', parseInt( 10 + bottom + (bottom * .1)) +  "px")
			}
		});
	}




/*******************
	ad aspect ratios
********************/

	var type_elements = $('.ad-text').toArray();
	var dict = [];

	type_elements.forEach(function(element) {
		var last = dict.push({
    		element:		$(element).parent().eq(0),
    		description: 	$(element).find( "span" ).eq(0)  //.children('span').eq(0)
		});
		setAdRatios(dict[last-1].element, dict[last-1].description);
	}, this);
	
	$(window).on('resize', function(){
		dict.forEach(function(element) {
			setAdRatios(element.element, element.description);
		}, this);
	});

	function setAdRatios(element, textElement) {
		var height = element.css('height'),
			width = element.css('width');
		textElement.text('H: '+height + ' x '+ 'W: '+width);
	}