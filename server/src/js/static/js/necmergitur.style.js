(function() 
{	// Cached style
	var styleCache =  {};
	
	/** Get the feature style
	*	@param {ol.Feature} the feature to get the style for
	*	@param {bool} true if the feature  is selected
	*/
	wapp.getFeatureStyle = function(feature, sel)
	{	var th = "fa-star";
		var type = feature.get('type');
		switch (type)
		{	case "J": //Structures d’accueil pour personnes âgées ou personnes handicapées
				th = "ign-service-handicap";
				break;
			case "L": //Salles d'auditions, de conférences, de réunions, de spectacles ou à usage multiple
				th = "ign-loisir-theatre";
				break;
			case "M": //Magasins de vente, centres commerciaux
				th = "ign-commerce-boutique";
				break;
			case "N": //Restaurants et débits de boisson
				th = "ign-commerce-cafe";
				break;
			case "O": //Hôtels et autres établissements d’hébergement
				th = "ign-tourisme-hotel";
				break;
			case "P": //Salles de danse et salles de jeux
				th = "ign-loisir-theatre";
				break;
			case "R": //Établissements d’éveil, d’enseignement, de formation, centres de vacances, centres de loisirs sans hébergement
				th = "ign-education-ecole";
				break;
			case "S": //Bibliothèques, centres de documentation
				th = "ign-service-livre";
				break;
			case "T": //Salles d'exposition à vocation commerciale
				th = "ign-loisir-theatre";
				break;
			case "U": //Établissements de soins
				th = "ign-service-hopital";
				break;
			case "V": //Établissements de divers cultes
				th = "ign-religion-abbaye";
				break;
			case "W": //Administrations, banques, bureaux
				th = "fa-futbol-o";
				break;
			case "X": //Établissements sportifs couverts
				th = "fa-futbol-o";
				break;
			case "Y": //Musées
				th = "fa-loisir-musee";
				break;
			default:
				if (type)
				{	if (type.match("/Museum")) th = "fa-camera";
					else if (type.match("/Monument")) th = "fa-building";
					else if (type.match("/Sculpture")) th = "fa-android";
					else if (type.match("/Religious")) th = "fa-institution";
					else if (type.match("/Castle")) th = "fa-key";
					else if (type.match("Water")) th = "fa-tint";
					else if (type.match("Island")) th = "fa-leaf";
					else if (type.match("/Event")) th = "fa-heart";
					else if (type.match("/Artwork")) th = "fa-asterisk";
					else if (type.match("/Stadium")) th = "fa-futbol-o";
					else if (type.match("/Place")) th = "fa-street-view";
				}
		}


		var k = th+(sel?"_1":"_0");
		var style = styleCache[k];
		if (!style)
		{	styleCache[k] = style = new ol.style.Style
			({	image: new ol.style.FontSymbol(
						{	//form: "bookmark", 
							glyph: th, 
							radius: sel?12:8, 
							//offsetX: -15,
							//offsetY: -15,
							fill: new ol.style.Fill(
							{	color: sel ? "#f00":"navy"
							}),
							stroke: new ol.style.Stroke(
							{	color: "#fff",
								width: 2
							})
						}),
						stroke: new ol.style.Stroke(
						{	width: 2,
							color: '#f80'
						}),
						fill: new ol.style.Fill(
						{	color: [255, 136, 0, 0.6]
						})
			});
		}
		return [style];
	};

	var imgCache = {};
	/** Get animage of the feature
	*	@param {ol.Feature} the feature to get the style for
	*/
	wapp.getStyleImage = function(f)
	{	var type = f.get('type');
		// Create image if not exist
		if (!imgCache[type])
		{	var canvas = document.createElement('canvas');
			var ctx = canvas.getContext("2d");
			var st = this.getFeatureStyle(f);
			var img0 = st[0].getImage().getImage();
			canvas.width = img0.width;
			canvas.height = img0.height;
			for (var i=0; i<st.length; i++)
			{	var img = st[i].getImage().getImage();
				ctx.drawImage(img,(img0.width-img.width)/2, (img0.height-img.height)/2);
			}
			imgCache[type] = canvas.toDataURL("image/png");
		}
		return imgCache[type];
		//return this.getFeatureStyle(f)[0].getImage().getImage().toDataURL("image/png");
	}
})();