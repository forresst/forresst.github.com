---
layout: post
title: Tri des collections avec Backbone.js et jQuery Mobile
info : Comment vous pouvez triez une liste dans jQuery Mobile après avoir ajouté un enregistrement dans la collection BackBone.
categories:
- jQuery Mobile
- Backbone
---

*Ceci est une traduction d'un article du blog de CHARIOT Solutions, voici le lien vers la [version originale](http://blog.chariotsolutions.com/2012/01/sorting-collections-with-backbonejs-and.html)*

Dans un précédent [article](/2012/03/01/Backbone-et-jQuery-Mobile/), j'ai fourni un exemple simple de rendu d'une liste HTML utilisant Backbone.js et jQuery Mobile. Le code de cet exemple a fini par rendre une liste comme celle-ci :

![Alt "ListView.png"](/images/2012-03-01-Backbone-et-jQuery-Mobile/ListView.png)

Notez que la liste est présentée dans l'ordre d'apparition dans le JSON.

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

Aussi, lorsqu'un élément est ajouté, il s'affiche en bas de la liste.  Bien que facile, ce n'est pas le meilleur. Dans cet article, je vais ajouter un tri à la collection Backbone et faire un petit changement à la vue de telle sorte que les nouveaux éléments soient ajoutés et que la liste soit automatiquement triée.

Backbone.js fait ces changements très facilement. D'abord, pour qu'une collection Backbone soit triéé, vous devez mettre en œuvre une méthode *comparator* sur la collection. Comme les modèles sont ajoutés à la collection, Backbone s'assurera que le tri est maintenue sur la base de l'implémentation de *comparator*. D'après la documentation Backbone, "les fonctions *comparator* prennent un modèle et renvoient une valeur numérique ou une chaîne par laquelle le modèle doit être trié par rapport aux autres".

Nous allons trier la liste selon la date de l'activité de l'exercice. Comme *comparators* doit retourner un nombre ou une chaîne de tri, nous allons retourner le temps en millisecondes depuis le 01/01/70. Notre nouvelle définition de la collection ressemble à ceci :

{% highlight js linenos %}

exercise.Activities = Backbone.Collection.extend({
  model: exercise.Activity,
  url: "exercise.json",
  comparator: function(activity){
    var date = new Date(activity.get('date'));
    return date.getTime();
  }
});

{% endhighlight %}

Si nous rafraichissons notre navigateur avec l'implementation de la collection mise à jour, notez que la liste est maintenant triée par date.

![Alt "ListViewSort.png"](/images/2012-03-01-Backbone-et-jQuery-Mobile/ListViewSort.png)

Si nous voulions qu'elle soit triée par ordre décroissant, nous aurions tout simplement retourner la valeur négative de la méthode getTime().

Si vous avez essayé d'ajouter une nouvelle activité, vous remarquerez qu'elle se présente à la fin de la liste. Cela est dû au fait que nous avons lier un écouteur (listener) à la méthode *add* de la collection (ligne 7 ci-dessous), et tout cela est ajouté au HTML à la fin de l'affichage de la liste (ligne 30 ci-dessous).

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

Si vous ouvrez une console JS dans le navigateur et enquêtez sur la collection en entrant

	JSON.stringify(exercise.activities)

vous verrez que la collection est triée. Pour corriger la représentation HTML de la collection, tout ce que nous devons faire est de remplacer l'événement *add* lié à l'appel du *render*. Ce sera un nouveau rendu HTML basé sur la collection. Nous pouvons aussi retirer la méthode *add* dans la vue, car elle n'est plus nécessaire. Notre configuration de la vue modifiée ressemble à ceci :

{% highlight js linenos %}

exercise.ActivityListView = Backbone.View.extend({
  tagName: 'ul',
  id: 'activities-list',
  attributes: {"data-role": 'listview'},

  initialize: function() {
    this.collection.bind('add', this.render, this);
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

Après l'actualisation de la vue, la liste continuera à être triée, même lors de l'ajout de nouvelles activités. Comme le code ne fait qu'ajouter un élément avec la date d'aujourd'hui, essayez de taper le texte suivant dans la console JS

	exercise.activities.add({id:12, date:"12/01/2011", type:"Interval Run"});

Cela devrait ajouter un élément en haut de la liste. Maintenant, votre liste sera toujours triée.

Le code source peut être trouvé dans mon dépôt git [ici](https://github.com/stevenpsmith/Exercise/tree/sort). Cette URL vous amène à la branche "sort". La branche principale représente le code d'introduction du billet du blog trouvée [ici](/2012/03/01/Backbone-et-jQuery-Mobile/).

