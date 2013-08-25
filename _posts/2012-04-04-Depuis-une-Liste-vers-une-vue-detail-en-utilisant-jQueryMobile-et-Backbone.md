---
layout: post
title: Depuis une liste vers une vue détail en utilisant jQueryMobile et Backbone.js
info : 
categories:
- jQuery Mobile
- Backbone
---

*Ceci est une traduction d'un article du blog de CHARIOT Solutions, voici le lien vers la [version originale](http://blog.chariotsolutions.com/2012/01/from-list-to-details-view-using.html)*

Dans mon précédent article, j'ai construit une application de base pour démontrer l'utilisation de Backbone.js avec jQueryMobile (JQM). L'introduction peut être trouvée [ici](/2012/03/01/Backbone-et-jQuery-Mobile/), et un bref article ultérieure sur le tri des collections [ici](/2012/03/31/Tri-des-collections-avec-Backbone-et-jQuery-Mobile/) . Dans cet article, je veut ajouter la possibilité de visualiser le détail des éléments présentés dans la liste.

La première étape consiste à créer une nouvelle page JQM pour afficher la vue du détail. JQM fait cela facilement pour ajouter des pages à votre application. J'ai ajouté le code suivant dans le fichier index.html :

{% highlight html linenos %}

    <div data-role="page" id="activity-details" data-add-back-btn="true">
      <div data-role="header">
        <a href="#" data-role="button" data-icon="arrow-d" id="edit-activity-button" class="ui-btn-right">Edit</a>
        <h1>Activity Details</h1>
      </div>
      <div data-role="content" id="activity-details-content">
          <!-- the contents of the list view will be rendered via the backbone view -->
      </div>
    </div>

{% endhighlight %}

Cela va créer la structure de la page, et Backbone.js sera l'utiliser pour remplir le contenu du div basé sur l'enregistrement tapé (ou cliqué) dans la liste. L'étape suivante consiste à définir le template de la vue du détail. C'est le pattern que je suis lors de l'élaboration à l'aide jQueryMobile et Backbone.js. Le template peut être inséré sous le template de la liste d'éléments dans le fichier index.html .

{% highlight html linenos %}

    <script type="text/template" id="activity-details-template">    
        <h3><%= type %></h3>
        <ul data-role="listview" id="activitiy-fields" data-inset="true">
          <li>Date: <%= date %></li>
          <li>Minutes: <%= minutes %></li>
          <li>Distance: <%= distance %></li>
          <li>Comments: <%= comments %></li>
        </ul>
    </script>

{% endhighlight %}

J'ai décidé d'intégrer le détail dans une liste en lecture seule, de ce fait, jQueryMobile fournira un peu de style raisonnable. Comme le point ici est de démontrer que Backbone et jQueryMobile jouent ensemble, je ne voulais pas avoir à dépenser beaucoup de temps sur le style :)

Ensuite, nous avons besoin de définir la vue Backbone qui va utiliser le template pour rendre le contenu approprié. Toutes ces vues ont besoin de faire appliquer le modèle dans le template et l'ajouter au conteneur HTML défini lorsque la vue est instanciée.

{% highlight js linenos %}

    exercise.ActivityDetailsView = Backbone.View.extend({
        //since this template will render inside a div, we don't need to specify a tagname
        initialize: function() {
            this.template = _.template($('#activity-details-template').html());
        },
        
        render: function() {
            var container = this.options.viewContainer,
                activity = this.model,
                renderedContent = this.template(this.model.toJSON());
                
            container.html(renderedContent);
            container.trigger('create');
            return this;
        }
    });

{% endhighlight %}

Afin de récupérer le modèle correct à lier à la vue du détail, nous avons besoin de savoir quel enregistrement dans la vue liste a été cliqué (ou tappé). Pour faire cela, nous pouvons lier l'évenement *click* à l'élément dans la liste. Ceci peut être accompli en modifiant la méthode de rendu de ActivityListView. Voici la version actuelle de la liste :

