// This file has all panels and functions 
// associated with the dashboard itself.
// Each of these can be used to create a 
// card-style information thing.


// Panel that displays a header.
function panel_head(text){
	$('#dashboard').prepend('<section class="db-head" id="companyName">' + text + '</section>');
}


// Panel that displays a text or value with a subtitle.
function panel_value(text,title){
	$('#dashboard').append('<section class="db-card"><h1>' + title + '</h1><article><p class="big">' + text + '</p><!--<p class="small">in US DOLLARS $</p>--></article></section>');
}


// Panel that displays a list of text-values.
function panel_list(array,title){
	var html = '<section class="db-card"><h1>' + title + '</h1><ul>';
  array.forEach( function (d) {
  	html += '<li>' + d + '</li>';
  } );
  html += '</ul></section>';
  $('#dashboard').append(html);
}


// Panel that displays a companies stock-price.
function panel_stockprice(ticker){
  var html = '<section class="db-card">';
  html += '<h1>Stock Price</h1>';
  html += '<article id="stock">';
  html += '<div class="stockdiv"><p>Value</p><p class="bigtemp" id="stockprice"></p></div>';
  html += '<div class="stockdiv"><p>Change</p><p class="bigtemp" id="stockchgabs">+15.39</p></div>';
  html += '<div class="stockdiv"><p>%</p><p class="bigtemp" id="stockchgrel"></p></div>';
  html += '</article></section>';
  
  
  $('#dashboard').append(html);
  // The following function is available in dashboard.js
  fn_getYahooStockPrice(ticker); 
  // FUNCTION to get the YAHOO FINANCE stockprice for a specific TICKER.
  function fn_getYahooStockPrice(ticker,res_id) {
      console.log('Fetching stock price from Yahoo Finance for ', ticker );
      var url = 'http://query.yahooapis.com/v1/public/yql';
      var symbol = ticker;
      var data = encodeURIComponent("select * from yahoo.finance.quotes where symbol in ('" + symbol + "')");

      $.getJSON(url, 'q=' + data + "&format=json&diagnostics=true&env=http://datatables.org/alltables.env")
          .done(function (data) {
            console.log(data, data.query.results.quote.Change); 
            $('#stockprice').text(data.query.results.quote.LastTradePriceOnly);
            $('#stockchgabs').text(data.query.results.quote.Change);            
            $('#stockchgrel').text(data.query.results.quote.ChangeinPercent);
            // Change the styling as well...
            if( data.query.results.quote.Change < 0.0 ){
            	$('#stockchgabs').removeClass('increase').addClass('decrease');
              $('#stockchgrel').removeClass('increase').addClass('decrease');
            }
            else{
            	$('#stockchgabs').removeClass('decrease').addClass('increase');
              $('#stockchgrel').removeClass('decrease').addClass('increase');
            }
          })
          .fail(function (jqxhr, textStatus, error) {
              var err = textStatus + ", " + error;
              console.log('YAHOO FINANCE request failed: ' + err);
          });
  }
}




// Panel that displays news for a search query
function panel_news_old(query){
	var html = '<section class="db-card"><h1>News</h1><article><ul id="newscontent"></ul></article></section>';
  $('#dashboard').append(html);
  fn_getGoogleNews(query);
  // FUNCTION to get the GOOGLE NEWS for a specific COMPANY NAME
  function fn_getGoogleNews(search_query){
    var url = '//ajax.googleapis.com/ajax/services/search/news?v=1.0&q=' + search_query;
    console.log('Fetching Google News from: ', url);
    $.getJSON(url)
      .done( function (data) {
        var selection = [];
        if( data.responseData.results.length > 0 ){
          // Add the first three news stories.
          for( var i=0; i<Math.min(3,data.responseData.results.length); i++ ){
            //console.log(data.responseData.results[0].publishedDate);
            $('#newscontent').append('<li style="padding:20px 0px;"><strong>' + data.responseData.results[i].title  + '</strong><br/><br/>' + data.responseData.results[i].content + ' <a href="' + data.responseData.results[i].unescapedUrl + '">read more</a></li>');
          }
          // Now also calculate the average sentiment
          var newsData = data.responseData.results.map(function(d){
            return {
              "title":d.titleNoFormatting,
              "content":d.content,
              "date":String(d.publishedDate)
            }; 
          }); // still has html-tags
          getAllSentiment(newsData);
        }
        else{
          $('#newscontent').append('<li>No news found.</li>');
        }
      })
      .fail( function (jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
        console.log('GOOGLE NEWS request failed: ' + err);
      });
  }
}




// Panel that displays weather for a location query
function panel_weather(query){
	// Create the HTML.
  var html = '<section class="db-card"><h1>Current weather</h1><article id="liveweather" style="display: flex;"></article></section>';
  $('#dashboard').append(html);
  // Get the weather using the following function.
  console.log('Fetching the weather from OpenWeatherMap for ', query);
  fn_getWeather(query);
  // FUNCTION to get the WEATHER at a location.
	// 
  function fn_getWeather(location_query){
    var url = '//api.openweathermap.org/data/2.5/weather?units=metric&q=' + location_query;
    $.getJSON(url)
      .done( function (data) {
        $('#liveweather').html('<div class="weatherleft"><p class="bigtemp">' + data.main.temp + '°</p><p class="smalltemp">' + data.main.temp_min + '°</p></div><div  class="weatherright"><p><strong>Humidity: </strong>' + data.main.humidity + '%</p><p><strong>Wind Speed: </strong>' + data.wind.speed + '</p><p><strong>Visibility: </strong>' + data.main.pressure + 'mb</p></div>');
      })
      .fail( function (jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
        console.log('WEATHER request failed: ' + err);
      });
  }
}



// Panel that displays news for a search query
function panel_news(query){
	// Add the panel to the dashboard.
  var html = '<section class="db-card"><h1>News</h1><article><ul id="newscontent"></ul></article></section>';
  $('#dashboard').append(html);
  // Query Google News.
  $.ajax({
  url      : document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=?&q=' + encodeURIComponent("http://news.google.com/?output=rss&q=" + query),
  dataType : 'json',
  success  : function (data) {
    if (data.responseData.feed && data.responseData.feed.entries) {
      var newsData = [];
      console.log('Number of news articles obtained from Google News ', data.responseData.feed.entries.length);
      $.each(data.responseData.feed.entries, function (i, e) {
        //console.log("------------------------");
        //console.log("title      : " + e.title);
        //console.log("content     : " + e.content.replace(/(<([^>]+)>)/ig,""));
        //console.log("contentSnippet: " + e.contentSnippet);
        //console.log("publishedDate: " + e.publishedDate);
        if( i < 3 ){
        	// add news stories to panel.
          $('#newscontent').append('<li style="padding:20px 0px;"><strong>' + e.title  + '</strong><br/><br/>' + e.contentSnippet + '</li>');
        }
        // Add this datapoint to the array.
        newsData.push( {
            "title": e.title,
            "content": e.content.replace(/(<([^>]+)>)/ig,""),
            "date":String(e.publishedDate)
        } );
      });
      getAllSentiment(newsData);
    }
  }// end of success
}); // end of ajax
}