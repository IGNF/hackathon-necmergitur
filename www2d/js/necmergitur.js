/**
 _ __   ___  ___   _ __ ___   ___ _ __ __ _(_) |_ _   _ _ __ 
| '_ \ / _ \/ __| | '_ ` _ \ / _ \ '__/ _` | | __| | | | '__|
| | | |  __/ (__  | | | | | |  __/ | | (_| | | |_| |_| | |   
|_| |_|\___|\___| |_| |_| |_|\___|_|  \__, |_|\__|\__,_|_|   
                                      |___/                  
 
 * @classdesc
 * 
 */
var wapp = new CordovApp(
{	/**
	* Initilize the application map 
	* @constructor
	*/
	initialize: function() 
	{	var self = this; 
		//wapp.wait("Chargement...", false);

		// Gestion des parametres
		if (!this.param.options) this.param.options={};
		delete this.param.zoombt;
		this.setParamInput("#options", this.param.options, function(e)
			{	switch (e.name)
				{	case "rotmap":
						wapp.rotateMap(e.val);
						break;
					case "zoombt":
						if (e.val===false) $("#map .ol-zoom").hide();
						else $("#map .ol-zoom").show();
						break;
					default: break;
				}
			});

		// Layers (set hdpi:false to enable tile cache)
		var layers = this.layers =  [
				new ol.layer.Tile({ name:"OSM", source: new ol.source.OSM(), baseLayer: true, hidpi: false, visible: false }),
				new ol.layer.Geoportail("GEOGRAPHICALGRIDSYSTEMS.MAPS", {baseLayer: true, hidpi: false, visible: true }),
				new ol.layer.Geoportail("ORTHOIMAGERY.ORTHOPHOTOS", {baseLayer: true, hidpi: false, visible: false }),
				new ol.layer.Geoportail("CADASTRALPARCELS.PARCELS", { hidpi: false, visible: false }),
				new ol.layer.Geoportail("TRANSPORTNETWORKS.ROADS", { hidpi: false, visible: false })
			];
		var vislayers = this.param.layers;
		if (vislayers && vislayers.length) 
		{	for (var i=0; i<layers.length; i++)
			{	if ($.inArray(layers[i].get('name'), vislayers)>=0) layers[i].setVisible(true);
				else layers[i].setVisible(false);
			}
		}
		
		// The map
		var pos = this.param.position || {};
		var map = this.map = new ol.Map.Geoportail
			({	target: 'map',
				key: apiKey,
				// Improve user experience by loading tiles while animating. Will make
				// animations stutter on mobile or slow devices.
				//loadTilesWhileAnimating: true,
				view: new ol.View
				({	zoom: pos.zoom || 5,
					center: [pos.lon || 166326, pos.lat || 5992663]
				}),
				controls: ol.control.defaults({ attribution:false }),
				interactions: ol.interaction.defaults(),
				layers: layers
			});
		this.rotateMap(this.param.options.rotmap);

		// Geolocation Control
		this.addLocateControl(map);

		// Menu
		map.addControl (new ol.control.Toggle(
		{	"class":"menuCtrl", 
			"html":"<i class='fa fa-bars'></i>",
			"toggleFn": function(b)
			{	wapp.toggleMenu();
			}
		}));

		// Layer switcher
		map.addControl (new ol.control.LayerSwitcher({ target:$("#layerswitcher").get(0) }));
		
		
		// Source
		/*
		var source = this.geosource = new ol.source.Vector(
		{	//url: 'data/DataInfoGreffe-IDF.json',
			projection: 'CRS:84',//'CRS:84'
			format: new ol.format.GeoJSON()
			//attributions: [new ol.Attribution({ html: "&copy; <a href='https://www.data.gouv.fr/fr/datasets/fonds-de-la-guerre-14-18-extrait-de-la-base-memoire/'>data.gouv.fr</a>" })],
			//logo:"https://www.data.gouv.fr/s/avatars/37/e56718abd4465985ddde68b33be1ef.jpg" 
		});
		// Cluster Source
		var clusterSource = new ol.source.Cluster({
			distance: 40,
			source: source
		});
		// Vector layer canex
		this.geolayer = new ol.layer.AnimatedCluster(
		{	source: clusterSource,
			projection: 'EPSG:3857',
			//style: function(feature,res){ return self.getFeatureStyle(feature); },
			displayInLayerSwitcher:false
		});
		*/
		
		
		/* Layer DBPedia * /
		var source = this.geosource = new ol.source.DBPedia(
		{	// Tile strategy (must reload on resolution change)
			strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({ tileSize:512  })),
			// Bbox strategy : reload at each move
			//strategy: ol.loadingstrategy.bbox,
			// Min resolution to load data
			minResolution: 20,
			// Language
			lang:"fr"
		});
		
		source.readFeature = function (feature, attributes, lastfeature)
		{	var cat = attributes.type.value
			if (cat)
			{	if (cat.match("/Sculpture")) return false;
				else if (cat.match("Water")) return false;
				else if (cat.match("Island")) return false;
				else if (cat.match("/Event")) return false;
				else if (cat.match("/Artwork")) return false;
			}
			// Copy RDF attributes values
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
		/**/

		/* ERP Layer */
		var source = this.geosource = new ol.source.ERP(
		{	// Tile strategy (must reload on resolution change)
			strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({ tileSize:512  })),
			// Bbox strategy : reload at each move
			//strategy: ol.loadingstrategy.bbox,
			// Min resolution to load data
			minResolution: 20
		});
		/**/
		
		// Force layer reload on resolution change 
		map.getView().on('change:resolution', function(evt)
		{	source.clear();
			self.load42();
		});
		this.load42();
		
		this.geolayer = new ol.layer.Vector(
		{	name: 'ERP',
			source: source,
			style: function(feature,res){ return self.getFeatureStyle(feature); }
		});
		this.map.addLayer(this.geolayer);
		
		// Show info on move end
		map.on('moveend', this.moveEnd, this);

		// Select
		this.select = new ol.interaction.Select({ layers:[this.geolayer], style:function(feature,res){ return self.getFeatureStyle(feature, true); } });
		this.map.addInteraction(this.select);
		this.select.on('select', this.moveEnd, this);
		
		// Chargement des cartes
		if (this.param.canvasMap)
		{	for (var i=0; i<this.param.canvasMap.length; i++) 
			{	this.addCanevasMap(this.param.canvasMap[i]);
			}
		}

		// Load features from files

	},
	
	load42: function()
	{	var geom = new ol.geom.Point( ol.proj.transform ([ecole42.lon, ecole42.lat],"EPSG:4326",this.map.getView().getProjection()) );
		if (!ecole42.geometry) ecole42.geometry = geom;
		feature = new ol.Feature(ecole42);
		this.geosource.addFeature(feature);
	},

	/**
	*/
	rotateMap: function(b)
	{	if (!this.map) return;
		var inter = this.map.getInteractions().getArray().filter(function(interaction) 
		{	return interaction instanceof ol.interaction.PinchRotate
				|| interaction instanceof ol.interaction.DragRotate;
		});
		for (var i=0; i<inter.length; i++) inter[i].setActive(b);
	},
	
	/**
	*/
	photo: function()
	{	this.getPicture(function(url)
		{	$("#fiche2 .photo").attr("src",url+"?"+new Date().getTime()).show();
		},
		null,
		{	prompt: "Joindre une photo",
			name: "TMP/photo.jpg",
			//targetWidth: this.param.imgSize,
			//targetHeight: this.param.imgSize,
			correctOrientation: (this.param.imgOrient!==false)
		});
	},

	/** A new page is shown
	*/
	onShowPage: function(page, e)
	{	switch(page)
		{	// Resize map
			case "fiche2":
				$("body").addClass("fiche");
				this.map.updateSize();
				break;
			default: break;
		}
	},

	/** A new page is hidden
	*/
	onHidePage: function(page, e)
	{	switch(page)
		{	// Resize map
			case "fiche2":
				$("body").removeClass("fiche");
				this.map.updateSize();
				break;
			default: break;
		}
	},

	/** Show/hide menu
	*/
	onMenu: function() 
	{	this.hidePage();
	},

	/** Show Selection
	*/
	showSelect: function()
	{	var f = this.lastPoint;
		if (!f) return;

		// Set attributes
		$('#fiche2 .rn [data-attr]').each(function()
			{	var a = f.get($(this).data("attr"));
				if (a)
				{	var neq = $(this).data("neq");
					var eq = $(this).data("eq");
					if (neq || eq) 
					{	if (a!=neq || a==eq) $(this).show();
						else $(this).hide();
					}
					else $(this).text(($(this).data("prefix") || "") + a + ($(this).data("suffix") || "") );
				}
				else $(this).text("");
			});	
		
		// Plan
		var plan = $('[data-role="onglet-li"][data-list="plan"]');
		plan.html("");
		var levels = f.get("levels");
		var self = this;
		/*
		if (this.geoimgLayer) 
		{	this.map.removeLayer(this.geoimgLayer);
			this.geoimgLayer = false;
		}
		*/
		if (!levels)
		{	$("<p>").text("Pas de plan disponible...").appendTo(plan);
		}
		else
		{	for (var i=0; i<levels.length; i++)
			{	$("<img>").attr('src','data/'+levels[i].file)
					.data("level",levels[i])
					.on ("click touch", function(e)
					{	e.preventDefault();
						e.stopPropagation();
						if (self.geoimgLayer) self.map.removeLayer(self.geoimgLayer);
						var l = $(this).data("level");
						var geoimg = self.geoimgLayer = new ol.layer.Image(
						{	name: "Georef",
							opacity: 1,
							source: new ol.source.GeoImage(
							{	url: 'data/'+l.file,
								imageCenter: l.georef.imageCenter,
								imageScale: l.georef.imageScale,
								imageMask: l.georef.imageMask,
								imageRotate: l.georef.imageRotate,
								projection: 'EPSG:3857'
							})
						});
						self.map.addLayer(geoimg);
					})
					.appendTo(plan);
			}
		}
		
		// Photo
		var photo =	$('[data-role="onglet-li"][data-list="photo"]').removeClass().addClass('loading');
		var image = $("img", photo);
		var url = f.get("thumbnail");
		if (url)
		{	image.attr("src", url);
			$("#bandeau img").attr("src", url);
			photo.removeClass();
		}
		else 
		{	photo.removeClass().addClass('noimg');
			$("#bandeau img").attr("src", "img/bandeau.jpg");
		}
		
		this.showPage(['fiche2','bandeau']);
	},

	getFeatureName: function(f)
	{	return f.get('label');
	},
	getFeatureCoord: function(f)
	{	return ol.coordinate.toStringHDMS(ol.proj.transform(f.getGeometry().getCoordinates(), this.map.getView().getProjection(), 'EPSG:4326')).replace(/ /g,"").replace("N","N ");
	},


	/** Fires when the user presses the back button
	*/
	onBackButton: function() 
	{	if (this.getPage()) this.hidePage();
		else this.quit(); 
	},

	/**
	*/
	moveEnd: function(e)
	{	if (!this.select.getActive()) return;
		var f;
		// Selection
		if (e.selected)
		{	if (e.selected.length) this.selected = f = e.selected[0];//.get('features')[0];
			else this.selected = false;
		}
		// Selection or closest to center
		f = this.selected || this.geosource.getClosestFeatureToCoordinate ( this.map.getView().getCenter() );
		// allready done
		if (this.lastPoint === f) return;
		// No feature
		if (!f)
		{	$("#selection").html(_T("pas de sélection"));
			return;
		}
		// Show Info
		var nom = this.getFeatureName(f);
		var coord = this.getFeatureCoord(f);
		var img = this.getStyleImage(f);
		$("#selection").html(nom+" ("+coord+")")
			.prepend($("<img>").attr('src',img));
		this.select.getFeatures().clear();
		this.select.getFeatures().push(f);
		this.lastPoint = f;
		if (this.isPage("fiche2")) this.showSelect();
	},

	/**

	/** Save current position 
	*/
	saveContext: function()
	{	var pos = this.map.getView().getCenter();
		var zoom = this.map.getView().getZoom();
		this.param['position'] = { lon:Math.round(pos[0]*100)/100, lat:Math.round(pos[1]*100)/100, zoom:zoom };
		var layers=[]; 
		wapp.map.getLayers().forEach(function(l)
		{	if (l.getVisible() && l.get('name')) layers.push(l.get('name'));
		})
		this.param['layers'] = layers;
		this.saveParam();
	},

	/** Ask for quit on quit
	*/
	quit: function()
	{	// www
		/*
		if (!this.isCordova)
		{	this.saveContext();
			this.geolocation.setTracking(false);
			return;
		}
		*/
		// Mobile
		var self = this;
		this.message(_T("Voulez-vous quitter l'aplication&nbsp;?"), _T("Quitter"), [_T("Annuler"),_T("OK")],
			function (button)
			{	if (button == "2") 
				{	self.saveContext();
					self.geolocation.setTracking(false);
					navigator.app.exitApp();
				}
			}
		);
	},

	/** Save context on pause
	*/
	pause: function()
	{	this.saveContext();
	}
});
