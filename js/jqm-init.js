$(document).bind("mobileinit", function() {


	$("div").live("pagebeforeshow",function(event,ui) {
		var header = $("div[data-role='header'] h1",$(this));
		var title = $.trim(header.text());
		modtitle = "/" + title + ".html";
		_gaq.push(["_trackPageview",modtitle]);
		console.log(modtitle);
	});
	

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-28940436-2']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();


});