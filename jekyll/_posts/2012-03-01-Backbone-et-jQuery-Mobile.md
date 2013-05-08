---
layout: post
title: Introduction à Backbone.js avec jQuery Mobile
info : Si vous travaillez sur une lourde application JavaScript (Je pense à jQuery Mobile, etc ...), vous voudriez probablement trouver dans les bibliothèques JavaScript une aide pour ajouter une structure, de la cohérence et de la commodité à vos applications.
categories:
- jQuery Mobile
- Backbone
lastmod: 2012-03-30 12:40:00 +0100
---

*Ceci est une traduction d'un article du blog de CHARIOT Solutions, voici le lien vers la [version originale](http://blog.chariotsolutions.com/2011/12/introduction-to-backbonejs-with-jquery.html)*

Si vous travaillez sur une lourde application JavaScript (Je pense à jQuery Mobile, etc ...), vous voudriez probablement trouver dans les bibliothèques JavaScript une aide pour ajouter une structure, de la cohérence et de la commodité à vos applications. Une des bibliothèques JavaScript que j'ai utilisé dernièrement est Backbone.js. Je vous cite la documentation de Backbone : "Backbone fournit des modèles qui sont des enregistrements clé-valeur avec des événements associés et customisables, des collections avec une API contenant plusiseurs fonctions, des vues avec la gestion d'événements déclaratifs, et se connecte à toute votre application existante via une interface RESTful JSON". C'est vraiment un excellent résumé de ce que Backbone peut fournir à votre application.

Pour l'exemple, afin d'utiliser Backbone, je vais créer une petite application jQuery Mobile et utiliser un modèle Backbone, une collection et la vue pour rendre l'interface utilisateur. Grâce à l'utilisation du modèle d'événement de Backbone, l'interface utilisateur sera mise à jour quand le modèle change ou lorsque de nouveaux modèles sont créés.

J'ai décidé d'utiliser jQuery Mobile comme framework UI, principalement parce que je suis un gars mobile et il fournira le code HTML avec du style raisonnable sans effort supplémentaire de ma part. Je sais, je suis paresseux ... mais ça fonctionne pour ce blog :). En continuant sur le chemin de la paresse, lorsque je parlerais de jQuery Mobile, j'utiliserais l'abbréviation JQM à partir de maintenant.

Ce qui suit suppose que vous êtes au moins un peu familier avec jQuery et JQM.  Si ce n'est pas, jetez un oeil sur le site Web JQM [http://jquerymobile.com/](http://jquerymobile.com/) (et [http://mobile.jquery-fr.com/](http://mobile.jquery-fr.com/) pour la version française). Ils ont beaucoup de documentation et même un modèle pour créer une application de base.  Tout le code dans ce post sera disponible dans mon dépôt github ([https://github.com/stevenpsmith/Exercise/tree/BackboneIntro](https://github.com/stevenpsmith/Exercise/tree/BackboneIntro)).

L'application que nous allons faire va permettre à un utilisateur de noter les exercices qu'il a fait un jour donné. N'oubliez pas que c'est une application très basique dont le seul but est de faire une présentation de Backbone.js. La partie qui sera développée pour cet article implique d'extraire des données d'exercice d'un serveur et de présenter cela dans une liste, un modèle très commun pour des applications mobile. En fin de compte, notre application va ressembler à ceci :

![Alt "ListView.png"](/images/2012-03-01-Backbone-et-jQuery-Mobile/ListView.png)

Le JSON que nous allons traiter, ressemblera à ceci :

{% highlight js linenos %}

[
    {
        "id":1,
        "date": "12/12/2011",
        "type": "Run",
        "distance": "3 miles",
        "comments": "This was really hard",
        "minutes": 36
    },
    {
        "id":2,
        "date": "12/11/2011",
        "type": "Bike",
        "distance": "6 miles",
        "comments": "All down hill...felt like nothing",
        "minutes": 30
    },
    {
        "id":3,
        "date": "12/10/2011",
        "type": "Walk",
        "distance": "2.5 miles",
        "comments": "Shouldn't have taken the dog",
        "minutes": 45
    },
    {
        "id":4,
        "date": "12/09/2011",
        "type": "Run",
        "distance": "Long",
        "comments": "Legs felt good",
        "minutes": 75
    }
]

