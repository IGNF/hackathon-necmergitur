
/**
	@brief : 
	@author : Jean-Marc Viglino (ign.fr)
	@copyright: IGN 2012
	
	@use : JQuery
	@use : JQuery.mobile
	@use : minidb.js
*/

/**
	WebApp pour PhoneGap
*/
var WebApp = function(obj)
{	var self = this;
	// Division du menu
	this.phoneMenu = null;
	// Application phontgap
	this.phoneGap = (localStorage['WebApp@PhoneGap'] != 'false');
	// Parametres de l'appli : localStorage['WebApp@param']
	this.param = {};
	// Effet sur les menus (fermeture du menu)
	this.menuEffect = true;

	/** Afficher une alerte
	*/
	this.alert = function (what,titre)
	{	if (this.phoneGap) navigator.notification.alert(what,null,titre?titre:"ALERTE");
		else alert (what);
	}
	
	/** Afficher un message 
	*/
	this.message = function (message, titre, boutons, callback)
	{	if (this.phoneGap)
		{	navigator.notification.confirm
			(	message?message:"", 
				callback, 
				titre?titre:"Message", 
				boutons?boutons:"OK"  
			);
		}
		else alert (message?message:titre);
	}
	
	/** Afficher un message de chargement
	*/
	this.waitMsg = function(msg)
	{	if (msg===false) $.mobile.hidePageLoadingMsg();
		else 
		{	if (msg) $.mobile.showPageLoadingMsg('a', msg, true);
			else $.mobile.showPageLoadingMsg();
		}
	}
	
	/** Quitter l'application
	*/
	this.quit = function()
	{	this.message("Voulez-vous quitter l'aplication ?", "Quitter", "Annuler,OK",
			function (button)
			{	if(button == "2") navigator.app.exitApp(); 
			}
		);
	};
	
	/** Sauvegarder les parametres de l'application
	*/
	this.saveParam = function()
	{	localStorage['WebApp@param'] = JSON.stringify(this.param);
	};
	
	/** Exporter les parametres dans un fichier
	*/
	this.exportParam = function(nom)
	{	if (!nom) return;
		var self = this;
		var data = JSON.stringify(this.param);
		gpFile.write
		(	nom, data, 
			function(f) { self.message ("Le fichier "+nom+" a été correctement enregistré."); }, 
			function(error) { self.alert ("Impossible d'entregistrer le fichier "+nom+" ("+error.code+")"); }
		);		
	};
	
	/** Remise a zero des parametres de l'application
	*/
	this.resetParam = function()
	{	if (localStorage['WebApp@param']) this.param = JSON.parse(localStorage['WebApp@param']);
		else this.param = {};
	};
	
	/** Afficher / masquer le menu
		@return true : le menu est affiche
		@return false : le menu est masque
	*/
	this.showMenu = function(b)
	{	var menu = this.phoneMenu;
		if (!menu.length) return;
		// Valeur par defaut
		if (b!==true && b!==false) b = (menu.css('display')=='none');
		// Afficher
		if (b)
		{	menu.show();
			$(".inner", menu).slideDown();
		}
		else 
		{	if (this.menuEffect) $(".inner", menu).slideUp( function(){ menu.hide() } );
			else $(".inner", menu).slideUp( 0, function(){ menu.hide() } );
		}
	}
	
	/** Le menu est affiche
		@return true / false : le menu est affiche / masque
	*/
	this.isMenu = function()
	{	return (this.phoneMenu.length && (!this.phoneMenu.hasClass('menuBar')) && this.phoneMenu.css('display')!='none')
	}

	
/**
	Fonctions de l'application a surcharger
*/
	// Fonction d'initialisation
	this.init = function() {};
	
	// Changement d'orientation
	this.orientation = function(w,h) {};
	
	/** Gestion des boutons pour android
		Bouton menu : affichage d'une menu par defaut 
	*/
	this.onMenu = function() 
	{	this.showMenu();
	};
	
	/** Gestion des boutons pour Android
		Bouton retour : 
		- si on est sur le menu on le ferme
		- si on est sur la page "main", on demande de quitter.
	*/
	this.onBack = function() 
	{	// Masquer le menu de l'app
		if (this.isMenu()) this.showMenu(false)
		// Masquer un select
		else if ($(".ui-selectmenu").hasClass('in')) $('select').selectmenu('close');
		// Quitter si sur la page "main"
		else if ($.mobile.activePage.attr('id') == 'main') this.quit();
		else $.mobile.changePage('#main', {transition: 'slide', reverse:true});
	};

	/** Mettre en veille */
	this.pause = function() {};
	/** Reveiller */
	this.resume = function() {};

/** 
	Initialisation de l'application
*/
	this._init = function()
	{	// Mini DB ?
		if (typeof(MiniDB) != 'undefined') $.extend (this,MiniDB);
		// Minimiser les latences (si fastclick.js)...
		if (window.FastClick)
		{	$.mobile.buttonMarkup.hoverDelay = 0;
			new FastClick(document.body);
			console.log ("FastClick");
		}
		// Cordova ?
		if (!window.cordova) this.phoneGap = false;
		// Recuperer les parametres
		this.resetParam();
		// Texte des boutons
		$.mobile.page.prototype.options.backBtnText = "Retour";
		$.mobile.listview.prototype.options.filterPlaceholder = "Filtrer sur...";
		// Changement d'orientation
		$(window).resize(function()
			{	self.orientation ($(window).innerWidth(), $(window).innerHeight());
			});
		// Gestion des boutons pour android
		document.addEventListener("menubutton", function(){self.onMenu();}, false);
		document.addEventListener("backbutton", function(){self.onBack();}, false);
		if (!this.phoneGap)
		{	window.menubutton = function(){self.onMenu();};
			window.backbutton = function(){self.onBack();};
		}
		
		// Mettre en pause / resumer
		document.addEventListener("pause", function(){self.pause()}, false);
		document.addEventListener("resume", function(){self.resume();}, false);
		
		// Gestion du clavier (rafficher le clavier si efface une recherche)
		// necessiste le plugin SoftKeyBoard
		if (window.cordova && window.cordova.exec && window.plugins.hasOwnProperty('SoftKeyBoard'))
		{	console.log("SoftKeyBoard");
			$(document).on("click", ".ui-input-search .ui-input-clear", function(e)
			{	var input = $(this).prev("input");
				setTimeout (function()
				{	input.focus();
					plugins.SoftKeyBoard.show();
				},300);
			});
		}
		
		// Gestion d'un menuon
		this.phoneMenu = $("div[data-role='phoneMenu']");
		// Ne pas replier la barre
		if (!this.phoneMenu.hasClass('menuBar')) this.phoneMenu.click(function(){self.onMenu()});
		// Encapsuler le menu
		this.phoneMenu.wrapInner("<div class='inner'>");
		// Gestion des icones
		$("a", this.phoneMenu).each(function()
		{	var icon = $(this).attr('data-icon');
			if (icon) $(this).wrapInner("<span class='ui-titre'>").prepend("<span class='ui-icon-big ui-icon-big-"+icon+"'>&nbsp;</span>");
		});
		// Initialiser l'appli
		self.init();
		// Fermer l'ecran de demarrage
		if (navigator.splashscreen) navigator.splashscreen.hide();
	};
	
	// Classe utilisateur
	$.extend(this,obj);
	// Lancer
	$(document).ready(function()
	{	if (self.phoneGap)
		{	document.addEventListener("deviceready", function(){self._init();}, false);
			return;	
		}
		self._init();
	});	
}