{% highlight js linenos %}

    exercise.ActivityListView = Backbone.View.extend({
        tagName: 'ul',
        id: 'activities-list',
        attributes: {"data-role": 'listview'},
        
        initialize: function() {
            this.collection.bind('add', this.add, this);
            this.template = _.template($('#activity-list-item-template').html());
        },
        
        render: function() {
            var container = this.options.viewContainer,
                activities = this.collection,
                template = this.template,
                listView = $(this.el);
                
            $(this.el).empty();
            activities.each(function(activity){
                listView.append(template(activity.toJSON()));
            });
            container.html($(this.el));
            container.trigger('create');
            return this;
        },
        
        add: function(item) {
            var activitiesList = $('#activities-list'),
                template = this.template;
                
            activitiesList.append(template(item.toJSON()));
            activitiesList.listview('refresh');
        }
    });

{% endhighlight %}

La partie intéressante ici se trouve dans les lignes 18 à20, où l'élément HTML de activity est rendu et ajouté à la liste. C'est là que la modification doit avoir lieu. Chaque élément HTML activity doit être lié à un événement *click*. Dans cet événement *click*, l'id de activity devra en quelque sorte être passé à la vue du détail afin que l'affichage appropriée puissent se déclencher. Il y a plusieurs façons de le faire. L'approche que j'ai utilisés dans le passé incluent l'utilisation de jQuery.jqmData(...) ou le stockage locale d'une session (en supposant que nous soyons en HTML5). Dans cet exemple, nous utiliserons la méthode jqmData. L'astuce consiste à capturer l'id lors de rendu de la liste afin qu'il puisse être utilisé pendant l'exécution de l'événement *click*. Voici les modifications requises aux lignes 18 à 20 du code précédent.

{% highlight js linenos %}

activities.each(function(activity){
   var renderedItem = template(activity.toJSON()),
       $renderedItem = $(renderedItem);  //convert the html into an jQuery object
   $renderedItem.jqmData('activityId', activity.get('id'));  //set the data on it for use in the click event
   $renderedItem.bind('click', function(){
         //set the activity id on the page element for use in the details pagebeforeshow event
        $('#activity-details').jqmData('activityId', $(this).jqmData('activityId'));  //'this' represents the element being clicked
   });
   listView.append($renderedItem);
});

{% endhighlight %}

La première chose est de capturer le rendu de l'élément HTML de activity dans une variable et de le mettre dans un objet jQuery, comme on peut le voir dans les lignes 2-3 . La ligne 4 est l'endroit où la donnée id d'activity est attaché à notre élément HTML activity. Ensuite, le bind de l'événement (lignes 5-8) récupère les données attachées et définit l'élément HTML du détail de l'activity, qui est notre HTML de la page détail de activity. D'après la documentation de jQuery, la méthode bind se réfère à l'élément DOM auquel le gestionnaire d'événements est lié. Nous pouvons l'utiliser pour obtenir les données de l'id d'activity et l'attacher à la vue du détail. Cela nous donne la possibilité de passer l'id approprié lors de l'exécution de la page du détail.

Maintenant nous avons besoin de lier tout cela ensemble. Le pattern typique que je suis, est d'utiliser l' événement *pagebeforeshow* de jQueryMobile pour mettre en place tout le nécessaire pour rendre une page complète. Cela agit comme mon contrôleur.

{% highlight js linenos %}

$('#activity-details').on('pagebeforeshow', function(){
    var activitiesDetailsContainer = $('#activity-details').find(":jqmData(role='content')"),
        activityDetailsView,
        activityId = $('#activity-details').jqmData('activityId'),
        activityModel = exercise.activities.get(activityId);
    
    activityDetailsView = new exercise.ActivityDetailsView({model: activityModel, viewContainer: activitiesDetailsContainer});
    activityDetailsView.render();
});

{% endhighlight %}

Ce code récupère la donnée id attachée à l'élément détails de activity, regardez le modèle utilisant l'API Backbone (ligne 5), il instancie la vue avec le modèle et la vue du conteneur, et appelle la méthode render pour rendre le code HTML final. Le résultat final ressemble à ceci :

![Alt "ListDetails.png"](/images/2012-03-01-Backbone-et-jQuery-Mobile/ListDetails.png)

Le code source pour ce poste peuvent être trouvés [ici](https://github.com/stevenpsmith/Exercise/tree/details-display). Notez que ceci est une branche de mon dépôt de cette application. Chaque article du blog associé à cette base de code se trouve sur une branche distincte.
