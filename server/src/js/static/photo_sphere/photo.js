$(document).ready(afficherPhoto);

function afficherPhoto() {
	var loader = document.createElement('div');
	loader.className = 'loader';
	var div = document.getElementById('photobox');

	console.log(GET('number'));

	var PSV = new PhotoSphereViewer({
		panorama: 'img/42_'+GET('number')+'.jpg',

		// Container
		container: div,

		// Deactivate the animation
		time_anim: false,

		// Display the navigation bar
		navbar: true,

		// Resize the panorama
		size: {
			width: '100%',
			height: '100%'
		},

		// HTML loader
		loading_html: loader
	});
}

function GET(param) {
	var vars = {};
	window.location.href.replace( 
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			vars[key] = value !== undefined ? value : '';
		}
	);

	if ( param ) {
		return vars[param] ? vars[param] : null;	
	}
	return vars;
}