{% endhighlight %}

J'aime organiser ma structure de l'application un peu différemment que JQM le montre pour sa mise en place, principalement pour des raisons organisationnelles. Mon structure de l'application ressemble à ceci :

![Alt "dir_structure.png"](/images/2012-03-01-Backbone-et-jQuery-Mobile/dir_structure.png)

Tout notre travail se fera dans index.html et app.js. Dans les applications réelles, j'ai l'habitude de découper mes fichiers JS plus finement, mais cela n'est vraiment pas nécessaire ici. La page liste de l'application est définie dans index.html. Cela devrait ressembler à une définition de page JQM typique avec seulement la partie du contenu de définie. Nous utiliserons la vue de Backbone pour créer la liste :

{% highlight rhtml linenos %}

<div data-role="page" id="activities">
    <div data-role="header">
        <h1>Activities</h1>
        <a href="#" data-role="button" data-icon="add" id="add-button">Add</a>
    </div>
    <div data-role="content">
        <!-- Le contenu de la liste sera rendu via la vue de backbone -->
    </div>
</div>

{% endhighlight %}

Si nous regardons cela dans le navigateur, on obtient une page vide avec un bouton Ajouter dans l'entête. Puisque nous voulons remplir notre liste avec des données, nous devons définir dans l'ordre un modèle Backbone et une collection pour manipuler et stocker les données via JavaScript. Un modèle de base et sa collection sont faciles à définir :

{% highlight js linenos %}

exercise.Activity = Backbone.Model.extend({
});

exercise.Activities = Backbone.Collection.extend({
    model: exercise.Activity,
    url: "exercise.json"
});

{% endhighlight %}

Le grand avantage au sujet de la collection, c'est qu'elle fournit un accès RESTful à votre serveur pour la récupération et la persistance de données. Pour conserver cette simplicité, nos données seront servis à partir d'un fichier statique JSON avec la structure mentionné plus tôt. Puisque nous n'avons pas de serveur réel dans cet exemple, nous ne pouvons pas vraiment sauver nos changements n'importe où, mais dans la mémoire du client. Mais la collection ira chercher les données à partir du serveur et cela peut être utilisé pour nous aider à faire le rendu notre interface utilisateur. Le code suivant va créer une instance de la collection en mémoire, récupérer les données depuis le serveur et le parser en une collection de modèles.

{% highlight js linenos %}

exercise.initData = function(){
    exercise.activities = new exercise.Activities();
    exercise.activities.fetch({async: false});  // use async false to have the app wait for data before rendering the list
};
{% endhighlight %}

