---
layout: post
title: Comment utiliser jQuery Mobile et Backbone.js pour gérer des formulaires
info : Comment utiliser jQuery Mobile et Backbone.js pour gérer des formulaires
categories:
- jQuery Mobile
- Backbone
---

*Ceci est une traduction d'un article du blog de CHARIOT Solutions, voici le lien vers la <a href="http://blog.chariotsolutions.com/2012/02/using-jquerymobile-and-backbonejs-for.html" rel="external" data-role="button" data-inline="true" data-mini="true">version originale</a>.*

###Introduction

Dans cet article, je continue le développement de mon application "exercice" que j'ai commencé (et amélioré) dans ces articles :

* <a href="/2012/03/01/Backbone-et-jQuery-Mobile/" data-role="button" data-inline="true" data-mini="true">Introduction à Backbone.js avec jQuery Mobile</a>

* <a href="/2012/03/31/Tri-des-collections-avec-Backbone-et-jQuery-Mobile/" data-role="button" data-inline="true" data-mini="true">Tri des collections avec Backbone.js et jQuery Mobile</a>

* <a href="/2012/04/04/Depuis-une-Liste-vers-une-vue-detail-en-utilisant-jQueryMobile-et-Backbone/" data-role="button" data-inline="true" data-mini="true">Depuis une liste vers une vue détail en utilisant jQueryMobile et Backbone.js</a>

Ajoutons la possibilité de créer et modifier des enregistrements dans l'application.

###Ajout d'une nouvelle activité

Tout comme dans l'article précédent, la première chose que nous avons besoin, c'est une page jQueryMobile pour recevoir le contenu du formulaire. Ajoutez les lignes suivantes à index.html :

{% highlight html linenos %}

<div data-role="page" id="activity-form" data-add-back-btn="true">
  <div data-role="header">
    <a href="#" data-role="button" data-icon="check" data-theme="b" data-rel="back" id="save-activity-button" class="ui-btn-right">Save</a>
    <h1>New Activity</h1>
  </div>
  <div data-role="content" id="activity-form-content">
      <!-- the contents of the form will be rendered via the backbone view -->
      <form id="activity-form-form" action="#"></form>
  </div>
</div>

{% endhighlight %}

Dans le code ci-dessus, nous voyons une page typique de jQueryMobile. Les principales choses qui nous intéressent ici sont la balise d'ancrage dans le div *header* :

* Spécifiez *data-rel="back"* pour accédez à la page précédente dès que la sauvegarde est terminée. De cette façon, si nous entrons dans la page du formulaire depuis "Add" ou "Edit", la navigation sera gérée.

* Le *class="ui-btn-right"*  déplace le bouton sur le côté droit de la barre d'entête.

* Le *data-theme="b"* permet que le bouton *save* utilise le thème bleu.

L'étape suivante consiste à définir le template que la vue utilisera pour rendre le contenu de cette page. Commençons par un simple template avec une saisie pour chaque attribut d'activity. Pour varier un peu l'interface utilisateur, nous pouvons utiliser un menu déroulant pour le type d'activité. Le template de base devrait ressembler à ceci :

{% highlight html linenos %}

<script type="text/template" id="activity-form-template">
    <label for="date" class="select">Date</label>
    <input type="date" name="date" id="date" placeholder="Date" value="<%= date %>" />
     
    <label for="type" class="select">Type</label>
    <select name="type" id="type">
        <option>Run</option>
        <option>Bike</option>
        <option>Swim</option>
        <option>Walk</option>
    </select>
     
    <label for="distance">Distance</label>
    <input type="text" name="distance" id="distance" placeholder="" value="<%= distance %>" />
 
    <label for="minutes">Minutes</label>
    <input type="tel" name="minutes" id="minutes" placeholder="" value="<%= minutes %>" />
     
    <div data-role="fieldcontain">
        <textarea name="comments" id="comments" placeholder="Comments"><%= comments %></textarea>
    </div>
</script>

{% endhighlight %}

Notez que nous utilisons les 5 types d'*input* HTML pour les champs. Les navigateurs qui prennent en charge ceux-ci varie, mais le pire des cas, ils déprécient le type d'*input* vers un saisie de type texte. Par exemple, sur iOS, la date présentera un sélecteur de date natif, alors que sur Android (ou Chrome, etc) le champ se comportera comme une saisie de texte standard.

