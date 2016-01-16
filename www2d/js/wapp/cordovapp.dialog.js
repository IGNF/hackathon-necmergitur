/**
	@brief: Cordova web application 
	@author: Jean-Marc Viglino (ign.fr)
	@copyright: IGN 2015
	
	@require: JQuery
*/


(function(){

var _dlg=null, _content, _title, _buttons, _cbox, _back=null;

/** Show dialogs on the app
*/
CordovApp.prototype.Dialog =
{
	/** A dialog is shown on the app
	* @return {bool} true if a dialog is shown
	*/
	hasDialog: function()
	{	return (_dlg && _dlg.hasClass("visible"));
	},

	/** Close the dialog 
	* @return {bool} true if a dialog is closed
	*/
	close: function ()
	{	if (!this.hasDialog()) return false;
		_dlg.removeClass('visible');
		_back.hide();
		setTimeout (function(){ _dlg.hide(); }, 200);
		return true;
	},

	/** Show a new dialog 
	* @param {html} a jQuery objet that contents the dialog
	* @param {options}
	*	- closeBox {bool} ass a close box
	*	- title {string} title of the dialog
	*	- buttons {Array{String}} list of button to show 
	*	- callback {function} callback function with index of pressed button as argument
	*	- classe {String} dialog class for css 
	*/
	show: function (content, options)
	{	if (!options) options={};
		var self = this;

		function addButton(id, text)
		{	$("<div>").text(text)
					.attr("data-role","dialogBt")
					.appendTo(_buttons)
					.on ("click touchstart",function(e)
					{	e.stopPropagation();
						e.preventDefault();
						self.close();
						if (options.callback) options.callback(id);
					});
		}

		if (!_dlg) 
		{	if (!options) options={};
			_back = $('<div>').attr("data-role","backDialog").appendTo("body");
			_dlg = $('<div>').attr("data-role","dialog").appendTo("body");
			_cbox = $("<i>").addClass("fa fa-close")
					.attr("data-role","closebox")
					.appendTo(_dlg)
					.on ("click touchstart",function(e)
					{	e.stopPropagation();
						e.preventDefault();
						self.close();
					});
			_title = $("<div>").addClass("title").appendTo(_dlg);
			_content = $("<div>").addClass("content").appendTo(_dlg);
			_buttons = $("<div>").addClass("buttons").appendTo(_dlg);
		}

		if (options.closeBox) _cbox.show();
		else _cbox.hide();
		if (options.title) _title.html(options.title).show();
		else _title.hide();
		_dlg.removeClass().addClass(options.classe);
		
		_buttons.html("");
		if (options.buttons)
		{	for (var i=0; i<options.buttons.length; i++)
			{	addButton (i+1, options.buttons[i]);
			}
		}
		else addButton(1, _T("annuler"));

		_back.show();
		_content.html(content)
		_dlg.show();
		setTimeout (function(){ _dlg.addClass('visible'); }, 200);
	}
}



/** Wait dialog
*/
var _wait=null, _wback=null;

/** Wait dialog

	@param msg {String}	information on status
*/
CordovApp.prototype.wait = function(msg, anim)
{	if (!_wait)
	{	_wback = $("<div>").attr("data-role","backDialog").appendTo("body");
		_wait = $("<div>").attr("id","wait").attr("data-role","dialog").appendTo("body");
		$("<i>").addClass("fa fa-spinner fa-pulse")
			.css({ float:"left", "font-size":"2em", "margin":"0.25em 0.5em"})
			.appendTo(_wait);
		$("<p>").appendTo(_wait);
	}
	if (msg !== false) 
	{	_wback.show();
		_wait.show();
		$("p", _wait).html(msg);
		if (!_wait.hasClass('visible')) 
		{	if (anim===false) _wait.addClass('visible noanim');
			else setTimeout (function(){ _wait.addClass('visible'); }, 200);
		}
	}
	else 
	{	_wback.hide();
		_wait.removeClass('visible noanim');
		if (anim===false) _wait.hide();
		else setTimeout (function(){ _wait.hide(); }, 200);
	}
}

})();
