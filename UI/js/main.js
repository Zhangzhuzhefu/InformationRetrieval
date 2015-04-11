$(document).ready(function() {

  $('input[type=text]').focus();

  var cl = new CanvasLoader('canvasLoader');
  var mainContent = $('#mainContent').children('.row');
  var canvasLoader = $('#canvasLoader');
  var didScroll = false;
  var errMsg; // check whether the error message has appeared
  var noResult;

  var storeData = {
    url: 'http://192.168.1.2:8983/solr/amazon/',
    triggerBy: '',
    query: '',
    searchBy: '',
    start: 0,
    spellStr: '',
    lastQuery: '',
    queryStr: ''
  }

  var filterCards = function() {
    var filterSet = [];
    $('input[type=checkbox]:checked').each(function(i, filter) {
      filterSet.push($(filter).val());
    });
    $('.card').each(function(i, card) {
        if($.inArray($(card).attr('data-category'), filterSet) > -1) {
          $(card).show();
        } else {
          $(card).hide();
        }
    });

    if(!noResult & !errorMsg && $('.card:visible').length === 0) {
        mainContent.append('<div class="clearfix"></div><div id="noResult" class="alert alert-danger" role="alert">'
        + '<h3>No result is found.</h3></div>');
        noResult = $('#noResult');;
    }

    if(noResult && $('.card:visible').length > 0) {
        noResult.remove();
        noResult = null;
    }
  }


  var renderData = function(queryData, spellData) {
    cl.hide();
    if(spellData !== undefined) {
      mainContent.append('<div class="col-xs-12"><h4>Did you mean: <u><a id="hintMsg">' + spellData.spellcheck.collations[1].collationQuery + '</a></u></h4></div>');

      $('#hintMsg').click(function() {
        storeData.triggerBy = 'hint';
        storeData.query = $('#hintMsg').text();
        storeData.searchBy = $('input[type=radio]:checked').val();
        $('input[type=text]').val(storeData.query);
        storeData.start = 0;
        if(storeData.searchBy === 'keyword') {
            storeData.queryStr = storeData.url + 'query?q=' + storeData.query;
        } else {
            storeData.queryStr = storeData.url + 'query?q=' + storeData.searchBy + ':' + storeData.query;
        }
        storeData.lastQuery = storeData.queryStr;
        fetchData(storeData);
        $(window).scrollTop(0);
      });
    }

    if(errMsg) {
      errMsg.remove();
      errMsg = null;
    }

    if(noResult) {
        noResult.remove();
        noResult = null;
    }


    if (queryData.response.numFound === 0) {
        if(!noResult) {
             mainContent.append('<div class="clearfix"></div><div id="noResult" class="alert alert-danger" role="alert">'
            + '<h3>No result is found.</h3></div>');
            noResult = $('#noResult');
        }

    } else {
        $.each(queryData.response.docs, function(i, value) {
            var card = '<div data-category="' + value.category + '" class="card col-lg-3 col-sm-4 col-xs-6">'
            + '<div class="imgWrapper"><a target = "_blank" href="' + value.url + '"><img src="' + value.bigImageLink + '" class="img-responsive" alt="Responsive image"></a></div>'
            + '<p id="title">' + value.title + '</p>'
            + '<p id="author">Author: ' + value.author + '</p>'
            + '<p id="price">Price: ' + value.sellingPrice + '</p></div>';
            mainContent.append(card);
          });

        filterCards();
    }
  }

  var errorMsg = function() {
    cl.hide();
    if(!errMsg) {
      mainContent.append('<div class="clearfix"></div><div id="errorMsg" class="alert alert-danger" role="alert">'
        + '<h3>Oooops! Something went wrong! Please try again later.</h3></div>');
      errMsg = $('#errorMsg');
    }
  }

  var fetchData = function(options) {
    if(options.triggerBy === 'submit' ) {
      $('input[type=text]').blur();
      mainContent.empty();
      errMsg = null;
      noResult = null;
      canvasLoader.removeClass('wrapper-bottom');
      canvasLoader.addClass('wrapper');
      cl.setDiameter(91);
      cl.show();

    $.when(sendRequest(options.spellStr), sendRequest(options.queryStr))
      .done(function(d1, d2) {
            d1 = d1[0];
            d2 = d2[0];
            if(d1.spellcheck.correctlySpelled) {
              renderData(d2);
            } else {
              renderData(d2, d1);
            }
          })
      .fail(errorMsg);
      
    } else if(options.triggerBy === 'hint'){
      mainContent.empty();
      errMsg = null;
      noResult = null;
      canvasLoader.removeClass('wrapper-bottom');
      canvasLoader.addClass('wrapper');
      cl.setDiameter(91);
      cl.show();

      sendRequest(options.queryStr)
      .done(function(d) {
              renderData(d)
            })
      .fail(errorMsg);
    } else {
      canvasLoader.addClass('wrapper-bottom');
      canvasLoader.removeClass('wrapper');
      cl.setDiameter(91);
      cl.show();

      sendRequest(options.queryStr)
      .done(function(d) {
          renderData(d);
        }).fail(errorMsg);
    }
  }

  var sendRequest = function(request) {
  console.log(request);
    return $.ajax({
      dataType: 'jsonp',
      jsonp: 'json.wrf',
      type: 'get',
      url: request,
      timeout: 5000
    });
  }


  var submitForm = function() {
    var query = $('input[type=text]').val().trim();
    var searchBy = $('input[type=radio]:checked').val();

    if(query && (errMsg || !(query === storeData.query && searchBy === storeData.searchBy))) {
      storeData.triggerBy = 'submit';
      storeData.query = query;
      storeData.searchBy = searchBy;
      storeData.start = 0;

      storeData.spellStr = storeData.url + 'spell?q=' + storeData.query;
      if(storeData.searchBy === 'keyword') {
        storeData.queryStr = storeData.url + 'query?q=' + storeData.query;
      } else {
        storeData.queryStr = storeData.url + 'query?q=' + storeData.searchBy + ':' + storeData.query;
      }

      storeData.lastQuery = storeData.queryStr;



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

  $('input[type=checkbox]').click(function() {
    filterCards();
  });

  $(window).scroll(function() {
    didScroll = true;
  });

  setInterval(function() {
    if (didScroll) {
      didScroll = false;
      if($(window).scrollTop() == $(document).height() - $(window).height() && storeData.query) {
        var scrollPosition = $(window).scrollTop();
        storeData.triggerBy = 'scroll';
        if(!errMsg) {
          storeData.start = storeData.start + 12;
        }

        storeData.queryStr = storeData.lastQuery + '&start=' + storeData.start;
        fetchData(storeData);
        $(window).scrollTop(scrollPosition);
      }
    }
  }, 800);
});
