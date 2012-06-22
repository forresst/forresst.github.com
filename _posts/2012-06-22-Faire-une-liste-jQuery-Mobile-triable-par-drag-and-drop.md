---
layout: post
title: Faire une liste jQuery Mobile triable par drag & drop
info: Liste triable par drag & drop sous jQuery Mobile
categories:
- jQuery Mobile
- Tutoriel
---

J'ai eu besoin d'une liste "triable" par drag & drop sous jQuery Mobile qui fonctionne sur mon smartphone.
Ne voulant par réinventer la roue, j'ai piocher le code dans différentes librairies pour arriver à un résultat qui fonctionne sous Android 4 sur mon Nexus S avec le navigateur d'Android.
Vos retours sur d'autres smartphones, sur d'autres navigateurs m'interesse. Un petit retour sur mon compte twitter (@forresst17) sera apprécié. Je signalerais vos retours sur cet article.

J'ai fait aussi des tests concluants sur plusieurs navigateurs de bureau :

* Chrome 12

* Firefox 12 & 13

Voici le lien de la <a href="/demos/sortable/fr/index.html" rel="external" data-role="button" data-inline="true" data-mini="true">Démo</a>.

###I) Créez une liste sous jQuery Mobile

Tout d'abord nous allons créer une page jQuery Mobile contenant une liste :

{% highlight html %}
<!DOCTYPE html> 
<html>
<head>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1"> 
  <title>Exemple</title> 
  <link rel="stylesheet" href="http://code.jquery.com/mobile/1.1.0/jquery.mobile-1.1.0.min.css" />
  <script src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
  <script src="http://code.jquery.com/mobile/1.1.0/jquery.mobile-1.1.0.min.js"></script>
  <script>
</head>
<body> 
<div>
  <div data-role="header" data-theme="d">
    <h1>Exemple</h1>
  </div>

  <div data-role="content" data-theme="c">
    <ul data-role="listview" data-inset="true" data-theme="d" id="sortable">
      <li data-role="list-divider">Liste</li>
      <li>Elément 1</li>
      <li>Elément 2</li>
      <li>Elément 3</li>
      <li>Elément 4</li>
      <li>Elément 5</li>
    </ul>
  </div>
</div>
</body>
</html>
{% endhighlight %}

**Remarque** : j'ai rajouté *id="sortable"* sur la balise *ul*, cela va nous servir pour le point suivant.

###II) Ajoutez les fonctionnalités sortable de jQuery UI

Je me suis inspiré de la <a href="http://jqueryui.com/demos/sortable/" rel="external" data-role="button" data-inline="true" data-mini="true">Démo</a> du site de jQuery UI

{% highlight html %}
...
  <title>Exemple</title> 
  <link rel="stylesheet" href="http://code.jquery.com/mobile/1.1.0/jquery.mobile-1.1.0.min.css" />
  <script src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
  <script src="http://code.jquery.com/mobile/1.1.0/jquery.mobile-1.1.0.min.js"></script>
  
  <!-- (Début) Ajoutez les fonctionnalités sortable de jQuery UI -->
  <script src="http://code.jquery.com/ui/1.8.21/jquery-ui.min.js"></script>
  $(document).bind('pageinit', function() {
    $( "#sortable" ).sortable();
    $( "#sortable" ).disableSelection();
    <!-- Actualiser la liste à la fin de sorte à avoir un affichage correct -->
    $( "#sortable" ).bind( "sortstop", function(event, ui) {
      $('#sortable').listview('refresh');
    });
  });
  <!-- (Fin) Ajoutez les fonctionnalités sortable de jQuery UI -->
  
</head>
<body> 
...
{% endhighlight %}

**Astuce** : Si vous ne voulez pas utiliser la totalité de jQuery UI, vous pouvez récupérer sur la page de téléchargement de jQuery UI que les composants nécessaires pour notre exemple, c'est à dire :

* Core
* Widget
* Mouse
* Sortable

###III) Ajouter jQuery UI Touch Punch pour que cela fonctionne sur les appareils tactiles

