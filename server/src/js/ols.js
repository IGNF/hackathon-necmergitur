var URL = "http://wxs.ign.fr/gwnicj6lfgj2r0jz88otg61m/geoportail/ols"

var parseString = require('xml2js').parseString;
var xml = "<root>Hello xml2js!</root>"
parseString(xml, function (err, result) {
    console.dir(result);
});

module.exports = function(freeform){
	
}