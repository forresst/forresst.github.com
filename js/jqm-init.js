  var _gaq = _gaq || [];
  $(document).ready(function(e) {
    (function() {
      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + 
                  '.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
    }); 

  $(document).on("pageshow" ".ui-page", function(event, ui) {
    var $page = $(this);
    var url = $page.data("url");
    try {
      _gaq.push(['_setAccount', 'UA-28940436-2']);    
      if (url.length)) {
       _gaq.push(['_trackPageview', url)]);
      } else {
       _gaq.push(['_trackPageview']);
      }
    } catch(err) {}
  });