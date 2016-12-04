
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var street_view = $('#street').val();
    var city = $('#city').val();
    var address = street_view + ',' + city;
    $greeting.text("So you want to live in" + address + "?");

    // YOUR CODE GOES HERE!
    var streetViewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location='+ address + '&key=AIzaSyAYKltJCYkvXh71AplAVj-ixKgXA8pt08s';
    console.log("StreetView: " + streetViewUrl);
    $body.append('<img class="bgimg" src=" '+ streetViewUrl + '">');

    //AJAX REQUEST
    var nyUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q='+ city +'&page=2&sort=oldest&api-key=3e98fdc33a2543a9be59a1865c49e9fb';

    $.getJSON( nyUrl, function(data) {
        var items = [];
         $.each( data, function( key, val ) {
            items.push( "<li id='" + key + "'>" + val + "</li>" );
        });
         console.log(items);
         var articles = data.response.docs;
         for(var i=0; i<articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' + '<a href="'+ article.web_url + '">' + article.headline.main + '</a>'+ '<p>' + article.snippet + '</p>' + '</li>');
        }
    }) .error(function(e) {
            $nytElem.text("Reuest denied");
        }); // Chaining of the error function

    var wikiRequestTimeOut = setTimeout(function(){
        $wikiElem.text("Request denied");
    },8000); // error function handler

    //AJAX REQUEST using $.ajax
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+ city + '&format=json&callback=wikiCall';
    $.ajax({
        dataType: "jsonp",
        url: wikiUrl,
         success: function(response) {
            var articleList = response[1];
            for(var i=0; i<articleList.length; i++) {
                var articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">'+ articleStr + '<a><li>');
            }
            clearTimeout(wikiRequestTimeOut);
        }
    });

    // Send AJAX query via jQuery library.
    $.ajax(settings);
    return false;
};

$('#form-container').submit(loadData);