Maintenant nous avons besoin de naviguer vers la page du formulaire. Cela demande de modifier le bouton "Add" sur la page de la liste.

{% highlight html linenos %}

<div data-role="page" id="activities">
  <div data-role="header">
    <h1>Activities</h1>
    <a href="#activity-form" data-role="button" data-icon="add" id="add-button" class="ui-btn-right">Add</a>
  </div>
  <div data-role="content">
      <!-- Les éléments de la liste seront rendus par la vue backbone -->
  </div>
</div>

{% endhighlight %}

Pour faire la transition vers la page du formulaire, l'attribut *href* sur ​​la balise d'ancrage (par exemple button) doit être changé par l'*id* de la page du formulaire, comme indiqué dans la ligne 4 ci-dessus. La dernière étape dans la présentation de la page de formulaire pour supporter l'ajout d'activités est la modification du gestionnaire du clic du bouton *add*.

{% highlight js linenos %}

$('#add-button').live('click', function(){
    var activity = new exercise.Activity(),
        activityForm = $('#activity-form-form'),
        activityFormView;
 
    activityFormView = new exercise.ActivityFormView({model: activity, viewContainer: activityForm});
    activityFormView.render();
});

{% endhighlight %}

Ici, nous créons un modèle vide, prenez le nœud du formulaire, créez un nouveau *exercise.ActivityFormView* avec ces objets, et lancez le rendu du formulaire. Les tests à ce point témoigne d'un problème. La capture d'écran ci-dessous ne s'affiche pas ;)

![Alt "ScreenShot.png"](/images/2012-03-01-Backbone-et-jQuery-Mobile/ScreenShot.png)

En investigant dans la console du navigateur, on découvre l'erreur : *Uncaught ReferenceError: distance is not defined*. Cela est du au template essayant d'accéder à un attribut indéfini du modèle. Le problème est décrit <a href="https://github.com/documentcloud/underscore/issues/237" rel="external" data-role="button" data-inline="true" data-mini="true">ici</a> avec quelques moyens pour le contourner. J'ai trouvé que la solution de contournement est plus facile pour fournir des valeurs par défaut pour le modèle, comme illustré ci-dessous.

{% highlight js linenos %}

exercise.Activity = Backbone.Model.extend({
   defaults: {
       date: '',
       type: '',
       distance: '',
       comments: '',
       minutes: ''
   }
});

{% endhighlight %}

Maintenant le formulaire est bien rendu. Avec l'aide de certains CSS, on peut serrer un peu les choses et se retrouver avec la version de droite (le CSS fait partie du code source, consultez les liens à la fin de cet article).

![Alt "ScreenShot2.png"](/images/2012-03-01-Backbone-et-jQuery-Mobile/ScreenShot2.png)
![Alt "ScreenShot3.png"](/images/2012-03-01-Backbone-et-jQuery-Mobile/ScreenShot3.png)

###Modifier une activité existante

Comme le modèle et la vue sont déjà implémentés, l'ajout de fonctionnalités de modification est assez simple. La première étape consiste à mettre à jour l'attribut href du bouton de modification sur la page détail d'activity.

{% highlight html linenos %}

<div data-role="page" id="activity-details" data-add-back-btn="true">
  <div data-role="header">
    <a href="#activity-form" data-role="button" data-icon="arrow-d" id="edit-activity-button" class="ui-btn-right">Edit</a>
    <h1>Activity Details</h1>
  </div>
  <div data-role="content" id="activity-details-content">
      <!-- Les éléments de la liste seront rendus par la vue backbone -->
  </div>
</div>

{% endhighlight %}

Comme nous l'avons fait avec le bouton d'ajout, qui référencait la page formulaire d'activity. Maintenant, nous devons ajouter le gestionnaire d'événement du clic pour le bouton de modification.

{% highlight js linenos %}

$('#edit-activity-button').live('click', function() {
    var activityId = $('#activity-details').jqmData('activityId'),
        activityModel = exercise.activities.get(activityId),
        activityForm = $('#activity-form-form'),
        activityFormView;
     
    activityFormView = new exercise.ActivityFormView({model: activityModel, viewContainer: activityForm});
    activityFormView.render();
});

