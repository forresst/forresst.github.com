---
layout: post
title: Make a list jQuery Mobile sortable by drag & drop
info: Sortable list with drag & drop in jQuery Mobile
categories:
- jQuery Mobile
- Tutoriel
---

I needed a sortable list by drag & drop in jQuery Mobile running on my smartphone.
I did not want to reinvent the wheel, so I pick the code for public libraries to achieve a result that runs on Android 4 on my Nexus S with the Android browser.
Your feedback on other smartphones, on other browsers am interested. A small return on my twitter account (@ forresst17) will be appreciated. I would point your feedback on this post.

Tested and approved on:

* Nexus S with Android 4.0 (my smartphone)

* iPad2 with IOS 5.1 (Thanks Poulpator)


I also made several positive reports on desktop browsers:

* Chrome 12

* Firefox 12 & 13

Here is the link to the <a href="/demos/sortable/en/index.html" rel="external" data-role="button" data-inline="true" data-mini="true">Demo</a> .

###1 - Create a list with jQuery Mobile

First we will create a page containing a list jQuery Mobile:

{% highlight html %}
<!DOCTYPE html> 
<html>
<head>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1"> 
  <title>Example</title> 
  <link rel="stylesheet" href="http://code.jquery.com/mobile/1.1.1/jquery.mobile-1.1.1.min.css" />
  <script src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
  <script src="http://code.jquery.com/mobile/1.1.1/jquery.mobile-1.1.1.min.js"></script>
</head>
<body> 
<div>
  <div data-role="header" data-theme="d">
    <h1>Example</h1>
  </div>

  <div data-role="content" data-theme="c">
    <ul data-role="listview" data-inset="true" data-theme="d" id="sortable">
      <li data-role="list-divider">List</li>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
      <li>Item 4</li>
      <li>Item 5</li>
    </ul>
  </div>
</div>
</body>
</html>
{% endhighlight %}

**Note**: I added *id="sortable"* on tag *ul*, it will serve us for the next point.

###2 - Add the features of jQuery UI sortable

I was inspired by the <a href="http://jqueryui.com/demos/sortable/" rel="external" data-role="button" data-inline="true" data-mini="true">Demo</a> site of jQuery UI.

{% highlight html %}
...
  <title>Example</title> 
  <link rel="stylesheet" href="http://code.jquery.com/mobile/1.1.1/jquery.mobile-1.1.1.min.css" />
  <script src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
  <script src="http://code.jquery.com/mobile/1.1.1/jquery.mobile-1.1.1.min.js"></script>
  
  <!-- (Start) Add the features of jQuery UI sortable -->
  <script src="http://code.jquery.com/ui/1.8.21/jquery-ui.min.js"></script>
  <script>
  $(document).bind('pageinit', function() {
    $( "#sortable" ).sortable();
    $( "#sortable" ).disableSelection();
    <!-- Refresh list to the end of sort to have a correct display -->
    $( "#sortable" ).bind( "sortstop", function(event, ui) {
      $('#sortable').listview('refresh');
    });
  });
  </script>
  <!-- (End) Add the features of jQuery UI sortable -->
  
</head>
<body> 
...
{% endhighlight %}

**Tip** : If you not want to use the entire jQuery UI, you can get on the download page the jQuery UI components needed for our example:

* Core
* Widget
* Mouse
* Sortable

###3 - Add jQuery UI Touch Punch to work on touch devices

The sortable list works fine on a desktop browser. But if you want to do a test on your smartphone, it does not work.
There is a small plugin for jQuery UI to simulate touch events for drag & drop function on smartphones.
This tool is <a href="http://touchpunch.furf.com/" rel="external" data-role="button" data-inline="true" data-mini="true">jQuery UI Touch Punch</a>.

Please download the <a href="https://raw.github.com/furf/jquery-ui-touch-punch/master/jquery.ui.touch-punch.min.js" rel="external" data-role="button" data-inline="true" data-mini="true">JS minified</a> and save it in the same directory as your HTML file. Then add the JS in your HTML page.

{% highlight html %}
...
  <script src="http://code.jquery.com/ui/1.8.21/jquery-ui.min.js"></script>

  <!-- (Start) Add jQuery UI Touch Punch -->
  <script src="jquery.ui.touch-punch.min.js"></script>
  <!-- (End) Add jQuery UI Touch Punch -->

  <script>  
  $(document).bind('pageinit', function() {
    $( "#sortable" ).sortable();
...
{% endhighlight %}

The sortable list now works properly on your smartphone.

###4 - Conclusion

I hope it will serve you in your future developments. One must be aware that this is a trick and that this is not the best solution that exists.
The JS file from jQuery UI is pretty heavy, you can still reduce it by taking only the components listed above.
But I think, it's the simplest pending another solution ...