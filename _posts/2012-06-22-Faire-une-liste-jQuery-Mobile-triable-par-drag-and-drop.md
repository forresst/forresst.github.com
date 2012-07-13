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

Testé et approuvé sur :

* Nexus S avec Android 4.0 (mon smartphone)

* iPad2 avec IOS 5.1 (Merci Poulpator)

J'ai fait aussi des tests concluants sur plusieurs navigateurs de bureau :

* Chrome 12

* Firefox 12 & 13

Voici le lien de la <a href="/demos/sortable/fr/index.html" rel="external" data-role="button" data-inline="true" data-mini="true">Démo</a>.

###1 - Créez une liste sous jQuery Mobile

Tout d'abord nous allons créer une page jQuery Mobile contenant une liste :

{% highlight html %}
<!DOCTYPE html> 
<html>
<head>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1"> 
  <title>Exemple</title> 
  <link rel="stylesheet" href="http://code.jquery.com/mobile/1.1.1/jquery.mobile-1.1.1.min.css" />
  <script src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
  <script src="http://code.jquery.com/mobile/1.1.1/jquery.mobile-1.1.1.min.js"></script>
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

###2 - Ajoutez les fonctionnalités sortable de jQuery UI

Je me suis inspiré de la <a href="http://jqueryui.com/demos/sortable/" rel="external" data-role="button" data-inline="true" data-mini="true">Démo</a> du site de jQuery UI

{% highlight html %}
...
  <title>Exemple</title> 
  <link rel="stylesheet" href="http://code.jquery.com/mobile/1.1.1/jquery.mobile-1.1.1.min.css" />
  <script src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
  <script src="http://code.jquery.com/mobile/1.1.1/jquery.mobile-1.1.1.min.js"></script>
  
  <!-- (Début) Ajoutez les fonctionnalités sortable de jQuery UI -->
  <script src="http://code.jquery.com/ui/1.8.21/jquery-ui.min.js"></script>
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

###3 - Ajoutez jQuery UI Touch Punch pour que cela fonctionne sur les appareils tactiles

La liste triable fonctionne correctement sur un navigateur de bureau. Mais si vous voulez faire un test sur votre smartphone, cela ne fonctionne pas.
Il existe un petit plugin à jQuery UI qui permet de simuler les événements tactiles pour que le drag & drop fonctionnent sur les smartphones.
Cet outil c'est <a href="http://touchpunch.furf.com/" rel="external" data-role="button" data-inline="true" data-mini="true">jQuery UI Touch Punch</a>.

Veuillez télécharger le <a href="https://raw.github.com/furf/jquery-ui-touch-punch/master/jquery.ui.touch-punch.min.js" rel="external" data-role="button" data-inline="true" data-mini="true">JS minifié</a> et le sauvegarder dans le même répertoire que votre fichier HTML. Puis ajoutez le JS dans votre page HTML.

{% highlight html %}
...
  <script src="http://code.jquery.com/ui/1.8.21/jquery-ui.min.js"></script>

  <!-- (Début) Ajoutez jQuery UI Touch Punch -->
  <script src="jquery.ui.touch-punch.min.js"></script>
  <!-- (Fin) Ajoutez jQuery UI Touch Punch -->

  <script>
  $(document).bind('pageinit', function() {
    $( "#sortable" ).sortable();
...
{% endhighlight %}

La liste triable fonctionne maintenant correctement sur votre smartphone.

###4 - Conclusion

J'espère que cela pourra vous servir dans vos futurs développements. Il faut bien être conscient que c'est une astuce et que ce n'est pas la meilleure solution qui existe.
Le fichier JS de jQuery UI est assez lourd, vous pouvez tout de même le diminuer en prenant seulement les composants cités au dessus.
Mais je pense que c'est la mise oeuvre la plus simple en attendant une autre solution ...