La fonction exercise.initData() peut être appelé lors de l'initialisation de l'application (ou n'importe où ailleurs serait approprié) pour charger les données. Maintenant il est temps de rendre la vue. Les vues Backbone dépendent d'Underscore.js. Underscore est une bibliothèque d'utilitaire qui comprend un grand nombre de fonctionnalités intéressantes, dont l'une est les templates de vue. Backbone peut être utilisé avec de nombreux frameworks de template de vue (par exemple Mustache, Handlbars, etc...), mais ici nous nous limiterons avec les templates de Underscore car ils répondent à nos besoins. Pour nos éléments d'activité d'exercice, nous avons besoin d'un modèle très basique comme celui-ci :

{% highlight rhtml linenos %}

<script type="text/template" id="activity-list-item-template">    
    <li><a href="#activity-details" identifier="<%= id %>"><%= date %> - <%= type %></a></li>
</script>

{% endhighlight %}

En donnant au template un id unique, cela permettra d'y accéder en utilisant les sélecteurs habituels de jQuery. Les éléments axés sur les données sur le modèle sont entourés par <blockquote> &lt;%= id %&gt; </blockquote>  Comme vous pouvez le voir dans la ligne 2, nous utilisons les attributs id, date et type du modèle fourni dans le template pour remplir le code HTML en conséquence. Bien que l'attribut "identifier" n'est pas un véritable attribut HTML et qu'il n'appartient à aucun framework, il sera utilisé pour déterminer l'activité sélectionné par l'utilisateur dans la liste afin que les données appropriées puissent être récupérées et affichées sur une page suivante.

L'étape suivante consiste à définir la vue de Backbone qui rendra la liste. Les vues Backbone peuvent être définies et mises en place de nombreuses façons, et la documentation fait un excellent travail en expliquant les options, etc. Je tiens à définir mes vues de sorte qu'elles soient aussi autonomes que possible. Donc, plutôt que de laisser Backbone créer le code HTML au sein d'un DIV (le comportement par défaut), je définis les propriétés appropriées pour créer une liste JQM comme indiquée dans les lignes 2-4 ci-dessous :

{% highlight js linenos %}

exercise.ActivityListView = Backbone.View.extend({
    tagName: 'ul',
    id: 'activities-list',
        attributes: {"data-role": 'listview'},

    initialize: function() {
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
    }
});

{% endhighlight %}

A partir du site Backbone: «L'implémentation par défaut du *render* n'est pas opérationnel. Surchargez cette fonction avec votre code pour rendre le template de la vue à partir des données du modèle, et mettez à jour *this.el* avec le nouveau HTML. Une bonne convention est de retourner *this* à la fin du *render* pour permettre des appels enchaînés". Le *$(this.el)* se réfère à l'élément conteneur, dans ce cas l'élément *ul*. Il y a des attributs standards qui sont accessibles à partir de la vue, y compris la collection et le modèle Backbone. Les lignes 17-20 itérent sur la collection *activities*, remplissent les espaces réservés du template avec les données du modèle, et ajoutent le code HTML résultant dans l'élément conteneur.

Si vous avez besoin de passer des données arbitraires à votre vue, on peut y accéder via l'objet *options* comme indiqué sur la ligne 11 du code. Comme mentionné plus haut, j'aime que mes vues Backbone soient aussi autonomes que possible, donc je fournis à l'élément contenant l'HTML pour cette vue (comme un objet jQuery) lors de la construction de l'instance View. La ligne 20 définit le HTML de l'élément contenant à la vue de Backbone et la ligne 21 dit à JQM de styliser les choses appropriées.

La prochaine étape consiste à instancier et rendre la vue avec la collection appropriée et le conteneur HTML. Puisque c'est la page "Home" dans notre application, cela se fait après que JQM initialise la page.

{% highlight js linenos %}

$('#activities').live('pageinit', function(event){
    var activitiesListContainer = $('#activities').find(":jqmData(role='content')"),
        activitiesListView;
    exercise.initData();
    activitiesListView = new exercise.ActivityListView({collection: exercise.activities, viewContainer: activitiesListContainer});
    activitiesListView.render();
});

{% endhighlight %}

Maintenant, nous avons un affichage de liste qui rend une liste JQM basée sur les données dans une collection Backbone. Pour profiter de la puissance réelle des modèles/collections de Backbone, nous pouvons ajouter des écouteurs lors de changement dans la collection qui mettront à jour la vue en fonction de ces changements. La beauté de ceci est que le code supplémentaire pour accomplir cela est minime. En ajoutant

	this.collection.bind('add', this.add, this);

à la méthode *initialize* de votre Vue Backbone et en fournissant une méthode add().

{% highlight js linenos %}

add: function(item) {
   var activitiesList = $('#activities-list'),
       template = this.template;

   activitiesList.append(template(item.toJSON()));
   activitiesList.listview('refresh');
}

{% endhighlight %}

Ici, nous récupérons tout simplement la liste en ajoutant le nouveau modèle à la vue (et en rafraîchissant, c'est JQM qui fait sa magie). En ajoutant un gestionnaire de clic au bouton "Add", nous pouvons tester que l'ajout d'un modèle à la collection met à jour la vue.

{% highlight js linenos %}

$('#add-button').live('click', function(){
    exercise.activities.add({id: 6, date: '12/15/2011', type: 'Walk', distance: '2 miles', comments: 'Wow...that was easy.'});
});

{% endhighlight %}

Il existe d'autres méthodes pour lier, mais cela fournit un exemple rapide sur la façon dont Backbone peut être utilisé pour assister le rendu de la vue et du traitement des données dans les applications client basées sur JavaScript.

La base du code complet est disponible [ici](https://github.com/stevenpsmith/Exercise/tree/BackboneIntro). Il peut être déployé sur n'importe quel serveur web. Pour OS X, j'utilise le serveur Web intégré, mais n'hésitez pas à utiliser le serveur de votre choix.

