#Magasin de vente et centre commercial

Juste un peu de stat : https://www.data.gouv.fr/fr/datasets/les-commerces-par-commune-ou-arrondissement-base-permanente-des-equipements-idf/

Ca c'est plus complet mais y a pas d'adresse : https://www.infogreffe.fr/societes/entreprises-departement/ville-de-paris-075.html

Le must => Ce que propose la CCI ile de france ... mais bon c'est pas de l'open data et c'est payant

Le fichier M.csv a été créé à partir des données extraites sur le site : https://datainfogreffe.fr/explore/dataset/entreprises-immatriculees-2015/?disjunctive.code_postal&disjunctive.ville&disjunctive.region&disjunctive.greffe&disjunctive.date

Le fichier a ensuite été traité avec FME pour extraire les points localisés en Ile de France puis trier les activités correspondantes à un type ERP défini. Le fichier M regroupe tous les points ayant une activité commerciale.
