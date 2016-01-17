/*
	Copyright (c) 2013 Jean-Marc VIGLINO, 
	released under the CeCILL license (http://www.cecill.info/).
	
	Geoportail API config object.
	Default parameters to access Geoportail's services.
	The capabilities can be enumerated for each API key.
	
*/
var geoportailConfig =
{	// url of the services
	url: "http://wxs.ign.fr/",
	// Default layer capabilities
	capabilities:
	{	"default":
		{	"BASELAYER":{minZoom:0, maxZoom:20, visibility:false, displayInLayerSwitcher:false, "title":"Baselayer","format":"image/jpeg","tilematrix":"PM","style":"normal","bbox":[-178.187,-84,178,84]},

			// Geoportal 
			"GEOGRAPHICALGRIDSYSTEMS.ETATMAJOR40":{"title":"Carte de l'état-major (1820-1866)","order":"9972000","format":"image/jpeg","tilematrix":"PM","style":"normal","minZoom":6,"maxZoom":15,"bbox":[-6.0888886,41.18441,10.96101,51.274532],"desc":"Carte française en couleurs du XIXè siècle en couleurs superposable aux cartes et données modernes.","keys":"Cartes historiques","legend":[null],"originators":{"IGN":{"href":"http://www.ign.fr","attribution":"Institut national de l'information géographique et forestière","logo":"http://wxs.ign.fr/static/logos/IGN/IGN.gif","minZoom":6,"maxZoom":15,"bbox":[-6.0888886,41.18441,10.96101,51.274532]}}},
			"ELEVATION.SLOPES":{"title":"Carte du relief","order":"9890000","format":"image/jpeg","tilematrix":"PM","style":"normal","minZoom":6,"maxZoom":14,"bbox":[-178.20589,-22.595179,167.43176,50.93085],"desc":"La couche altitude se compose d'un MNT (Modèle Numérique de Terrain) affiché en teintes hypsométriques et issu de la BD ALTI®.","keys":"Cartes","legend":[null],"originators":{"IGN":{"href":"http://www.ign.fr","attribution":"Institut national de l'information géographique et forestière","logo":"http://wxs.ign.fr/static/logos/IGN/IGN.gif","minZoom":6,"maxZoom":14,"bbox":[-178.20589,-22.595179,167.43176,50.93085]}}},
			"TRANSPORTNETWORKS.ROADS":{"title":"Routes","order":"8990000","format":"image/png","tilematrix":"PM","style":"normal","minZoom":6,"maxZoom":18,"bbox":[-63.37252,-21.475586,55.925865,72.67905],"desc":"Affichage du réseau routier français et européen.","keys":"Réseau routier","legend":[null,null,null],"originators":{"IGN":{"href":"http://www.ign.fr","attribution":"Institut national de l'information géographique et forestière","logo":"http://wxs.ign.fr/static/logos/IGN/IGN.gif","minZoom":15,"maxZoom":9,"bbox":[-63.37252,-21.475586,55.925865,51.31212]},"EUROGEOGRAPHICS":{"href":"http://www.eurogeographics.org/","attribution":"Eurogeographics","logo":"http://wxs.ign.fr/static/logos/EUROGEOGRAPHICS/EUROGEOGRAPHICS.gif","minZoom":6,"maxZoom":9,"bbox":[-26.711018,20.991827,54.909374,72.67905]}}},
			"ORTHOIMAGERY.ORTHOPHOTOS":{"title":"Photographies aériennes","order":"9990000","format":"image/jpeg","tilematrix":"PM","style":"normal","minZoom":0,"maxZoom":19,"bbox":[-180,-86,180,84],"desc":"Photographies aériennes","keys":"Photographies","legend":[null,null,null],"originators":{"CNES":{"href":"http://www.cnes.fr/","attribution":"Centre national d'études spatiales (CNES)","logo":"http://wxs.ign.fr/static/logos/CNES/CNES.gif","minZoom":19,"maxZoom":13,"bbox":[2.2656832,45.279934,4.0227704,46.8038]},"SIGLR":{"href":"http://www.siglr.org//","attribution":"SIGLR","logo":"http://wxs.ign.fr/static/logos/SIGLR/SIGLR.gif","minZoom":19,"maxZoom":13,"bbox":[1.6784439,42.316307,4.8729386,44.978218]},"IGN":{"href":"http://www.ign.fr","attribution":"Institut national de l'information géographique et forestière","logo":"http://wxs.ign.fr/static/logos/IGN/IGN.gif","minZoom":19,"maxZoom":13,"bbox":[-63.160706,-21.401262,55.84643,51.090965]},"ASTRIUM":{"href":"http://www.geo-airbusds.com/","attribution":"Airbus Defence and Space","logo":"http://wxs.ign.fr/static/logos/ASTRIUM/ASTRIUM.gif","minZoom":16,"maxZoom":13,"bbox":[-55.01953,1.845384,-50.88867,6.053161]},"FEDER2":{"href":"http://www.europe-en-france.gouv.fr/","attribution":"Fonds européen de développement économique et régional","logo":"http://wxs.ign.fr/static/logos/FEDER2/FEDER2.gif","minZoom":19,"maxZoom":13,"bbox":[1.3577043,48.824635,4.269964,50.37648]},"RGD_SAVOIE":{"href":"http://www.rgd.fr","attribution":"Régie de Gestion de Données des Pays de Savoie (RGD 73-74)","logo":"http://wxs.ign.fr/static/logos/RGD_SAVOIE/RGD_SAVOIE.gif","minZoom":19,"maxZoom":13,"bbox":[5.7759595,45.65335,7.0887337,46.438328]},"CRAIG":{"href":"http://www.craig.fr","attribution":"Centre Régional Auvergnat de l'Information Géographique (CRAIG)","logo":"http://wxs.ign.fr/static/logos/CRAIG/CRAIG.gif","minZoom":19,"maxZoom":13,"bbox":[2.0398402,44.60505,4.5090737,46.8038]},"CG45":{"href":"http://www.loiret.com","attribution":"Le conseil général du Loiret","logo":"http://wxs.ign.fr/static/logos/CG45/CG45.gif","minZoom":19,"maxZoom":13,"bbox":[1.4883244,47.471867,3.1349874,48.354233]},"e-Megalis":{"href":"http://www.e-megalisbretagne.org//","attribution":"Syndicat mixte de coopération territoriale (e-Megalis)","logo":"http://wxs.ign.fr/static/logos/e-Megalis/e-Megalis.gif","minZoom":19,"maxZoom":13,"bbox":[-5.1937118,47.23789,-0.98568505,48.980812]},"PPIGE":{"href":"http://www.ppige-npdc.fr/","attribution":"PPIGE","logo":"http://wxs.ign.fr/static/logos/PPIGE/PPIGE.gif","minZoom":19,"maxZoom":13,"bbox":[1.5212119,49.957302,4.2673664,51.090965]},"CG06":{"href":"http://www.cg06.fr","attribution":"Département Alpes Maritimes (06) en partenariat avec : Groupement Orthophoto 06 (NCA, Ville de Cannes, CARF, CASA,CG06, CA de Grasse) ","logo":"http://wxs.ign.fr/static/logos/CG06/CG06.gif","minZoom":19,"maxZoom":13,"bbox":[6.6093955,43.44647,7.7436337,44.377018]},"DITTT":{"href":"http://www.dittt.gouv.nc/portal/page/portal/dittt/","attribution":"Direction des Infrastructures, de la Topographie et des Transports Terrestres","logo":"http://wxs.ign.fr/static/logos/DITTT/DITTT.gif","minZoom":18,"maxZoom":13,"bbox":[163.47784,-22.767689,167.94624,-19.434975]},"PLANETOBSERVER":{"href":"http://www.planetobserver.com/","attribution":"PlanetObserver (images satellites)","logo":"http://wxs.ign.fr/static/logos/PLANETOBSERVER/PLANETOBSERVER.gif","minZoom":0,"maxZoom":12,"bbox":[-180,-86,180,84]}}},
			"CADASTRALPARCELS.PARCELS":{"title":"Parcelles cadastrales","order":"9790000","format":"image/png","tilematrix":"PM","style":"bdparcellaire","minZoom":0,"maxZoom":20,"bbox":[-63.160706,-21.39223,55.84643,51.090965],"desc":"Limites des parcelles cadastrales issues de plans scannés et de plans numériques.","keys":"Parcelles cadastrales","legend":[null],"originators":{"IGN":{"href":"http://www.ign.fr","attribution":"Institut national de l'information géographique et forestière","logo":"http://wxs.ign.fr/static/logos/IGN/IGN.gif","minZoom":20,"maxZoom":0,"bbox":[-63.160706,-21.39223,55.84643,51.090965]}}},
			"GEOGRAPHICALGRIDSYSTEMS.PLANIGN":{"title":"Plan IGN","format":"image/jpeg","tilematrix":"PM","style":"normal","minZoom":6,"maxZoom":18,"bbox":[-179.5,-75,179.5,75],"desc":"Représentation graphique des bases de données IGN.","keys":"Cartes","legend":[null,null,null,null],"originators":{"IGN":{"href":"http://www.ign.fr","attribution":"Institut national de l'information géographique et forestière","logo":"http://wxs.ign.fr/static/logos/IGN/IGN.gif","minZoom":16,"maxZoom":9,"bbox":[-63.37252,-21.475586,55.925865,51.31212]},"EUROGEOGRAPHICS":{"href":"http://www.eurogeographics.org/","attribution":"Eurogeographics","logo":"http://wxs.ign.fr/static/logos/EUROGEOGRAPHICS/EUROGEOGRAPHICS.gif","minZoom":14,"maxZoom":9,"bbox":[-63.37252,-21.475586,55.925865,51.31212]}}},
			"GEOGRAPHICALGRIDSYSTEMS.MAPS":{"title":"Cartes IGN","order":"9980000","format":"image/jpeg","tilematrix":"PM","style":"normal","minZoom":0,"maxZoom":18,"bbox":[-180,-68.138855,180,80],"desc":"Cartes IGN","keys":"Cartes","legend":[null,null,null,null],"originators":{"IGN":{"href":"http://www.ign.fr","attribution":"Institut national de l'information géographique et forestière","logo":"http://wxs.ign.fr/static/logos/IGN/IGN.gif","minZoom":18,"maxZoom":6,"bbox":[-180,-60,180,80]},"NCL-DITTT":{"href":"http://www.dittt.gouv.nc/portal/page/portal/dittt","attribution":"Direction des Infrastructures, de la Topographie et des Transports Terrestres du gouvernement de la Nouvelle-Calédonie","logo":"http://wxs.ign.fr/static/logos/NCL-DITTT/NCL-DITTT.gif","minZoom":16,"maxZoom":8,"bbox":[163.47784,-22.79525,168.19109,-19.494438]}}}
		}
	}
};

