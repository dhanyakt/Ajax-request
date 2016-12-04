
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

                function nonce_generate() {
                return (Math.floor(Math.random() * 1e12).toString());
            }

            const YELP_KEY = 'jWmZkyFrOCA2QNJMoOpNYg';
            const YELP_TOKEN = 'WlVkulucchfYwOw-8kHqDStncgDQew0T';
            const YELP_KEY_SECRET = '12Ay90fFF1Z_kRlSaDrIZQC-ypo';
            const YELP_TOKEN_SECRET = 'kOePxoen2dhPK26lMFgtO15hmno';

            var yelpUrl = 'https://api.yelp.com/v2/search?term=food&location=Charlotte';
            var parameters = {
                oauth_consumer_key: YELP_KEY,
                oauth_token: YELP_TOKEN,
                oauth_nonce: nonce_generate(),
                oauth_timestamp: Math.floor(Date.now()/1000),
                oauth_signature_method: 'HMAC-SHA1',
                oauth_version : '2.0',
                callback: 'cb'              // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
            };

            var encodedSignature = oauthSignature.generate('GET',yelpUrl, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
                parameters.oauth_signature = encodedSignature;

            var settings = {
                url: yelp_url,
                data: parameters,
                cache: true,                // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
                dataType: 'jsonp',
                success: function(response) {
                // Do stuff with results
                console.log(response);
                },
                fail: function() {
                // Do stuff on fail
                console.log("Try again after some time");
                }
            };

            // Send AJAX query via jQuery library.
            $.ajax(settings);


    return false;

};

$('#form-container').submit(loadData);
