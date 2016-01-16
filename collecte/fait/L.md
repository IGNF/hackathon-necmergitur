# Salle de cinémas et autres lieu de projection

http://opendata.paris.fr/explore/dataset/cinemas-a-paris/

# Salle de spectacles 

https://www.data.gouv.fr/fr/datasets/les-lieux-de-diffusion-du-spectacle-vivant-en-ile-de-france-idf/

```
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
SELECT distinct ?label ?lat ?long
WHERE {
  ?subject dbpedia-owl:type dbpedia-fr:Théâtre
. ?subject geo:lat ?lat
. ?subject geo:long ?long
. ?subject rdfs:label ?label
. FILTER(xsd:float(?lat) <= 49.04694
&& 48.658291 <= xsd:float(?lat)
&& xsd:float(?long) <= 2.63791
&& 2.08679 <= xsd:float(?long)
&& LANG(?label) = 'fr') 
}
LIMIT 10000
```
