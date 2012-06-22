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

I also made several positive reports on desktop browsers:

* Chrome 12

* Firefox 12 & 13

Here is the link to the <a href="/demos/sortable/en/index.html" rel="external" data-role="button" data-inline="true" data-mini="true">Demo</a> .

###I) Create a list with jQuery Mobile

First we will create a page containing a list jQuery Mobile:

{% highlight html %}
<!DOCTYPE html> 
<html>
<head>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1"> 
  <title>Example</title> 
  <link rel="stylesheet" href="http://code.jquery.com/mobile/1.1.0/jquery.mobile-1.1.0.min.css" />
  <script src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
  <script src="http://code.jquery.com/mobile/1.1.0/jquery.mobile-1.1.0.min.js"></script>
  <script>
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

###II) Add the features of jQuery UI sortable

I was inspired by the <a href="http://jqueryui.com/demos/sortable/" rel="external" data-role="button" data-inline="true" data-mini="true">Demo</a> site of jQuery UI.

{% highlight html %}
...
  <title>Example</title> 
  <link rel="stylesheet" href="http://code.jquery.com/mobile/1.1.0/jquery.mobile-1.1.0.min.css" />
  <script src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
  <script src="http://code.jquery.com/mobile/1.1.0/jquery.mobile-1.1.0.min.js"></script>
  
  <!-- (Start) Add the features of jQuery UI sortable -->
  <script src="http://code.jquery.com/ui/1.8.21/jquery-ui.min.js"></script>
  $(document).bind('pageinit', function() {
    $( "#sortable" ).sortable();
    $( "#sortable" ).disableSelection();
    <!-- Refresh list to the end of sort to have a correct display -->
    $( "#sortable" ).bind( "sortstop", function(event, ui) {
      $('#sortable').listview('refresh');
    });
  });
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

###III) Add jQuery UI Touch Punch to work on touch devices

