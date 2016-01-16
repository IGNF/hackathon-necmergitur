/*
	Copyright (c) 2015 Jean-Marc VIGLINO, 
	released under the CeCILL license (http://www.cecill.info/).
	
	@classdesc
	ol.source.DBPedia is a DBPedia layer source that load DBPedia located content in a vector layer.
	
	olx.source.DBPedia:
	{	url: {string} url of the static image
		image: {image} the static image, if not provided, use url to load an image
		imageCenter: {ol.Coordinate} of the center of the image
		imageScale: {ol.Size|Number} [scalex, scaley] of the image
		imageRotate: {number} angle of the image in radian, default 0
		imageCrop: {ol.Extent} of the image to be show (in the image) default: [0,0,imageWidth,imageHeight]
		imageMask: {Array.<ol.Coordinate>} - linestring to mask the image on the map
	}

	@require jQuery
	
	Inherits from:
	<ol.source.Vector>
*/

/**
* @constructor ol.source.DBPedia
* @extends {ol.source.Vector}
* @param {olx.source.Vector=} options
* @todo 
*/
ol.source.DBPedia = function(opt_options)
{	var options = opt_options || {};
	var self = this; 

	options.loader = this._loaderFn;
	
	/** Url for DBPedia SPARQL */
	this._url = options.url || "http://fr.dbpedia.org/sparql";

	/** Min resolution to load features  */
	this._minResolution = options.minResolution || 0;
	
	/** Result language */
	this._lang = options.lang || "fr";

	/** Query limit */
	this._limit = options.limit || 1000;

	// Bbox strategy : reload at each move
    if (!options.strategy) options.strategy = ol.loadingstrategy.bbox;

	ol.source.Vector.call (this, options);	
};
ol.inherits (ol.source.DBPedia, ol.source.Vector);


/** Set feature attributes 
* @param {feature} the feature
* @param {attributes} RDF attributes
* @param {lastfeature} last feature added (null if none)
* @return {boolean} true: add the feature to the layer
* @API stable
*/
ol.source.DBPedia.prototype.readFeature = function (feature, attributes, lastfeature)
{	// Copy RDF attributes values
	for (var i in attributes) feature.set (i, attributes[i].value);

	// Prevent same feature with different type duplication
	if (lastfeature && lastfeature.get("subject") == attributes.subject.value)
	{	// Kepp dbpedia.org type ?
		// if (bindings[i].type.match ("dbpedia.org") lastfeature.get("type") = bindings[i].type.value;
		// Concat types
		lastfeature.set("type", lastfeature.get("type") +"\n"+ attributes.type.value);
		return false;
	}
	else 
	{	return true;
	}
};

/** Loader function used to load features.
* @private
*/
ol.source.DBPedia.prototype._loaderFn = function(extent, resolution, projection) 
{	if (resolution > this._minResolution) return;
	var self = this;
	var bbox = ol.proj.transformExtent(extent, projection, "EPSG:4326");
	// SPARQL request: for more info @see http://fr.dbpedia.org/
	query =	"PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> "
				+ "SELECT DISTINCT * WHERE { "
				+ "?subject geo:lat ?lat . "
				+ "?subject geo:long ?long . "
				+ "?subject rdfs:label ?label. "
				+ "OPTIONAL {?subject dbpedia-owl:thumbnail ?thumbnail}."
				+ "OPTIONAL {?subject dbpedia-owl:abstract ?abstract} . "
				+ "OPTIONAL {?subject rdf:type ?type} . "
				// Filter type
				// + "FILTER ( regex (?type, 'Monument|Sculpture|Museum', 'i') ) ."
				+ "FILTER(xsd:float(?lat) <= " + bbox[3] + " && " + bbox[1] + " <= xsd:float(?lat) "
				+ "&& xsd:float(?long) <= " + bbox[2] + " && " + bbox[0] + " <= xsd:float(?long) "
				+ "&& lang(?label) = '"+self._lang+"' "
				+ "&& lang(?abstract) = '"+self._lang+"' "
				+ ") . "
				+ "} LIMIT "+this._limit;
	// Ajax request to get the tile
	$.ajax(
	{	url: this._url,
		dataType: 'jsonp', 
		data: { query: query, format:"json" },
		success: function(data) 
		{	var bindings = data.results.bindings;
			var features = [];
			var att, pt, feature, lastfeature = null;
			for ( var i in bindings )
			{	att = bindings[i];
				pt = [Number(bindings[i].long.value), Number(bindings[i].lat.value)];
				feature = new ol.Feature(new ol.geom.Point(ol.proj.transform (pt,"EPSG:4326",projection)));
				if (self.readFeature(feature, att, lastfeature))
				{	features.push(feature);
					lastfeature = feature;
				}
			}
			self.addFeatures(features);
    }});
};