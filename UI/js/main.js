$(document).ready(function() {

	var cl = new CanvasLoader('canvasLoader');
	var mainContent = $('#mainContent').children('.row');
	var canvasLoader = $('#canvasLoader');
	var errDiv = $('#errorMsg');
	var didScroll = false;

	var storeData = {
		url: 'http://address:8983/solr/amazon/',
		triggerByScroll: false,
		query: '',
		searchBy: '',
		start: 0,
		spellStr: '',
		queryStr: ''
	}

	var renderData = function(queryData, spellData) {
		cl.hide();
		if(errDiv) {
			errDiv.remove();
		}

		if(spellData !== undefined) {
			mainContent.append('<p>Did you mean:' + spellData.spellcheck.collations[1].collationQuery + '</p>');
		}

		// $.each($.parseJSON(queryData).response.docs, function(i, value) {
		$.each(queryData.response.docs, function(i, value) {
			var card = '<div class="card col-lg-3 col-sm-4 col-xs-6">'
				+ '<img src="http://placehold.it/350x350" class="img-responsive" alt="Responsive image">'
	      + (i+1) + '</div>';
				mainContent.append(card);
		});
	}

	var errorMsg = function() {
		cl.hide();
		$('#mainContent').append('<div id="errorMsg" class="alert alert-danger" role="alert">' +
					  '<h3>Oooops! Something went wrong! Please try again later.</h3></div>');
	}

	var fetchData = function(options) {
		if(!options.triggerByScroll) {

			mainContent.empty();
	  	canvasLoader.removeClass('wrapper-bottom');
	  	canvasLoader.addClass('wrapper');
	  	cl.setDiameter(91);
			cl.show();

	  	$.when(sendRequest(options.spellStr), sendRequest(options.queryStr))
	  	.done(function(d1, d2) {
	  		d1 = spellRight; // delete this when testing 
	  		d2 = result; // delete this when testing 

	  		if(d1.spellcheck.correctlySpelled) {
	  			renderData(d2);
	  		} else {

	  			renderData(d2, d1);
	  		}
	  	})
	  	.fail(errorMsg);

		} else {
	  	canvasLoader.addClass('wrapper-bottom');
	  	canvasLoader.removeClass('wrapper');
	  	cl.setDiameter(91);
			cl.show();

	  	sendRequest(options.queryStr)
	  	.done(function(d) {
				d = result;	// delete this when testing 

	  		renderData(d)
	  	})
	  	.fail(errorMsg);
		}
	}

	var sendRequest = function(request) {
		return $.ajax({
			dataType: 'json',
			url: 'http://mysafeinfo.com/api/data?list=englishmonarchs&format=json',
			timeout: 5000
		});
	}


	var submitForm = function() {

		var query = $('input[type=text]').val().trim();
		var searchBy = $('input[type=radio]:checked').val().trim();
		if(searchBy.indexOf('title') > -1) {
			searchBy = 'title';
		} 
		else {
			searchBy = 'author';
		}

		if(query && !(query === storeData.query && searchBy === storeData.searchBy)) {

			storeData.query = query;
			storeData.searchBy = searchBy;
			storeData.start = 1;

			storeData.spellStr = storeData.url + 'spell?q=' + storeData.query;
			storeData.queryStr = storeData.url + 'query?' + storeData.searchBy + ':q=' + storeData.query + '&start=' + storeData.start;

			fetchData(storeData);

			$(window).scrollTop(0);
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
	    	storeData.triggerByScroll = true;
	    	storeData.start = storeData.start + 12;
	    	storeData.queryStr = storeData.url + 'query?' + storeData.searchBy + ':q=' + storeData.query + '&start=' + storeData.start;
	    	fetchData(storeData);
	    	$(window).scrollTop(scrollPosition);
	    }
    }
	}, 800);




var spellRight = 
{
    "response": {
        "docs": [
            {
                "ASIN": "143800138X"
            }
        ],
        "numFound": 1,
        "start": 0
    },
    "responseHeader": {
        "QTime": 4,
        "status": 0
    },
    "spellcheck": {
        "collations": [],
        "correctlySpelled": true,
        "suggestions": []
    }
};