/** Jquery autoconf
	key			{String} the API key
	success		{function} a collaback function 
*/
geoportailConfig.jqautoconf = function(key, success)
{	var geopresolutions = [156543.03390625,78271.516953125,39135.7584765625,19567.87923828125,9783.939619140625,4891.9698095703125,2445.9849047851562,1222.9924523925781,611.4962261962891,305.74811309814453,152.87405654907226,76.43702827453613,38.218514137268066,19.109257068634033,9.554628534317017,4.777314267158508,2.388657133579254,1.194328566789627,0.5971642833948135,0.29858214169740677,0.14929107084870338];
	function getZoom(res)
	{	res = Number(res);
		res *= 0.000281;
		for (var r=0; r<geopresolutions.length; r++) 
			if (res>geopresolutions[r]) return r;
	}
	function getBbox(bbox)
	{	bbox = bbox.split(",");
		for (var k=0; k<bbox.length; k++) bbox[k] = Number(bbox[k]);
		return bbox;
	}

	$.ajax("http://wxs.ign.fr/"+key+"/autoconf/?output=json",
	{	dataType:"jsonp",
		success:function(resp, status)
		{	var xml = $.parseXML(resp.xml.replace(/xlink:|sld:|gpp:/g,""));
			var o, z, js = {};
			if (!key) js.BASELAYER = geoportailConfig.capabilities['default'].BASELAYER;
			var layers = $(xml).find("Layer");
			for (var i=0; i<layers.length; i++)
			{	var l = $(layers[i]);
				if (!/WMTS/.test(l.find("Server").attr("service"))) continue;
				if (!/geoportail\/wmts/.test(l.find("OnlineResource").attr("href"))) continue;
				var service = js[l.find("Name:first").text()] = {};
				service.title = l.find("Title:first").text();
				service.order = l.find("Extension Layer").attr("order");
				service.format = l.find("Format:first").text();
				service.tilematrix = "PM";
				service.style = l.find("Style:first Name").text();
				service.minZoom = getZoom(l.find("MaxScaleDenominator:first").text());
				service.maxZoom = getZoom(l.find("MinScaleDenominator:first").text());
				service.bbox = getBbox (l.find("Extension BoundingBox:first").text());
				service.desc = l.find("Abstract:first").text();
				service.keys = l.find("Thematic").text();
				service.qlook = l.find("QuickLook OnlineResource").attr("xlink:href");
				if (/NOPIC|defaut/.test(service.qlook)) delete service.qlook;
				service.legend = [];
				l.find("LegendURL OnlineResource").each(function()
				{	if (!/NOLEGEND/.test($(this).attr("xlink:href"))) service.legend .push ($(this).attr("xlink:href"));
				});
				service.originators = {};
				l.find("Originators Originator").each(function()
				{	o = 
					{	href: $(this).find("URL").text(),
						attribution : $(this).find("Attribution").text(),
						logo : $(this).find("Logo").text(),
						minZoom: 0,
						maxZoom: 20
					};
					// Contrainte d'echelle
					$(this).find("Constraint").each(function()
					{	z = getZoom($(this).find("MinScaleDenominator:first").text());
						if (z<o.maxZoom) o.maxZoom = z;
						z = getZoom($(this).find("MaxScaleDenominator:first").text());
						if (z>o.minZoom) o.minZoom = z;
						o.bbox = getBbox ($(this).find("BoundingBox:first").text());
					})
					service.originators[$(this).attr("name")] = o;
				});
			}
			geoportailConfig.capabilities[(key?key:'default')] = js;
			if (typeof success == "function") success(js);
		},
		error:function()
		{	if (typeof success == "function") success(false); 
		}
	});
};
