Repository for the JS Files for Data for Leaders.


Code to add to index.html in the document ready function:

        $( document ).ready(function() {
					
          // Adds the header panel with the text in it.
          panel_head('Microsoft');
          
          // Adds the stockprice panel for microsoft.
        	panel_stockprice('MSFT');
          
          // Gets the weather in the specified city.
          panel_weather('Seattle, USA');
          
          // Places the map.
          initializeMap();
          
          // Show the showreel for three stocks.
          showShowreel("MSFT","AAPL","RIO");
        	
          //
          showSentimentPanel = true;
          showSentimentPanelVisually = false;
          showSentimentScatter = true;
          panel_news('Microsoft');
          
  			});