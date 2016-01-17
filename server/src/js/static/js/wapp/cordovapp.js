/**
	@brief: Cordova web application 
	@author: Jean-Marc Viglino (ign.fr)
	@copyright: IGN 2015
	
	@require: JQuery
*/

/* i18n */
if (!window._T) window._T = function(s) { return s; }

/*
 * @classdesc
 *	Web application pour Cordova 
 * 
 */
var CordovApp = function(obj)
{	var self = this;

	/**  Cordova app (or browser) */
	this.isCordova = window.cordova ? true:false;

	/** Webapp parameters: localStorage['WebApp@param'] */
	this.param = {};

	/** Show an alert
	*	@param {String} message to alert
	*	@param {String} title for the dialod
	*	@param {bool} true to use notification
	*/
	this.alert = function (what, titre, notif)
	{	// Use internal dialog
		if (!notif && this.Dialog)
		{	this.Dialog.show(what,
				{	title: titre||_T("ALERTE"),
					buttons: ["OK"],
					classe: "alert"
				});
			return;
		}
		// Use notification
		if (navigator.notification) navigator.notification.alert(what,null,titre?titre:_T("ALERTE"));
		else alert (what);
	}
	
	/** Show a message 
	*	@param {String} message to alert
	*	@param {String} title for the dialod
	*	@param {Array{String}} list of button labels
	*	@param {function} callback function with index of pressed button as argument
	*	@param {bool} true to use notification
	*/
	this.message = function (message, titre, boutons, callback, notif)
	{	// Use internal dialog
		if (!notif && this.Dialog)
		{	this.Dialog.show(message,
				{	title: titre||_T("MESSAGE"),
					callback: callback,
					buttons: boutons,
					classe: "message"
				});
			return;
		}
		// Use notification
		if (navigator.notification)
		{	navigator.notification.confirm
			(	message?message:"", 
				callback, 
				titre?titre:_T("Message"), 
				boutons?boutons:["OK"]
			);
		}
		else 
		{	callback (confirm(message?message:titre)?2:1);
		}
	}
	
	/** Save app parameters
	*/
	this.saveParam = function()
	{	localStorage['WebApp@param'] = JSON.stringify(this.param);
	};
	
	/** Reset app parameters (load from localStorage)
	*/
	this.resetParam = function()
	{	if (localStorage['WebApp@param']) this.param = JSON.parse(localStorage['WebApp@param']);
		else this.param = {};
	};
	
	/** Constructor
	* @api
	*/
	this.initialize = function() {};

	/** Quit the app
	* @api
	*/
	this.quit = function()
	{	navigator.app.exitApp();
	};
	
	/** Fires when the user presses the menu button
	* @api
	*/
	this.onMenuButton = function() { this.toggleMenu(); };
	
	/** Fires when the user presses the back button
	* @api
	*/
	this.onBackButton = function() { this.quit(); };

	/** Pause the app 
	* @api
	*/
	this.pause = function() {};

	/** Resume 
	* @api
	*/
	this.resume = function() {};

	/** Application initialisation
	* @private
	*/
	this._init = function()
	{	var self = this;

		// Minimize latences (si fastclick.js)...
		if (window.FastClick)
		{	FastClick.attach(document.body);
			console.log ("FastClick");
		}
		// Get last params
		this.resetParam();

		// Device button behavior
		document.addEventListener("menubutton", function()
		{	if (!self.Dialog.close()) self.onMenuButton();
		}, false);
		document.addEventListener("backbutton", function()
		{	if (!self.Dialog.close()) self.onBackButton();
		}, false);
		
		// Pause / resume behavior
		document.addEventListener("pause", function(){self.pause()}, false);
		document.addEventListener("resume", function(){self.resume();}, false);

		// 
		if (this.menu)
		{	$(document).on("showpage", function(e)
			{	self.onShowPage(e.page, e); 
			});
			$(document).on("hidepage", function(e)
			{	self.onHidePage(e.page, e); 
			});
			$(document).on("menu", function(e)
			{	self.onMenu(); 
			});
		}
		
		// initialize app
		self.initialize();

		// Close splashscreen (if any)
		if (navigator.splashscreen) navigator.splashscreen.hide();
	};
	
	// Extend user class
	$.extend(this,obj);

	// Run on ready
	$(document).ready(function()
	{	// Load pages 
		//if (CordovApp.loadPages) CordovApp.loadPages();

		if (window.cordova)
		{	document.addEventListener("deviceready", function(){self._init();}, false);
			return;	
		}
		self._init();
	});

	$("body").on("click touchstart","i.clear-input",function()
		{	var i = $(this).prev();
			if (i.prop('nodeName')=="INPUT") i.val("").focus();
		});


	// Try to scroll input when outside
	/** /
	$(window).on("resize", function()
	{	var input = $("input:focus");
		if (!input.length) return;
		var top = input.offset().top + input.height() ;
		if (top > $(document).height())
		{	var parent = $(this).parent();
			while ( parent && !parent.scrollTop(input.position().top).scrollTop())
			{	parent = parent.parent();
			}
		}
	});
	/**/

	$(window).on('beforeunload', function()
	{	return wapp.quit();
	});
}