  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-28940436-2']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

$( document ).bind( "mobileinit", function() {

  // Google analytics
  $( '[data-role=page]' ).live( 'pageshow', function (event, ui) {
        try 
        {
            if ( location.hash )
            {
               url = location.hash;
            }
            else 
            {
               url = defaulturl;
            }
            _gaq.push( ['_trackPageview', url] );
        } 
        catch( error ) 
        {
	  // Oh no! Call the catch logger
 
      }
  });

});

