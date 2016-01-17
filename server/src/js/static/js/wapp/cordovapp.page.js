/**
     ___ __ _ _ __   _____  __
    / __/ _` | '_ \ / _ \ \/ /
   | (_| (_| | | | |  __/>  < 
    \___\__,_|_| |_|\___/_/\_\
 
 
 * @classdesc
 *	Web application geodesique
 * 
 */
CordovApp.prototype.menu = $("[data-role='menu']");


/** Load Template
*/
(function(){

// Internal template cache array
var templates = {};

/** Call on menu show or hide
* @param tmp {string} the template file to load
* @return a jQuery object
* @api
*/
CordovApp.template = function (tmp)
{	if (typeof(tmp) != "string") return "";
	var data = "";
	// Mise en cache
	if (!templates[tmp]) 
	{	var url = tmp;
		if (tmp.indexOf("/")<0) url = "templates/"+tmp;
		templates[tmp] = $.ajax(
		{	type: "GET",
			url: url+".html",
			async: false
		}).responseText;
	}
	data = $(templates[tmp]);
	
	// Traduction
	if (window.i18n) $("[data-i18n]", data).each(function()
	{	var $this = $(this);
		$this.html(i18n.T($this.attr("data-i18n")));
	});
	return data;
}

})()


/** Call on menu show or hide
* @param event 
*	{	type {String} "menu"
*		show {bool} show or hide the menu
*	}
* @api
*/
CordovApp.prototype.onMenu = function(event) {}

/** Call on menu show or hide
* @param event 
*	{	type {String} "showPage"
*	}
* @api
*/
CordovApp.prototype.onShowPage = function(event) {}

/** Call on menu show or hide
* @param event 
*	{	type {String} "showPage"
*	}
* @api
*/
CordovApp.prototype.onHidePage = function(event) {}

CordovApp.prototype.showMenu = function()
{	this.menu.addClass("visible");
	$(document).trigger( { type:"menu", show:true } );
};

CordovApp.prototype.hideMenu = function()
{	this.menu.removeClass("visible");
	$(document).trigger( { type:"menu", show:false } );
};

CordovApp.prototype.toggleMenu = function()
{	$(document).trigger( { type:"menu", show:this.menu.hasClass("visible") } );
	this.menu.toggleClass("visible");
};

CordovApp.prototype.isMenu = function()
{	return this.menu.hasClass("visible");
};


CordovApp.prototype.showPage = function(id_page)
{	if (typeof(id_page) == "string") id_page=[id_page];
	for (var i=0; i<id_page.length; i++)
	{	if (this.isPage(id_page[i])) return; }
	// Hide page shown
	$("[data-role='page'].visible").each(function()
	{	var self = $(this)
			.trigger( { type: "hidepage", page:$(this).attr('id') } )
			.removeClass("visible");
		setTimeout (function(){ self.hide(); }, 500);
	});
	// hide menu
	this.hideMenu();
	// Show page
	function show(item)
	{	setTimeout (function() { item.addClass("visible"); }, 100);
	}
	for (var i=0; i<id_page.length; i++)
	{	var self = $("#"+id_page[i])
			.trigger( { type:"showpage", page:id_page[i] } )
			.show();
		show (self);
	}
};

CordovApp.prototype.hidePage = function(id_page)
{	if (!id_page) 
	{	$("[data-role='page'].visible").each(function()
		{	var self = $(this)
				.trigger( { type:"hidepage", page:$(this).attr('id') } )
				.removeClass("visible");
			setTimeout (function(){ self.hide(); }, 500);
		});
	}
	else 
	{	var self = $("#"+id_page)
			.trigger( { type:"hidepage", page:id_page } )
			.removeClass("visible");
		setTimeout (function(){ self.hide(); }, 500);
	}
};

CordovApp.prototype.togglePage = function(id_page)
{	var item = $("#"+id_page);
	if (item.hasClass("visible")) this.hidePage(id_page);
	else this.showPage(id_page);
};

CordovApp.prototype.isPage = function(id_page)
{	return $("#"+id_page).hasClass("visible");
}

CordovApp.prototype.getPage = function()
{	return $("[data-role='page'].visible").attr('id');
}

CordovApp.prototype.showOnglet = function(item)
{	if ($(item).hasClass('select')) return;
	var parent = $(item).parent().parent();
	$("[data-role='onglet-li']", parent).hide();
	$("div", $(item).parent()).removeClass('select');
	var onglet = $(item).data("list");
	$(item).addClass('select');
	$("[data-role='onglet-li'][data-list="+onglet+"]", parent)
		.trigger({ type:'showonglet' })
		.show();
};


/* Set page header */
$(document).ready(function()
{	// Load page template
	$('[data-role="page"]').each(function()
	{	if ($(this).data("template"))
		{	$(this).append(CordovApp.template ("page-"+$(this).data("template")) );
		}
	});
	// Load menu template
	$('[data-role="menu"]').each(function()
	{	if ($(this).data("template"))
		{	$(this).append(CordovApp.template ("menu-"+$(this).data("template")) );

		}
	});

	// Page header
	$("[data-role='header'][data-back-button='true']").prepend
	(	$("<i>").addClass("backArrowBt")
			.on('click touchstart', function(e)
			{	wapp.hidePage();
				e.preventDefault();
				e.stopPropagation();
			})
	);

	// Onglets
	$("[data-role='onglet-bt'] div").on( 'click touchstart', function(e)
	{	if ($(this).data('list')=='close') CordovApp.prototype.hidePage();
		else CordovApp.prototype.showOnglet(this);
		e.preventDefault();
		e.stopPropagation();
	});
	$("div:first", "[data-role='onglet-bt']").each(function(){ CordovApp.prototype.showOnglet(this); });
});


