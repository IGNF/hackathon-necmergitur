/**
	@brief: Cordova web application 
	@author: Jean-Marc Viglino (ign.fr)
	@copyright: IGN 2015
	
	@require: JQuery
*/

/** Connect parameters to data-input-role div 
* @param {object} a jQuery element to search data-input
* @param {object} a param objet with key corresponding to data-param
* @param {onchage} a function that trigger change on params
*/
CordovApp.prototype.setParamInput = function(elt, param, onchange)
{	var self = this;
	elt = $(elt);
			
	function setValue (elt, v)
	{	var p = elt.data("param");
		switch (elt.data("input"))
		{	case "check":
				if (typeof(v)!="boolean") v = elt.data("default");
				if (v) elt.addClass("checked");
				else  elt.removeClass("checked");
				break;
			case "select":
				var found = false;
				$('[data-input-role="option"]', elt).each(function()
				{	if ($(this).data('val')==v) 
					{	found = true;
						$(this).addClass("selected");
					}
					else $(this).removeClass("selected");
				});
				if (!found) v = $('[data-input-role="option"][data-default]', elt).addClass("selected").data('val');
				break;
			default: break;
		}
		param[p] = v;
		if (onchange) onchange ({ name:p, param:param, val:v });
	}

	$("[data-input]", elt).each(function()
		{	var $this = $(this);
			var p = $this.data('param');
			setValue ($this, param[p]);
		})
		.on("click touchstart", function(e)
		{	e.stopPropagation();
			e.preventDefault();
			var $this = $(this);
			var p = $this.data('param');
			if (param.hasOwnProperty(p))
			{	switch ($this.data('input'))
				{	case "check":
						setValue ($this, !$this.hasClass("checked"));
						break;
					case "select":
						var content = $("<ul>").attr("data-role","select");
						var l = $("[data-input-role]", $this);
						for (var i=0; i<l.length; i++)
						{	var li = $(l[i]);
							$("<li>").html(li.html())
								.data("li",li)
								.addClass(li.hasClass("selected")?"selected":"")
								.on("click touchstart", function(e)
								{	e.stopPropagation();
									e.preventDefault();
									setValue($this, $(this).data("li").data("val"));
									$(this).addClass("selected");
									self.Dialog.close();
								})
								.appendTo(content);
						}
						self.Dialog.show(content, { title: $("label",$this).html() });
						break;
					default: break;
				};
			}
		})
		.on("change", function()
		{	if (onchange) 
			{	var p = $(this).data('param');
				if (param.hasOwnProperty(p))
					onchange ({ name:p, param:param, val:param[p] });
			}
		});
};