{% endhighlight %}

Si vous vous souvenez, l'activityId est transmis à la vue de la page de détails par la gestion de l'évement du click sur un élément de la liste. Nous allons le réutiliser ici pour récupérer l'activité de la collection.

Il est temps de tester. En choisissant une activité, la page de détail est rendu. En cliquant sur le bouton de modification, cela affiche le formulaire pré-rempli avec les détails de l'activité. Tout est superbe.

![Alt "ScreenShot4.png"](/images/2012-03-01-Backbone-et-jQuery-Mobile/ScreenShot4.png)

Mais attendez ..... cette capture d'écran a été faite à partir du navigateur sur lequel je teste. Nous devons toujours le tester sur les appareils mobiles. J'ai mentionné plus tôt que nous utilisions quelques types d'*input* HTML 5 (à savoir la date). La bonne chose est que iOS 5 affichera un sélecteur de date sympa pour les types *date*. Le défi est que la date soit dans un format spécifique pour que cela fonctionne. L'image ci-dessous montre à quoi ressemble la page du formulaire sur un appareil iOS.

![Alt "ScreenShot5.png"](/images/2012-03-01-Backbone-et-jQuery-Mobile/ScreenShot5.png)

###Correction de la date

Aucune valeur de date ne s'affiche sur notre appareil iOS. Il s'agit d'un <a href="https://github.com/jquery/jquery-mobile/issues/2755" rel="external" data-role="button" data-inline="true" data-mini="true">problème</a> connu. Donc, pour iOS nous devons avoir le format de date à yyyy-mm-dd, tandis que pour d'autres plateformes, je préfère que la date soit visible ainsi mm/dd/yyyy. Je me rends compte que les formats de date doivent être localisées, mais dans le besoin de cet exemple, je tiens à la garder simple et précise mm/dd/yyyy comme le format de date de l'affichage. Il existe de nombreuses options qui pourraient être décrites ici, mais pour démontrer encore plus les capacités de Backbone.js, nous allons modifier notre modèle afin de répondre à nos exigences de date.

Tout d'abord, l'attribut date dans notre flux JSON est une chaîne. Convertissons ceci en une date où les données seront récupérées à partir du serveur, puis quand nous aurons besoin de la date, nous pourrons tout simplement la manipuler. Ceci peut être accompli de plusieurs façons.

* Implémenter une méthode d'analyse sur la collection qui convertit la chaîne en une date lorsque les données sont récupérées à partir du serveur.
* Implémenter une méthode sur le modèle qui convertit la chaîne en une date et le définit sur ​​le modèle. Ce serait alors d'exiger au code appelant qu'il sache appeler cette méthode en fonction de la circonstance.
* Substituer la méthode set sur ​​le modèle, regarder l'attribut date, puis le convertir en une date en fonction des besoins.

La dernière option est l'approche la plus solide. Ajoutez la méthode suivante pour le modèle Activity.

{% highlight js linenos %}

set: function(attributes, options) {
    var aDate;
    if (attributes.date){
        //A FAIRE lors d'une prochaine version - vérifier que la date à un format valide
        aDate = new Date(attributes.date);
        if ( Object.prototype.toString.call(aDate) === "[object Date]" && !isNaN(aDate.getTime()) ){
            attributes.date = aDate;
        }
    }
    Backbone.Model.prototype.set.call(this, attributes, options);
}

{% endhighlight %}

De plus, mettez à jour le defaults de sorte que l'attribut date soit désormais une date au lieu d'une chaîne.

{% highlight js linenos %}

defaults: {
    date: new Date(),
    type: '',
    distance: '',
    comments: '',
    minutes: ''
},

{% endhighlight %}

Bien que ce ne soit pas la manipulation de date la plus solide, cela est suffisant pour le moment. Dans une prochaine version, cela devra être améliorée.

Ensuite, ajoutez les attributs à noutre modèle qui formatera la date comme nous le souhaitons (par exemple mm/dd/yyyy et yyyy-mm-dd).

{% highlight js linenos %}

dateInputType: function(){
    return exercise.formatDate(this.get('date'), "yyyy-mm-dd"); //https://github.com/jquery/jquery-mobile/issues/2755
},
 
