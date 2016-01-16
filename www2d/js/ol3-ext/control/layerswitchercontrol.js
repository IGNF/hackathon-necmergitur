/*
	Copyright (c) 2015 Jean-Marc VIGLINO, 
	released under the CeCILL license (http://www.cecill.info/).
	
*/

/**
 * OpenLayers 3 Layer Switcher Control.
 *
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} opt_options Control options.
 */
ol.control.LayerSwitcher = function(opt_options) 
{	var options = opt_options || {};
	var self = this;
	this.dcount = 0;
	this.step_opacity = options.step_opacity || 0.5;
	this.show_progress = options.show_progress;

	var element;
	if (options.target) 
	{	element = $("<div>").addClass(options.switcherClass || "ol-layerswitcher");
	}
	else
	{	element = $("<div>").addClass((options.switcherClass || 'ol-layerswitcher') +' ol-unselectable ol-control ol-collapsed');
	
		$("<button>").on("touchstart", function(e){ element.toggleClass("ol-collapsed"); e.preventDefault(); })
					.mouseover(function(){ element.removeClass("ol-collapsed"); })
					.click (function(){ element.toggleClass("ol-forceopen").addClass("ol-collapsed"); })
					.appendTo(element);
		$(element).mouseleave (function(){ element.addClass("ol-collapsed"); })
	}
	this.panel_ = $("<ul>").addClass("panel")
				.appendTo(element);

	ol.control.Control.call(this, 
	{	element: element.get(0),
		target: options.target
	});

};
ol.inherits(ol.control.LayerSwitcher, ol.control.Control);

/**
 * Set the map instance the control is associated with.
 * @param {ol.Map} map The map instance.
 */
ol.control.LayerSwitcher.prototype.setMap = function(map) 
{   ol.control.Control.prototype.setMap.call(this, map);
	this.drawPanel();

	if (this.map_)
	{	this.map_.getLayerGroup().un('change', this.drawPanel, this);
		this.map_.getView().un('propertychange', this.viewChange, this);
	}

	this.map_ = map;
	// Get change (new layer added or removed)
	if (map) 
	{	map.getLayerGroup().on('change', this.drawPanel, this);
		map.getView().on('propertychange', this.viewChange, this);
	}

};


/**
*	On view change hide layer depending on resolution
*/
ol.control.LayerSwitcher.prototype.viewChange = function(e) 
{	switch (e.key) 
	{	case 'resolution':
		{	var res = this.map_.getView().getResolution();
			$("li", this.panel_).each(function()
			{	var l = $(this).data('layer');
				if (l)
				{	if (l.getMaxResolution()<=res || l.getMinResolution()>=res) $(this).addClass("ol-layer-hidden");
					else $(this).removeClass("ol-layer-hidden");
				}
			});
			break;
		}
		default: 
			break;
	}
}

/**
*	Draw the panel control
*/
ol.control.LayerSwitcher.prototype.drawPanel = function(e) 
{	var map = this.getMap();
	if (!map) return;
	var self = this;
	// Multiple event simultaneously / draw once => put drawing in the event queue
	this.dcount++;
	setTimeout (function(){ self.drawPanel_(); }, 0);
}

/** Delayed draw panel control 
*/
ol.control.LayerSwitcher.prototype.drawPanel_ = function(e) 
{	if (--this.dcount) return;
	this.panel_.html("");
	this.drawList (this.panel_, this.getMap().getLayers().getArray());
}

/** Change layer visibility
*/
ol.control.LayerSwitcher.prototype.switchLayerVisibility = function(l, layers)
{	if (!l.get('baseLayer')) l.setVisible(!l.getVisible());
	else 
	{	if (!l.getVisible()) l.setVisible(true);
		for (var i=0; i<layers.length; i++)
		{	if (l!==layers[i] && layers[i].get('baseLayer') && layers[i].getVisible()) layers[i].setVisible(false);
		}
	}
}

/** Check if layer is visible
*/
ol.control.LayerSwitcher.prototype.testLayerVisibility = function(layer)
{	if (this.map_)
	{	var res = this.map_.getView().getResolution();
		return (layer.getMaxResolution()<=res || layer.getMinResolution()>=res);
	}
	return false;
}

