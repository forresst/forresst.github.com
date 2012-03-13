---
layout: post
title: Introduction à Backbone.js avec jQuery Mobile
info : Si vous travaillez sur une lourde application JavaScript (Je pense à jQuery Mobile, etc ...), vous voudriez probablement trouver dans les bibliothèques JavaScript une aide pour ajouter une structure, de la cohérence et de la commodité à vos applications.
categories:
- jQuery Mobile
- Backbone
---

*Ceci est une traduction d'un article*

Si vous travaillez sur une lourde application JavaScript (Je pense à jQuery Mobile, etc ...), vous voudriez probablement trouver dans les bibliothèques JavaScript une aide pour ajouter une structure, de la cohérence et de la commodité à vos applications. Une des bibliothèques JavaScript que j'ai utilisé dernièrement est Backbone.js. Je vous cite la documentation de Backbone : "Backbone fournit des modèles qui sont des enregistrements clé-valeur avec des événements associés et customisables, des collections avec une API contenant plusiseurs fonctions, des vues avec la gestion d'événements déclaratifs, et se connecte à toute votre application existante via une interface RESTful JSON". C'est vraiment un excellent résumé de ce que Backbone peut fournir à votre application.

Pour l'exemple, afin d'utiliser Backbone, je vais créer une petite application jQuery Mobile et utiliser un modèle Backbone, une collection et la vue pour rendre l'interface utilisateur. Grâce à l'utilisation du modèle d'événement de Backbone, l'interface utilisateur sera mise à jour quand le modèle change ou lorsque de nouveaux modèles sont créés.

J'ai décidé d'utiliser jQuery Mobile comme framework UI, principalement parce que je suis un gars mobile et il fournira le code HTML avec du style raisonnable sans effort supplémentaire de ma part. Je sais, je suis paresseux ... mais ça fonctionne pour ce blog :). En continuant sur le chemin de la paresse, lorsque je parlerais de jQuery Mobile, j'utiliserais l'abbréviation JQM à partir de maintenant.

Ce qui suit suppose que vous êtes au moins un peu familier avec jQuery et JQM.  Si ce n'est pas, jetez un oeil sur le site Web JQM [http://jquerymobile.com/](http://jquerymobile.com/) (et [http://mobile.jquery-fr.com/](http://mobile.jquery-fr.com/) pour la version française). Ils ont beaucoup de documentation et même un modèle pour créer une application de base.  Tout le code dans ce post sera disponible dans mon dépôt github ([https://github.com/stevenpsmith/Exercise/tree/BackboneIntro](https://github.com/stevenpsmith/Exercise/tree/BackboneIntro)).

L'application que nous allons faire va permettre à un utilisateur de noter les exercices qu'il a fait un jour donné. N'oubliez pas que c'est une application très basique dont le seul but est de faire une présentation de Backbone.js. La partie qui sera développée pour cet article implique d'extraire des données d'exercice d'un serveur et de présenter cela dans une liste, un modèle très commun pour des applications mobile. En fin de compte, notre application va ressembler à ceci :

![Alt "ListView.png"](/images/ListView.png)

Le JSON que nous allons traiter, ressemblera à ceci :

{% highlight js %}

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

![Alt "dir_structure.png"](/images/dir_structure.png)

Tout notre travail se fera dans index.html et app.js. Dans les applications réelles, j'ai l'habitude de découper mes fichiers JS plus finement, mais cela n'est vraiment pas nécessaire ici. La page liste de l'application est définie dans index.html. Cela devrait ressembler à une définition de page JQM typique avec seulement la partie du contenu de définie. Nous utiliserons la vue de Backbone pour créer la liste :

{% highlight rhtml %}

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

{% highlight rhtml %}

exercise.Activity = Backbone.Model.extend({
});

exercise.Activities = Backbone.Collection.extend({
    model: exercise.Activity,
    url: "exercise.json"
});

{% endhighlight %}

Le grand avantage au sujet de la collection, c'est qu'elle fournit un accès RESTful à votre serveur pour la récupération et la persistance de données. Pour conserver cette simplicité, nos données seront servis à partir d'un fichier statique JSON avec la structure mentionné plus tôt. Puisque nous n'avons pas de serveur réel dans cet exemple, nous ne pouvons pas vraiment sauver nos changements n'importe où, mais dans la mémoire du client. Mais la collection ira chercher les données à partir du serveur et cela peut être utilisé pour nous aider à faire le rendu notre interface utilisateur. Le code suivant va créer une instance de la collection en mémoire, récupérer les données depuis le serveur et le parser en une collection de modèles.

{% highlight rhtml %}

exercise.initData = function(){
    exercise.activities = new exercise.Activities();
    exercise.activities.fetch({async: false});  // use async false to have the app wait for data before rendering the list
};
{% endhighlight %}

La fonction exercise.initData() peut être appelé lors de l'initialisation de l'application (ou n'importe où ailleurs serait approprié) pour charger les données. Maintenant il est temps de rendre la vue. Les vues Backbone dépendent d'Underscore.js. Underscore est une bibliothèque d'utilitaire qui comprend un grand nombre de fonctionnalités intéressantes, dont l'une est les templates de vue. Backbone peut être utilisé avec de nombreux frameworks de template de vue (par exemple Mustache, Handlbars, etc...), mais ici nous nous limiterons avec les templates de Underscore car ils répondent à nos besoins. Pour nos éléments d'activité d'exercice, nous avons besoin d'un modèle très basique comme celui-ci :

{% highlight rhtml %}

<script type="text/template" id="activity-list-item-template">    
    <li><a href="#activity-details" identifier="<%= id %>"><%= date %> - <%= type %></a></li>
</script>

{% endhighlight %}

En donnant au template un id unique, cela permettra d'y accéder en utilisant les sélecteurs habituels de jQuery. Les éléments axés sur les données sur le modèle sont entourés par <blockquote><%= %></blockquote>  As you can see in line 2, we are using the id, date, and type attributes of whatever model is supplied to the template to fill in the HTML accordingly.  While the "identifier" attribute is not a real HTML attribute and not required by any of the frameworks, it would be used to determine what activity the user selected in the list so the appropriate data could be retrieved and displayed on a subsequent page.



##A FINIR
