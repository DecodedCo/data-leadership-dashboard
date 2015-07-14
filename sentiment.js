var sentimentResults = [];
var justSentiment = [];
var justLengths = [];


function getAllSentiment(articles){
	for ( var ii=0; ii<articles.length; ii++ ){
    // Only for the last one pass the true-flag so it creates the graphs.
   	calculateSentiment(articles[ii], ii == articles.length-1)    
  }
}


function calculateSentiment(article_text, showBool){
  
  var the_sentiment = "";
  
  $.ajax({url: "http://sentiment.decoded.com/api/"+"dictionary"+"/?txt="+article_text.content, jsonp: "callback", dataType: "jsonp", success: function (data) {
    the_sentiment = data.result.sentiment;
    if (the_sentiment == "Positive"){
      the_sentiment = 1;
    }
    else if (the_sentiment == "Neutral"){
      the_sentiment = 0;
    }
    else{
    	the_sentiment = -1;
    }
    the_length = article_text.content.length;
    justSentiment.push(the_sentiment);
    justLengths.push(the_length);
    tmp = {};
    tmp["ArticleTitle"] = article_text.title;
    tmp["ArticleSentiment"] = the_sentiment;
    tmp["ArticleLength"] = the_length;
    tmp["ArticleDate"] = article_text.date;
  	sentimentResults.push(tmp);
    
    if (showBool){
      // Calculate the average sentiment.
      var sentiment = justSentiment.reduce( function (a, b) { return a + b; } ) / justSentiment.length;
 			
      // Show the sentiment.
      // The boolean flag is to indicate if we are showing text-sentiment or the visual.
      if( showSentimentPanel != undefined && showSentimentPanel == true ){
      	showSentiment(sentiment,showSentimentPanelVisually);
      }
      
      // Show scatter as well...
      if( showSentimentScatter != undefined && showSentimentScatter == true ){
      	makeScatter(sentimentResults);
      }
    }
    
  } // end of function 
  }); // end of ajax.
} // end of function calculateSentiment.



function showSentiment(sentiment,showVisual){
  console.log('Average sentiment', sentiment);
  
  // Add the panel to the dashboard.
  var html = '<section class="db-card">';
  html += '<h1>Sentiment</h1>';
  html += '<div>';
  html += '<div id="emotiontext" style="display:none; text-align:center; padding:20px;"></div>';
  html += '<div id="emotion" style="display:none; text-align:center; padding:20px;">';
  html += '<i class="icon happyIcon fa fa-smile-o fa-5x" style="color:white; background-color:rgba(111,194,8,1); padding:1px 5px; border-radius:50%;"></i>';
  html += '<i class="icon neutralIcon fa fa-meh-o fa-5x" style="color:white; background-color:rgba(176,237,245,0.7); padding:0px 5px; border-radius:50%;"></i>';
  html += '<i class="icon sadIcon fa fa-frown-o fa-5x" style="color:white; background-color:rgba(194,20,8,0.8); padding:0px 5px; border-radius:50%;"></i>';
  html += '</div>';
  html += '</div>';
  html += '</section>';
  $('#dashboard').append(html);
  
  //
  if( showVisual == true ){
    $("#emotiontext").hide();
    $("#emotion").show();
    if (sentiment > 0.2){
        $(".icon").hide();
        $(".happyIcon").show();
    } 
    else if(sentiment < -0.2){
        $(".icon").hide();
        $(".sadIcon").show();
    }
    else{
        $(".icon").hide();
        $(".neutralIcon").show();
    }
  }
  else {
    $("#emotion").hide();
  	$("#emotiontext").show();
    $("#emotiontext").html('Average sentiment: ' + sentiment)
  }
}




function makeScatter(data){
  // Add the panel
  var html = '';
  html += '<section class="db-card">';
  html += '<h1>Sentiment Scatter</h1>';
  html += '<div id="sentimentScatter" style="min-height:250px;"></div>';
  html += '</section>';
  $('#dashboard').append(html);
  // Now create the scatter plot.
  drawScatter(data);
}



function drawScatter(data){
  	// Set initial parameters.
  	var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = $("#sentimentScatter").width() - margin.left - 			margin.right;
        height = $("#sentimentScatter").height() - margin.top - margin.bottom;

    var x = d3.time.scale().range([0, width]),
        y = d3.scale.linear().range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
        .scale(x)
        .ticks(5)
        .orient("bottom");
    var yAxis = d3.svg.axis().scale(y).orient("left");

    var svg = d3.select("#sentimentScatter").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      	.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      data.forEach(function(d) {
        d.ArticleLength = +d.ArticleLength;
        d.ArticleDate = d3.time.format("%d %b %Y %H:%M")
          .parse(d.ArticleDate.substring(5,22));
      });

      x.domain(d3.extent(data, function(d) { 
        return d.ArticleDate; 
      })).nice();
      y.domain(d3.extent(data, function(d) { 
        return d.ArticleLength; 
      })).nice();

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
        	.append("text")
          .attr("class", "label")
          .attr("x", width)
          .attr("y", -6)
          .style("text-anchor", "end")
          .text("Publication Date");

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        	.append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("# words")

      var classes = ["sad","neutral","happy"]

      svg.selectAll(".dot")
          .data(data)
        	.enter().append("circle")
          .attr("class",function(d){
            //console.log("article sentiment",d.ArticleSentiment," class",classes[parseInt(d.ArticleSentiment)+1]);
            return "dot " +classes[parseInt(d.ArticleSentiment)+1];
          })
          .attr("r", 10)
          .attr("cx", function(d) { return x(d.ArticleDate); })
          .attr("cy", function(d) { return y(d.ArticleLength); })
          //.style("fill", function(d) { return 			color[d.ArticleSentiment+1]; });
          .on("mouseover",function(d){
            $("#tooltipText").html(d.ArticleTitle);
            d3.select("#articleTooltip")
            .style("opacity", "1")
            .style("left", (d3.event.pageX+15) + "px")
            .style("top", (d3.event.pageY-75) + "px")
            //.style("height","100px");
          })
      		.on("mouseout",function(d){ 
       			$("#tooltipText").html(""); 				
            d3.select("#articleTooltip").style("opacity","0"); 
      		});
  
}