/**
*	Render a list of layer
*/
ol.control.LayerSwitcher.prototype.drawList = function(ul, layers)
{	var self = this;
	var setVisibility = function(e) 
	{	e.stopPropagation();
		var l = $(this).parent().data("layer");
		self.switchLayerVisibility(l,layers);
	};
	var setOpacity = function(e)
	{	e.stopPropagation();
		var l = $(this).parent().parent().data("layer");
		l.setOpacity($(this).data('val')); 
	};
	function moveLayer (l, layers, inc)
	{	for (var i=0; i<layers.getLength(); i++)
		{	if (layers.item(i) === l) 
			{	layers.remove(l);
				layers.insertAt(i+inc, l);
				return true;
			}
			if (layers.item(i).getLayers && moveLayer (l, layers.item(i).getLayers(), inc)) return true;
		}
		return false;
	};
	function moveLayerUp(e) 
	{	e.preventDefault(); 
		moveLayer($(this).parent().data("layer"), self.map_.getLayers(), -1); 
	};
	function moveLayerDown(e) 
	{	e.preventDefault(); 
		moveLayer($(this).parent().data("layer"), self.map_.getLayers(), +1); 
	};
	
	// Add the layer list
	for (var i=0; i<layers.length; i++)
	{	var layer = layers[i];
		if (layer.get("displayInLayerSwitcher")===false) continue;
		
		var d = $("<li>").addClass(layer.getVisible()?"visible":"")
						.data("layer",layer); //.appendTo(ul);
		if (this.testLayerVisibility(layer)) d.addClass("ol-layer-hidden");
		
		//  up/down
		if (i>0) 
		{	$("<div>").addClass("layerup")
				.click (moveLayerUp)
				.on ('touchstart', moveLayerUp)
				.appendTo(d);
		}
		if (i<layers.length-1) 
		{	$("<div>").addClass("layerdown")
				.click (moveLayerDown)
				.on ('touchstart', moveLayerDown)
				.appendTo(d);
		}
		// Show/hide sub layers
		if (layer.getLayers) 
		{	$("<div>").addClass(layer.get("openInLayerSwitcher") ? "collapse-layers" : "expend-layers" )
					.click(function()
					{	var l = $(this).parent().data("layer");
						l.set("openInLayerSwitcher", !l.get("openInLayerSwitcher") )
					})
					.appendTo(d);
		}
		// Visibility
		$("<input>")
			.attr('type', layer.get('baseLayer') ? 'radio' : 'checkbox')
			.attr("checked",layer.getVisible())
			//.on ('change', setVisibility)
			.click (setVisibility)
			.on ('touchstart', setVisibility)
			.appendTo(d);
		// Label
		$("<label>").text(layer.get("title") || layer.get("name"))
			.click(function(e){ $(this).prev().click(); })
			.attr('unselectable', 'on')
			.css('user-select', 'none')
			.on('selectstart', false)
			.appendTo(d);

		// Progress
		if (this.show_progress && layer instanceof ol.layer.Tile)
		{	var p = $("<div>")
				.addClass("layerswitcher-progress")
				.appendTo(d);
			this.setprogress_(layer);
			layer.layerswitcher_progress = p;
		}

		// Opacity
		var opacity = $("<div>")
			.addClass("layerswitcher-opacity")
			.addClass(("layerswitcher-opacity-"+this.step_opacity).replace(".","_"))
			.appendTo(d);
		var op = true;
		for (var k=0; k<=10; k+=this.step_opacity) 
		{	var opi = $("<div>").append($("<div>").css('opacity',k/10))
				.addClass("opacity-"+(10*k))
				.data("val",k/10)
				.click(setOpacity)
				.on('mouseup',setOpacity)
				.on('touchstart',setOpacity)
				.appendTo(opacity);
			if (op && k/10 >= layer.getOpacity())
			{	opi.addClass('select');
				op=false;
			}
		}

		// Layer group
		if (layer.getLayers) 
		{	if (layer.get("openInLayerSwitcher")===true) this.drawList ($("<ul>").appendTo(d), layer.getLayers().getArray());
		}
		// Add to the list
		d.appendTo(ul);
	}
};

/** @private
*/
ol.control.LayerSwitcher.prototype.setprogress_ = function(layer)
{	if (!layer.layerswitcher_progress)
	{	var loaded = 0;
		var loading = 0;
		function draw()
		{	if (loading === loaded) 
			{	loading = loaded = 0;
				layer.layerswitcher_progress.width(0);
			}
			else 
			{	layer.layerswitcher_progress.css('width', (loaded / loading * 90).toFixed(1) + '%');
			}
		}
		layer.getSource().on('tileloadstart', function()
		{	loading++;
			draw();
		});
		layer.getSource().on('tileloadend', function()
		{	loaded++;
			draw();
		});
		layer.getSource().on('tileloaderror', function()
		{	loaded++;
			draw();
		});
	}
}