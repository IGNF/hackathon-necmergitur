Source DBPEDIA http://fr.dbpedia.org/sparql

```
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
SELECT distinct ?label ?lat ?long ?type
WHERE {
  ?subject rdf:type dbo:ReligiousBuilding
. ?subject dbpedia-owl:type ?type
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

Source IGN

http://wxs.ign.fr/gwnicj6lfgj2r0jz88otg61m/geoportail/wfs?request=GetFeature&typenames=BDTOPO_BDD_WLD_WGS84G:pai_religieux&outputformat=csv&cql_filter=nature='Culte catholique ou orthodoxe' AND BBOX(the_geom,48.658291,2.08679,49.04694,2.63791)

http://wxs.ign.fr/gwnicj6lfgj2r0jz88otg61m/geoportail/wfs?request=GetFeature&typenames=BDTOPO_BDD_WLD_WGS84G:pai_religieux&outputformat=csv&cql_filter=nature='Culte protestant' AND BBOX(the_geom,48.658291,2.08679,49.04694,2.63791)

http://wxs.ign.fr/gwnicj6lfgj2r0jz88otg61m/geoportail/wfs?request=GetFeature&typenames=BDTOPO_BDD_WLD_WGS84G:pai_religieux&outputformat=csv&cql_filter=nature='Culte israélite' AND BBOX(the_geom,48.658291,2.08679,49.04694,2.63791)

http://wxs.ign.fr/gwnicj6lfgj2r0jz88otg61m/geoportail/wfs?request=GetFeature&typenames=BDTOPO_BDD_WLD_WGS84G:pai_religieux&outputformat=csv&cql_filter=nature='Culte islamique' AND BBOX(the_geom,48.658291,2.08679,49.04694,2.63791)

http://wxs.ign.fr/gwnicj6lfgj2r0jz88otg61m/geoportail/wfs?request=GetFeature&typenames=BDTOPO_BDD_WLD_WGS84G:pai_religieux&outputformat=csv&cql_filter=nature='Culte divers' AND BBOX(the_geom,48.658291,2.08679,49.04694,2.63791)









