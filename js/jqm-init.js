$(document).bind("mobileinit", function() {
  $( '[data-role=page]' ).live( 'pageshow', function (event, ui) {
    _gaq.push(['_trackPageview']);
  });

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-28940436-2']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

});