var spellWrong = 
{
    "response": {
        "docs": [],
        "numFound": 0,
        "start": 0
    },
    "responseHeader": {
        "QTime": 18,
        "status": 0
    },
    "spellcheck": {
        "collations": [
            "collation",
            {
                "collationQuery": "computational financial accounting",
                "hits": 1,
                "misspellingsAndCorrections": [
                    "computationl",
                    "computational",
                    "financial",
                    "financial",
                    "accounting",
                    "accounting"
                ]
            }
        ],
        "correctlySpelled": false,
        "suggestions": [
            "computationl",
            {
                "endOffset": 12,
                "numFound": 1,
                "origFreq": 0,
                "startOffset": 0,
                "suggestion": [
                    {
                        "freq": 1,
                        "word": "computational"
                    }
                ]
            }
        ]
    }
};
 
var result = 
{
  "responseHeader":{
    "status":0,
    "QTime":14,
    "params":{
      "q":"finance"}},
  "response":{"numFound":371,"start":0,"docs":[
      {
        "id":"B002QDDLY6",
        "title":"Fundamentals of Corporate Finance Standard Edition",
        "description":"The best-selling Fundamentals of Corporate Finance (FCF) is written with one strongly held principle®C that corporate finance should be developed and taught in terms of a few integrated, powerful ideas. As such, there are three basic themes that are the ce",
        "author":"Bradford Jordan",
        "eisbn":"9780077388683",
        "binding":"Kindle Edition",
        "releaseDate":"2009-02-24",
        "pageNo":"800",
        "format":"Kindle eBook",
        "smallImageLink":"http://ecx.images-amazon.com/images/I/51gaESouquL._SL75_.jpg",
        "mediumImageLink":"http://ecx.images-amazon.com/images/I/51gaESouquL._SL160_.jpg",
        "bigImageLink":"http://ecx.images-amazon.com/images/I/51gaESouquL.jpg",
        "url":"http://www.amazon.com/Fundamentals-Corporate-Finance-Standard-Edition-ebook/dp/B002QDDLY6%3FSubscriptionId%3DAKIAI4EATQPGGOED4RBQ%26tag%3Di0ad9d-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D165953%26creativeASIN%3DB002QDDLY6",
        "reviewsCount":"53",
        "avStarRating":"4.0 out of 5 stars",
        "lending":" Not Enabled",
        "listPrice":"$233.67",
        "sellingPrice":"$77.40"},
      {
        "id":"B00KB3MO50",
        "title":"The Finance and Funding Directory 2014/15: A comprehensive guide to the best sources of finance and funding",
        "description":"The key to success in raising funding, whether for yourself or on behalf of a client, is identifying the areas within the company where funding options could apply, and then providing a comprehensive solution specifically designed to meet those needs. However, many people are unaware of the various options available, and these days there are several out-of-the-box solutions which also move beyond the traditional finance and funding offerings. The information contained in this Directory provides all the insight and information you require to make a successful application for funding and covers: - Asset Based Lending (ABL), Factoring and Invoice Discounting - Leasing and Asset Finance - Commercial and Corporate Finance - Banking Finance - Property Finance - Trade Finance - Bridging Finance - Equity Funding - Crowd Funding and Business Angels - Mezzanine Finance - Turnaround Funding - Support Organisations - Associations and Professional Bodies The Finance and Funding Directory is your essential guide to the financial resources available in the UK today.",
        "author":"Jonathan Wooller",
        "eisbn":"9780857194251",
        "binding":"Kindle Edition",
        "releaseDate":"2014-05-13",
        "pageNo":"192",
        "format":"Kindle eBook",
        "smallImageLink":"http://ecx.images-amazon.com/images/I/41VcY9yk2SL._SL75_.jpg",
        "mediumImageLink":"http://ecx.images-amazon.com/images/I/41VcY9yk2SL._SL160_.jpg",
        "bigImageLink":"http://ecx.images-amazon.com/images/I/41VcY9yk2SL.jpg",
        "url":"http://www.amazon.com/Finance-Funding-Directory-2014-comprehensive-ebook/dp/B00KB3MO50%3FSubscriptionId%3DAKIAI4EATQPGGOED4RBQ%26tag%3Di0ad9d-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D165953%26creativeASIN%3DB00KB3MO50",
        "reviewsCount":"1",
        "avStarRating":"4.0 out of 5 stars",
        "lending":" Not Enabled",
        "listPrice":"No List Price Available",
        "sellingPrice":"$0.00"},
      {
        "id":"B004XJ6BCK",
        "title":"How To Complain, Save Money (and buy this book for free)",
        "description":"A book about personal finance",
        "author":"Robert Rosenberg",
        "eisbn":"9780956860309",
        "binding":"Kindle Edition",
        "releaseDate":"2011-04-20",
        "pageNo":"54",
        "format":"Kindle eBook",
        "smallImageLink":"http://ecx.images-amazon.com/images/I/41aFJXztsqL._SL75_.jpg",
        "mediumImageLink":"http://ecx.images-amazon.com/images/I/41aFJXztsqL._SL160_.jpg",
        "bigImageLink":"http://ecx.images-amazon.com/images/I/41aFJXztsqL.jpg",
        "url":"http://www.amazon.com/Complain-Save-Money-this-book-ebook/dp/B004XJ6BCK%3FSubscriptionId%3DAKIAI4EATQPGGOED4RBQ%26tag%3Di0ad9d-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D165953%26creativeASIN%3DB004XJ6BCK",
        "reviewsCount":"No reviews available",
        "avStarRating":"No ratings available",
        "lending":" Enabled",
        "listPrice":"No List Price Available",
        "sellingPrice":"$2.99"},
      {
        "id":"B00NAGQ30M",
        "title":"STOCKS: How to trade them and get started quick",
        "description":"The complete books of my finance series.",
        "author":"Mike Valasek",
        "eisbn":"",
        "binding":"Kindle Edition",
        "releaseDate":"2014-09-02",
        "pageNo":"67",
        "format":"Kindle eBook",
        "smallImageLink":"http://ecx.images-amazon.com/images/I/41nj-xSDZOL._SL75_.jpg",
        "mediumImageLink":"http://ecx.images-amazon.com/images/I/41nj-xSDZOL._SL160_.jpg",
        "bigImageLink":"http://ecx.images-amazon.com/images/I/41nj-xSDZOL.jpg",
        "url":"http://www.amazon.com/STOCKS-trade-them-started-quick-ebook/dp/B00NAGQ30M%3FSubscriptionId%3DAKIAI4EATQPGGOED4RBQ%26tag%3Di0ad9d-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D165953%26creativeASIN%3DB00NAGQ30M",
        "reviewsCount":"2",
        "avStarRating":"3.0 out of 5 stars",
        "lending":" Enabled",
        "listPrice":"No List Price Available",
        "sellingPrice":"$9.99"},
      {
        "id":"B008KPMB4K",
        "title":"Corporate Finance For Dummies",
        "description":"Score your highest in corporate finance The math, formulas, and problems associated with corporate finance can be daunting to the uninitiated. Corporate Finance For Dummies introduces you to the practices of determining an operating budget, calculating future cash flow, and scenario analysis in a friendly, un-intimidating way that makes comprehension easy. Corporate Finance For Dummies covers everything you'll encounter in a course on corporate finance, including accounting statements, cash flow, raising and managing capital, choosing investments; managing risk; determining dividends; mergers and acquisitions; and valuation. Serves as an excellent resource to supplement coursework related to corporate finance Gives you the tools and advice you need to understand corporate finance principles and strategies Provides information on the risks and rewards associated with corporate finance and lending With easy-to-understand explanations and examples, Corporate Finance For Dummies is a helpful study guide to accompany your coursework, explaining the tough stuff in a way you can understand.",
        "author":"Michael Taillard",
        "eisbn":"9781118434840",
        "binding":"Kindle Edition",
        "releaseDate":"2012-12-06",
        "pageNo":"360",
        "format":"Kindle eBook",
        "smallImageLink":"http://ecx.images-amazon.com/images/I/51Pqx5a4haL._SL75_.jpg",
        "mediumImageLink":"http://ecx.images-amazon.com/images/I/51Pqx5a4haL._SL160_.jpg",
        "bigImageLink":"http://ecx.images-amazon.com/images/I/51Pqx5a4haL.jpg",
        "url":"http://www.amazon.com/Corporate-Finance-Dummies-Michael-Taillard-ebook/dp/B008KPMB4K%3FSubscriptionId%3DAKIAI4EATQPGGOED4RBQ%26tag%3Di0ad9d-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D165953%26creativeASIN%3DB008KPMB4K",
        "reviewsCount":"26",
        "avStarRating":"4.2 out of 5 stars",
        "lending":" Enabled",
        "listPrice":"$26.99",
        "sellingPrice":"$14.99"},
      {
        "id":"B00KSRTQC8",
        "title":"Investment Management: A Science to Teach or an Art to Learn?",
        "description":"Following the 2007®C09 financial crisis, mainstream finance theory was criticized for failing to forecast the market crash, which resulted in large losses for investors. Has our finance theory, which many consider an idealization that does not take reality into account, failed investors? Do we need to reconsider the theory and how it is taught (and practiced)? This book explores current critiques of mainstream theory and discusses implications for the curricula of finance programs as well as for practitioners. In so doing, the authors integrate a review of the literature supported by conversations with finance professors, asset managers, and other market players.",
        "author":"Frank J. Fabozzi",
        "eisbn":"9781934667743",
        "binding":"Kindle Edition",
        "releaseDate":"2014-05-16",
        "pageNo":"126",
        "format":"Kindle eBook",
        "smallImageLink":"http://ecx.images-amazon.com/images/I/41w6wzLBg2L._SL75_.jpg",
        "mediumImageLink":"http://ecx.images-amazon.com/images/I/41w6wzLBg2L._SL160_.jpg",
        "bigImageLink":"http://ecx.images-amazon.com/images/I/41w6wzLBg2L.jpg",
        "url":"http://www.amazon.com/Investment-Management-Science-Teach-Learn-ebook/dp/B00KSRTQC8%3FSubscriptionId%3DAKIAI4EATQPGGOED4RBQ%26tag%3Di0ad9d-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D165953%26creativeASIN%3DB00KSRTQC8",
        "reviewsCount":"1",
        "avStarRating":"5.0 out of 5 stars",
        "lending":" Enabled",
        "listPrice":"$0.99",
        "sellingPrice":"$0.00"},
      {
        "id":"B000P46RT4",
        "title":"Finance for Non-Financial Managers (Briefcase Books Series)",
        "description":"Financial reports speak their own language, and managers without a strong finance background often find themselves bewildered by what is being said. Finance for NonFinancial Managers helps managers become familiar with essential financial information, showing them how to \"speak the language of numbers\" and implement financial data in their daily business decisions. In addition, it clarifies how and why financial decisions impact business and operational objectives.",
        "author":"Gene Siciliano",
        "eisbn":"9780071425643",
        "binding":"Kindle Edition",
        "releaseDate":"2003-02-22",
        "pageNo":"180",
        "format":"Kindle eBook",
        "smallImageLink":"http://ecx.images-amazon.com/images/I/51phk5XyhPL._SL75_.jpg",
        "mediumImageLink":"http://ecx.images-amazon.com/images/I/51phk5XyhPL._SL160_.jpg",
        "bigImageLink":"http://ecx.images-amazon.com/images/I/51phk5XyhPL.jpg",
        "url":"http://www.amazon.com/Finance-Non-Financial-Managers-Briefcase-Series-ebook/dp/B000P46RT4%3FSubscriptionId%3DAKIAI4EATQPGGOED4RBQ%26tag%3Di0ad9d-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D165953%26creativeASIN%3DB000P46RT4",
        "reviewsCount":"33",
        "avStarRating":"4.4 out of 5 stars",
        "lending":" Not Enabled",
        "listPrice":"$16.95",
        "sellingPrice":"$10.27"},
      {
        "id":"B00ADP756E",
        "title":"Finance",
        "description":"By providing a solid theoretical basis, this book introduces modern finance to readers, including students in science and technology, who already have a good foundation in quantitative skills. It combines the classical, decision-oriented approach and the traditional organization of corporate finance books with a quantitative approach that is particularly well suited to students with backgrounds in engineering and the natural sciences. This combination makes finance much more transparent and accessible than the definition-theorem-proof pattern that is common in mathematics and financial economics. The book's main emphasis is on investments in real assets and the real options attached to them, but it also includes extensive discussion of topics such as portfolio theory, market efficiency, capital structure and derivatives pricing. Finance equips readers as future managers with the financial literacy necessary either to evaluate investment projects themselves or to engage critically with the analysis of financial managers. Supplementary material is available at www.cambridge.org/wijst.",
        "author":"Nico van der Wijst",
        "eisbn":"9781139614689",
        "binding":"Kindle Edition",
        "releaseDate":"2013-01-30",
        "pageNo":"445",
        "format":"Kindle eBook",
        "smallImageLink":"http://ecx.images-amazon.com/images/I/51cudewUlAL._SL75_.jpg",
        "mediumImageLink":"http://ecx.images-amazon.com/images/I/51cudewUlAL._SL160_.jpg",
        "bigImageLink":"http://ecx.images-amazon.com/images/I/51cudewUlAL.jpg",
        "url":"http://www.amazon.com/Finance-Nico-van-Wijst-ebook/dp/B00ADP756E%3FSubscriptionId%3DAKIAI4EATQPGGOED4RBQ%26tag%3Di0ad9d-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D165953%26creativeASIN%3DB00ADP756E",
        "reviewsCount":"1",
        "avStarRating":"5.0 out of 5 stars",
        "lending":" Not Enabled",
        "listPrice":"$56.00",
        "sellingPrice":"$38.99"},
      {
        "id":"B004GNFPES",
        "title":"Corporate Finance Demystified 2/E",
        "description":"The simple way to master corporate finance The math, the formulas, the problem solving . . . does corporate finance make your head spin? You're not alone. It's one of the toughest subjects for business students°™which is why Corporate Finance DeMYSTiFieD is written in a way that makes learning it easier than ever. This self-teaching guide first explains the basic principles of corporate finance, including accounting statements, cash flows, and ratio analysis. Then, you'll learn all the specifics of more advanced practices like estimating future cash flows, scenario analysis, and option valuation. Filled with end-of-chapter quizzes and a final exam, Corporate Finance DeMYSTiFieD teaches you the ins-and-outs of this otherwise confounding subject in no time at all. This fast and easy guide features:  An overview of important concepts, such as time value of money, interest rate conversion, payment composition, and amortization schedules Easy-to-understand descriptions of corporate finance principles and strategies Chapter-ending quizzes and a comprehensive final exam to reinforce what you've learned and pinpoint problem areas Hundreds of updated examples with practical solutions  Simple enough for a beginner, but challenging enough for an advanced student, Corporate Finance DeMYSTiFieD is your shortcut to a working knowledge of this important business topic. ",
        "author":"Troy Adair",
        "eisbn":"9780071760836",
        "binding":"Kindle Edition",
        "releaseDate":"2010-12-14",
        "pageNo":"304",
        "format":"Kindle eBook",
        "smallImageLink":"http://ecx.images-amazon.com/images/I/51lSWW3fkuL._SL75_.jpg",
        "mediumImageLink":"http://ecx.images-amazon.com/images/I/51lSWW3fkuL._SL160_.jpg",
        "bigImageLink":"http://ecx.images-amazon.com/images/I/51lSWW3fkuL.jpg",
        "url":"http://www.amazon.com/Corporate-Finance-Demystified-2-E-ebook/dp/B004GNFPES%3FSubscriptionId%3DAKIAI4EATQPGGOED4RBQ%26tag%3Di0ad9d-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D165953%26creativeASIN%3DB004GNFPES",
        "reviewsCount":"11",
        "avStarRating":"3.2 out of 5 stars",
        "lending":" Not Enabled",
        "listPrice":"$22.00",
        "sellingPrice":"$10.99"},
      {
        "id":"B00CX6UEE6",
        "title":"FINANCE CAPITALISM AND ITS DISCONTENTS",
        "description":"FINANCE CAPITALISM AND ITS DISCONTENTS contains the most important interviews and speeches that Professor Michael Hudson, Distinguished Professor of Economics at the University of Missouri (Kansas City), and president of the Institute for the Study of Long-term Economic Trends (ISLET) has given over the past decade (2003-2012). They span the political spectrum from COUNTERPUNCH.COM and KPFK radio°Øs GUNS AND BUTTER to iTULIP.COM and SANKT GEORGE in Berlin. It also includes his now-famous Rlmini, Italy, speeches that were given at a packed sports arena in early 2012 on the topic of how finance capitalism is pushing the world, starting with Europe, into austerity and neo-feudalism.",
        "author":"Michael Hudson",
        "eisbn":"",
        "binding":"Kindle Edition",
        "releaseDate":"2013-05-20",
        "pageNo":"286",
        "format":"Kindle eBook",
        "smallImageLink":"http://ecx.images-amazon.com/images/I/41sy0kg-dHL._SL75_.jpg",
        "mediumImageLink":"http://ecx.images-amazon.com/images/I/41sy0kg-dHL._SL160_.jpg",
        "bigImageLink":"http://ecx.images-amazon.com/images/I/41sy0kg-dHL.jpg",
        "url":"http://www.amazon.com/FINANCE-CAPITALISM-AND-ITS-DISCONTENTS-ebook/dp/B00CX6UEE6%3FSubscriptionId%3DAKIAI4EATQPGGOED4RBQ%26tag%3Di0ad9d-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D165953%26creativeASIN%3DB00CX6UEE6",
        "reviewsCount":"4",
        "avStarRating":"5.0 out of 5 stars",
        "lending":" Enabled",
        "listPrice":"$19.95",
        "sellingPrice":"$9.99"}]
  }
};




});

