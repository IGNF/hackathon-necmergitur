/*
	Copyright (c) 2015 Jean-Marc VIGLINO, 
	released under the CeCILL license (http://www.cecill.info/).
	
	@classdesc
	ol.source.ERP
	
	olx.source.ERP:
	{	
	}

	@require jQuery
	
	Inherits from:
	<ol.source.Vector>
*/

/**
* @constructor ol.source.ERP
* @extends {ol.source.Vector}
* @param {olx.source.Vector=} options
* @todo 
*/
ol.source.ERP = function(opt_options)
{	var options = opt_options || {};
	var self = this; 

	options.loader = this._loaderFn;
	
	/** Url */
	this._url = options.url || "http://repaire.noip.me:8080/erp";

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
ol.inherits (ol.source.ERP, ol.source.Vector);


/** Set feature attributes 
* @param {feature} the feature
* @param {attributes} RDF attributes
* @param {lastfeature} last feature added (null if none)
* @return {boolean} true: add the feature to the layer
* @API stable
*/
ol.source.ERP.prototype.readFeature = function (feature, attributes, lastfeature)
{	// Copy RDF attributes values
	for (var i in attributes) 
	{	if (i!="position") feature.set (i, attributes[i]);
	}

	return true;
};

/** Loader function used to load features.
* @private
*/
ol.source.ERP.prototype._loaderFn = function(extent, resolution, projection) 
{	if (resolution > this._minResolution) return;
	var self = this;
	var bbox = ol.proj.transformExtent(extent, projection, "EPSG:4326");
	
	// Ajax request to get the tile
	$.ajax(
	{	url: this._url,
		dataType: 'json', 
		data: { bbox: bbox.join(","), format:"json" },
		success: function(data) 
		{	var features = [];
			var att, pt, feature, lastfeature = null;
			for ( var i=0; i<data.length; i++ )
			{	att = data[i];
				pt = att.position.coordinates;
				feature = new ol.Feature(new ol.geom.Point(ol.proj.transform (pt,"EPSG:4326",projection)));
				if (self.readFeature(feature, att, lastfeature))
				{	features.push(feature);
					lastfeature = feature;
				}
			}
			self.addFeatures(features);
		}
    });
};