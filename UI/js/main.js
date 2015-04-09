$(document).ready(function() {
	var options = {
		itemsperRequest: 12,
		timeOut: 5000
	}

	var cl = new CanvasLoader('canvasLoader');
	var mainContent = $('#mainContent').children('.row');
	var canvasLoader = $('#canvasLoader');
	var didScroll = false;

	var sendData = {
		triggerByScroll: false,
		query: null,
		searchBy: null,
		index: 0 // check the number of further requests by scrolling
	};

	var ajaxData = function(q) {
		$.ajax({
			type: 'get',
			data: q,
			datatype: 'json',
			url: 'http://mysafeinfo.com/api/data?list=englishmonarchs&format=json',
			timeout: options.timeOut
		})
		.done(function(data) {
			cl.hide();
			$.each($.parseJSON(data), function(i, value) {
				if(i < options.itemsperRequest) {
					var card = '<div class="card col-lg-3 col-sm-4 col-xs-6">'
						+ '<img src="http://placehold.it/350x350" class="img-responsive" alt="Responsive image">'
	          + (i+1) + '</div>';
					mainContent.append(card);
				}
			});
		}).fail(function() {
			cl.hide();
			$('#mainContent').append('<div class="alert alert-danger" role="alert">' +
			  '<h3>Oooops! Something went wrong! Please try again later.</h3></div>');
		});
	}

	var fetchData = function(q) {
		if(!q.triggerByScroll) {
			mainContent.empty();
    	canvasLoader.removeClass('wrapper-bottom');
    	canvasLoader.addClass('wrapper');
		} else {
			canvasLoader.addClass('wrapper-bottom');
    	canvasLoader.removeClass('wrapper');
		}
		cl.setDiameter(91);
		cl.show();	
		ajaxData(q);
	}

	var submitForm = function() {
		sendData.triggerByScroll = false;
		var query = $('input[type=text]').val().trim();
		var searchBy = $('input[type=radio]:checked').val().trim();
		if(!query) {

		} else {
			if(!(query === sendData.query && searchBy === sendData.searchBy)) {
				sendData.query = query;
				sendData.searchBy = searchBy;
				fetchData(sendData);
				$(window).scrollTop(0);
			}
		}
	}

	$('input[type=text]').keypress(function(event) {
    if (event.which == 13) {
      event.preventDefault();
      submitForm();
    }
	});
	$('#submitButton').click(function() {
		submitForm();
	});



	$(window).scroll(function() {
	  didScroll = true;
	});

	setInterval(function() {
    if (didScroll) {
    	didScroll = false;
	    if($(window).scrollTop() == $(document).height() - $(window).height()) {
	    	var scrollPosition = $(window).scrollTop();
	    	sendData.triggerByScroll = true;
	    	sendData.index ++;
	    	fetchData(sendData);
	    	$(window).scrollTop(scrollPosition);
	    }
    }
	}, 800);

});