displayDate: function(){
    return exercise.formatDate(this.get('date'), "mm/dd/yyyy");
}

{% endhighlight %}

La fonction formatDate est un simple formateur de date qui répond à nos besoins spécifiques et peut être trouvé dans le code source qui accompagne cet article (voir le lien en bas de l'article).

Maintenant, comment pouvons-nous utiliser ces nouvelles méthodes dans notre vue. La première chose à réaliser, c'est de transmettre le template JSON. L'implémentation par défaut de la méthode toJSON d'un modèle Backbone.js ne comprendra pas ces fonctions. Par conséquent, nous devons substituer la méthode toJSON.

{% highlight js linenos %}

toJSON: function(){
    var json = Backbone.Model.prototype.toJSON.call(this);
    return _.extend(json, {dateInputType : this.dateInputType(), displayDate: this.displayDate()});
}

{% endhighlight %}

Ici, nous utilisons extend de Underscore.js pour ajouter nos attributs au JSON standard de Backbone. Maintenant, nous devons modifier nos templates de vue pour utiliser les attributs JSON appropriés.

{% highlight html linenos %}

<script type="text/template" id="activity-list-item-template">    
  <li><a href="#activity-details" identifier="<%= id %>"><%= displayDate %> - <%= type %></a></li>
</script>

<script type="text/template" id="activity-details-template">
    <h3><%= type %></h3>
    <ul data-role="listview" id="activitiy-fields" data-inset="true">
      <li>Date: <%= displayDate %></li>
      <li>Minutes: <%= minutes %></li>
      <li>Distance: <%= distance %></li>
      <li>Comments: <%= comments %></li>
    </ul>
</script>

<script type="text/template" id="activity-form-template">
    <label for="date" class="select">Date</label>
    <% if (navigator.userAgent.indexOf('iPhone') >= 0 || navigator.userAgent.indexOf('iPad') >= 0) { %>
        <input type="date" name="date" id="date" placeholder="Date" value="<%= dateInputType %>" />
    <% }else{ %>
        <input type="date" name="date" id="date" placeholder="Date" value="<%= displayDate %>" />
    <% } %>
     
    <label for="type" class="select">Type</label>
    <select name="type" id="type">
        <option>Run</option>
        <option>Bike</option>
        <option>Swim</option>
        <option>Walk</option>
    </select>
     
    <label for="distance">Distance</label>
    <input type="text" name="distance" id="distance" placeholder="" value="<%= distance %>" />

    <label for="minutes">Minutes</label>
    <input type="tel" name="minutes" id="minutes" placeholder="" value="<%= minutes %>" />
     
    <div data-role="fieldcontain">
        <textarea name="comments" id="comments" placeholder="Comments"><%= comments %></textarea>
    </div>
</script>

{% endhighlight %}

Notez que les lignes 16-21 comprennent la logique conditionnelle. Il s'agit d'une très basique détection d'appareil pour déterminer le format de la date à utiliser. Il y a des plug-ins qui fournissent des solutions de rechange plus solides, mais pour garder les choses claires, cela suffira à nos besoins. Les captures d'écran ci-dessous montrent le formulaire du navigateur de bureau et des versions d'IOS avec la gestion de la date appropriée.

![Alt "ScreenShot6.png"](/images/2012-03-01-Backbone-et-jQuery-Mobile/ScreenShot6.png)
![Alt "ScreenShot7.png"](/images/2012-03-01-Backbone-et-jQuery-Mobile/ScreenShot7.png)
![Alt "ScreenShot8.png"](/images/2012-03-01-Backbone-et-jQuery-Mobile/ScreenShot8.png)

###Sauvegarde

La dernière étape consiste à implémenter la fonction de sauvegarde.

{% highlight js linenos %}

$('#save-activity-button').live('click', function(){
    var activityId = $('#activity-details').jqmData('activityId'),
        activity,
        dateComponents,
        formJSON = $('#activity-form-form').formParams();
     
    //si nous sommes sur iOS et nous avons une date ... la convertir de yyyy-mm-dd vers mm/dd/yyyy
    //A FAIRE dans une future version - pour les non-iOS, nous aurions besoin de valider que la date est bien dans le format attendu (mm/dd/yyyy)
    if (formJSON.date && ((navigator.userAgent.indexOf('iPhone') >= 0 || navigator.userAgent.indexOf('iPad') >= 0)) ){
        dateComponents = formJSON.date.split("-");
        formJSON.date = dateComponents[1] + "/" + dateComponents[2] + "/" + dateComponents[0];
    }
     
    if (activityId){
        //modification
        activity = exercise.activities.get(activityId);
        activity.set(formJSON); //not calling save since we have no REST backend...save in memory
    }else{
        //nouveau (puisque nous n'avons aucun backend REST, créons un nouveau modèle et ajoutons la collection pour éviter à Backbone de faire des appels REST)
        activity = new exercise.Activity(formJSON);
        activity.set({'id': new Date().getTime()});  //create some identifier
        exercise.activities.add(activity);
    }
});

{% endhighlight %}

J'ai utilisé le plugin jQuery formParams de JavascriptMVC (trouvé <a href="http://v3.javascriptmvc.com/jquery/dist/jquery.formparams.js" rel="external" data-role="button" data-inline="true" data-mini="true">ici</a>) pour convertir mon formulaire HTML en un objet JSON. Puis, la date est convertie dans le format approprié. Une chose à noter ici est que nous n'avons aucun serveur réel avec une interface pour Backbone, nous n'appelons pas save sur le modèle ou create sur la collection. Ces méthodes entraîneraient des appels REST appropriés au serveur.

Comme l'événement du clic sur la vue de la liste passe l'activityId à la page de détails, nous pouvons utiliser ceci pour déterminer si nous sommes en ajout ou en modification. Une chose à considérer ici est que l'utilisateur peut cliquer sur une activité existante, puis revenir à la liste, puis cliquez sur ajouter. Dans ce cas, le ActivityId de l'activité précédemment sélectionné est toujours attaché à la vue activity-details. Cela entraînera l'implémentation de notre sauvegarde alors que nous sommes en train de modifier. Pour éviter cela, nous devons supprimer le ActivityId à partir de la page activity-details lors de l'ajout d'une nouvelle activité. Ceci peut être accompli en ajoutant la ligne 7 ci-dessous pour ajouter la gestion.

{% highlight html linenos %}

$('#add-button').live('click', function(){
    var activity = new exercise.Activity(),
        activityForm = $('#activity-form-form'),
        activityFormView;
 
    //effacer n'importe quel attribut id existant dans la page du formulaire
    $('#activity-details').jqmRemoveData('activityId');
    activityFormView = new exercise.ActivityFormView({model: activity, viewContainer: activityForm});
    activityFormView.render();
});

{% endhighlight %}

La dernière étape consiste à nous assurer que nos vues sont mises à jour en conséquence lorsque l'on ajoute ou modifie des activités. Comme la vue de détails récupère l'activité avant les chargements de page, aucune modification n'est requise ici. Mais notre vue de la liste n'affiche ceci que pendant le chargement de la page initial. C'est là que nous pouvons profiter de la liaison d'événements de Backbone. Quelques ajouts à l'ActivityListView et les choses seront traitées.

{% highlight html linenos %}

initialize: function() {
    this.collection.bind('add', this.render, this);
    this.collection.bind('change', this.changeItem, this);
    this.collection.bind('reset', this.render, this);
    this.template = _.template($('#activity-list-item-template').html());
},

...

changeItem: function(item){
    this.collection.sort();
}

{% endhighlight %}

L'événement change se propagera jusqu'au modèle et cela déclenchera l'appel de l'ensemble. Dans la méthode changeItem, nous trions la collection pour gérer les changements dans l'attribut date. L'appel de la méthode sort déclenchera l'événement reset, ce qui implique l'invocation de la méthode render, ce qui provoque le re-rendus de la liste. Cela permet de maintenir tout dans un ordre correct. L'événement add sera déclenché lorsque nous ajoutons une nouvelle activité à la collecte. Depuis que nous avons implémenter la méthode comparator sur la collection, les modèles ajoutés à la collection seront ajoutés dans l'ordre approprié.

Nous pouvons maintenant ajouter et modifier des activités. Démarrez l'exercice :)

Le code source pour cet article peut être trouvé <a href="https://github.com/stevenpsmith/Exercise/tree/new-and-edit" rel="external" data-role="button" data-inline="true" data-mini="true">ici</a>.