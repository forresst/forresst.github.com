---
layout: post
title: Introduction � Backbone.js avec jQuery Mobile
info : Backbone.js + jQuery Mobile
categories:
- jQuery Mobile
- Backbone
---

Si vous travaillez sur une lourde application JavaScript (Je pense � jQuery Mobile, etc ...), vous voudriez probablement trouver dans les biblioth�ques JavaScript une aide pour ajouter une structure, de la coh�rence et de la commodit� � vos applications. Une des biblioth�ques JavaScript que j'ai utilis� derni�rement est Backbone.js. Je vous cite la documentation de Backbone : "Backbone fournit des mod�les qui sont des enregistrements cl�-valeur avec des �v�nements associ�s et customisables, des collections avec une API contenant plusiseurs fonctions, des vues avec la gestion d'�v�nements d�claratifs, et se connecte � toute votre application existante via une interface RESTful JSON". C'est vraiment un excellent r�sum� de ce que Backbone peut fournir � votre application.

Pour l'exemple, afin d'utiliser Backbone, je vais cr�er une petite application jQuery Mobile et utiliser un mod�le Backbone, une collection et la vue pour rendre l'interface utilisateur. Gr�ce � l'utilisation du mod�le d'�v�nement de Backbone, l'interface utilisateur sera mise � jour quand le mod�le change ou lorsque de nouveaux mod�les sont cr��s.

J'ai d�cid� d'utiliser jQuery Mobile comme framework UI, principalement parce que je suis un gars mobile et il fournira le code HTML avec du style raisonnable sans effort suppl�mentaire de ma part. Je sais, je suis paresseux ... mais �a fonctionne pour ce blog :). En continuant sur le chemin de la paresse, lorsque je parlerais de jQuery Mobile, j'utiliserais l'abbr�viation JQM � partir de maintenant.

Ce qui suit suppose que vous �tes au moins un peu familier avec jQuery et JQM.  Si ce n'est pas, jetez un oeil sur le site Web JQM [http://jquerymobile.com/](http://jquerymobile.com/) (et [http://mobile.jquery-fr.com/](http://mobile.jquery-fr.com/) pour la version fran�aise). Ils ont beaucoup de documentation et m�me un mod�le pour cr�er une application de base.  Tout le code dans ce post sera disponible dans mon d�p�t github ([https://github.com/stevenpsmith/Exercise/tree/BackboneIntro](https://github.com/stevenpsmith/Exercise/tree/BackboneIntro)).

L'application que nous allons faire va permettre � un utilisateur de noter les exercices qu'il a fait un jour donn�. N'oubliez pas que c'est une application tr�s basique dont le seul but est de faire une pr�sentation de Backbone.js. La partie qui sera d�velopp�e pour cet article implique d'extraire des donn�es d'exercice d'un serveur et de pr�senter cela dans une liste, un mod�le tr�s commun pour des applications mobile. En fin de compte, notre application va ressembler � ceci :

![Alt "ListView.png"](https://github.com/forresst/forresst.github.com/blob/master/images/ListView.png)

Le JSON que nous allons traiter, ressemblera � ceci :

{% highlight rhtml %}

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

J'aime organiser ma structure de l'application un peu diff�remment que JQM le montre pour sa mise en place, principalement pour des raisons organisationnelles. Mon structure de l'application ressemble � ceci :

![Alt "dir_structure.png"](https://github.com/forresst/forresst.github.com/blob/master/images/dir_structure.png)

Tout notre travail se fera dans index.html et app.js. Dans les applications r�elles, j'ai l'habitude de d�couper mes fichiers JS plus finement, mais cela n'est vraiment pas n�cessaire ici. La page liste de l'application est d�finie dans index.html. Cela devrait ressembler � une d�finition de page JQM typique avec seulement la partie du contenu de d�finie. Nous utiliserons la vue de Backbone pour cr�er la liste :

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

Si nous regardons cela dans le navigateur, on obtient une page vide avec un bouton Ajouter dans l'ent�te. Puisque nous voulons remplir notre liste avec des donn�es, nous devons d�finir dans l'ordre un mod�le Backbone et une collection pour manipuler et stocker les donn�es via JavaScript. Un mod�le de base et sa collection sont faciles � d�finir :

{% highlight rhtml %}

exercise.Activity = Backbone.Model.extend({
});

exercise.Activities = Backbone.Collection.extend({
    model: exercise.Activity,
    url: "exercise.json"
});

{% endhighlight %}

Le grand avantage au sujet de la collection, c'est qu'elle fournit un acc�s RESTful � votre serveur pour la r�cup�ration et la persistance de donn�es. Pour conserver cette simplicit�, nos donn�es seront servis � partir d'un fichier statique JSON avec la structure mentionn� plus t�t. Puisque nous n'avons pas de serveur r�el dans cet exemple, nous ne pouvons pas vraiment sauver nos changements n'importe o�, mais dans la m�moire du client. Mais la collection ira chercher les donn�es � partir du serveur et cela peut �tre utilis� pour nous aider � faire le rendu notre interface utilisateur. Le code suivant va cr�er une instance de la collection en m�moire, r�cup�rer les donn�es depuis le serveur et le parser en une collection de mod�les.

{% highlight rhtml %}

exercise.initData = function(){
    exercise.activities = new exercise.Activities();
    exercise.activities.fetch({async: false});  // use async false to have the app wait for data before rendering the list
};
{% endhighlight %}

##A FINIR
