/**
 * 
 */
wapp.addLocateControl = function()
{	var self = this;
	
	// Geolocation Control
	var geoloc = this.geolocation = new ol.Geolocation(/** @type {olx.GeolocationOptions} */ 
	({	projection: this.map.getView().getProjection(),
		trackingOptions: 
		{	maximumAge: 10000,
			enableHighAccuracy: true,
			timeout: 600000
		}
	}));
	this.geolocation.on('change', this.locate, this);
	// Control to start position tracking
	var gloc = new ol.control.Toggle(
	{	"class":"geolocCtrl", 
		"html":"<i class='tools-locate'></i>",
		"toggleFn": function()
		{	var b = !geoloc.getTracking();
			geoloc.setTracking(b);
			if (b) $("#info").html("").show();
			else $("#info").hide();
		}
	});
	this.map.addControl (gloc);
}

/** Do something when a new location is triggered
*/
wapp.locate = function()
{	var position = this.geolocation.getPosition();
	var accuracy = this.geolocation.getAccuracy();
	var heading = this.geolocation.getHeading() || 0;
	var speed = this.geolocation.getSpeed() || 0;
		
	//var m = Date.now();
	//addPosition(position, heading, m, speed);
	this.map.pulse(position);
	this.map.getView().setCenter(position);
	var lonlat = ol.proj.transform(position, this.map.getView().getProjection(), 'EPSG:4326')

	var html = [
		'Position: ' + lonlat[0].toFixed(6) + ', ' + lonlat[1].toFixed(6),
		'Accuracy: ' + accuracy.toFixed(1),
		'Heading: ' + Math.round(heading*180/Math.PI) + '&deg;',
		'Speed: ' + (speed * 3.6).toFixed(1) + ' km/h'
	].join('<br />');
	var info = $('#info').html(html);

	// getClosestFeatureToCoordinate
	var f = this.geosource.getClosestFeatureToCoordinate(position);
	if (f)
	{	$("<hr>").appendTo(info);
		var nom = f.get('rn_nom') ? "RN "+f.get('rn_nom') : "Site "+(f.get('sit_type_diff')||"") + " " +f.get('sit_no');
		$("<p>").html(nom+"<br/>"+JSON.parse(f.get('the_geom')).coordinates.join('-')).appendTo(info);
	}
};
