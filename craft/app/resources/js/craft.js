/**
 * Craft by Pixel & Tonic
 *
 * @package   Craft
 * @author    Pixel & Tonic, Inc.
 * @copyright Copyright (c) 2014, Pixel & Tonic, Inc.
 * @license   http://buildwithcraft.com/license Craft License Agreement
 * @link      http://buildwithcraft.com
 */

(function($){

if (typeof Craft == 'undefined')
{
	Craft = {};
}

$.extend(Craft,
{
	navHeight: 48,

	/**
	 * Map of high-ASCII codes to their low-ASCII characters.
	 *
	 * @var object
	 */
	asciiCharMap: {
		'223':'ss', '224':'a',  '225':'a',  '226':'a',  '229':'a',  '227':'ae', '230':'ae', '228':'ae', '231':'c',  '232':'e',
		'233':'e',  '234':'e',  '235':'e',  '236':'i',  '237':'i',  '238':'i',  '239':'i',  '241':'n',  '242':'o',  '243':'o',
		'244':'o',  '245':'o',  '246':'oe', '249':'u',  '250':'u',  '251':'u',  '252':'ue', '255':'y',  '257':'aa', '269':'ch',
		'275':'ee', '291':'gj', '299':'ii', '311':'kj', '316':'lj', '326':'nj', '353':'sh', '363':'uu', '382':'zh', '256':'aa',
		'268':'ch', '274':'ee', '290':'gj', '298':'ii', '310':'kj', '315':'lj', '325':'nj', '352':'sh', '362':'uu', '381':'zh'
	},

	/**
	 * Get a translated message.
	 *
	 * @param string message
	 * @param object params
	 * @return string
	 */
	t: function(message, params)
	{
		if (typeof Craft.translations[message] != 'undefined')
			message = Craft.translations[message];

		if (params)
		{
			for (var key in params)
			{
				message = message.replace('{'+key+'}', params[key])
			}
		}

		return message;
	},

	/**
	 * Escapes some HTML.
	 *
	 * @param string str
	 * @return string
	 */
	escapeHtml: function(str)
	{
		return $('<div/>').text(str).html();
	},

	/**
	 * Returns the text in a string that might contain HTML tags.
	 *
	 * @param string str
	 * @return string
	 */
	getText: function(str)
	{
		return $('<div/>').html(str).text();
	},

	/**
	 * Encodes a URI copmonent. Mirrors PHP's rawurlencode().
	 *
	 * @param string str
	 * @return string
	 * @see http://stackoverflow.com/questions/1734250/what-is-the-equivalent-of-javascripts-encodeuricomponent-in-php
	 */
	encodeUriComponent: function(str)
	{
		str = encodeURIComponent(str);

		var differences = {
			'!': '%21',
			'*': '%2A',
			"'": '%27',
			'(': '%28',
			')': '%29'
		};

		for (var chr in differences)
		{
			var re = new RegExp('\\'+chr, 'g');
			str = str.replace(re, differences[chr]);
		}

		return str;
	},

	/**
	 * Formats an ID out of an input name.
	 *
	 * @param string inputName
	 * @return string
	 */
	formatInputId: function(inputName)
	{
		return this.rtrim(inputName.replace(/[\[\]]+/g, '-'), '-');
	},

	/**
	 * @return string
	 * @param path
	 * @param params
	 */
	getUrl: function(path, params, baseUrl)
	{
		if (typeof path != 'string')
		{
			path = '';
		}

		// Return path if it appears to be an absolute URL.
		if (path.search('://') != -1 || path.substr(0, 2) == '//')
		{
			return path;
		}

		path = Craft.trim(path, '/');

		var anchor = '';

		// Normalize the params
		if ($.isPlainObject(params))
		{
			var aParams = [];

			for (var name in params)
			{
				var value = params[name];

				if (name == '#')
				{
					anchor = value;
				}
				else if (value !== null && value !== '')
				{
					aParams.push(name+'='+value);
				}
			}

			params = aParams;
		}

		if (Garnish.isArray(params))
		{
			params = params.join('&');
		}
		else
		{
			params = Craft.trim(params, '&?');
		}

		// Were there already any query string params in the path?
		var qpos = path.indexOf('?');
		if (qpos != -1)
		{
			params = path.substr(qpos+1)+(params ? '&'+params : '');
			path = path.substr(0, qpos);
		}

		// Put it all together
		if (baseUrl)
		{
			var url = baseUrl;

			if (path)
			{
				// Does baseUrl already contain a path?
				var pathMatch = url.match(/[&\?]p=[^&]+/);
				if (pathMatch)
				{
					url = url.replace(pathMatch[0], pathMatch[0]+'/'+path);
					path = '';
				}
			}
		}
		else
		{
			var url = Craft.baseUrl;
		}

		// Does the base URL already have a query string?
		var qpos = url.indexOf('?');
		if (qpos != '-1')
		{
			params = url.substr(qpos+1)+(params ? '&'+params : '');
			url = url.substr(0, qpos);
		}

		if (!Craft.omitScriptNameInUrls && path)
		{
			if (Craft.usePathInfo)
			{
				// Make sure that the script name is in the URL
				if (url.search(Craft.scriptName) == -1)
				{
					url = Craft.rtrim(url, '/') + '/' + Craft.scriptName;
				}
			}
			else
			{
				// Move the path into the query string params

				// Is the p= param already set?
				if (params && params.substr(0, 2) == 'p=')
				{
					var endPath = params.indexOf('&');
					if (endPath != -1)
					{
						var basePath = params.substring(2, endPath);
						params = params.substr(endPath+1);
					}
					else
					{
						var basePath = params.substr(2);
						params = null;
					}

					// Just in case
					basePath = Craft.rtrim(basePath);

					path = basePath + (path ? '/'+path : '');
				}

				// Now move the path into the params
				params = 'p='+path + (params ? '&'+params : '');
				path = null;
			}
		}

		if (path)
		{
			url = Craft.rtrim(url, '/') + '/' + path;
		}

		if (params)
		{
			url += '?'+params;
		}

		if (anchor)
		{
			url += '#'+anchor;
		}

		return url;
	},

	/**
	 * @return string
	 * @param path
	 * @param params
	 */
	getCpUrl: function(path, params)
	{
		return this.getUrl(path, params, Craft.baseCpUrl)
	},

	/**
	 * @return string
	 * @param path
	 * @param params
	 */
	getSiteUrl: function(path, params)
	{
		return this.getUrl(path, params, Craft.baseSiteUrl)
	},

	/**
	 * Returns a resource URL.
	 *
	 * @param string path
	 * @param array|string|null params
	 * @return string
	 */
	getResourceUrl: function(path, params)
	{
		return Craft.getUrl(path, params, Craft.resourceUrl);
	},

	/**
	 * Returns an action URL.
	 *
	 * @param string path
	 * @param array|string|null params
	 * @return string
	 */
	getActionUrl: function(path, params)
	{
		return Craft.getUrl(path, params, Craft.actionUrl);
	},

	/**
	 * Redirects the window to a given URL.
	 *
	 * @param string url
	 */
	redirectTo: function(url)
	{
		document.location.href = this.getUrl(url);
	},

	/**
	 * Posts an action request to the server.
	 *
	 * @param string action
	 * @param object|null data
	 * @param function|null callback
	 * @param object|null options
	 * @return jqXHR
	 */
	postActionRequest: function(action, data, callback, options)
	{
		// Make 'data' optional
		if (typeof data == 'function')
		{
			options = callback;
			callback = data;
			data = undefined;
		}

		var jqXHR = $.ajax($.extend({
			url:      Craft.getActionUrl(action),
			type:     'POST',
			data:     data,
			success:  callback,
			error:    function(jqXHR, textStatus, errorThrown)
			{
				if (callback)
				{
					callback(null, textStatus, jqXHR);
				}
			},
			complete: function(jqXHR, textStatus)
			{
				if (textStatus != 'success')
				{
					if (typeof Craft.cp != 'undefined')
					{
						Craft.cp.displayError();
					}
					else
					{
						alert(Craft.t('An unknown error occurred.'));
					}
				}
			}
		}, options));

		// Call the 'send' callback
		if (options && typeof options.send == 'function')
		{
			options.send(jqXHR);
		}

		return jqXHR;
	},

	_waitingOnAjax: false,
	_ajaxQueue: [],

	/**
	 * Queues up an action request to be posted to the server.
	 */
	queueActionRequest: function(action, data, callback, options)
	{
		// Make 'data' optional
		if (typeof data == 'function')
		{
			options = callback;
			callback = data;
			data = undefined;
		}

		Craft._ajaxQueue.push([action, data, callback, options]);

		if (!Craft._waitingOnAjax)
		{
			Craft._postNextActionRequestInQueue();
		}
	},

	_postNextActionRequestInQueue: function()
	{
		Craft._waitingOnAjax = true;

		var args = Craft._ajaxQueue.shift();

		Craft.postActionRequest(args[0], args[1], function(data, textStatus, jqXHR)
		{
			if (args[2] && typeof args[2] == 'function')
			{
				args[2](data, textStatus, jqXHR);
			}

			if (Craft._ajaxQueue.length)
			{
				Craft._postNextActionRequestInQueue();
			}
			else
			{
				Craft._waitingOnAjax = false;
			}
		}, args[3]);
	},

	/**
	 * Converts a comma-delimited string into an array.
	 *
	 * @param string str
	 * @return array
	 */
	stringToArray: function(str)
	{
		if (typeof str != 'string')
			return str;

		var arr = str.split(',');
		for (var i = 0; i < arr.length; i++)
		{
			arr[i] = $.trim(arr[i]);
		}
		return arr;
	},

	/**
	 * Expands an array of POST array-style strings into an actual array.
	 *
	 * @param array arr
	 * @return array
	 */
	expandPostArray: function(arr)
	{
		var expanded = {};

		for (var key in arr)
		{
			var value = arr[key],
				m = key.match(/^(\w+)(\[.*)?/);

			if (m[2])
			{
				// Get all of the nested keys
				var keys = m[2].match(/\[[^\[\]]*\]/g);

				// Chop off the brackets
				for (var i = 0; i < keys.length; i++)
				{
					keys[i] = keys[i].substring(1, keys[i].length-1);
				}
			}
			else
			{
				var keys = [];
			}

			keys.unshift(m[1]);

			var parentElem = expanded;

			for (var i = 0; i < keys.length; i++)
			{
				if (i < keys.length-1)
				{
					if (typeof parentElem[keys[i]] != 'object')
					{
						// Figure out what this will be by looking at the next key
						if (!keys[i+1] || parseInt(keys[i+1]) == keys[i+1])
						{
							parentElem[keys[i]] = [];
						}
						else
						{
							parentElem[keys[i]] = {};
						}
					}

					parentElem = parentElem[keys[i]];
				}
				else
				{
					// Last one. Set the value
					if (!keys[i])
					{
						keys[i] = parentElem.length;
					}

					parentElem[keys[i]] = value;
				}
			}
		}

		return expanded;
	},

	/**
	 * Compares two variables and returns whether they are equal in value.
	 * Recursively compares array and object values.
	 *
	 * @param mixed obj1
	 * @param mixed obj2
	 * @return bool
	 */
	compare: function(obj1, obj2)
	{
		// Compare the types
		if (typeof obj1 != typeof obj2)
		{
			return false;
		}

		if (typeof obj1 == 'object')
		{
			// Compare the lengths
			if (obj1.length != obj2.length)
			{
				return false;
			}

			// Is one of them an array but the other is not?
			if ((obj1 instanceof Array) != (obj2 instanceof Array))
			{
				return false;
			}

			// If they're actual objects (not arrays), compare the keys
			if (!(obj1 instanceof Array))
			{
				if (!Craft.compare(Craft.getObjectKeys(obj1), Craft.getObjectKeys(obj2)))
				{
					return false;
				}
			}

			// Compare each value
			for (var i in obj1)
			{
				if (!Craft.compare(obj1[i], obj2[i]))
				{
					return false;
				}
			}

			// All clear
			return true;
		}
		else
		{
			return (obj1 === obj2);
		}
	},

	/**
	 * Returns an array of an object's keys.
	 *
	 * @param object obj
	 * @return string
	 */
	getObjectKeys: function(obj)
	{
		var keys = [];

		for (var key in obj)
		{
			keys.push(key);
		}

		return keys;
	},

	/**
	 * Takes an array or string of chars, and places a backslash before each one, returning the combined string.
	 *
	 * Userd by ltrim() and rtrim()
	 *
	 * @param string|array chars
	 * @return string
	 */
	escapeChars: function(chars)
	{
		if (!Garnish.isArray(chars))
		{
			chars = chars.split();
		}

		var escaped = '';

		for (var i = 0; i < chars.length; i++)
		{
			escaped += "\\"+chars[i];
		}

		return escaped;
	},

	/**
	 * Trim characters off of the beginning of a string.
	 *
	 * @param string str
	 * @param string|array|null The characters to trim off. Defaults to a space if left blank.
	 * @return string
	 */
	ltrim: function(str, chars)
	{
		if (!str) return str;
		if (chars === undefined) chars = ' \t\n\r\0\x0B';
		var re = new RegExp('^['+Craft.escapeChars(chars)+']+');
		return str.replace(re, '');
	},

	/**
	 * Trim characters off of the end of a string.
	 *
	 * @param string str
	 * @param string|array|null The characters to trim off. Defaults to a space if left blank.
	 * @return string
	 */
	rtrim: function(str, chars)
	{
		if (!str) return str;
		if (chars === undefined) chars = ' \t\n\r\0\x0B';
		var re = new RegExp('['+Craft.escapeChars(chars)+']+$');
		return str.replace(re, '');
	},

	/**
	 * Trim characters off of the beginning and end of a string.
	 *
	 * @param string str
	 * @param string|array|null The characters to trim off. Defaults to a space if left blank.
	 * @return string
	 */
	trim: function(str, chars)
	{
		str = Craft.ltrim(str, chars);
		str = Craft.rtrim(str, chars);
		return str;
	},

	/**
	 * Filters an array.
	 *
	 * @param array    arr
	 * @param function callback A user-defined callback function. If null, we'll just remove any elements that equate to false.
	 * @return array
	 */
	filterArray: function(arr, callback)
	{
		var filtered = [];

		for (var i = 0; i < arr.length; i++)
		{
			if (typeof callback == 'function')
			{
				var include = callback(arr[i], i);
			}
			else
			{
				var include = arr[i];
			}

			if (include)
			{
				filtered.push(arr[i]);
			}
		}

		return filtered;
	},

	/**
	 * Returns whether an element is in an array (unlike jQuery.inArray(), which returns the element's index, or -1).
	 *
	 * @param mixed elem
	 * @param mixed arr
	 * @return bool
	 */
	inArray: function(elem, arr)
	{
		return ($.inArray(elem, arr) != -1);
	},

	/**
	 * Removes an element from an array.
	 *
	 * @param mixed elem
	 * @param array arr
	 * @return bool Whether the element could be found or not.
	 */
	removeFromArray: function(elem, arr)
	{
		var index = $.inArray(elem, arr);
		if (index != -1)
		{
			arr.splice(index, 1);
			return true;
		}
		else
		{
			return false;
		}
	},

	/**
	 * Returns the last element in an array.
	 *
	 * @param array
	 * @return mixed
	 */
	getLast: function(arr)
	{
		if (!arr.length)
			return null;
		else
			return arr[arr.length-1];
	},

	/**
	 * Makes the first character of a string uppercase.
	 *
	 * @param string str
	 * @return string
	 */
	uppercaseFirst: function(str)
	{
		return str.charAt(0).toUpperCase() + str.slice(1);
	},

	/**
	 * Makes the first character of a string lowercase.
	 *
	 * @param string str
	 * @return string
	 */
	lowercaseFirst: function(str)
	{
		return str.charAt(0).toLowerCase() + str.slice(1);
	},

	/**
	 * Converts extended ASCII characters to ASCII.
	 *
	 * @param string str
	 * @return string
	 */
	asciiString: function(str)
	{
		var asciiStr = '';

		for (var c = 0; c < str.length; c++)
		{
			var ascii = str.charCodeAt(c);

			if (ascii >= 32 && ascii < 128)
			{
				asciiStr += str.charAt(c);
			}
			else if (typeof Craft.asciiCharMap[ascii] != 'undefined')
			{
				asciiStr += Craft.asciiCharMap[ascii];
			}
		}

		return asciiStr;
	},

	/**
	 * Prevents the outline when an element is focused by the mouse.
	 *
	 * @param mixed elem Either an actual element or a jQuery collection.
	 */
	preventOutlineOnMouseFocus: function(elem)
	{
		var $elem = $(elem),
			namespace = '.preventOutlineOnMouseFocus';

		$elem.on('mousedown'+namespace, function() {
			$elem.addClass('no-outline');
			$elem.focus();
		})
		.on('keydown'+namespace+' blur'+namespace, function(event) {
			if (event.keyCode != Garnish.SHIFT_KEY && event.keyCode != Garnish.CTRL_KEY && event.keyCode != Garnish.CMD_KEY)
				$elem.removeClass('no-outline');
		});
	},

	/**
	 * Creates a validation error list.
	 *
	 * @param array errors
	 * @return jQuery
	 */
	createErrorList: function(errors)
	{
		var $ul = $(document.createElement('ul')).addClass('errors');

		for (var i = 0; i < errors.length; i++)
		{
			var $li = $(document.createElement('li'));
			$li.appendTo($ul);
			$li.html(errors[i]);
		}

		return $ul;
	},

	/**
	 * Initializes any common UI elements in a given container.
	 *
	 * @param jQuery $container
	 */
	initUiElements: function($container)
	{
		$('.grid', $container).grid();
		$('.pane', $container).pane();
		$('.info', $container).infoicon();
		$('.checkbox-select', $container).checkboxselect();
		$('.fieldtoggle', $container).fieldtoggle();
		$('.lightswitch', $container).lightswitch();
		$('.nicetext', $container).nicetext();
		$('.pill', $container).pill();
		$('.menubtn', $container).menubtn();

		// Make placeholders work for IE9, too.
		$('input[type!=password], textarea', $container).placeholder();
	},

	_elementIndexClasses: {},
	_elementSelectorModalClasses: {},

	/**
	 * Registers an element index class for a given element type.
	 *
	 * @param string elementType
	 * @param function func
	 */
	registerElementIndexClass: function(elementType, func)
	{
		if (typeof this._elementIndexClasses[elementType] != 'undefined')
		{
			throw 'An element index class has already been registered for the element type “'+elementType+'”.';
		}

		this._elementIndexClasses[elementType] = func;
	},


	/**
	 * Registers an element selector modal class for a given element type.
	 *
	 * @param string elementType
	 * @param function func
	 */
	registerElementSelectorModalClass: function(elementType, func)
	{
		if (typeof this._elementSelectorModalClasses[elementType] != 'undefined')
		{
			throw 'An element selector modal class has already been registered for the element type “'+elementType+'”.';
		}

		this._elementSelectorModalClasses[elementType] = func;
	},

	/**
	 * Creates a new element index for a given element type.
	 *
	 * @param string elementType
	 * @param mixed  $container
	 * @param object settings
	 * @return BaseElementIndex
	 */
	createElementIndex: function(elementType, $container, settings)
	{
		if (typeof this._elementIndexClasses[elementType] != 'undefined')
		{
			var func = this._elementIndexClasses[elementType];
		}
		else
		{
			var func = Craft.BaseElementIndex;
		}

		return new func(elementType, $container, settings);
	},

	/**
	 * Creates a new element selector modal for a given element type.
	 *
	 * @param string elementType
	 * @param object settings
	 */
	createElementSelectorModal: function(elementType, settings)
	{
		if (typeof this._elementSelectorModalClasses[elementType] != 'undefined')
		{
			var func = this._elementSelectorModalClasses[elementType];
		}
		else
		{
			var func = Craft.BaseElementSelectorModal;
		}

		return new func(elementType, settings);
	},

	/**
	 * Retrieves a value from localStorage if it exists.
	 *
	 * @param string key
	 * @param mixed defaultValue
	 */
	getLocalStorage: function(key, defaultValue)
	{
		key = 'Craft-'+Craft.siteUid+'.'+key;

		if (typeof localStorage != 'undefined' && typeof localStorage[key] != 'undefined')
		{
			return JSON.parse(localStorage[key]);
		}
		else
		{
			return defaultValue;
		}
	},

	/**
	 * Saves a value to localStorage.
	 *
	 * @param string key
	 * @param mixed value
	 */
	setLocalStorage: function(key, value)
	{
		if (typeof localStorage != 'undefined')
		{
			key = 'Craft-'+Craft.siteUid+'.'+key;
			localStorage[key] = JSON.stringify(value);
		}
	},

	/**
	 * Returns element information from it's HTML.
	 *
	 * @param element
	 * @returns object
	 */
	getElementInfo: function(element)
	{
		var $element = $(element);

		if (!$element.hasClass('element'))
		{
			$element = $element.find('.element:first');
		}

		var info = {
			id:       $element.data('id'),
			label:    $element.data('label'),
			status:   $element.data('status'),
			url:      $element.data('url'),
			hasThumb: $element.hasClass('hasthumb'),
			$element: $element
		};

		return info;
	},

	/**
	 * Shows an element editor HUD.
	 *
	 * @param object $element
	 */
	showElementEditor: function($element)
	{
		if ($element.data('editable') && !$element.hasClass('disabled') && !$element.hasClass('loading'))
		{
			new Craft.ElementEditor($element);
		}
	}
});


// -------------------------------------------
//  Custom jQuery plugins
// -------------------------------------------

$.extend($.fn,
{
	animateLeft: function(pos, duration, easing, complete)
	{
		if (Craft.orientation == 'ltr')
		{
			return this.animate({ left: pos }, duration, easing, complete);
		}
		else
		{
			return this.animate({ right: pos }, duration, easing, complete);
		}
	},

	animateRight: function(pos, duration, easing, complete)
	{
		if (Craft.orientation == 'ltr')
		{
			return this.animate({ right: pos }, duration, easing, complete);
		}
		else
		{
			return this.animate({ left: pos }, duration, easing, complete);
		}
	},

	/**
	 * Disables elements by adding a .disabled class and preventing them from receiving focus.
	 */
	disable: function()
	{
		return this.each(function()
		{
			var $elem = $(this);
			$elem.addClass('disabled');

			if ($elem.data('activatable'))
			{
				$elem.removeAttr('tabindex');
			}
		});
	},

	/**
	 * Enables elements by removing their .disabled class and allowing them to receive focus.
	 */
	enable: function()
	{
		return this.each(function()
		{
			var $elem = $(this);
			$elem.removeClass('disabled');

			if ($elem.data('activatable'))
			{
				$elem.attr('tabindex', '0');
			}
		});
	},

	/**
	 * Sets the element as the container of a grid.
	 */
	grid: function()
	{
		return this.each(function()
		{
			var $container = $(this),
				settings = {};

			if ($container.data('item-selector')) settings.itemSelector = $container.data('item-selector');
			if ($container.data('cols'))          settings.cols = parseInt($container.data('cols'));
			if ($container.data('min-col-width')) settings.minColWidth = parseInt($container.data('min-col-width'));
			if ($container.data('mode'))          settings.mode = $container.data('mode');
			if ($container.data('fill-mode'))     settings.fillMode = $container.data('fill-mode');
			if ($container.data('col-class'))     settings.colClass = $container.data('col-class');
			if ($container.data('snap-to-grid'))  settings.snapToGrid = !!$container.data('snap-to-grid');

			new Craft.Grid(this, settings);
		});
	},

	infoicon: function()
	{
		return this.each(function()
		{
			new Craft.InfoIcon(this);
		});
	},

	pane: function()
	{
		return this.each(function()
		{
			new Craft.Pane(this);
		});
	},

	/**
	 * Sets the element as a container for a checkbox select.
	 */
	checkboxselect: function()
	{
		return this.each(function()
		{
			if (!$.data(this, 'checkboxselect'))
			{
				new Garnish.CheckboxSelect(this);
			}
		});
	},

	/**
	 * Sets the element as a field toggle trigger.
	 */
	fieldtoggle: function()
	{
		return this.each(function()
		{
			if (!$.data(this, 'fieldtoggle'))
			{
				new Craft.FieldToggle(this);
			}
		});
	},

	lightswitch: function(settings, settingName, settingValue)
	{
		// param mapping
		if (settings == 'settings')
		{
			if (typeof settingName == 'string')
			{
				settings = {};
				settings[settingName] = settingValue;
			}
			else
			{
				settings = settingName;
			}

			return this.each(function()
			{
				var obj = $.data(this, 'lightswitch');
				if (obj)
				{
					obj.setSettings(settings);
				}
			});
		}

		return this.each(function()
		{
			if (!$.data(this, 'lightswitch'))
			{
				new Craft.LightSwitch(this, settings);
			}
		});
	},

	nicetext: function()
	{
		return this.each(function()
		{
			if (!$.data(this, 'text'))
			{
				new Garnish.NiceText(this);
			}
		});
	},

	pill: function()
	{
		return this.each(function()
		{
			if (!$.data(this, 'pill'))
			{
				new Garnish.Pill(this);
			}
		});
	},

	menubtn: function()
	{
		return this.each(function()
		{
			var $btn = $(this);

			if (!$btn.data('menubtn') && $btn.next().hasClass('menu'))
			{
				new Garnish.MenuBtn($btn);
			}
		});
	}
});


Garnish.$doc.ready(function()
{
	Craft.initUiElements();
});


/**
 * Element index class
 */
Craft.BaseElementIndex = Garnish.Base.extend(
{
	elementType: null,

	instanceState: null,
	sourceStates: null,
	sourceStatesStorageKey: null,

	searchTimeout: null,
	elementSelect: null,
	sourceSelect: null,

	$container: null,
	$main: null,
	$scroller: null,
	$toolbar: null,
	$search: null,
	$mainSpinner: null,

	$statusMenuBtn: null,
	statusMenu: null,
	status: null,

	$localeMenuBtn: null,
	localeMenu: null,
	locale: null,

	$viewModeBtnTd: null,
	$viewModeBtnContainer: null,
	viewModeBtns: null,
	viewMode: null,

	$loadingMoreSpinner: null,
	$sidebar: null,
	$sidebarButtonContainer: null,
	showingSidebar: null,
	$sources: null,
	sourceKey: null,
	sourceViewModes: null,
	$source: null,
	$sourceToggles: null,
	$elements: null,
	$table: null,
	$elementContainer: null,


	init: function(elementType, $container, settings)
	{
		this.elementType = elementType;
		this.$container = $container;
		this.setSettings(settings, Craft.BaseElementIndex.defaults);

		// Set the state objects
		this.instanceState = {
			selectedSource: null
		};

		this.sourceStates = {};

		// Instance states (selected source) are stored by a custom storage key defined in the settings
		if (this.settings.storageKey)
		{
			$.extend(this.instanceState, Craft.getLocalStorage(this.settings.storageKey), {});
		}

		// Source states (view mode, etc.) are stored by the element type and context
		this.sourceStatesStorageKey = 'BaseElementIndex.'+this.elementType+'.'+this.settings.context;
		$.extend(this.sourceStates, Craft.getLocalStorage(this.sourceStatesStorageKey, {}));

		// Find the DOM elements
		this.$main = this.$container.find('.main');
		this.$toolbar = this.$container.find('.toolbar:first');
		this.$statusMenuBtn = this.$toolbar.find('.statusmenubtn:first');
		this.$localeMenuBtn = this.$toolbar.find('.localemenubtn:first');
		this.$search = this.$toolbar.find('.search:first input:first');
		this.$mainSpinner = this.$toolbar.find('.spinner:first');
		this.$loadingMoreSpinner = this.$container.find('.spinner.loadingmore')
		this.$sidebar = this.$container.find('.sidebar:first');
		this.$sidebarButtonContainer = this.$sidebar.children('.buttons');
		this.$sources = this.$sidebar.find('nav a');
		this.$sourceToggles = this.$sidebar.find('.toggle');
		this.$elements = this.$container.find('.elements:first');

		if (!this.$sidebarButtonContainer.length)
		{
			this.$sidebarButtonContainer = $('<div class="buttons"/>').prependTo(this.$sidebar);
		}

		this.showingSidebar = (this.$sidebar.length && !this.$sidebar.hasClass('hidden'));

		this.$viewModeBtnTd = this.$toolbar.find('.viewbtns:first');
		this.$viewModeBtnContainer = $('<div class="btngroup"/>').appendTo(this.$viewModeBtnTd);

		// No source, no party.
		if (this.$sources.length == 0)
		{
			return;
		}

		// Is there a locale menu?
		if (this.$localeMenuBtn.length)
		{
			this.localeMenu = this.$localeMenuBtn.menubtn().data('menubtn').menu;

			// Figure out the initial locale
			var $option = this.localeMenu.$options.filter('.sel:first');

			if (!$option.length)
			{
				$option = this.localeMenu.$options.first();
			}

			if ($option.length)
			{
				this.locale = $option.data('locale');
			}
			else
			{
				// No locale options -- they must not have any locale permissions
				this.settings.criteria = { id: '0' };
			}

			this.localeMenu.on('optionselect', $.proxy(this, 'onLocaleChange'));
		}

		this.onAfterHtmlInit();

		if (this.settings.context == 'index')
		{
			this.$scroller = Garnish.$win;
		}
		else
		{
			this.$scroller = this.$main;
		}

		// Select the initial source
		var source = this.getDefaultSourceKey();

		if (source)
		{
			var $source = this.getSourceByKey(source);

			if ($source)
			{
				// Expand any parent sources
				var $parentSources = $source.parentsUntil('.sidebar', 'li');
				$parentSources.not(':first').addClass('expanded');
			}
		}

		if (!source || !$source)
		{
			// Select the first source by default
			var $source = this.$sources.first();
		}

		this.selectSource($source);

		// Load up the elements!
		this.updateElements();

		// Add some listeners
		this.addListener(this.$sourceToggles, 'click', function(ev)
		{
			$(ev.currentTarget).parent().toggleClass('expanded');
			this.$sidebar.trigger('resize');
			ev.stopPropagation();
		});

		// The source selector
		this.sourceSelect = new Garnish.Select(this.$sidebar.find('nav'), this.$sources, {
			selectedClass:     'sel',
			multi:             false,
			vertical:          true,
			onSelectionChange: $.proxy(this, 'onSourceSelectionChange')
		});

		// Status changes
		if (this.$statusMenuBtn.length)
		{
			this.statusMenu = this.$statusMenuBtn.menubtn().data('menubtn').menu;
			this.statusMenu.on('optionselect', $.proxy(this, 'onStatusChange'));
		}

		this.addListener(this.$search, 'textchange', $.proxy(function()
		{
			if (this.searchTimeout)
			{
				clearTimeout(this.searchTimeout);
			}

			this.searchTimeout = setTimeout($.proxy(this, 'updateElements'), 500);
		}, this));

		// Auto-focus the Search box
		if (!Garnish.isMobileBrowser(true))
		{
			this.$search.focus();
		}
	},

	getDefaultSourceKey: function()
	{
		return this.instanceState.selectedSource;
	},

	onSourceSelectionChange: function()
	{
		var sourceElement = this.$sources.filter('.sel');
		if (sourceElement.length == 0)
		{
			sourceElement = this.$sources.filter(':first');
		}

		this.selectSource(sourceElement);
		this.updateElements();
	},

	setInstanceState: function(key, value)
	{
		if (typeof key == 'object')
		{
			$.extend(this.instanceState, key);
		}
		else
		{
			this.instanceState[key] = value;
		}

		// Store it in localStorage too?
		if (this.settings.storageKey)
		{
			Craft.setLocalStorage(this.settings.storageKey, this.instanceState);
		}
	},

	getSourceState: function(source, key, defaultValue)
	{
		if (typeof this.sourceStates[source] == 'undefined')
		{
			// Set it now so any modifications to it by whoever's calling this will be stored.
			this.sourceStates[source] = {};
		}

		if (typeof key == 'undefined')
		{
			return this.sourceStates[source];
		}
		else if (typeof this.sourceStates[source][key] != 'undefined')
		{
			return this.sourceStates[source][key];
		}
		else
		{
			return (typeof defaultValue != 'undefined' ? defaultValue : null);
		}
	},

	getSelectedSourceState: function(key, defaultValue)
	{
		return this.getSourceState(this.instanceState.selectedSource, key, defaultValue);
	},

	setSelecetedSourceState: function(key, value)
	{
		var viewState = this.getSelectedSourceState();

		if (typeof key == 'object')
		{
			$.extend(viewState, key);
		}
		else
		{
			viewState[key] = value;
		}

		this.sourceStates[this.instanceState.selectedSource] = viewState;

		// Store it in localStorage too
		Craft.setLocalStorage(this.sourceStatesStorageKey, this.sourceStates);
	},

	getControllerData: function()
	{
		return {
			context:            this.settings.context,
			elementType:        this.elementType,
			criteria:           $.extend({ status: this.status, locale: this.locale }, this.settings.criteria),
			disabledElementIds: this.settings.disabledElementIds,
			source:             this.instanceState.selectedSource,
			status:             this.status,
			viewState:          this.getSelectedSourceState(),
			search:             (this.$search ? this.$search.val() : null)
		};
	},

	updateElements: function()
	{
		this.$mainSpinner.removeClass('hidden');
		this.removeListener(this.$scroller, 'scroll');

		if (this.getSelectedSourceState('mode') == 'table' && this.$table)
		{
			Craft.cp.$collapsibleTables = Craft.cp.$collapsibleTables.not(this.$table);
		}

		// Can't use structure view for search results
		if (this.$search && this.$search.val())
		{
			if (this.getSelectedSourceState('mode') == 'structure')
			{
				this.selectViewMode('table', true);
			}
		}
		else if (this.getSelectedSourceState('mode') == 'table' && !this.doesSourceHaveViewMode('table'))
		{
			this.selectViewMode(this.sourceViewModes[0].mode, true);
		}

		var data = this.getControllerData();

		Craft.postActionRequest('elements/getElements', data, $.proxy(function(response, textStatus)
		{
			this.$mainSpinner.addClass('hidden');

			if (textStatus == 'success')
			{
				this.setNewElementDataHtml(response, false);
			}

		}, this));
	},

	setNewElementDataHtml: function(response, append)
	{
		if (!append)
		{
			this.$elements.html(response.html);
			this.$scroller.scrollTop(0);

			if (this.getSelectedSourceState('mode') == 'table')
			{
				var $headers = this.$elements.find('thead:first th');
				this.addListener($headers, 'click', 'onSortChange');

				this.$table = this.$elements.find('table:first');
				Craft.cp.$collapsibleTables = Craft.cp.$collapsibleTables.add(this.$table);
			}

			this.$elementContainer = this.getElementContainer();
		}
		else
		{
			this.$elementContainer.append(response.html);
		}

		$('head').append(response.headHtml);
		Garnish.$bod.append(response.footHtml);

		// More?
		if (response.more)
		{
			this.totalVisible = response.totalVisible;

			this.addListener(this.$scroller, 'scroll', function()
			{
				if (this.$scroller[0] == Garnish.$win[0])
				{
					var winHeight = Garnish.$win.innerHeight(),
						winScrollTop = Garnish.$win.scrollTop(),
						bodHeight = Garnish.$bod.height();

					var loadMore = (winHeight + winScrollTop >= bodHeight);
				}
				else
				{
					var containerScrollHeight = this.$scroller.prop('scrollHeight'),
						containerScrollTop = this.$scroller.scrollTop(),
						containerHeight = this.$scroller.outerHeight();

					var loadMore = (containerScrollHeight - containerScrollTop <= containerHeight + 15);
					console.log(containerScrollHeight, containerScrollTop, containerHeight, loadMore);

				}

				if (loadMore)
				{
					this.$loadingMoreSpinner.removeClass('hidden');
					this.removeListener(this.$scroller, 'scroll');

					var data = this.getControllerData();
					data.offset = this.totalVisible;

					Craft.postActionRequest('elements/getElements', data, $.proxy(function(response, textStatus)
					{
						this.$loadingMoreSpinner.addClass('hidden');

						if (textStatus == 'success')
						{
							this.setNewElementDataHtml(response, true);
						}

					}, this));
				}
			});
		}

		if (this.getSelectedSourceState('mode') == 'table')
		{
			Craft.cp.updateResponsiveTables();
		}

		this.onUpdateElements(append);
	},

	getElementContainer: function()
	{
		if (this.getSelectedSourceState('mode') == 'table')
		{
			return this.$table.find('tbody:first');
		}
		else
		{
			return this.$elements.children('ul');
		}
	},

	onUpdateElements: function(append)
	{
		this.settings.onUpdateElements(append);
	},

	onStatusChange: function(ev)
	{
		this.statusMenu.$options.removeClass('sel');
		var $option = $(ev.selectedOption).addClass('sel');
		this.$statusMenuBtn.html($option.html());

		this.status = $option.data('status');
		this.updateElements();
	},

	onLocaleChange: function(ev)
	{
		this.localeMenu.$options.removeClass('sel');
		var $option = $(ev.selectedOption).addClass('sel');
		this.$localeMenuBtn.html($option.html());

		this.locale = $option.data('locale');
		this.updateElements();
	},

	onSortChange: function(ev)
	{
		var $th = $(ev.currentTarget),
			attribute = $th.attr('data-attribute');

		if (this.getSelectedSourceState('order') == attribute)
		{
			if (this.getSelectedSourceState('sort') == 'asc')
			{
				this.setSelecetedSourceState('sort', 'desc');
			}
			else
			{
				this.setSelecetedSourceState('sort', 'asc');
			}
		}
		else
		{
			this.setSelecetedSourceState({
				order: attribute,
				sort: 'asc'
			});
		}

		this.updateElements();
	},

	getSourceByKey: function(key)
	{
		for (var i = 0; i < this.$sources.length; i++)
		{
			var $source = $(this.$sources[i]);

			if ($source.data('key') == key)
			{
				return $source;
			}
		}
	},

	selectSource: function($source)
	{
		if (this.$source == $source)
		{
			return;
		}

		if (this.$source)
		{
			this.$source.removeClass('sel');
		}

		this.sourceKey = $source.data('key');
		this.$source = $source.addClass('sel');
		this.setInstanceState('selectedSource', this.sourceKey);

		if (this.$search)
		{
			// Clear the search value without triggering the textchange event
			this.$search.data('textchangeValue', '');
			this.$search.val('');
		}

		// View mode buttons

		// Clear out any previous view mode data
		this.$viewModeBtnContainer.empty();
		this.viewModeBtns = {};
		this.viewMode = null;

		// Get the new list of view modes
		this.sourceViewModes = this.getViewModesForSource();

		// Create the buttons if there's more than one mode available to this source
		if (this.sourceViewModes.length > 1)
		{
			this.$viewModeBtnTd.removeClass('hidden');

			for (var i = 0; i < this.sourceViewModes.length; i++)
			{
				var viewMode = this.sourceViewModes[i];

				var $viewModeBtn = $('<div data-view="'+viewMode.mode+'" role="button"' +
					' class="btn'+(typeof viewMode.className != 'undefined' ? ' '+viewMode.className : '')+'"' +
					' title="'+viewMode.title+'"' +
					(typeof viewMode.icon != 'undefined' ? ' data-icon="'+viewMode.icon+'"' : '') +
					'/>'
				).appendTo(this.$viewModeBtnContainer);

				this.viewModeBtns[viewMode.mode] = $viewModeBtn;

				this.addListener($viewModeBtn, 'click', { mode: viewMode.mode }, function(ev) {
					this.selectViewMode(ev.data.mode);
					this.updateElements();
				});
			}
		}
		else
		{
			this.$viewModeBtnTd.addClass('hidden');
		}

		// Figure out which mode we should start with
		var viewMode = this.getSelectedSourceState('mode');

		if (!viewMode || !this.doesSourceHaveViewMode(viewMode))
		{
			// Default to structure view if the source has it
			if (this.$source.data('has-structure'))
			{
				viewMode = 'structure';
			}
			// Otherwise try to keep using the current view mode
			else if (this.viewMode && this.doesSourceHaveViewMode(this.viewMode))
			{
				viewMode = this.viewMode;
			}
			// Just use the first one
			else
			{
				viewMode = this.sourceViewModes[0].mode;
			}
		}

		this.selectViewMode(viewMode);

		this.onSelectSource();
	},

	getViewModesForSource: function()
	{
		var viewModes = [
			{ mode: 'table', title: Craft.t('Display in a table'), icon: 'list' }
		];

		if (this.$source.data('has-structure'))
		{
			viewModes.push({ mode: 'structure', title: Craft.t('Display hierarchically'), icon: 'structure' });
		}

		if (this.$source.data('has-thumbs'))
		{
			viewModes.push({ mode: 'thumbs', title: Craft.t('Display as thumbnails'), icon: 'grid' });
		}

		return viewModes;
	},

	onSelectSource: function()
	{
		this.settings.onSelectSource(this.sourceKey);
	},

	onAfterHtmlInit: function()
	{
		this.settings.onAfterHtmlInit()
	},

	doesSourceHaveViewMode: function(viewMode)
	{
		for (var i = 0; i < this.sourceViewModes.length; i++)
		{
			if (this.sourceViewModes[i].mode == viewMode)
			{
				return true;
			}
		}

		return false;
	},

	selectViewMode: function(viewMode, force)
	{
		// Make sure that the current source supports it
		if (!force && !this.doesSourceHaveViewMode(viewMode))
		{
			viewMode = this.sourceViewModes[0].mode;
		}

		// Has anything changed?
		if (viewMode == this.viewMode)
		{
			return;
		}

		// Deselect the previous view mode
		if (this.viewMode && typeof this.viewModeBtns[this.viewMode] != 'undefined')
		{
			this.viewModeBtns[this.viewMode].removeClass('active');
		}

		this.viewMode = viewMode;
		this.setSelecetedSourceState('mode', this.viewMode);

		if (typeof this.viewModeBtns[this.viewMode] != 'undefined')
		{
			this.viewModeBtns[this.viewMode].addClass('active');
		}
	},

	rememberDisabledElementId: function(elementId)
	{
		var index = $.inArray(elementId, this.settings.disabledElementIds);

		if (index == -1)
		{
			this.settings.disabledElementIds.push(elementId);
		}
	},

	forgetDisabledElementId: function(elementId)
	{
		var index = $.inArray(elementId, this.settings.disabledElementIds);

		if (index != -1)
		{
			this.settings.disabledElementIds.splice(index, 1);
		}
	},

	enableElements: function($elements)
	{
		$elements.removeClass('disabled').parents('.disabled').removeClass('disabled');

		for (var i = 0; i < $elements.length; i++)
		{
			var elementId = $($elements[i]).data('id');
			this.forgetDisabledElementId(elementId);
		}

		this.settings.onEnableElements($elements);
	},

	disableElements: function($elements)
	{
		$elements.removeClass('sel').addClass('disabled').parent().removeClass('sel');

		for (var i = 0; i < $elements.length; i++)
		{
			var elementId = $($elements[i]).data('id');
			this.rememberDisabledElementId(elementId);
		}

		this.settings.onDisableElements($elements);
	},

	getElementById: function(elementId)
	{
		return this.$elementContainer.find('[data-id='+elementId+']:first');
	},

	enableElementsById: function(elementIds)
	{
		elementIds = $.makeArray(elementIds);

		for (var i = 0; i < elementIds.length; i++)
		{
			var elementId = elementIds[i],
				$element = this.getElementById(elementId);

			if ($element.length)
			{
				this.enableElements($element);
			}
			else
			{
				this.forgetDisabledElementId(elementId);
			}
		}
	},

	disableElementsById: function(elementIds)
	{
		elementIds = $.makeArray(elementIds);

		for (var i = 0; i < elementIds.length; i++)
		{
			var elementId = elementIds[i],
				$element = this.getElementById(elementId);

			if ($element.length)
			{
				this.disableElements($element);
			}
			else
			{
				this.rememberDisabledElementId(elementId);
			}
		}
	},

	setElementSelect: function(obj)
	{
		this.elementSelect = obj;
	},

	addButton: function($button)
	{
		if (this.showingSidebar)
		{
			this.$sidebarButtonContainer.append($button);
		}
		else
		{
			$('<td class="thin"/>').prependTo(this.$toolbar.find('tr:first')).append($button);
		}
	},

	addCallback: function(currentCallback, newCallback)
	{
		return $.proxy(function() {
			if (typeof currentCallback == 'function')
			{
				currentCallback.apply(this, arguments);
			}
			newCallback.apply(this, arguments);
		}, this);
	},

	setIndexBusy: function()
	{
		this.$mainSpinner.removeClass('hidden');
		this.isIndexBusy = true;
		this.$elements.fadeTo('fast', 0.5);
	},

	setIndexAvailable: function()
	{
		this.$mainSpinner.addClass('hidden');
		this.isIndexBusy = false;
		this.$elements.fadeTo('fast', 1);
	}
},
{
	defaults: {
		context: 'index',
		storageKey: null,
		criteria: null,
		disabledElementIds: [],
		onUpdateElements: $.noop,
		onEnableElements: $.noop,
		onDisableElements: $.noop,
		onSelectSource: $.noop,
		onAfterHtmlInit: $.noop
	}
});


/**
 * Element Select input
 */
Craft.BaseElementSelectInput = Garnish.Base.extend(
{
	id: null,
	name: null,
	elementType: null,
	sources: null,
	criteria: null,
	sourceElementId: null,
	limit: null,
	modalStorageKey: null,

	elementSelect: null,
	elementSort: null,
	modal: null,

	$container: null,
	$elementsContainer: null,
	$elements: null,
	$addElementBtn: null,

	selectable: true,
	sortable: true,

	init: function(id, name, elementType, sources, criteria, sourceElementId, limit, modalStorageKey)
	{
		this.id = id;
		this.name = name;
		this.elementType = elementType;
		this.sources = sources;
		this.criteria = criteria;
		this.sourceElementId = sourceElementId;
		this.limit = limit;

		if (modalStorageKey)
		{
			this.modalStorageKey = 'BaseElementSelectInput.'+modalStorageKey;
		}

		this.$container = this.getContainer();
		this.$elementsContainer = this.getElementsContainer();
		this.$elements = this.getElements();
		this.$addElementBtn = this.getAddElementsBtn();

		this.updateAddElementsBtn();

		if (this.selectable)
		{
			this.elementSelect = new Garnish.Select(this.$elements, {
				multi: true,
				filter: ':not(.delete)'
			});
		}

		if (this.sortable)
		{
			this.elementSort = new Garnish.DragSort({
				container: this.$elementsContainer,
				filter: (this.selectable ? $.proxy(function() {
					return this.elementSelect.getSelectedItems();
				}, this) : null),
				caboose: $('<div class="caboose"/>'),
				onSortChange: (this.selectable ? $.proxy(function() {
					this.elementSelect.resetItemOrder();
				}, this) : null)
			});
		}

		this.initElements(this.$elements);

		this.addListener(this.$addElementBtn, 'activate', 'showModal');
	},

	getContainer: function()
	{
		return $('#'+this.id);
	},

	getElementsContainer: function()
	{
		return this.$container.children('.elements');
	},

	getElements: function()
	{
		return this.$elementsContainer.children();
	},

	getAddElementsBtn: function()
	{
		return this.$container.children('.btn.add');
	},

	canAddMoreElements: function()
	{
		return (!this.limit || this.$elements.length < this.limit);
	},

	updateAddElementsBtn: function()
	{
		if (this.canAddMoreElements())
		{
			this.enableAddElementsBtn();
		}
		else
		{
			this.disableAddElementsBtn();
		}
	},

	disableAddElementsBtn: function()
	{
		this.$addElementBtn.addClass('disabled');
	},

	enableAddElementsBtn: function()
	{
		this.$addElementBtn.removeClass('disabled');
	},

	initElements: function($elements)
	{
		if (this.selectable)
		{
			this.elementSelect.addItems($elements);
		}

		if (this.sortable)
		{
			this.elementSort.addItems($elements);
		}

		$elements.find('.delete').on('click', $.proxy(function(ev)
		{
			this.removeElement($(ev.currentTarget).closest('.element'));
		}, this));

		this.addListener($elements, 'dblclick', function(ev)
		{
			Craft.showElementEditor($(ev.currentTarget));
		});
	},

	removeElement: function(element)
	{
		var $element = $(element);

		this.$elements = this.$elements.not($element);

		if (this.selectable)
		{
			this.elementSelect.removeItems($element);
		}

		if (this.modal && $element.data('id'))
		{
			this.modal.elementIndex.enableElementsById($element.data('id'));
		}

		if (this.$addElementBtn && this.$addElementBtn.length)
		{
			this.updateAddElementsBtn();
		}

		$element.css('z-index', 0);

		var animateCss = {
			opacity: -1
		};
		animateCss['margin-'+Craft.left] = -($element.outerWidth() + parseInt($element.css('margin-'+Craft.right)));

		$element.animate(animateCss, 'fast', function() {
			$element.remove();
		});

	},

	showModal: function()
	{
		// Make sure we haven't reached the limit
		if (!this.canAddMoreElements())
		{
			return;
		}

		if (!this.modal)
		{
			this.modal = this.createModal();
		}
		else
		{
			this.modal.show();
		}
	},

	createModal: function()
	{
		return Craft.createElementSelectorModal(this.elementType, {
			storageKey:         this.modalStorageKey,
			sources:            this.sources,
			criteria:           this.criteria,
			multiSelect:        (this.limit != 1),
			disabledElementIds: this.getSelectedElementIds(),
			onSelect:           $.proxy(this, 'onModalSelect')
		});
	},

	getSelectedElementIds: function()
	{
		var ids = [];

		if (this.sourceElementId)
		{
			ids.push(this.sourceElementId);
		}

		for (var i = 0; i < this.$elements.length; i++)
		{
			ids.push($(this.$elements[i]).data('id'));
		}

		return ids;
	},

	onModalSelect: function(elements)
	{
		if (this.limit)
		{
			// Cut off any excess elements
			var slotsLeft = this.limit - this.$elements.length;

			if (elements.length > slotsLeft)
			{
				elements = elements.slice(0, slotsLeft);
			}
		}

		this.selectElements(elements);

		if (this.modal.elementIndex)
		{
			this.modal.elementIndex.disableElementsById(this.getSelectedElementIds());
		}
	},

	selectElements: function(elements)
	{
		for (var i = 0; i < elements.length; i++)
		{
			var element = elements[i],
				$element = this.createNewElement(element);

			// Animate it into place
			var origOffset = element.$element.offset(),
				destOffset = $element.offset();

			var css = {
				top:    origOffset.top - destOffset.top,
				zIndex: 10000
			};
			css[Craft.left] = origOffset.left - destOffset.left;

			$element.css(css);

			var animateCss = {
				top: 0
			};
			animateCss[Craft.left] = 0;

			$element.animate(animateCss, function() {
				$(this).css('z-index', 1);
			});

			this.initElements($element);
			this.$elements = this.$elements.add($element);
		}

		this.updateAddElementsBtn();
		this.onSelectElements();
	},

	createNewElement: function(elementInfo)
	{
		var $element = elementInfo.$element.clone();

		// Make a couple tweaks
		$element.addClass('removable');
		$element.prepend('<input type="hidden" name="'+this.name+'[]" value="'+elementInfo.id+'">' +
			'<a class="delete icon" title="'+Craft.t('Remove')+'"></a>');

		$element.appendTo(this.$elementsContainer);

		return $element;
	},

	onSelectElements: function()
	{
		this.trigger('selectElements');
	},

	forceModalRefresh: function ()
	{
		if (this.modal)
		{
			this.modal.elementIndex = null;
		}
	}
});


/**
 * Element selector modal class
 */
Craft.BaseElementSelectorModal = Garnish.Modal.extend(
{
	elementType: null,
	elementIndex: null,
	elementSelect: null,

	$body: null,
	$selectBtn: null,
	$sidebar: null,
	$sources: null,
	$sourceToggles: null,
	$main: null,
	$search: null,
	$elements: null,
	$tbody: null,
	$buttons: null,
	$cancelBtn: null,
	$selectBtn: null,

	init: function(elementType, settings)
	{
		this.elementType = elementType;
		this.setSettings(settings, Craft.BaseElementSelectorModal.defaults);

		// Build the modal
		var $container = $('<div class="modal elementselectormodal"></div>').appendTo(Garnish.$bod),
			$body = $('<div class="body"><div class="spinner big"></div></div>').appendTo($container),
			$footer = $('<div class="footer"/>').appendTo($container);

		this.base($container, this.settings);

		this.$buttons = $('<div class="buttons rightalign"/>').appendTo($footer);
		this.$cancelBtn = $('<div class="btn">'+Craft.t('Cancel')+'</div>').appendTo(this.$buttons);
		this.$selectBtn = $('<div class="btn disabled submit">'+Craft.t('Select')+'</div>').appendTo(this.$buttons);

		this.$body = $body;

		this.addListener(this.$cancelBtn, 'activate', 'cancel');
		this.addListener(this.$selectBtn, 'activate', 'selectElements');
	},

	onFadeIn: function()
	{
		if (!this.elementIndex)
		{
			// Get the modal body HTML based on the settings
			var data = {
				context:     'modal',
				elementType: this.elementType,
				sources:     this.settings.sources
			};

			Craft.postActionRequest('elements/getModalBody', data, $.proxy(function(response, textStatus)
			{
				if (textStatus == 'success')
				{
					this.$body.html(response);

					if (this.$body.has('.sidebar:not(.hidden)').length)
					{
						this.$body.addClass('has-sidebar');
					}

					// Initialize the element index
					this.elementIndex = Craft.createElementIndex(this.elementType, this.$body, {
						context:            'modal',
						storageKey:         this.settings.storageKey,
						criteria:           this.settings.criteria,
						disabledElementIds: this.settings.disabledElementIds,
						onUpdateElements:   $.proxy(this, 'onUpdateElements'),
						onEnableElements:   $.proxy(this, 'onEnableElements'),
						onDisableElements:  $.proxy(this, 'onDisableElements')
					});
				}

			}, this));
		}
		else
		{
			// Auto-focus the Search box
			if (!Garnish.isMobileBrowser(true))
			{
				this.elementIndex.$search.focus();
			}
		}

		this.base();
	},

	onUpdateElements: function(appended)
	{
		if (!appended)
		{
			this.addListener(this.elementIndex.$elementContainer, 'dblclick', 'selectElements');
		}

		// Reset the element select
		if (this.elementSelect)
		{
			this.elementSelect.destroy();
			delete this.elementSelect;
		}

		if (this.elementIndex.getSelectedSourceState('mode') == 'structure')
		{
			var $items = this.elementIndex.$elementContainer.find('.row:not(.disabled)');
		}
		else
		{
			var $items = this.elementIndex.$elementContainer.children(':not(.disabled)');
		}

		this.elementSelect = new Garnish.Select(this.elementIndex.$elementContainer, $items, {
			multi: this.settings.multiSelect,
			vertical: (this.elementIndex.getSelectedSourceState('mode') != 'thumbs'),
			onSelectionChange: $.proxy(this, 'onSelectionChange')
		});

        this.elementIndex.setElementSelect(this.elementSelect);
    },

	onSelectionChange: function()
	{
		if (this.elementSelect.totalSelected)
		{
			this.$selectBtn.removeClass('disabled');
		}
		else
		{
			this.$selectBtn.addClass('disabled');
		}
	},

	onEnableElements: function($elements)
	{
		this.elementSelect.addItems($elements);
	},

	onDisableElements: function($elements)
	{
		this.elementSelect.removeItems($elements);
	},

	cancel: function()
	{
		this.hide();
	},

	selectElements: function()
	{
		if (this.elementIndex && this.elementSelect && this.elementSelect.totalSelected)
		{
			this.elementSelect.clearMouseUpTimeout();
			this.hide();

			var $selectedItems = this.elementSelect.getSelectedItems(),
				elementInfo = this.getElementInfo($selectedItems);

			this.onSelect(elementInfo);

			if (this.settings.disableOnSelect)
			{
				this.elementIndex.disableElements(this.elementSelect.getSelectedItems());
			}
		}
	},

	getElementInfo: function($selectedItems)
	{
		var info = [];

		for (var i = 0; i < $selectedItems.length; i++)
		{
			var $item = $($selectedItems[i]);

			info.push(Craft.getElementInfo($item));
		}

		return info;
	},

	onSelect: function(elementInfo)
	{
		this.settings.onSelect(elementInfo);
	}
},
{
	defaults: {
		resizable: true,
		storageKey: null,
		sources: null,
		criteria: null,
		multiSelect: false,
		disabledElementIds: [],
		disableOnSelect: false,
		onCancel: $.noop,
		onSelect: $.noop
	}
});


/**
 * Input Generator
 */
Craft.BaseInputGenerator = Garnish.Base.extend(
{
	$source: null,
	$target: null,
	settings: null,

	listening: null,
	timeout: null,

	init: function(source, target, settings)
	{
		this.$source = $(source);
		this.$target = $(target);
		this.setSettings(settings);

		this.startListening();
	},

	setNewSource: function(source)
	{
		var listening = this.listening;
		this.stopListening();

		this.$source = $(source);

		if (listening)
		{
			this.startListening();
		}
	},

	startListening: function()
	{
		if (this.listening)
		{
			return;
		}

		this.listening = true;

		this.addListener(this.$source, 'textchange', 'onTextChange');

		this.addListener(this.$target, 'focus', function() {
			this.addListener(this.$target, 'textchange', 'stopListening');
			this.addListener(this.$target, 'blur', function() {
				this.removeListener(this.$target, 'textchange,blur');
			});
		});
	},

	stopListening: function()
	{
		if (!this.listening)
		{
			return;
		}

		this.listening = false;

		this.removeAllListeners(this.$source);
		this.removeAllListeners(this.$target);
	},

	onTextChange: function()
	{
		if (this.timeout)
		{
			clearTimeout(this.timeout);
		}

		this.timeout = setTimeout($.proxy(this, 'updateTarget'), 250);
	},

	updateTarget: function()
	{
		var sourceVal = this.$source.val(),
			targetVal = this.generateTargetValue(sourceVal);

		this.$target.val(targetVal);
		this.$target.trigger('textchange');
	},

	generateTargetValue: function(sourceVal)
	{
		return sourceVal;
	}
});


/**
 * Admin table class
 */
Craft.AdminTable = Garnish.Base.extend(
{
	settings: null,
	totalObjects: null,
	sorter: null,

	$noObjects: null,
	$table: null,
	$tbody: null,
	$deleteBtns: null,

	init: function(settings)
	{
		this.setSettings(settings, Craft.AdminTable.defaults);

		if (!this.settings.allowDeleteAll)
		{
			this.settings.minObjects = 1;
		}

		this.$noObjects = $(this.settings.noObjectsSelector);
		this.$table = $(this.settings.tableSelector);
		this.$tbody  = this.$table.children('tbody');
		this.totalObjects = this.$tbody.children().length;

		if (this.settings.sortable)
		{
			this.sorter = new Craft.DataTableSorter(this.$table, {
				onSortChange: $.proxy(this, 'reorderObjects')
			});
		}

		this.$deleteBtns = this.$table.find('.delete');
		this.addListener(this.$deleteBtns, 'click', 'deleteObject');

		this.updateUI();
	},

	addRow: function(row)
	{
		if (this.settings.maxObjects && this.totalObjects >= this.settings.maxObjects)
		{
			// Sorry pal.
			return;
		}

		var $row = $(row).appendTo(this.$tbody),
			$deleteBtn = $row.find('.delete');

		if (this.settings.sortable)
		{
			this.sorter.addItems($row);
		}

		this.$deleteBtns = this.$deleteBtns.add($deleteBtn);

		this.addListener($deleteBtn, 'click', 'deleteObject');
		this.totalObjects++;

		this.updateUI();
	},

	reorderObjects: function()
	{
		if (!this.settings.sortable)
		{
			return false;
		}

		// Get the new field order
		var ids = [];

		for (var i = 0; i < this.sorter.$items.length; i++)
		{
			var id = $(this.sorter.$items[i]).attr(this.settings.idAttribute);
			ids.push(id);
		}

		// Send it to the server
		var data = {
			ids: JSON.stringify(ids)
		};

		Craft.postActionRequest(this.settings.reorderAction, data, $.proxy(function(response, textStatus)
		{
			if (textStatus == 'success')
			{
				if (response.success)
				{
					Craft.cp.displayNotice(Craft.t(this.settings.reorderSuccessMessage));
				}
				else
				{
					Craft.cp.displayError(Craft.t(this.settings.reorderFailMessage));
				}
			}

		}, this));
	},

	deleteObject: function(event)
	{
		if (this.settings.minObjects && this.totalObjects <= this.settings.minObjects)
		{
			// Sorry pal.
			return;
		}

		var $row = $(event.target).closest('tr'),
			id = $row.attr(this.settings.idAttribute),
			name = $row.attr(this.settings.nameAttribute);

		if (this.confirmDeleteObject($row))
		{
			Craft.postActionRequest(this.settings.deleteAction, { id: id }, $.proxy(function(response, textStatus)
			{
				if (textStatus == 'success')
				{
					if (response.success)
					{
						$row.remove();
						this.totalObjects--;
						this.updateUI();
						this.onDeleteObject(id);

						Craft.cp.displayNotice(Craft.t(this.settings.deleteSuccessMessage, { name: name }));
					}
					else
					{
						Craft.cp.displayError(Craft.t(this.settings.deleteFailMessage, { name: name }));
					}
				}

			}, this));
		}
	},

	confirmDeleteObject: function($row)
	{
		var name = $row.attr(this.settings.nameAttribute);
		return confirm(Craft.t(this.settings.confirmDeleteMessage, { name: name }));
	},

	onDeleteObject: function(id)
	{
		this.settings.onDeleteObject(id);
	},

	updateUI: function()
	{
		// Show the "No Whatever Exists" message if there aren't any
		if (this.totalObjects == 0)
		{
			this.$table.hide();
			this.$noObjects.removeClass('hidden');
		}
		else
		{
			this.$table.show();
			this.$noObjects.addClass('hidden');
		}

		// Disable the sort buttons if there's only one row
		if (this.settings.sortable)
		{
			var $moveButtons = this.$table.find('.move');

			if (this.totalObjects == 1)
			{
				$moveButtons.addClass('disabled');
			}
			else
			{
				$moveButtons.removeClass('disabled');
			}
		}

		// Disable the delete buttons if we've reached the minimum objects
		if (this.settings.minObjects && this.totalObjects <= this.settings.minObjects)
		{
			this.$deleteBtns.addClass('disabled');
		}
		else
		{
			this.$deleteBtns.removeClass('disabled');
		}

		// Hide the New Whatever button if we've reached the maximum objects
		if (this.settings.newObjectBtnSelector)
		{
			if (this.settings.maxObjects && this.totalObjects >= this.settings.maxObjects)
			{
				$(this.settings.newObjectBtnSelector).addClass('hidden');
			}
			else
			{
				$(this.settings.newObjectBtnSelector).removeClass('hidden');
			}
		}
	}
},
{
	defaults: {
		tableSelector: null,
		noObjectsSelector: null,
		newObjectBtnSelector: null,
		idAttribute: 'data-id',
		nameAttribute: 'data-name',
		sortable: false,
		allowDeleteAll: true,
		minObjects: 0,
		maxObjects: null,
		reorderAction: null,
		deleteAction: null,
		reorderSuccessMessage: Craft.t('New order saved.'),
		reorderFailMessage:    Craft.t('Couldn’t save new order.'),
		confirmDeleteMessage:  Craft.t('Are you sure you want to delete “{name}”?'),
		deleteSuccessMessage:  Craft.t('“{name}” deleted.'),
		deleteFailMessage:     Craft.t('Couldn’t delete “{name}”.'),
		onDeleteObject: $.noop
	}
});


/**
 * Asset index class
 */
Craft.AssetIndex = Craft.BaseElementIndex.extend(
{
	$uploadButton: null,
	$uploadInput: null,
	$progressBar: null,
	$folders: null,
	$previouslySelectedFolder: null,

	uploader: null,
	promptHandler: null,
	progressBar: null,

	initialSourceKey: null,
	isIndexBusy: false,
	_uploadTotalFiles: 0,
	_uploadFileProgress: {},
	_uploadedFileIds: [],
	_selectedFileIds: [],

	_singleFileMenu: null,
	_multiFileMenu: null,

	_fileDrag: null,
	_folderDrag: null,
	_expandDropTargetFolderTimeout: null,
	_tempExpandedFolders: [],

	init: function(elementType, $container, settings)
	{
		this.base(elementType, $container, settings);

		var context = this.settings.context;
		if (context == 'index')
		{
			this.initIndexMode();
		}

		var assetIndex = this;
		this.$sources.each(function() {

			// Index mode gets all the fancy options
			if (context == 'index')
			{
				assetIndex._createFolderContextMenu.apply(assetIndex, [$(this), true]);
				if ($(this).parents('ul').length > 1)
				{
					assetIndex._folderDrag.addItems($(this).parent());
				}
			}
			else
			{
				assetIndex._createFolderContextMenu.apply(assetIndex, [$(this), false]);
			}
		});
	},

	/**
	 * Full blown Assets.
	 */
	initIndexMode: function()
	{
		// Context menus for the folders
		var assetIndex = this;

		// ---------------------------------------
		// File dragging
		// ---------------------------------------
		this._fileDrag = new Garnish.DragDrop({
			activeDropTargetClass: 'sel assets-fm-dragtarget',
			helperOpacity: 0.5,

			filter: $.proxy(function()
			{
				return this.elementSelect.getSelectedItems();
			}, this),

			helper: $.proxy(function($file)
			{
				return this._getDragHelper($file);
			}, this),

			dropTargets: $.proxy(function()
			{
				var targets = [];

				this.$sources.each(function()
				{
					targets.push($(this));
				});

				return targets;
			}, this),

			onDragStart: $.proxy(function()
			{
				this._tempExpandedFolders = [];

				this.$previouslySelectedFolder = this.$source.removeClass('sel');

			}, this),

			onDropTargetChange: $.proxy(this, '_onDropTargetChange'),

			onDragStop: $.proxy(this, '_onFileDragStop')
		});

		// ---------------------------------------
		// Folder dragging
		// ---------------------------------------
		this._folderDrag = new Garnish.DragDrop({
			activeDropTargetClass: 'sel assets-fm-dragtarget',
			helperOpacity: 0.5,

			filter: $.proxy(function()
			{
				// return each of the selected <a>'s parent <li>s, except for top level drag attampts.
				var $selected = this.sourceSelect.getSelectedItems(),
					draggees = [];
				for (var i = 0; i < $selected.length; i++)
				{
					var $source = $($selected[i]).parent();
					if ($source.parents('ul').length > 1 && $source.hasClass('sel'))
					{
						draggees.push($source[0]);
					}
				}

				return $(draggees);
			}, this),

			helper: $.proxy(function($folder)
			{
				var $helper = $('<ul class="assets-fm-folderdrag" />').append($folder);

				// collapse this folder
				$folder.removeClass('expanded');

				// set the helper width to the folders container width
				$helper.width(this.$sidebar[0].scrollWidth);

				return $helper;
			}, this),

			dropTargets: $.proxy(function()
			{
				var targets = [];

				this.$sources.each(function()
				{
					if (!$(this).is(assetIndex._folderDrag.$draggee))
					{
						targets.push($(this));
					}
				});

				return targets;
			}, this),

			onDragStart: $.proxy(function()
			{
				this._tempExpandedFolders = [];

				// hide the expanded draggees' subfolders
				this._folderDrag.$draggee.filter('.expanded').removeClass('expanded').addClass('expanded-tmp')
			}, this),

			onDropTargetChange: $.proxy(this, '_onDropTargetChange'),

			onDragStop: $.proxy(this, '_onFolderDragStop')
		});

	},

	_onFileDragStop: function()
	{
		if (this._fileDrag.$activeDropTarget)
		{
			// keep it selected
			this._fileDrag.$activeDropTarget.addClass('sel');

			var targetFolderId = this._getFolderIdFromSourceKey(this._fileDrag.$activeDropTarget.data('key'));
			var originalFileIds = [],
				newFileNames = [];


			// For each file, prepare array data.
			for (var i = 0; i < this._fileDrag.$draggee.length; i++)
			{
				var originalFileId = Craft.getElementInfo(this._fileDrag.$draggee[i]).id,
					fileName = Craft.getElementInfo(this._fileDrag.$draggee[i]).url.split('/').pop();

				originalFileIds.push(originalFileId);
				newFileNames.push(fileName);
			}

			// are any files actually getting moved?
			if (originalFileIds.length)
			{
				this.setIndexBusy();

				this._positionProgressBar();
				this.progressBar.resetProgressBar();
				this.progressBar.setItemCount(originalFileIds.length);
				this.progressBar.showProgressBar();


				// for each file to move a separate request
				var parameterArray = [];
				for (i = 0; i < originalFileIds.length; i++)
				{
					parameterArray.push({
						fileId: originalFileIds[i],
						folderId: targetFolderId,
						fileName: newFileNames[i]
					});
				}

				// define the callback for when all file moves are complete
				var onMoveFinish = $.proxy(function(responseArray)
				{
					this.promptHandler.resetPrompts();

					// loop trough all the responses
					for (var i = 0; i < responseArray.length; i++)
					{
						var data = responseArray[i];

						// push prompt into prompt array
						if (data.prompt)
						{
							this.promptHandler.addPrompt(data);
						}

						if (data.error)
						{
							alert(data.error);
						}
					}

					this.setIndexAvailable();
					this.progressBar.hideProgressBar();

					if (this.promptHandler.getPromptCount())
					{
						// define callback for completing all prompts
						var promptCallback = $.proxy(function(returnData)
						{
							var newParameterArray = [];

							// loop trough all returned data and prepare a new request array
							for (var i = 0; i < returnData.length; i++)
							{
								if (returnData[i].choice == 'cancel')
								{
									continue;
								}

								// find the matching request parameters for this file and modify them slightly
								for (var ii = 0; ii < parameterArray.length; ii++)
								{
									if (parameterArray[ii].fileName == returnData[i].fileName)
									{
										parameterArray[ii].action = returnData[i].choice;
										newParameterArray.push(parameterArray[ii]);
									}
								}
							}

							// nothing to do, carry on
							if (newParameterArray.length == 0)
							{
								this._selectSourceByFolderId(targetFolderId);
							}
							else
							{
								// start working
								this.setIndexBusy();
								this.progressBar.resetProgressBar();
								this.progressBar.setItemCount(this.promptHandler.getPromptCount());
								this.progressBar.showProgressBar();

								// move conflicting files again with resolutions now
								this._moveFile(newParameterArray, 0, onMoveFinish);
							}
						}, this);

						this._fileDrag.fadeOutHelpers();
						this.promptHandler.showBatchPrompts(promptCallback);
					}
					else
					{
						this._fileDrag.fadeOutHelpers();
						this._selectSourceByFolderId(targetFolderId);
					}
				}, this);

				// initiate the file move with the built array, index of 0 and callback to use when done
				this._moveFile(parameterArray, 0, onMoveFinish);

				// skip returning dragees
				return;
			}
		}
		else
		{
			this._collapseExtraExpandedFolders();
		}

		// re-select the previously selected folders
		this.$previouslySelectedFolder.addClass('sel');

		this._fileDrag.returnHelpersToDraggees();
	},

	_onFolderDragStop: function()
	{
		// show the expanded draggees' subfolders
		this._folderDrag.$draggee.filter('.expanded-tmp').removeClass('expanded-tmp').addClass('expanded');

		// Only move if we have a valid target and we're not trying to move into our direct parent
		if (
			this._folderDrag.$activeDropTarget
				&& this._folderDrag.$activeDropTarget.siblings('ul').find('>li').filter(this._folderDrag.$draggee).length == 0
		)
		{
			var targetFolderId = this._getFolderIdFromSourceKey(this._folderDrag.$activeDropTarget.data('key'));

			this._collapseExtraExpandedFolders(targetFolderId);

			// get the old folder IDs, and sort them so that we're moving the most-nested folders first
			var folderIds = [];

			for (var i = 0; i < this._folderDrag.$draggee.length; i++)
			{
				var $a = $('> a', this._folderDrag.$draggee[i]),
					folderId = this._getFolderIdFromSourceKey($a.data('key')),
					$source = this._getSourceByFolderId(folderId);

				// make sure it's not already in the target folder
				if (this._getFolderIdFromSourceKey(this._getParentSource($source).data('key')) != targetFolderId)
				{
					folderIds.push(folderId);
				}
			}

			if (folderIds.length)
			{
				folderIds.sort();
				folderIds.reverse();

				this.setIndexBusy();
				this._positionProgressBar();
				this.progressBar.resetProgressBar();
				this.progressBar.setItemCount(folderIds.length);
				this.progressBar.showProgressBar();

				var responseArray = [];
				var parameterArray = [];

				for (var i = 0; i < folderIds.length; i++)
				{
					parameterArray.push({
						folderId: folderIds[i],
						parentId: targetFolderId
					});
				}

				// increment, so to avoid displaying folder files that are being moved
				this.requestId++;

				/*
				 Here's the rundown:
				 1) Send all the folders being moved
				 2) Get results:
				   a) For all conflicting, receive prompts and resolve them to get:
				   b) For all valid move operations: by now server has created the needed folders
					  in target destination. Server returns an array of file move operations
				   c) server also returns a list of all the folder id changes
				   d) and the data-id of node to be removed, in case of conflict
				   e) and a list of folders to delete after the move
				 3) From data in 2) build a large file move operation array
				 4) Create a request loop based on this, so we can display progress bar
				 5) when done, delete all the folders and perform other maintenance
				 6) Champagne
				 */

				// this will hold the final list of files to move
				var fileMoveList = [];

				// these folders have to be deleted at the end
				var folderDeleteList = [];

				// this one tracks the changed folder ids
				var changedFolderIds = {};

				var removeFromTree = [];

				var onMoveFinish = $.proxy(function(responseArray)
				{
					this.promptHandler.resetPrompts();

					// loop trough all the responses
					for (var i = 0; i < responseArray.length; i++)
					{
						var data = responseArray[i];

						// if succesful and have data, then update
						if (data.success)
						{
							if (data.transferList && data.deleteList && data.changedFolderIds)
							{
								for (var ii = 0; ii < data.transferList.length; ii++)
								{
									fileMoveList.push(data.transferList[ii]);
								}
								for (var ii = 0; ii < data.deleteList.length; ii++)
								{
									folderDeleteList.push(data.deleteList[ii]);
								}
								for (var oldFolderId in data.changedFolderIds)
								{
									changedFolderIds[oldFolderId] = data.changedFolderIds[oldFolderId];
								}
								removeFromTree.push(data.removeFromTree);
							}
						}

						// push prompt into prompt array
						if (data.prompt)
						{
							this.promptHandler.addPrompt(data);
						}

						if (data.error)
						{
							alert(data.error);
						}
					}

					if (this.promptHandler.getPromptCount())
					{
						// define callback for completing all prompts
						var promptCallback = $.proxy(function(returnData)
						{
							this.promptHandler.resetPrompts();
							this.setNewElementDataHtml('');

							var newParameterArray = [];

							// loop trough all returned data and prepare a new request array
							for (var i = 0; i < returnData.length; i++)
							{
								if (returnData[i].choice == 'cancel')
								{
									continue;
								}

								parameterArray[0].action = returnData[i].choice;
								newParameterArray.push(parameterArray[0]);

							}

							// start working on them lists, baby
							if (newParameterArray.length == 0)
							{
								$.proxy(this, '_performActualFolderMove', fileMoveList, folderDeleteList, changedFolderIds, removeFromTree)();
							}
							else
							{
								// start working
								this.setIndexBusy();
								this.progressBar.resetProgressBar();
								this.progressBar.setItemCount(this.promptHandler.getPromptCount());
								this.progressBar.showProgressBar();

								// move conflicting files again with resolutions now
								moveFolder(newParameterArray, 0, onMoveFinish);
							}
						}, this);

						this.promptHandler.showBatchPrompts(promptCallback);

						this.setIndexAvailable();
						this.progressBar.hideProgressBar();
					}
					else
					{
						$.proxy(this, '_performActualFolderMove', fileMoveList, folderDeleteList, changedFolderIds, removeFromTree, targetFolderId)();
					}

				}, this);

				var moveFolder = $.proxy(function(parameterArray, parameterIndex, callback)
				{
					if (parameterIndex == 0)
					{
						responseArray = [];
					}

					Craft.postActionRequest('assets/moveFolder', parameterArray[parameterIndex], $.proxy(function(data, textStatus)
					{
						parameterIndex++;
						this.progressBar.incrementProcessedItemCount(1);
						this.progressBar.updateProgressBar();

						if (textStatus == 'success')
						{
							responseArray.push(data);
						}

						if (parameterIndex >= parameterArray.length)
						{
							callback(responseArray);
						}
						else
						{
							moveFolder(parameterArray, parameterIndex, callback);
						}

					}, this));
				}, this);

				// initiate the folder move with the built array, index of 0 and callback to use when done
				moveFolder(parameterArray, 0, onMoveFinish);

				// skip returning dragees until we get the Ajax response
				return;
			}
		}
		else
		{
			this._collapseExtraExpandedFolders();
		}

		this._folderDrag.returnHelpersToDraggees();
	},

	/**
	 * Really move the folder. Like really. For real.
	 */
	_performActualFolderMove: function(fileMoveList, folderDeleteList, changedFolderIds, removeFromTree, targetFolderId)
	{
		this.setIndexBusy();
		this.progressBar.resetProgressBar();
		this.progressBar.setItemCount(1);
		this.progressBar.showProgressBar();


		var moveCallback = $.proxy(function(folderDeleteList, changedFolderIds, removeFromTree)
		{
			//Move the folders around in the tree
			var topFolderLi = $();
			var folderToMove = $();
			var topMovedFolderId = 0;

			// Change the folder ids
			for (var previousFolderId in changedFolderIds)
			{
				folderToMove = this._getSourceByFolderId(previousFolderId);

				// Change the id and select the containing element as the folder element.
				folderToMove = folderToMove
									.attr('data-key', 'folder:' + changedFolderIds[previousFolderId].newId)
									.data('key', 'folder:' + changedFolderIds[previousFolderId].newId).parent();

				if (topFolderLi.length == 0 || topFolderLi.parents().filter(folderToMove).length > 0)
				{
					topFolderLi = folderToMove;
					topFolderMovedId = changedFolderIds[previousFolderId].newId;
				}
			}

			if (topFolderLi.length == 0)
			{
				this.setIndexAvailable();
				this.progressBar.hideProgressBar();
				this._folderDrag.returnHelpersToDraggees();

				return;
			}

			var topFolder = topFolderLi.find('>a');

			// Now move the uppermost node.
			var siblings = topFolderLi.siblings('ul, .toggle');
			var parentSource = this._getParentSource(topFolder);

			var newParent = this._getSourceByFolderId(targetFolderId);
			this._prepareParentForChildren(newParent);
			this._addSubfolder(newParent, topFolderLi);

			topFolder.after(siblings);

			this._cleanUpTree(parentSource);
			this.$sidebar.find('ul>ul, ul>.toggle').remove();

			// delete the old folders
			for (var i = 0; i < folderDeleteList.length; i++)
			{
				Craft.postActionRequest('assets/deleteFolder', {folderId: folderDeleteList[i]});
			}

			this.setIndexAvailable();
			this.progressBar.hideProgressBar();
			this._folderDrag.returnHelpersToDraggees();
			this._selectSourceByFolderId(topFolderMovedId);

		}, this);

		if (fileMoveList.length > 0)
		{
			this._moveFile(fileMoveList, 0, $.proxy(function()
			{
				moveCallback(folderDeleteList, changedFolderIds, removeFromTree);
			}, this));
		}
		else
		{
			moveCallback(folderDeleteList, changedFolderIds, removeFromTree);
		}
	},

	/**
	 * Get parent source for a source.
	 * @param $source
	 * @returns {*}
	 * @private
	 */
	_getParentSource: function($source)
	{
		if ($source.parents('ul').length == 1)
		{
			return null;
		}
		return $source.parent().parent().siblings('a');
	},

	/**
	 * Move a file using data from a parameter array.
	 *
	 * @param parameterArray
	 * @param parameterIndex
	 * @param callback
	 * @private
	 */
	_moveFile: function(parameterArray, parameterIndex, callback)
	{
		if (parameterIndex == 0)
		{
			this.responseArray = [];
		}

		Craft.postActionRequest('assets/moveFile', parameterArray[parameterIndex], $.proxy(function(data, textStatus)
		{
			this.progressBar.incrementProcessedItemCount(1);
			this.progressBar.updateProgressBar();

			if (textStatus == 'success')
			{
				this.responseArray.push(data);

				// If assets were just merged we should get the referece tags updated right away
				Craft.cp.runPendingTasks();
			}

			parameterIndex++;

			if (parameterIndex >= parameterArray.length)
			{
				callback(this.responseArray);
			}
			else
			{
				this._moveFile(parameterArray, parameterIndex, callback);
			}

		}, this));
	},

	_selectSourceByFolderId: function(targetFolderId)
	{
		var targetSource = this._getSourceByFolderId(targetFolderId);

		// Make sure that all the parent sources are expanded and this source is visible.
		var parentSources = targetSource.parent().parents('li');
		parentSources.each(function()
		{
			if (!$(this).hasClass('expanded'))
			{
				$(this).find('> .toggle').click();
			}
		});

		this.selectSource(targetSource);
		this.updateElements();
	},

	/**
	 * Initialize the uploader.
	 *
	 * @private
	 */
	onAfterHtmlInit: function()
	{
		if (!this.$uploadButton)
		{
			this.$uploadButton = $('<div class="btn submit assets-upload-button" data-icon="↑" style="position: relative; overflow: hidden;" role="button">' + Craft.t('Upload files') + '</div>');
			this.addButton(this.$uploadButton);

			this.$uploadInput = $('<input type="file" multiple="multiple" name="assets-upload" />').hide().insertBefore(this.$uploadButton);
		}

		this.promptHandler = new Craft.PromptHandler();
		this.progressBar = new Craft.ProgressBar(this.$main, true);

		var options = {
			url: Craft.getActionUrl('assets/uploadFile'),
			fileInput: this.$uploadInput,
			dropZone: this.$main
		};

		options.events = {
			fileuploadstart:       $.proxy(this, '_onUploadStart'),
			fileuploadprogressall: $.proxy(this, '_onUploadProgress'),
			fileuploaddone:        $.proxy(this, '_onUploadComplete')
		};

		if (typeof this.settings.criteria.kind != "undefined")
		{
			options.allowedKinds = this.settings.criteria.kind;
		}

		this.uploader = new Craft.Uploader (this.$uploadButton, options);
		this.$uploadButton.on('click', $.proxy(function()
		{
			if (!this.isIndexBusy)
			{
				this.$uploadButton.parent().find('input[name=assets-upload]').click();
			}
		}, this));

		this.base();
	},

	onSelectSource: function()
	{
		this.uploader.setParams({folderId: this._getFolderIdFromSourceKey(this.sourceKey)});

		this.base();
	},

	_getFolderIdFromSourceKey: function(sourceKey)
	{
		return sourceKey.split(':')[1];
	},

	/**
	 * React on upload submit.
	 *
	 * @param id
	 * @private
	 */
	_onUploadStart: function(event) {
		this.setIndexBusy();

		// Initial values
		this._positionProgressBar();
		this.progressBar.resetProgressBar();
		this.progressBar.showProgressBar();
	},

	/**
	 * Update uploaded byte count.
	 */
	_onUploadProgress: function(event, data) {
		var progress = parseInt(data.loaded / data.total * 100, 10);
		this.progressBar.setProgressPercentage(progress);
	},

	/**
	 * On Upload Complete.
	 */
	_onUploadComplete: function(event, data) {
		var response = data.result;
		var fileName = data.files[0].name;

		var doReload = true;

		if (response.success || response.prompt)
		{
			// Add the uploaded file to the selected ones, if appropriate
			this._uploadedFileIds.push(response.fileId);

			// If there is a prompt, add it to the queue
			if (response.prompt)
			{
				this.promptHandler.addPrompt(response);
			}
		}
		else
		{
			if (response.error)
			{
				alert(Craft.t('Upload failed for {filename}. The error message was: ”{error}“', { filename: fileName, error: response.error }));
			}
			else
			{
				alert(Craft.t('Upload failed for {filename}.', { filename: fileName }));
			}
			doReload = false;
		}

		// for the last file, display prompts, if any. If not - just update the element view.
		if (this.uploader.isLastUpload())
		{
			this.setIndexAvailable();
			this.progressBar.hideProgressBar();

			if (this.promptHandler.getPromptCount())
			{
				this.promptHandler.showBatchPrompts($.proxy(this, '_uploadFollowup'));
			}
			else
			{
				if (doReload)
				{
					this.updateElements();
				}

			}
		}
	},

	/**
	 * Follow up to an upload that triggered at least one conflict resolution prompt.
	 *
	 * @param returnData
	 * @private
	 */
	_uploadFollowup: function(returnData)
	{
		this.setIndexBusy();
		this.progressBar.resetProgressBar();

		this.promptHandler.resetPrompts();

		var finalCallback = $.proxy(function()
		{
			this.setIndexAvailable();
			this.progressBar.hideProgressBar();
			this.updateElements();
		}, this);

		this.progressBar.setItemCount(returnData.length);

		var doFollowup = $.proxy(function(parameterArray, parameterIndex, callback)
		{
			var postData = {
				additionalInfo: parameterArray[parameterIndex].additionalInfo,
				fileName:       parameterArray[parameterIndex].fileName,
				userResponse:   parameterArray[parameterIndex].choice
			};

			Craft.postActionRequest('assets/uploadFile', postData, $.proxy(function(data, textStatus)
			{
				if (textStatus == 'success' && data.fileId)
				{
					this._uploadedFileIds.push(data.fileId);
				}
				parameterIndex++;
				this.progressBar.incrementProcessedItemCount(1);
				this.progressBar.updateProgressBar();

				if (parameterIndex == parameterArray.length)
				{
					callback();
				}
				else
				{
					doFollowup(parameterArray, parameterIndex, callback);
				}
			}, this));

		}, this);

		this.progressBar.showProgressBar();
		doFollowup(returnData, 0, finalCallback);
	},

	/**
	 * Perform actions after updating elements
	 * @private
	 */
	onUpdateElements: function(append)
	{
		this.base(append);

		if (this.settings.context == 'index')
		{
			$elements = this.$elementContainer.children(':not(.disabled)');
			this._initElementSelect($elements);
			this._attachElementEvents($elements);
			this._initElementDragger($elements);
		}

		// See if we have freshly uploaded files to add to selection
		if (this._uploadedFileIds.length)
		{
			var item = null;
			for (var i = 0; i < this._uploadedFileIds.length; i++)
			{
				item = this.$main.find('[data-id=' + this._uploadedFileIds[i] + ']:first').parent();
				if (this.getSelectedSourceState('mode') == 'table')
				{
					item = item.parent();
				}

				this.elementSelect.selectItem(item);
			}

			// Reset the list.
			this._uploadedFileIds = [];
		}
	},

	_initElementSelect: function($children)
	{
		if (typeof this.elementSelect == "object" && this.elementSelect != null)
		{
			this.elementSelect.destroy();
			delete this.elementSelect;
		}

		var elementSelect = new Garnish.Select(this.$elementContainer, $children, {
			multi: true,
			vertical: (this.getSelectedSourceState('mode') == 'table'),
			onSelectionChange: $.proxy(this, '_onElementSelectionChange')
		});

		this.setElementSelect(elementSelect);
	},

	_onElementSelectionChange: function()
	{
		this._enableElementContextMenu();
		var selected = this.elementSelect.getSelectedItems();
		this._selectedFileIds = [];
		for (var i = 0; i < selected.length; i++)
		{
			this._selectedFileIds[i] = Craft.getElementInfo(selected[i]).id;
		}
	},

	_attachElementEvents: function($elements)
	{
		// Doubleclick opens the HUD for editing
		this.removeListener($elements, 'dlbclick');
		this.addListener($elements, 'dblclick', $.proxy(this, '_editProperties'));

		// Context menus
		this._destroyElementContextMenus();
		this._createElementContextMenus($elements);
	},

	_initElementDragger: function($elements)
	{
		this._fileDrag.removeAllItems();
		this._fileDrag.addItems($elements);
	},

	_editProperties: function(event)
	{
		var $element = $(event.currentTarget).find('.element');
		new Craft.ElementEditor($element);
	},

	_createElementContextMenus: function($elements)
	{
		var settings = {menuClass: 'menu assets-contextmenu'};

		var menuOptions = [{ label: Craft.t('View file'), onClick: $.proxy(this, '_viewFile') }];
		menuOptions.push({ label: Craft.t('Edit properties'), onClick: $.proxy(this, '_showProperties') });
		menuOptions.push({ label: Craft.t('Rename file'), onClick: $.proxy(this, '_renameFile') });
		menuOptions.push({ label: Craft.t('Copy reference tag'), onClick: $.proxy(this, '_copyRefTag') });
		menuOptions.push('-');
		menuOptions.push({ label: Craft.t('Delete file'), onClick: $.proxy(this, '_deleteFile') });
		this._singleFileMenu = new Garnish.ContextMenu($elements, menuOptions, settings);

		menuOptions = [{ label: Craft.t('Delete'), onClick: $.proxy(this, '_deleteFiles') }];
		this._multiFileMenu = new Garnish.ContextMenu($elements, menuOptions, settings);

		this._enableElementContextMenu();
	},

	_destroyElementContextMenus: function()
	{
		if (this._singleFileMenu !== null)
		{
			this._singleFileMenu.destroy();
		}
		if (this._multiFileMenu !== null)
		{
			this._singleFileMenu.destroy();
		}
	},

	_enableElementContextMenu: function()
	{
		this._multiFileMenu.disable();
		this._singleFileMenu.disable();

		if (this.elementSelect.getTotalSelected() == 1)
		{
			this._singleFileMenu.enable();
		}
		else if (this.elementSelect.getTotalSelected() > 1)
		{
			this._multiFileMenu.enable();
		}
	},

	_showProperties: function(event)
	{
		$(event.currentTarget).dblclick();
	},

	_viewFile: function(event)
	{
		window.open(Craft.getElementInfo(event.currentTarget).url);
	},

	/**
	 * Rename File
	 */
	_renameFile: function(event)
	{
		var $target = $(event.currentTarget);
		var fileId = Craft.getElementInfo($target).id,
			oldName = Craft.getElementInfo($target).url.split('/').pop();
		if (oldName.indexOf('?') !== -1)
		{
			oldName = oldName.split('?').shift();
		}

		var newName = prompt(Craft.t("Rename file"), oldName);

		if (newName && newName != oldName)
		{
			this.setIndexBusy();

			var postData = {
				fileId:   fileId,
				folderId: this._getFolderIdFromSourceKey(this.$source.data('key')),
				fileName: newName
			};

			var handleRename = function(data, textStatus)
			{
				this.setIndexAvailable();

				this.promptHandler.resetPrompts();
				if (textStatus == 'success')
				{
					if (data.prompt)
					{
						this.promptHandler.addPrompt(data);

						var callback = $.proxy(function(choice)
						{
							choice = choice[0].choice;
							if (choice != 'cancel')
							{
								postData.action = choice;
								Craft.postActionRequest('assets/moveFile', postData, $.proxy(handleRename, this));
							}
						}, this);

						this.promptHandler.showBatchPrompts(callback);
					}

					if (data.success)
					{
						this.updateElements();

						// If assets were just merged we should get the referece tags updated right away
						Craft.cp.runPendingTasks();
					}

					if (data.error)
					{
						alert(data.error);
					}
				}
			};

			Craft.postActionRequest('assets/moveFile', postData, $.proxy(handleRename, this));
		}
	},

	_copyRefTag: function(event)
	{
		var message = Craft.t('{ctrl}C to copy.', {
			ctrl: (navigator.appVersion.indexOf('Mac') ? '⌘' : 'Ctrl-')
		});

		prompt(message, '{asset:'+Craft.getElementInfo($(event.currentTarget)).id+'}');
	},

	/**
	 * Delete a file
	 */
	_deleteFile: function(event)
	{
		var $target = $(event.currentTarget);
		var fileId = Craft.getElementInfo($target).id;

		var fileTitle = Craft.getElementInfo($target).label;

		if (confirm(Craft.t('Are you sure you want to delete “{name}”?', { name: fileTitle })))
		{
			if ($target.data('AssetEditor'))
			{
				$target.data('AssetEditor').removeHud();
			}

			this.setIndexBusy();

			Craft.postActionRequest('assets/deleteFile', {fileId: fileId}, $.proxy(function(data, textStatus)
			{
				this.setIndexAvailable();

				if (textStatus == 'success')
				{
					if (data.error)
					{
						alert(data.error);
					}

					this.updateElements();

				}

			}, this));
		}
	},

	/**
	 * Delete multiple files.
	 */
	_deleteFiles: function()
	{
		if (confirm(Craft.t("Are you sure you want to delete these {number} files?", {number: this.elementSelect.getTotalSelected()})))
		{
			this.setIndexBusy();

			var postData = {};

			for (var i = 0; i < this._selectedFileIds.length; i++)
			{
				postData['fileId['+i+']'] = this._selectedFileIds[i];
			}

			Craft.postActionRequest('assets/deleteFile', postData, $.proxy(function(data, textStatus)
			{
				this.setIndexAvailable();

				if (textStatus == 'success')
				{
					if (data.error)
					{
						alert(data.error);
					}

					this.updateElements();
				}

			}, this));
		}
	},

	_getDragHelper: function($element)
	{
		var currentView = this.getSelectedSourceState('mode');
		switch (currentView)
		{
			case 'table':
			{
				var $container = $('<div class="assets-listview assets-lv-drag" />'),
					$table = $('<table cellpadding="0" cellspacing="0" border="0" />').appendTo($container),
					$tbody = $('<tbody />').appendTo($table);

				$table.width(this.$table.width());
				$tbody.append($element);

				return $container;
			}
			case 'thumbs':
			{
				return $('<ul class="thumbsview assets-tv-drag" />').append($element.removeClass('sel'));
			}
		}

		return $();
	},

	/**
	 * On Drop Target Change
	 */
	_onDropTargetChange: function($dropTarget)
	{
		clearTimeout(this._expandDropTargetFolderTimeout);

		if ($dropTarget)
		{
			var folderId = this._getFolderIdFromSourceKey($dropTarget.data('key'));

			if (folderId)
			{
				this.dropTargetFolder = this._getSourceByFolderId(folderId);

				if (this._hasSubfolders(this.dropTargetFolder) && ! this._isExpanded(this.dropTargetFolder))
				{
					this._expandDropTargetFolderTimeout = setTimeout($.proxy(this, '_expandFolder'), 500);
				}
			}
			else
			{
				this.dropTargetFolder = null;
			}
		}
	},

	/**
	 * Collapse Extra Expanded Folders
	 */
	_collapseExtraExpandedFolders: function(dropTargetFolderId)
	{
		clearTimeout(this._expandDropTargetFolderTimeout);

		// If a source id is passed in, exclude it's parents
		if (dropTargetFolderId)
		{
			var excluded = this._getSourceByFolderId(dropTargetFolderId).parents('li').find('>a');
		}

		for (var i = this._tempExpandedFolders.length-1; i >= 0; i--)
		{
			var source = this._tempExpandedFolders[i];

			// check the parent list, if a source id is passed in
			if (! dropTargetFolderId || excluded.filter('[data-key="' + source.data('key') + '"]').length == 0)
			{
				this._collapseFolder(source);
				this._tempExpandedFolders.splice(i, 1);
			}
		}
	},

	_getSourceByFolderId: function(folderId)
	{
		return this.$sources.filter('[data-key="folder:' + folderId + '"]');
	},

	_hasSubfolders: function(source)
	{
		return source.siblings('ul').find('li').length;
	},

	_isExpanded: function(source)
	{
		return source.parent('li').hasClass('expanded');
	},

	_expandFolder: function()
	{
		// collapse any temp-expanded drop targets that aren't parents of this one
		this._collapseExtraExpandedFolders(this._getFolderIdFromSourceKey(this.dropTargetFolder.data('key')));

		this.dropTargetFolder.parent().find('> .toggle').click();

		// keep a record of that
		this._tempExpandedFolders.push(this.dropTargetFolder);

	},

	_collapseFolder: function(source)
	{
		var li = source.parent();
		if (li.hasClass('expanded'))
		{
			li.find('> .toggle').click();
		}
	},

	_createFolderContextMenu: function(element, addAllOptions)
	{
		element = $(element);
		var menuOptions = [{ label: Craft.t('New subfolder'), onClick: $.proxy(this, '_createSubfolder', element) }];

		// For all folders that are not top folders
		if (element.parents('ul').length > 1 && addAllOptions)
		{
			menuOptions.push({ label: Craft.t('Rename folder'), onClick: $.proxy(this, '_renameFolder', element) });
			menuOptions.push({ label: Craft.t('Delete folder'), onClick: $.proxy(this, '_deleteFolder', element) });
		}
		new Garnish.ContextMenu(element, menuOptions, {menuClass: 'menu assets-contextmenu'});
	},

	_createSubfolder: function(parentFolder)
	{
		var subfolderName = prompt(Craft.t('Enter the name of the folder'));

		if (subfolderName)
		{
			var params = {
				parentId:  this._getFolderIdFromSourceKey(parentFolder.data('key')),
				folderName: subfolderName
			};

			this.setIndexBusy();

			Craft.postActionRequest('assets/createFolder', params, $.proxy(function(data, textStatus)
			{
				this.setIndexAvailable();

				if (textStatus == 'success' && data.success)
				{
					this._prepareParentForChildren(parentFolder);

					var subFolder = $('<li><a data-key="folder:' + data.folderId + '" data-has-thumbs="' + parentFolder.data('has-thumbs') + '">' + data.folderName + '</a></li>');

					var $a = subFolder.find('a');
					this._addSubfolder(parentFolder, subFolder);
					this._createFolderContextMenu($a, this.settings.context == "index");
					this.sourceSelect.addItems($a);

					// For Assets Modals the folder drag manager won't be available
					if (this._folderDrag)
					{
						this._folderDrag.addItems($a.parent());
					}

					this.$sources = this.$sources.add($a);
				}

				if (textStatus == 'success' && data.error)
				{
					alert(data.error);
				}

			}, this));
		}
	},

	_deleteFolder: function(targetFolder)
	{
		if (confirm(Craft.t('Really delete folder “{folder}”?', {folder: $.trim(targetFolder.text())})))
		{
			var params = {
				folderId: this._getFolderIdFromSourceKey(targetFolder.data('key'))
			}

			this.setIndexBusy();

			Craft.postActionRequest('assets/deleteFolder', params, $.proxy(function(data, textStatus)
			{
				this.setIndexAvailable();

				if (textStatus == 'success' && data.success)
				{
					var parentFolder = this._getParentSource(targetFolder);

					// remove folder and any trace from it's parent, if needed.
					this.$sources = this.$sources.not(targetFolder);
					this.sourceSelect.removeItems(targetFolder);

					targetFolder.parent().remove();
					this._cleanUpTree(parentFolder);

				}

				if (textStatus == 'success' && data.error)
				{
					alert(data.error);
				}

			}, this));
		}
	},

	/**
	 * Rename
	 */
	_renameFolder: function(targetFolder)
	{
		var oldName = $.trim(targetFolder.text()),
			newName = prompt(Craft.t('Rename folder'), oldName);

		if (newName && newName != oldName)
		{
			var params = {
				folderId: this._getFolderIdFromSourceKey(targetFolder.data('key')),
				newName: newName
			};

			this.setIndexBusy();

			Craft.postActionRequest('assets/renameFolder', params, $.proxy(function(data, textStatus)
			{
				this.setIndexAvailable();

				if (textStatus == 'success' && data.success)
				{
					targetFolder.text(data.newName);
				}

				if (textStatus == 'success' && data.error)
				{
					alert(data.error);
				}

			}, this), 'json');
		}
	},

	/**
	 * Prepare a source folder for children folder.
	 *
	 * @param parentFolder
	 * @private
	 */
	_prepareParentForChildren: function(parentFolder)
	{
		if (!this._hasSubfolders(parentFolder))
		{
			parentFolder.parent().addClass('expanded').append('<div class="toggle"></div><ul></ul>');
			this.addListener(parentFolder.siblings('.toggle'), 'click', function(ev)
			{
				$(ev.currentTarget).parent().toggleClass('expanded');
			});

		}
	},

	/**
	 * Add a subfolder to the parent folder at the correct spot.
	 *
	 * @param parentFolder
	 * @param subFolder
	 * @private
	 */

	_addSubfolder: function(parentFolder, subFolder)
	{
		var existingChildren = parentFolder.siblings('ul').find('>li');
		var folderInserted = false;
		existingChildren.each(function()
		{
			if (!folderInserted && $.trim($(this).text()) > $.trim(subFolder.text()))
			{
				$(this).before(subFolder);
				folderInserted = true;
			}
		});
		if (!folderInserted)
		{
			parentFolder.siblings('ul').append(subFolder);
		}
	},

	_cleanUpTree: function(parentFolder)
	{
		if (parentFolder !== null && parentFolder.siblings('ul').find('li').length == 0)
		{
			parentFolder.siblings('ul').remove();
			parentFolder.siblings('.toggle').remove();
			parentFolder.parent().removeClass('expanded');
		}
	},

	_positionProgressBar: function()
	{
		var $container = $(),
			offset = 0;

		if (this.settings.context == 'index')
		{
			$container = this.progressBar.$progressBar.parents('#content');
		}
		else
		{
			$container = this.progressBar.$progressBar.parents('.main');
		}

		var containerTop = $container.offset().top;
		var scrollTop = Garnish.$doc.scrollTop();
		var diff = scrollTop - containerTop;
		var windowHeight = Garnish.$win.height();

		if ($container.height() > windowHeight)
		{
			offset = (windowHeight / 2) - 6 + diff;
		}
		else
		{
			offset = ($container.height() / 2) - 6;
		}
		this.progressBar.$progressBar.css({
			top: offset
		});

	}

});

// Register it!
Craft.registerElementIndexClass('Asset', Craft.AssetIndex);


/**
 * Asset Select input
 */
Craft.AssetSelectInput = Craft.BaseElementSelectInput.extend(
{
	requestId: 0,
	hud: null,
	fieldId: 0,
	uploader: null,
	progressBar: null,

	init: function(id, name, elementType, sources, criteria, sourceElementId, limit, storageKey, fieldId)
	{
		this.base(id, name, elementType, sources, criteria, sourceElementId, limit, storageKey);
		this.fieldId = fieldId;
		this._attachDragEvents();
	},

	_attachDragEvents: function()
	{
		this.progressBar = new Craft.ProgressBar($('<div class="progress-shade"></div>').appendTo(this.$container));

		var options = {
			url: Craft.getActionUrl('assets/expressUpload'),
			dropZone: this.$container,
			formData: {
				fieldId: this.fieldId,
				entryId: $('input[name=entryId]').val()
			}
		};

		if (typeof this.criteria.kind != "undefined")
		{
			options.allowedKinds = this.criteria.kind;
		}

		options.events = {};
		options.events.fileuploadstart = $.proxy(this, '_onUploadStart');
		options.events.fileuploadprogressall = $.proxy(this, '_onUploadProgress');
		options.events.fileuploaddone = $.proxy(this, '_onUploadComplete');

		this.uploader = new Craft.Uploader(this.$container, options);
	},

	/**
	 * Add the freshly uploaded file to the input field.
	 *
	 * @param element
	 */
	selectUploadedFile: function(element)
	{
		// Check if we're able to add new elements
		if (this.limit)
		{
			if (this.totalElements + 1 == this.limit)
			{
				return;
			}
		}

		var $newElement = element.$element;

		// Make a couple tweaks
		$newElement.addClass('removable');
		$newElement.prepend('<input type="hidden" name="'+this.name+'[]" value="'+element.id+'">' +
			'<a class="delete icon" title="'+Craft.t('Remove')+'"></a>');

		$newElement.appendTo(this.$elementsContainer);

		var margin = -($newElement.outerWidth()+10);

		this.$addElementBtn.css('margin-'+Craft.left, margin+'px');

		var animateCss = {};
		animateCss['margin-'+Craft.left] = 0;
		this.$addElementBtn.animate(animateCss, 'fast');

		this.$elements = this.$elements.add($newElement);
		this.initElements($newElement);

		this.totalElements ++;

		if (this.limit && this.totalElements == this.limit)
		{
			this.$addElementBtn.addClass('disabled');
		}

		if (this.modal)
		{
			this.modal.elementIndex.rememberDisabledElementId(element.id);
		}

	},

	/**
	 * On upload start.
	 *
	 * @param event
	 * @private
	 */
	_onUploadStart: function(event)
	{
		this.progressBar.$progressBar.css({
			top: Math.round(this.$container.outerHeight() / 2) - 6
		});

		this.$container.addClass('uploading');
		this.progressBar.resetProgressBar();
		this.progressBar.showProgressBar();
	},

	/**
	 * On upload progress.
	 *
	 * @param event
	 * @param data
	 * @private
	 */
	_onUploadProgress: function(event, data)
	{
		var progress = parseInt(data.loaded / data.total * 100, 10);
		this.progressBar.setProgressPercentage(progress);
	},

	/**
	 * On a file being uploaded.
	 *
	 * @param event
	 * @param data
	 * @private
	 */
	_onUploadComplete: function(event, data)
	{
		var html = $(data.result.html);
		$('head').append(data.result.css);

		this.selectUploadedFile(Craft.getElementInfo(html));

		// Last file
		if (this.uploader.isLastUpload())
		{
			this.progressBar.hideProgressBar();
			this.$container.removeClass('uploading');
		}

		this.forceModalRefresh();
	}
});


/**
 * Asset selector modal class
 */
Craft.AssetSelectorModal = Craft.BaseElementSelectorModal.extend(
{
	$selectTransformBtn: null,
	$transformSpinner: null,
	_selectedTransform: null,

	init: function(elementType, settings)
	{
		settings = $.extend({}, Craft.AssetSelectorModal.defaults, settings);

		if (settings.canSelectImageTransforms)
		{
			if (typeof Craft.AssetSelectorModal.transforms == 'undefined')
			{
				var base = this.base;

				this.fetchTransformInfo($.proxy(function()
				{
					// Finally call this.base()
					base.call(this, elementType, settings);

					this.createSelectTransformButton();
				}, this));

				// Prevent this.base() from getting called until later
				return;
			}
		}

		this.base(elementType, settings);

		if (settings.canSelectImageTransforms)
		{
			this.createSelectTransformButton();
		}
	},

	fetchTransformInfo: function(callback)
	{
		Craft.postActionRequest('assets/getTransformInfo', $.proxy(function(response, textStatus)
		{
			if (textStatus == 'success' && response instanceof Array)
			{
				Craft.AssetSelectorModal.transforms = response;
			}
			else
			{
				Craft.AssetSelectorModal.transforms = [];
			}

			callback();

		}, this));
	},

	createSelectTransformButton: function()
	{
		if (!Craft.AssetSelectorModal.transforms.length)
		{
			return;
		}

		var $btnGroup = $('<div class="btngroup"/>').appendTo(this.$buttons);
		this.$selectBtn.appendTo($btnGroup);

		this.$selectTransformBtn = $('<div class="btn menubtn disabled">'+Craft.t('Select Transform')+'</div>').appendTo($btnGroup);

		var $menu = $('<div class="menu" data-align="right"></div>').insertAfter(this.$selectTransformBtn),
			$menuList = $('<ul></ul>').appendTo($menu);

		for (var i = 0; i < Craft.AssetSelectorModal.transforms.length; i++)
		{
			$('<li><a data-transform="'+Craft.AssetSelectorModal.transforms[i].handle+'">'+Craft.AssetSelectorModal.transforms[i].name+'</a></li>').appendTo($menuList);
		}

		new Garnish.MenuBtn(this.$selectTransformBtn, {
			onOptionSelect: $.proxy(this, 'onSelectTransform')
		});

		this.$transformSpinner = $('<div class="spinner hidden" style="margin-'+Craft.right+': -24px;"/>').insertAfter($btnGroup);
	},

	onSelectionChange: function(ev)
	{
		if (this.elementSelect.totalSelected && this.settings.canSelectImageTransforms && Craft.AssetSelectorModal.transforms.length)
		{
			var allowTransforms = true,
				$selectedItems = this.elementSelect.getSelectedItems();

			for (var i = 0; i < $selectedItems.length; i++)
			{
				if (!$('.element.hasthumb:first', $selectedItems[i]).length)
				{
					allowTransforms = false;
					break;
				}
			}
		}
		else
		{
			var allowTransforms = false;
		}

		if (allowTransforms)
		{
			this.$selectTransformBtn.removeClass('disabled');
		}
		else if (this.$selectTransformBtn)
		{
			this.$selectTransformBtn.addClass('disabled');
		}

		this.base();
	},

	onSelectTransform: function(option)
	{
		var transform = $(option).data('transform');
		this.selectImagesWithTransform(transform);
	},

	selectImagesWithTransform: function(transform)
	{
		// First we must get any missing transform URLs
		if (typeof Craft.AssetSelectorModal.transformUrls[transform] == 'undefined')
		{
			Craft.AssetSelectorModal.transformUrls[transform] = {};
		}

		var $selectedItems = this.elementSelect.getSelectedItems(),
			imageIdsWithMissingUrls = [];

		for (var i = 0; i < $selectedItems.length; i++)
		{
			var $item = $($selectedItems[i]),
				elementId = Craft.getElementInfo($item).id;

			if (typeof Craft.AssetSelectorModal.transformUrls[transform][elementId] == 'undefined')
			{
				imageIdsWithMissingUrls.push(elementId);
			}
		}

		if (imageIdsWithMissingUrls.length)
		{
			this.$transformSpinner.removeClass('hidden');
			this.fetchMissingTransformUrls(imageIdsWithMissingUrls, transform, $.proxy(function()
			{
				this.$transformSpinner.addClass('hidden');
				this.selectImagesWithTransform(transform);
			}, this));
		}
		else
		{
			this._selectedTransform = transform;
			this.selectElements();
			this._selectedTransform = null;
		}
	},

	fetchMissingTransformUrls: function(imageIdsWithMissingUrls, transform, callback)
	{
		var elementId = imageIdsWithMissingUrls.pop();

		var data = {
			fileId: elementId,
			handle: transform,
			returnUrl: true
		};

		Craft.postActionRequest('assets/generateTransform', data, $.proxy(function(response, textStatus)
		{
			Craft.AssetSelectorModal.transformUrls[transform][elementId] = false;

			if (textStatus == 'success')
			{
				if (response.url)
				{
					Craft.AssetSelectorModal.transformUrls[transform][elementId] = response.url;
				}
			}

			// More to load?
			if (imageIdsWithMissingUrls.length)
			{
				this.fetchMissingTransformUrls(imageIdsWithMissingUrls, transform, callback);
			}
			else
			{
				callback();
			}
		}, this));
	},

	getElementInfo: function($selectedItems)
	{
		var info = this.base($selectedItems);

		if (this._selectedTransform)
		{
			for (var i = 0; i < info.length; i++)
			{
				var elementId = info[i].id;

				if (
					typeof Craft.AssetSelectorModal.transformUrls[this._selectedTransform][elementId] != 'undefined' &&
					Craft.AssetSelectorModal.transformUrls[this._selectedTransform][elementId] !== false
				)
				{
					info[i].url = Craft.AssetSelectorModal.transformUrls[this._selectedTransform][elementId];
				}
			}
		}

		return info;
	},

	onSelect: function(elementInfo)
	{
		this.settings.onSelect(elementInfo, this._selectedTransform);
	}
},
{
	defaults: {
		canSelectImageTransforms: false
	},

	transformUrls: {}
});

// Register it!
Craft.registerElementSelectorModalClass('Asset', Craft.AssetSelectorModal);


/**
 * Category index class
 */
Craft.CategoryIndex = Craft.BaseElementIndex.extend(
{
	groupId: null,
	structure: null,

	$noCats: null,
	$addCategoryForm: null,
	$addCategoryInput: null,
	$addCategorySpinner: null,

	getDefaultSourceKey: function()
	{
		if (this.settings.context == 'index' && typeof defaultGroupHandle != 'undefined')
		{
			for (var i = 0; i < this.$sources.length; i++)
			{
				var $source = $(this.$sources[i]);

				if ($source.data('handle') == defaultGroupHandle)
				{
					return $source.data('key');
				}
			}
		}

		return this.base();
	},

	onSelectSource: function()
	{
		if (this.settings.context == 'index' && typeof history != 'undefined')
		{
			var uri = 'categories/'+this.$source.data('handle');

			history.replaceState({}, '', Craft.getUrl(uri));
		}

		this.base();
	},

	getViewModesForSource: function()
	{
		return [
			{ mode: 'structure', title: Craft.t('Display hierarchically'), icon: 'structure' }
		];
	},

	onUpdateElements: function(append)
	{
		// Make sure it's not table view (for a search)
		if (this.getSelectedSourceState('mode') == 'structure')
		{
			this.$noCats = this.$elements.children('.nocats');
			this.$addCategoryForm = this.$elements.children('form');
			this.$addCategoryInput = this.$addCategoryForm.find('input[type=text]');
			this.$addCategorySpinner = this.$addCategoryForm.find('.spinner');

			this.structure = this.$elementContainer.data('structure');
			this.groupId = this.$addCategoryForm.data('group-id');

			this.addListener(this.$addCategoryForm, 'submit', 'onAddCategorySubmit');
		}

		this.initElements(this.$elementContainer.find('.element'));

		this.base(append);
	},

	initElements: function($elements)
	{
		if (this.settings.context == 'index')
		{
			this.addListener($elements, 'dblclick', function(ev)
			{
				Craft.showElementEditor($(ev.currentTarget));
			});

			this.addListener($elements.siblings('.delete'), 'click', 'onDeleteClick');
		}
	},

	onDeleteClick: function(ev)
	{
		var $element = $(ev.currentTarget).siblings('.element'),
			info = Craft.getElementInfo($element);

		if (confirm(Craft.t('Are you sure you want to delete “{name}” and its descendants?', { name: info.label })))
		{
			Craft.postActionRequest('categories/deleteCategory', { categoryId: info.id }, $.proxy(function(response, textStatus)
			{
				if (textStatus == 'success')
				{
					if (response.success)
					{
						this.structure.removeElement($element);
						Craft.cp.displayNotice(Craft.t('“{name}” deleted.', { name: info.label }));

						// Was that the last one?
						if (!this.$elementContainer.find('.element').not($element).length)
						{
							this.$noCats.removeClass('hidden');
						}
					}
					else
					{
						Craft.cp.displayError(Craft.t('Couldn’t delete “{name}”.', { name: info.label }));
					}
				}

			}, this));
		}
	},

	onAddCategorySubmit: function(ev)
	{
		ev.preventDefault();

		this.$addCategorySpinner.removeClass('hidden');

		var data = {
			title: this.$addCategoryInput.val(),
			groupId: this.groupId
		};

		Craft.postActionRequest('categories/createCategory', data, $.proxy(function(response, textStatus) {

			this.$addCategorySpinner.addClass('hidden');

			if (textStatus == 'success')
			{
				this.$noCats.addClass('hidden');

				var $element = $('<div class="element" data-editable="1"' +
					'data-id="'+response.id+'" ' +
					'data-locale="'+Craft.locale+'" ' +
					'data-status="'+response.status+'" ' +
					'data-label="'+response.title+'" ' +
					'data-url="'+response.url+'">' +
					'<div class="label">' +
						'<span class="status '+response.status+'"></span>' +
						'<span class="title">'+response.title+'</span>' +
					'</div>' +
				'</div>');

				// Add it to the structure
				this.structure.addElement($element);

				// Add the delete button
				var $row = $element.parent();
				$('<a class="delete icon" title="'+Craft.t('Delete')+'"></a>').appendTo($row);

				// Initialize it
				this.initElements($element);

				// Clear out the "Add a Category" input
				this.$addCategoryInput.val('');

				// Animate the new category into place
				var css = {
					top: 24
				};
				css[Craft.left] = -5;

				var animateCss = {
					top: 0
				};
				animateCss[Craft.left] = 0;

				$element.css(css).animate(animateCss, 'fast');
			}

		}, this));
	}

});

// Register it!
Craft.registerElementIndexClass('Category', Craft.CategoryIndex);


/**
 * Category Select input
 */
Craft.CategorySelectInput = Craft.BaseElementSelectInput.extend(
{
	selectable: false,
	sortable: false,

	init: function()
	{
		this.base.apply(this, arguments);
		this.addLastClasses();
	},

	getElements: function()
	{
		return this.$elementsContainer.find('li:not(.hidden) > .row .element');
	},

	initElements: function($elements)
	{
		this.initCheckboxes($elements.siblings('.checkbox'));
	},

	initCheckboxes: function($checkboxes)
	{
		this.removeListener($checkboxes, 'change');
		this.addListener($checkboxes, 'change', 'onCheckboxChange');
	},

	onCheckboxChange: function(ev)
	{
		var $checkbox = $(ev.currentTarget);

		if ($checkbox.prop('checked'))
		{
			// Make sure everything leading up to this is checked
			$checkbox.closest('li').parentsUntil(this.$elementsContainer, 'li').children('.row').find('.checkbox').prop('checked', true);
		}
		else
		{
			// Make sure everything under it is also unchecked
			$checkbox.closest('li').children('ul').find('.checkbox').prop('checked', false);
		}
	},

	createNewElement: function(elementInfo)
	{
		var $li = this.$container.find('#'+this.id+'-category-'+elementInfo.id),
			$parentLis = $li.parentsUntil(this.$elementsContainer, 'li'),
			$allLis = $li.add($parentLis),
			$parentElements = $parentLis.children('.row').find('.element'),
			$checkboxes = $allLis.children('.row').find('.checkbox'),
			$element = $li.children('.row').find('.element');

		// Make sure all parent elements are visible and checked
		$allLis.removeClass('hidden');
		$checkboxes.prop('checked', true);

		this.initCheckboxes($checkboxes);
		this.$elements = this.$elements.add($parentElements);

		return $element;
	},

	onSelectElements: function()
	{
		this.addLastClasses();
		this.base.apply(this, arguments);
	},

	addLastClasses: function()
	{
		// Add the "last" class to the last visible <li>s in each <ul>
		var $uls = this.$elementsContainer.find('ul');

		for (var i = 0; i < $uls.length; i++)
		{
			var $ul = $($uls[i]);

			$ul.children('.last').removeClass('last');
			$ul.children(':not(.hidden):last').addClass('last');
		}
	}
});


/**
 * DataTableSorter
 */
Craft.DataTableSorter = Garnish.DragSort.extend(
{
	$table: null,

	init: function(table, settings)
	{
		this.$table = $(table);
		var $rows = this.$table.children('tbody').children(':not(.filler)');

		settings = $.extend({}, Craft.DataTableSorter.defaults, settings);

		settings.container = this.$table.children('tbody');
		settings.helper = $.proxy(this, 'getHelper');
		settings.caboose = '<tr/>';
		settings.axis = Garnish.Y_AXIS;

		this.base($rows, settings);
	},

	getHelper: function($helperRow)
	{
		var $helper = $('<div class="'+this.settings.helperClass+'"/>').appendTo(Garnish.$bod),
			$table = $('<table/>').appendTo($helper),
			$tbody = $('<tbody/>').appendTo($table);

		$helperRow.appendTo($tbody);

		// Copy the table width and classes
		$table.width(this.$table.width());
		$table.prop('className', this.$table.prop('className'));

		// Copy the column widths
		var $firstRow = this.$table.find('tr:first'),
			$cells = $firstRow.children(),
			$helperCells = $helperRow.children();

		for (var i = 0; i < $helperCells.length; i++)
		{
			$($helperCells[i]).width($($cells[i]).width());
		}

		return $helper;
	}

},
{
	defaults: {
		handle: '.move',
		helperClass: 'datatablesorthelper'
	}
});


/**
 * Editable table class
 */
Craft.EditableTable = Garnish.Base.extend(
{
	id: null,
	baseName: null,
	columns: null,
	sorter: null,
	biggestId: -1,

	$table: null,
	$tbody: null,
	$addRowBtn: null,

	init: function(id, baseName, columns, settings)
	{
		this.id = id;
		this.baseName = baseName;
		this.columns = columns;
		this.setSettings(settings, Craft.EditableTable.defaults);

		this.$table = $('#'+id);
		this.$tbody = this.$table.children('tbody');

		this.sorter = new Craft.DataTableSorter(this.$table, {
			helperClass: 'editabletablesorthelper'
		});

		var $rows = this.$tbody.children();

		for (var i = 0; i < $rows.length; i++)
		{
			new Craft.EditableTable.Row(this, $rows[i]);
		}

		this.$addRowBtn = this.$table.next('.add');
		this.addListener(this.$addRowBtn, 'activate', 'addRow');
	},

	addRow: function()
	{
		var rowId = this.settings.rowIdPrefix+(this.biggestId+1),
			rowHtml = Craft.EditableTable.getRowHtml(rowId, this.columns, this.baseName, {}),
			$tr = $(rowHtml).appendTo(this.$tbody);

		new Craft.EditableTable.Row(this, $tr);
		this.sorter.addItems($tr);

		// Focus the first input in the row
		$tr.find('input,textarea,select').first().focus();

		// onAddRow callback
		this.settings.onAddRow($tr);
	}
},
{
	textualColTypes: ['singleline', 'multiline', 'number'],
	defaults: {
		rowIdPrefix: '',
		onAddRow: $.noop,
		onDeleteRow: $.noop
	},

	getRowHtml: function(rowId, columns, baseName, values)
	{
		var rowHtml = '<tr data-id="'+rowId+'">';

		for (var colId in columns)
		{
			var col = columns[colId],
				name = baseName+'['+rowId+']['+colId+']',
				value = (typeof values[colId] != 'undefined' ? values[colId] : ''),
				textual = Craft.inArray(col.type, Craft.EditableTable.textualColTypes);

			rowHtml += '<td class="'+(textual ? 'textual' : '')+' '+(typeof col['class'] != 'undefined' ? col['class'] : '')+'"' +
			              (typeof col['width'] != 'undefined' ? ' width="'+col['width']+'"' : '') +
			              '>';

			switch (col.type)
			{
				case 'select':
				{
					rowHtml += '<div class="select small"><select name="'+name+'">';

					var hasOptgroups = false;

					for (var key in col.options)
					{
						var option = col.options[key];

						if (typeof option.optgroup != 'undefined')
						{
							if (hasOptgroups)
							{
								rowHtml += '</optgroup>';
							}
							else
							{
								hasOptgroups = true;
							}

							rowHtml += '<optgroup label="'+option.optgroup+'">';
						}
						else
						{
							var optionLabel = (typeof option.label != 'undefined' ? option.label : option),
								optionValue = (typeof option.value != 'undefined' ? option.value : key),
								optionDisabled = (typeof option.disabled != 'undefined' ? option.disabled : false);

							rowHtml += '<option value="'+optionValue+'"'+(optionValue == value ? ' selected' : '')+(optionDisabled ? ' disabled' : '')+'>'+optionLabel+'</option>';
						}
					}

					if (hasOptgroups)
					{
						rowHtml += '</optgroup>';
					}

					rowHtml += '</select></div>';

					break;
				}

				case 'checkbox':
				{
					rowHtml += '<input type="hidden" name="'+name+'">' +
					           '<input type="checkbox" name="'+name+'" value="1"'+(value ? ' checked' : '')+'>';

					break;
				}

				default:
				{
					rowHtml += '<textarea name="'+name+'" rows="1">'+value+'</textarea>';
				}
			}

			rowHtml += '</td>';
		}

		rowHtml += '<td class="thin action"><a class="move icon" title="'+Craft.t('Reorder')+'"></a></td>' +
				'<td class="thin action"><a class="delete icon" title="'+Craft.t('Delete')+'"></a></td>' +
			'</tr>';

		return rowHtml;
	}
});

/**
 * Editable table row class
 */
Craft.EditableTable.Row = Garnish.Base.extend(
{
	table: null,
	id: null,
	niceTexts: null,

	$tr: null,
	$tds: null,
	$textareas: null,
	$deleteBtn: null,

	init: function(table, tr)
	{
		this.table = table;
		this.$tr = $(tr);
		this.$tds = this.$tr.children();

		// Get the row ID, sans prefix
		var id = parseInt(this.$tr.attr('data-id').substr(this.table.settings.rowIdPrefix.length));

		if (id > this.table.biggestId)
		{
			this.table.biggestId = id;
		}

		this.$textareas = $();
		this.niceTexts = [];
		var textareasByColId = {};

		var i = 0;

		for (var colId in this.table.columns)
		{
			var col = this.table.columns[colId];

			if (Craft.inArray(col.type, Craft.EditableTable.textualColTypes))
			{
				$textarea = $('textarea', this.$tds[i]);
				this.$textareas = this.$textareas.add($textarea);

				this.addListener($textarea, 'focus', 'onTextareaFocus');
				this.addListener($textarea, 'mousedown', 'ignoreNextTextareaFocus');

				this.niceTexts.push(new Garnish.NiceText($textarea, {
					onHeightChange: $.proxy(this, 'onTextareaHeightChange')
				}));

				if (col.type == 'singleline' || col.type == 'number')
				{
					this.addListener($textarea, 'keypress', { type: col.type }, 'validateKeypress');
				}

				textareasByColId[colId] = $textarea;
			}

			i++;
		}

		// Now that all of the text cells have been nice-ified, let's normalize the heights
		this.onTextareaHeightChange();

		// Now look for any autopopulate columns
		for (var colId in this.table.columns)
		{
			var col = this.table.columns[colId];

			if (col.autopopulate && typeof textareasByColId[col.autopopulate] != 'undefined' && !textareasByColId[colId].val())
			{
				if (col.autopopulate == 'handle')
				{
					new Craft.HandleGenerator(textareasByColId[colId], textareasByColId[col.autopopulate]);
				}
				else
				{
					new Craft.BaseInputGenerator(textareasByColId[colId], textareasByColId[col.autopopulate]);
				}
			}
		}

		var $deleteBtn = this.$tr.children().last().find('.delete');
		this.addListener($deleteBtn, 'click', 'deleteRow');
	},

	onTextareaFocus: function(ev)
	{
		var $textarea = $(ev.currentTarget);

		if ($textarea.data('ignoreNextFocus'))
		{
			$textarea.data('ignoreNextFocus', false);
			return;
		}

		setTimeout(function()
		{
			var val = $textarea.val();

			// Does the browser support setSelectionRange()?
			if (typeof $textarea[0].setSelectionRange != 'undefined')
			{
				// Select the whole value
				var length = val.length * 2;
				$textarea[0].setSelectionRange(0, length);
			}
			else
			{
				// Refresh the value to get the cursor positioned at the end
				$textarea.val(val);
			}
		}, 0);
	},

	ignoreNextTextareaFocus: function(ev)
	{
		$.data(ev.currentTarget, 'ignoreNextFocus', true);
	},

	validateKeypress: function(ev)
	{
		var keyCode = ev.keyCode ? ev.keyCode : ev.charCode;

		if (!ev.metaKey && !ev.ctrlKey && (
			(keyCode == Garnish.RETURN_KEY) ||
			(ev.data.type == 'number' && !Craft.inArray(keyCode, Craft.EditableTable.Row.numericKeyCodes))
		))
		{
			ev.preventDefault();
		}
	},

	onTextareaHeightChange: function()
	{
		// Keep all the textareas' heights in sync
		var tallestTextareaHeight = -1;

		for (var i = 0; i < this.niceTexts.length; i++)
		{
			if (this.niceTexts[i].height > tallestTextareaHeight)
			{
				tallestTextareaHeight = this.niceTexts[i].height;
			}
		}

		this.$textareas.css('min-height', tallestTextareaHeight);
	},

	deleteRow: function()
	{
		this.table.sorter.removeItems(this.$tr);
		this.$tr.remove();

		// onDeleteRow callback
		this.table.settings.onDeleteRow(this.$tr);
	}
},
{
	numericKeyCodes: [9 /* (tab) */ , 8 /* (delete) */ , 37,38,39,40 /* (arrows) */ , 45,91 /* (minus) */ , 46,190 /* period */ , 48,49,50,51,52,53,54,55,56,57 /* (0-9) */ ]
});


/**
 * Element editor
 */
Craft.ElementEditor = Garnish.Base.extend(
{
	$element: null,
	elementId: null,
	locale: null,

	$form: null,
	$fieldsContainer: null,
	$cancelBtn: null,
	$saveBtn: null,
	$spinner: null,

	$localeSelect: null,
	$localeSpinner: null,

	hud: null,

	init: function($element)
	{
		this.$element = $element;
		this.elementId = $element.data('id');

		this.$element.addClass('loading');

		var data = {
			elementId:      this.elementId,
			locale:         this.$element.data('locale'),
			includeLocales: true
		};

		Craft.postActionRequest('elements/getEditorHtml', data, $.proxy(this, 'showHud'));
	},

	showHud: function(response, textStatus)
	{
		this.$element.removeClass('loading');

		if (textStatus == 'success')
		{
			var $hudContents = $();

			if (response.locales)
			{
				var $localesContainer = $('<div class="header"/>'),
					$localeSelectContainer = $('<div class="select"/>').appendTo($localesContainer);

				this.$localeSelect = $('<select/>').appendTo($localeSelectContainer);
				this.$localeSpinner = $('<div class="spinner hidden"/>').appendTo($localesContainer);

				for (var i = 0; i < response.locales.length; i++)
				{
					var locale = response.locales[i];
					$('<option value="'+locale.id+'"'+(locale.id == response.locale ? ' selected="selected"' : '')+'>'+locale.name+'</option>').appendTo(this.$localeSelect);
				}

				this.addListener(this.$localeSelect, 'change', 'switchLocale');

				$hudContents = $hudContents.add($localesContainer);
			}

			this.$form = $('<form/>');
			this.$fieldsContainer = $('<div class="fields"/>').appendTo(this.$form);

			this.updateForm(response);

			var $buttonsOuterContainer = $('<div class="footer"/>').appendTo(this.$form);

			this.$spinner = $('<div class="spinner hidden"/>').appendTo($buttonsOuterContainer);

			var $buttonsContainer = $('<div class="buttons right"/>').appendTo($buttonsOuterContainer);
			this.$cancelBtn = $('<div class="btn">'+Craft.t('Cancel')+'</div>').appendTo($buttonsContainer);
			this.$saveBtn = $('<input class="btn submit" type="submit" value="'+Craft.t('Save')+'"/>').appendTo($buttonsContainer);

			$hudContents = $hudContents.add(this.$form);

			this.hud = new Garnish.HUD(this.$element, $hudContents, {
				bodyClass: 'body elementeditor',
				closeOtherHUDs: false
			});

			this.hud.on('hide', $.proxy(function() {
				delete this.hud;
			}, this));

			this.addListener(this.$form, 'submit', 'saveElement');
			this.addListener(this.$cancelBtn, 'click', function() {
				this.hud.hide()
			});
		}
	},

	switchLocale: function()
	{
		var newLocale = this.$localeSelect.val();

		if (newLocale == this.locale)
		{
			return;
		}

		this.$localeSpinner.removeClass('hidden');

		var data = {
			elementId: this.elementId,
			locale:    newLocale
		};

		Craft.postActionRequest('elements/getEditorHtml', data, $.proxy(function(response, textStatus)
		{
			this.$localeSpinner.addClass('hidden');

			if (textStatus == 'success')
			{
				this.updateForm(response);
			}
			else
			{
				this.$localeSelect.val(this.locale);
			}
		}, this));
	},

	updateForm: function(response)
	{
		this.locale = response.locale;

		this.$fieldsContainer.html(response.html)
		Craft.initUiElements(this.$fieldsContainer);
	},

	saveElement: function(ev)
	{
		ev.preventDefault();

		this.$spinner.removeClass('hidden');

		var data = this.$form.serialize();

		Craft.postActionRequest('elements/saveElement', data, $.proxy(function(response, textStatus)
		{
			this.$spinner.addClass('hidden');

			if (textStatus == 'success')
			{
				if (textStatus == 'success' && response.success)
				{
					if (this.locale == this.$element.data('locale'))
					{
						// Update the label
						this.$element.find('.title').text(response.newTitle);
					}

					// Update Live Preview
					if (typeof Craft.livePreview != 'undefined')
					{
						Craft.livePreview.updateIframe(true);
					}

					this.closeHud();
				}
				else
				{
					this.updateForm(response);
					Garnish.shake(this.hud.$hud);
				}
			}
		}, this));
	},

	closeHud: function()
	{
		this.hud.hide();
		delete this.hud;
	}
});


/**
 * Entry index class
 */
Craft.EntryIndex = Craft.BaseElementIndex.extend(
{
	getDefaultSourceKey: function()
	{
		if (this.settings.context == 'index' && typeof defaultSectionHandle != 'undefined')
		{
			if (defaultSectionHandle == 'singles')
			{
				return 'singles';
			}
			else
			{
				for (var i = 0; i < this.$sources.length; i++)
				{
					var $source = $(this.$sources[i]);

					if ($source.data('handle') == defaultSectionHandle)
					{
						return $source.data('key');
					}
				}
			}
		}

		return this.base();
	},

	onSelectSource: function()
	{
		if (this.settings.context == 'index' && typeof history != 'undefined')
		{
			if (this.$source.data('key') == 'singles')
			{
				var handle = 'singles';
			}
			else
			{
				var handle = this.$source.data('handle');
			}

			var uri = 'entries';

			if (handle)
			{
				uri += '/'+handle;
			}

			history.replaceState({}, '', Craft.getUrl(uri));
		}

		this.base();
	}

});

// Register it!
Craft.registerElementIndexClass('Entry', Craft.EntryIndex);


/**
 * Handle Generator
 */
Craft.EntryUrlFormatGenerator = Craft.BaseInputGenerator.extend(
{
	generateTargetValue: function(sourceVal)
	{
		// Remove HTML tags
		sourceVal = sourceVal.replace("/<(.*?)>/g", '');

		// Make it lowercase
		sourceVal = sourceVal.toLowerCase();

		// Convert extended ASCII characters to basic ASCII
		sourceVal = Craft.asciiString(sourceVal);

		// Handle must start with a letter and end with a letter/number
		sourceVal = sourceVal.replace(/^[^a-z]+/, '');
		sourceVal = sourceVal.replace(/[^a-z0-9]+$/, '');

		// Get the "words"
		var words = Craft.filterArray(sourceVal.split(/[^a-z0-9]+/));

		var urlFormat = words.join('-');

		if (urlFormat && this.settings.suffix)
		{
			urlFormat += this.settings.suffix;
		}

		return urlFormat;
	}
});


Craft.FieldLayoutDesigner = Garnish.Base.extend(
{
	$container: null,
	$tabContainer: null,
	$unusedFieldContainer: null,
	$newTabBtn: null,
	$allFields: null,

	tabGrid: null,
	unusedFieldGrid: null,

	tabDrag: null,
	fieldDrag: null,

	init: function(container, settings)
	{
		this.$container = $(container);
		this.setSettings(settings, Craft.FieldLayoutDesigner.defaults);

		this.$tabContainer = this.$container.children('.fld-tabs');
		this.$unusedFieldContainer = this.$container.children('.unusedfields');
		this.$newTabBtn = $('#newtabbtn');
		this.$allFields = this.$unusedFieldContainer.find('.fld-field');

		// Set up the layout grids
		this.tabGrid = new Craft.Grid(this.$tabContainer, Craft.FieldLayoutDesigner.gridSettings);
		this.unusedFieldGrid = new Craft.Grid(this.$unusedFieldContainer, Craft.FieldLayoutDesigner.gridSettings);

		var $tabs = this.$tabContainer.children();
		for (var i = 0; i < $tabs.length; i++)
		{
			this.initTab($($tabs[i]));
		}

		this.fieldDrag = new Craft.FieldLayoutDesigner.FieldDrag(this);

		if (this.settings.customizableTabs)
		{
			this.tabDrag = new Craft.FieldLayoutDesigner.TabDrag(this);

			this.addListener(this.$newTabBtn, 'activate', 'addTab');
		}
	},

	initTab: function($tab)
	{
		if (this.settings.customizableTabs)
		{
			var $editBtn = $tab.find('.tabs .settings'),
				$menu = $('<div class="menu" data-align="center"/>').insertAfter($editBtn),
				$ul = $('<ul/>').appendTo($menu);

			$('<li><a data-action="rename">'+Craft.t('Rename')+'</a></li>').appendTo($ul);
			$('<li><a data-action="delete">'+Craft.t('Delete')+'</a></li>').appendTo($ul);

			new Garnish.MenuBtn($editBtn, {
				onOptionSelect: $.proxy(this, 'onTabOptionSelect')
			});
		}

		// Don't forget the fields!
		var $fields = $tab.children('.fld-tabcontent').children();

		for (var i = 0; i < $fields.length; i++)
		{
			this.initField($($fields[i]));
		}
	},

	initField: function($field)
	{
		var $editBtn = $field.find('.settings'),
			$menu = $('<div class="menu" data-align="center"/>').insertAfter($editBtn),
			$ul = $('<ul/>').appendTo($menu);

		if ($field.hasClass('fld-required'))
		{
			$('<li><a data-action="toggle-required">'+Craft.t('Make not required')+'</a></li>').appendTo($ul);
		}
		else
		{
			$('<li><a data-action="toggle-required">'+Craft.t('Make required')+'</a></li>').appendTo($ul);
		}

		$('<li><a data-action="remove">'+Craft.t('Remove')+'</a></li>').appendTo($ul);

		new Garnish.MenuBtn($editBtn, {
			onOptionSelect: $.proxy(this, 'onFieldOptionSelect')
		});
	},

	onTabOptionSelect: function(option)
	{
		if (!this.settings.customizableTabs)
		{
			return;
		}

		var $option = $(option),
			$tab = $option.data('menu').$trigger.parent().parent().parent(),
			action = $option.data('action');

		switch (action)
		{
			case 'rename':
			{
				this.renameTab($tab);
				break;
			}
			case 'delete':
			{
				this.deleteTab($tab);
				break;
			}
		}
	},

	onFieldOptionSelect: function(option)
	{
		var $option = $(option),
			$field = $option.data('menu').$trigger.parent(),
			action = $option.data('action');

		switch (action)
		{
			case 'toggle-required':
			{
				this.toggleRequiredField($field, $option);
				break;
			}
			case 'remove':
			{
				this.removeField($field);
				break;
			}
		}
	},

	renameTab: function($tab)
	{
		if (!this.settings.customizableTabs)
		{
			return;
		}

		var $labelSpan = $tab.find('.tabs .tab span'),
			oldName = $labelSpan.text(),
			newName = prompt(Craft.t('Give your tab a name.'), oldName);

		if (newName && newName != oldName)
		{
			$labelSpan.text(newName);
			$tab.find('.id-input').attr('name', 'fieldLayout['+Craft.encodeUriComponent(newName)+'][]');
		}
	},

	deleteTab: function($tab)
	{
		if (!this.settings.customizableTabs)
		{
			return;
		}

		// Find all the fields in this tab
		var $fields = $tab.find('.fld-field');

		for (var i = 0; i < $fields.length; i++)
		{
			var fieldId = $($fields[i]).attr('data-id');
			this.removeFieldById(fieldId);
		}

		this.tabGrid.removeItems($tab);
		this.tabDrag.removeItems($tab);

		$tab.remove();
	},

	toggleRequiredField: function($field, $option)
	{
		if ($field.hasClass('fld-required'))
		{
			$field.removeClass('fld-required');
			$field.find('.required-input').remove();

			setTimeout(function() {
				$option.text(Craft.t('Make required'));
			}, 500);
		}
		else
		{
			$field.addClass('fld-required');
			$('<input class="required-input" type="hidden" name="requiredFields[]" value="'+$field.data('id')+'">').appendTo($field);

			setTimeout(function() {
				$option.text(Craft.t('Make not required'));
			}, 500);
		}
	},

	removeField: function($field)
	{
		var fieldId = $field.attr('data-id');

		$field.remove();

		this.removeFieldById(fieldId);
		this.tabGrid.refreshCols();
	},

	removeFieldById: function(fieldId)
	{
		var $field = this.$allFields.filter('[data-id='+fieldId+']:first'),
			$group = $field.closest('.fld-tab');

		$field.removeClass('hidden');

		if ($group.hasClass('hidden'))
		{
			$group.removeClass('hidden');
			this.unusedFieldGrid.addItems($group);

			if (this.settings.customizableTabs)
			{
				this.tabDrag.addItems($group);
			}
		}
		else
		{
			this.unusedFieldGrid.refreshCols();
		}
	},

	addTab: function()
	{
		if (!this.settings.customizableTabs)
		{
			return;
		}

		var $tab = $('<div class="fld-tab">' +
						'<div class="tabs">' +
							'<div class="tab sel draggable">' +
								'<span>Tab '+(this.tabGrid.$items.length+1)+'</span>' +
								'<a class="settings icon" title="'+Craft.t('Rename')+'"></a>' +
							'</div>' +
						'</div>' +
						'<div class="fld-tabcontent"></div>' +
					'</div>').appendTo(this.$tabContainer);

		this.tabGrid.addItems($tab);
		this.tabDrag.addItems($tab);

		this.initTab($tab);
	}
},
{
	gridSettings: {
		itemSelector: '.fld-tab:not(.hidden)',
		minColWidth: 240,
		percentageWidths: false,
		fillMode: 'grid',
		snapToGrid: 30
	},
	defaults: {
		customizableTabs: true
	}
});


Craft.FieldLayoutDesigner.BaseDrag = Garnish.Drag.extend(
{
	designer: null,
	$insertion: null,
	showingInsertion: false,
	$caboose: null,
	draggingUnusedItem: false,
	addToTabGrid: false,

	/**
	 * Constructor
	 */
	init: function(designer, settings)
	{
		this.designer = designer;

		// Find all the items from both containers
		var $items = this.designer.$tabContainer.find(this.itemSelector)
			.add(this.designer.$unusedFieldContainer.find(this.itemSelector));

		this.base($items, settings);
	},

	/**
	 * On Drag Start
	 */
	onDragStart: function()
	{
		this.base();

		// Are we dragging an unused item?
		this.draggingUnusedItem = this.$draggee.hasClass('unused');

		// Create the insertion
		this.$insertion = this.getInsertion();

		// Add the caboose
		this.addCaboose();
		this.$items = $().add(this.$items.add(this.$caboose));

		if (this.addToTabGrid)
		{
			this.designer.tabGrid.addItems(this.$caboose);
		}

		// Swap the draggee with the insertion if dragging a selected item
		if (this.draggingUnusedItem)
		{
			this.showingInsertion = false;
		}
		else
		{
			// Actually replace the draggee with the insertion
			this.$insertion.insertBefore(this.$draggee);
			this.$draggee.detach();
			this.$items = $().add(this.$items.not(this.$draggee).add(this.$insertion));
			this.showingInsertion = true;

			if (this.addToTabGrid)
			{
				this.designer.tabGrid.removeItems(this.$draggee);
				this.designer.tabGrid.addItems(this.$insertion);
			}
		}

		this.setMidpoints();
	},

	/**
	 * Append the caboose
	 */
	addCaboose: $.noop,

	/**
	 * Returns the item's container
	 */
	getItemContainer: $.noop,

	/**
	 * Tests if an item is within the tab container.
	 */
	isItemInTabContainer: function($item)
	{
		return (this.getItemContainer($item)[0] == this.designer.$tabContainer[0]);
	},

	/**
	 * Sets the item midpoints up front so we don't have to keep checking on every mouse move
	 */
	setMidpoints: function()
	{
		for (var i = 0; i < this.$items.length; i++)
		{
			var $item = $(this.$items[i]);

			// Skip the unused tabs
			if (!this.isItemInTabContainer($item))
			{
				continue;
			}

			var offset = $item.offset();

			$item.data('midpoint', {
				left: offset.left + $item.outerWidth() / 2,
				top:  offset.top + $item.outerHeight() / 2
			});
		}
	},

	/**
	 * On Drag
	 */
	onDrag: function()
	{
		// Are we hovering over the tab container?
		if (this.draggingUnusedItem && !Garnish.hitTest(this.mouseX, this.mouseY, this.designer.$tabContainer))
		{
			if (this.showingInsertion)
			{
				this.$insertion.remove();
				this.$items = $().add(this.$items.not(this.$insertion));
				this.showingInsertion = false;

				if (this.addToTabGrid)
				{
					this.designer.tabGrid.removeItems(this.$insertion);
				}
				else
				{
					this.designer.tabGrid.refreshCols();
				}

				this.setMidpoints();
			}
		}
		else
		{
			// Is there a new closest item?
			this.onDrag._closestItem = this.getClosestItem();

			if (this.onDrag._closestItem != this.$insertion[0])
			{
				if (this.showingInsertion &&
					($.inArray(this.$insertion[0], this.$items) < $.inArray(this.onDrag._closestItem, this.$items)) &&
					($.inArray(this.onDrag._closestItem, this.$caboose) == -1)
				)
				{
					this.$insertion.insertAfter(this.onDrag._closestItem);
				}
				else
				{
					this.$insertion.insertBefore(this.onDrag._closestItem);
				}

				this.$items = $().add(this.$items.add(this.$insertion));
				this.showingInsertion = true;

				if (this.addToTabGrid)
				{
					this.designer.tabGrid.addItems(this.$insertion);
				}
				else
				{
					this.designer.tabGrid.refreshCols();
				}

				this.setMidpoints();
			}
		}

		this.base();
	},

	/**
	 * Returns the closest item to the cursor.
	 */
	getClosestItem: function()
	{
		this.getClosestItem._closestItem = null;
		this.getClosestItem._closestItemMouseDiff = null;

		for (this.getClosestItem._i = 0; this.getClosestItem._i < this.$items.length; this.getClosestItem._i++)
		{
			this.getClosestItem._$item = $(this.$items[this.getClosestItem._i]);

			// Skip the unused tabs
			if (!this.isItemInTabContainer(this.getClosestItem._$item))
			{
				continue;
			}

			this.getClosestItem._midpoint = this.getClosestItem._$item.data('midpoint');
			this.getClosestItem._mouseDiff = Garnish.getDist(this.getClosestItem._midpoint.left, this.getClosestItem._midpoint.top, this.mouseX, this.mouseY);

			if (this.getClosestItem._closestItem === null || this.getClosestItem._mouseDiff < this.getClosestItem._closestItemMouseDiff)
			{
				this.getClosestItem._closestItem = this.getClosestItem._$item[0];
				this.getClosestItem._closestItemMouseDiff = this.getClosestItem._mouseDiff;
			}
		}

		return this.getClosestItem._closestItem;
	},

	/**
	 * On Drag Stop
	 */
	onDragStop: function()
	{
		if (this.showingInsertion)
		{
			this.$insertion.replaceWith(this.$draggee);
			this.$items = $().add(this.$items.not(this.$insertion).add(this.$draggee));

			if (this.addToTabGrid)
			{
				this.designer.tabGrid.removeItems(this.$insertion);
				this.designer.tabGrid.addItems(this.$draggee);
			}
		}

		// Drop the caboose
		this.$items = this.$items.not(this.$caboose);
		this.$caboose.remove();

		if (this.addToTabGrid)
		{
			this.designer.tabGrid.removeItems(this.$caboose);
		}

		// "show" the drag items, but make them invisible
		this.$draggee.css({
			display:    this.draggeeDisplay,
			visibility: 'hidden'
		});

		this.designer.tabGrid.refreshCols();
		this.designer.unusedFieldGrid.refreshCols();

		// return the helpers to the draggees
		this.returnHelpersToDraggees();

		this.base();
	}
});


Craft.FieldLayoutDesigner.TabDrag = Craft.FieldLayoutDesigner.BaseDrag.extend(
{
	itemSelector: '> div.fld-tab',
	addToTabGrid: true,

	/**
	 * Constructor
	 */
	init: function(designer)
	{
		var settings = {
			handle: '.tab'
		};

		this.base(designer, settings);
	},

	/**
	 * Append the caboose
	 */
	addCaboose: function()
	{
		this.$caboose = $('<div class="fld-tab fld-tab-caboose"/>').appendTo(this.designer.$tabContainer);
	},

	/**
	 * Returns the insertion
	 */
	getInsertion: function()
	{
		var $tab = this.$draggee.find('.tab');

		return $('<div class="fld-tab fld-insertion" style="height: '+this.$draggee.height()+'px;">' +
					'<div class="tabs"><div class="tab sel draggable" style="width: '+$tab.width()+'px; height: '+$tab.height()+'px;"></div></div>' +
					'<div class="fld-tabcontent" style="height: '+this.$draggee.find('.fld-tabcontent').height()+'px;"></div>' +
				'</div>');
	},

	/**
	 * Returns the item's container
	 */
	getItemContainer: function($item)
	{
		return $item.parent();
	},

	/**
	 * On Drag Stop
	 */
	onDragStop: function()
	{
		if (this.draggingUnusedItem && this.showingInsertion)
		{
			// Create a new tab based on that field group
			var $tab = this.$draggee.clone().removeClass('unused'),
				tabName = $tab.find('.tab span').text();

			$tab.find('.fld-field').removeClass('unused');

			// Add the edit button
			$tab.find('.tabs .tab').append('<a class="settings icon" title="'+Craft.t('Edit')+'"></a>');

			// Remove any hidden fields
			var $fields = $tab.find('.fld-field'),
				$hiddenFields = $fields.filter('.hidden').remove();

			$fields = $fields.not($hiddenFields);
			$fields.prepend('<a class="settings icon" title="'+Craft.t('Edit')+'"></a>');

			for (var i = 0; i < $fields.length; i++)
			{
				var $field = $($fields[i]);
				$field.append('<input class="id-input" type="hidden" name="fieldLayout['+Craft.encodeUriComponent(tabName)+'][]" value="'+$field.data('id')+'">');
			}

			this.designer.fieldDrag.addItems($fields);

			this.designer.initTab($tab);

			// Set the unused field group and its fields to hidden
			this.$draggee.css({ visibility: 'inherit', display: 'field' }).addClass('hidden');
			this.$draggee.find('.fld-field').addClass('hidden');

			// Set this.$draggee to the clone, as if we were dragging that all along
			this.$draggee = $tab;

			// Remember it for later
			this.addItems($tab);

			// Update the grids
			this.designer.tabGrid.addItems($tab);
			this.designer.unusedFieldGrid.removeItems(this.$draggee);
		}

		this.base();
	}
});


Craft.FieldLayoutDesigner.FieldDrag = Craft.FieldLayoutDesigner.BaseDrag.extend(
{
	itemSelector: '> div.fld-tab .fld-field',

	/**
	 * Append the caboose
	 */
	addCaboose: function()
	{
		this.$caboose = $();

		var $fieldContainers = this.designer.$tabContainer.children().children('.fld-tabcontent');

		for (var i = 0; i < $fieldContainers.length; i++)
		{
			var $caboose = $('<div class="fld-tab fld-tab-caboose"/>').appendTo($fieldContainers[i]);
			this.$caboose = this.$caboose.add($caboose);
		}
	},

	/**
	 * Returns the insertion
	 */
	getInsertion: function()
	{
		return $('<div class="fld-field fld-insertion" style="height: '+this.$draggee.height()+'px;"/>');
	},

	/**
	 * Returns the item's container
	 */
	getItemContainer: function($item)
	{
		return $item.parent().parent().parent();
	},

	/**
	 * On Drag Stop
	 */
	onDragStop: function()
	{
		if (this.draggingUnusedItem && this.showingInsertion)
		{
			// Create a new field based on that one
			var $field = this.$draggee.clone().removeClass('unused');
			$field.prepend('<a class="settings icon" title="'+Craft.t('Edit')+'"></a>');
			this.designer.initField($field);

			// Hide the unused field
			this.$draggee.css({ visibility: 'inherit', display: 'field' }).addClass('hidden');

			// Hide the group too?
			if (this.$draggee.siblings(':not(.hidden)').length == 0)
			{
				var $group = this.$draggee.parent().parent();
				$group.addClass('hidden');
				this.designer.unusedFieldGrid.removeItems($group);
			}

			// Set this.$draggee to the clone, as if we were dragging that all along
			this.$draggee = $field;

			// Remember it for later
			this.addItems($field);
		}

		if (this.showingInsertion)
		{
			// Find the field's new tab name
			var tabName = this.$insertion.parent().parent().find('.tab span').text(),
				inputName = 'fieldLayout['+Craft.encodeUriComponent(tabName)+'][]';

			if (this.draggingUnusedItem)
			{
				this.$draggee.append('<input class="id-input" type="hidden" name="'+inputName+'" value="'+this.$draggee.data('id')+'">');
			}
			else
			{
				this.$draggee.find('.id-input').attr('name', inputName);
			}
		}

		this.base();
	}
});


/**
 * FieldToggle
 */
Craft.FieldToggle = Garnish.Base.extend(
{
	$toggle: null,
	targetPrefix: null,
	targetSelector: null,
	reverseTargetSelector: null,

	_$target: null,
	_$reverseTarget: null,
	type: null,

	init: function(toggle)
	{
		this.$toggle = $(toggle);

		// Is this already a field toggle?
		if (this.$toggle.data('fieldtoggle'))
		{
			Garnish.log('Double-instantiating a field toggle on an element');
			this.$toggle.data('fieldtoggle').destroy();
		}

		this.$toggle.data('fieldtoggle', this);

		this.type = this.getType();

		if (this.type == 'select')
		{
			this.targetPrefix = (this.$toggle.attr('data-target-prefix') || '');
		}
		else
		{
			this.targetSelector = this.normalizeTargetSelector(this.$toggle.data('target'));
			this.reverseTargetSelector = this.normalizeTargetSelector(this.$toggle.data('reverse-target'));
		}

		this.findTargets();

		if (this.type == 'link')
		{
			this.addListener(this.$toggle, 'click', 'onToggleChange');
		}
		else
		{
			this.addListener(this.$toggle, 'change', 'onToggleChange');
		}
	},

	normalizeTargetSelector: function(selector)
	{
		if (selector && !selector.match(/^[#\.]/))
		{
			selector = '#'+selector;
		}

		return selector;
	},

	getType: function()
	{
		if (this.$toggle.prop('nodeName') == 'INPUT' && this.$toggle.attr('type').toLowerCase() == 'checkbox')
		{
			return 'checkbox';
		}
		else if (this.$toggle.prop('nodeName') == 'SELECT')
		{
			return 'select';
		}
		else if (this.$toggle.prop('nodeName') == 'A')
		{
			return 'link';
		}
	},

	findTargets: function()
	{
		if (this.type == 'select')
		{
			this._$target = $(this.normalizeTargetSelector(this.targetPrefix+this.getToggleVal()));
		}
		else
		{
			if (this.targetSelector)
			{
				this._$target = $(this.targetSelector);
			}

			if (this.reverseTargetSelector)
			{
				this._$reverseTarget = $(this.reverseTargetSelector);
			}
		}
	},

	getToggleVal: function()
	{
		return Garnish.getInputPostVal(this.$toggle);
	},

	onToggleChange: function()
	{
		if (this.type == 'select')
		{
			this.hideTarget(this._$target);
			this.findTargets();
			this.showTarget(this._$target);
		}
		else
		{
			if (this.type == 'link')
			{
				var show = this.$toggle.hasClass('collapsed') || !this.$toggle.hasClass('expanded');
			}
			else
			{
				var show = !!this.getToggleVal();
			}

			if (show)
			{
				this.showTarget(this._$target);
				this.hideTarget(this._$reverseTarget);
			}
			else
			{
				this.hideTarget(this._$target);
				this.showTarget(this._$reverseTarget);
			}
		}
	},

	showTarget: function($target)
	{
		if ($target && $target.length)
		{
			$target.removeClass('hidden');

			if (this.type != 'select')
			{
				if (this.type == 'link')
				{
					this.$toggle.removeClass('collapsed');
					this.$toggle.addClass('expanded');
				}

				$target.height('auto');
				var height = $target.height();
				$target.height(0);
				$target.stop().animate({height: height}, 'fast', function() {
					$target.height('auto');
				});
			}
		}
	},

	hideTarget: function($target)
	{
		if ($target && $target.length)
		{
			if (this.type == 'select')
			{
				$target.addClass('hidden');
			}
			else
			{
				if (this.type == 'link')
				{
					this.$toggle.removeClass('expanded');
					this.$toggle.addClass('collapsed');
				}

				$target.stop().animate({height: 0}, 'fast', function() {
					$target.addClass('hidden');
				});
			}
		}
	}
});


Craft.Grid = Garnish.Base.extend(
{
	$container: null,

	$items: null,
	items: null,
	totalCols: null,
	colPctWidth: null,
	sizeUnit: null,

	possibleItemColspans: null,
	possibleItemPositionsByColspan: null,

	itemPositions: null,
	itemColspansByPosition: null,

	layouts: null,
	layout: null,
	itemHeights: null,
	leftPadding: null,

	init: function(container, settings)
	{
		this.$container = $(container);

		this.setSettings(settings, Craft.Grid.defaults);

		if (this.settings.mode == 'pct')
		{
			this.sizeUnit = '%';
		}
		else
		{
			this.sizeUnit = 'px';
		}

		this.$items = this.$container.children(this.settings.itemSelector);
		this.setItems();
		this.refreshCols();

		// Adjust them when the container is resized
		this.addListener(this.$container, 'resize', 'refreshCols');

		// Trigger a window resize event in case anything needs to adjust itself, now that the items are layed out.
		Garnish.$win.trigger('resize');
	},

	addItems: function(items)
	{
		this.$items = $().add(this.$items.add(items));
		this.setItems();
		this.refreshCols();
	},

	removeItems: function(items)
	{
		this.$items = $().add(this.$items.not(items));
		this.setItems();
		this.refreshCols();
	},

	setItems: function()
	{
		this.items = [];

		for (var i = 0; i < this.$items.length; i++)
		{
			this.items.push($(this.$items[i]));
		}
	},

	refreshCols: function()
	{
		if (!this.items.length)
		{
			return;
		}

		if (this.settings.cols)
		{
			this.totalCols = this.settings.cols;
		}
		else
		{
			this.totalCols = Math.floor(this.$container.width() / this.settings.minColWidth);
		}

		if (this.totalCols == 0)
		{
			this.totalCols = 1;
		}

		if (this.settings.fillMode == 'grid')
		{
			var itemIndex = 0;

			while (itemIndex < this.items.length)
			{
				// Append the next X items and figure out which one is the tallest
				var tallestItemHeight = -1,
					colIndex = 0;

				for (var i = itemIndex; (i < itemIndex + this.totalCols && i < this.items.length); i++)
				{
					var itemHeight = this.items[i].height('auto').height();
					if (itemHeight > tallestItemHeight)
					{
						tallestItemHeight = itemHeight;
					}

					colIndex++;
				}

				if (this.settings.snapToGrid)
				{
					var remainder = tallestItemHeight % this.settings.snapToGrid;

					if (remainder)
					{
						tallestItemHeight += this.settings.snapToGrid - remainder;
					}
				}

				// Now set their heights to the tallest one
				for (var i = itemIndex; (i < itemIndex + this.totalCols && i < this.items.length); i++)
				{
					this.items[i].height(tallestItemHeight);
				}

				// set the itemIndex pointer to the next one up
				itemIndex += this.totalCols;
			}
		}
		else
		{
			this.removeListener(this.$items, 'resize');

			if (this.settings.mode == 'pct')
			{
				this.colPctWidth = (100 / this.totalCols);
			}

			// The setup

			this.layouts = [];

			this.itemPositions = [];
			this.itemColspansByPosition = [];

			// Figure out all of the possible colspans for each item,
			// as well as all the possible positions for each item at each of its colspans

			this.possibleItemColspans = [];
			this.possibleItemPositionsByColspan = [];
			this.itemHeightsByColspan = [];

			for (var item = 0; item < this.items.length; item++)
			{
				this.possibleItemColspans[item] = [];
				this.possibleItemPositionsByColspan[item] = {};
				this.itemHeightsByColspan[item] = {};

				var $item = this.items[item].show(),
					positionRight = ($item.data('position') == 'right'),
					positionLeft = ($item.data('position') == 'left'),
					minColspan = ($item.data('colspan') ? $item.data('colspan') : ($item.data('min-colspan') ? $item.data('min-colspan') : 1)),
					maxColspan = ($item.data('colspan') ? $item.data('colspan') : ($item.data('max-colspan') ? $item.data('max-colspan') : this.totalCols));

				if (minColspan > this.totalCols) minColspan = this.totalCols;
				if (maxColspan > this.totalCols) maxColspan = this.totalCols;

				for (var colspan = minColspan; colspan <= maxColspan; colspan++)
				{
					// Get the height for this colspan
					$item.css('width', this.getItemWidth(colspan) + this.sizeUnit);
					this.itemHeightsByColspan[item][colspan] = $item.outerHeight();

					this.possibleItemColspans[item].push(colspan);
					this.possibleItemPositionsByColspan[item][colspan] = [];

					if (positionLeft)
					{
						var minPosition = 0,
							maxPosition = 0;
					}
					else if (positionRight)
					{
						var minPosition = this.totalCols - colspan,
							maxPosition = minPosition;
					}
					else
					{
						var minPosition = 0,
							maxPosition = this.totalCols - colspan;
					}

					for (var position = minPosition; position <= maxPosition; position++)
					{
						this.possibleItemPositionsByColspan[item][colspan].push(position);
					}
				}
			}

			// Find all the possible layouts

			var colHeights = [];

			for (var i = 0; i < this.totalCols; i++)
			{
				colHeights.push(0);
			}

			this.createLayouts(0, [], [], colHeights, 0);

			// Now find the layout that looks the best.
			// We'll determine that by first finding all of the layouts that have the lowest overall height,
			// and of those, find the one with the least empty space

			// Find the layout(s) with the least overall height
			var layoutHeights = [];

			for (var i = 0; i < this.layouts.length; i++)
			{
				layoutHeights.push(Math.max.apply(null, this.layouts[i].colHeights));
			}

			var shortestHeight = Math.min.apply(null, layoutHeights),
				shortestLayouts = [],
				emptySpaces = [];

			for (var i = 0; i < layoutHeights.length; i++)
			{
				if (layoutHeights[i] == shortestHeight)
				{
					shortestLayouts.push(this.layouts[i]);

					// Now get its total empty space, including any trailing empty space
					var emptySpace = this.layouts[i].emptySpace;

					for (var j = 0; j < this.totalCols; j++)
					{
						emptySpace += (shortestHeight - this.layouts[i].colHeights[j]);
					}

					emptySpaces.push(emptySpace);
				}
			}

			// And the layout with the least empty space is...
			this.layout = shortestLayouts[$.inArray(Math.min.apply(null, emptySpaces), emptySpaces)];

			// Figure out the left padding based on the number of empty columns
			var totalEmptyCols = 0;

			for (var i = this.layout.colHeights.length-1; i >= 0; i--)
			{
				if (this.layout.colHeights[i] == 0)
				{
					totalEmptyCols++;
				}
				else
				{
					break;
				}
			}

			this.leftPadding = this.getItemWidth(totalEmptyCols) / 2;

			if (this.settings.mode == 'fixed')
			{
				this.leftPadding += (this.$container.width() - (this.settings.minColWidth * this.totalCols)) / 2;
			}

			// Now position the items
			this.positionItems();

			// Update the positions as the items' heigthts change
			this.addListener(this.$items, 'resize', 'onItemResize');
		}
	},

	getItemWidth: function(colspan)
	{
		if (this.settings.mode == 'pct')
		{
			return (this.colPctWidth * colspan);
		}
		else
		{
			return (this.settings.minColWidth * colspan);
		}
	},

	createLayouts: function(item, prevPositions, prevColspans, prevColHeights, prevEmptySpace)
	{
		// Loop through all possible colspans
		for (var c = 0; c < this.possibleItemColspans[item].length; c++)
		{
			var colspan = this.possibleItemColspans[item][c];

			// Loop through all the possible positions for this colspan,
			// and find the one that is closest to the top

			var tallestColHeightsByPosition = [];

			for (var p = 0; p < this.possibleItemPositionsByColspan[item][colspan].length; p++)
			{
				var position = this.possibleItemPositionsByColspan[item][colspan][p];

				var colHeightsForPosition = [],
					endingCol = position + colspan - 1;

				for (var col = position; col <= endingCol; col++)
				{
					colHeightsForPosition.push(prevColHeights[col]);
				}

				tallestColHeightsByPosition[p] = Math.max.apply(null, colHeightsForPosition);
			}

			// And the shortest position for this colspan is...
			var p = $.inArray(Math.min.apply(null, tallestColHeightsByPosition), tallestColHeightsByPosition),
				position = this.possibleItemPositionsByColspan[item][colspan][p];

			// Now log the colspan/position placement
			var positions = prevPositions.slice(0),
				colspans = prevColspans.slice(0),
				colHeights = prevColHeights.slice(0),
				emptySpace = prevEmptySpace;

			positions.push(position);
			colspans.push(colspan);

			// Add the new heights to those columns
			var tallestColHeight = tallestColHeightsByPosition[p],
				endingCol = position + colspan - 1;

			for (var col = position; col <= endingCol; col++)
			{
				emptySpace += tallestColHeight - colHeights[col];
				colHeights[col] = tallestColHeight + this.itemHeightsByColspan[item][colspan];
			}

			// If this is the last item, create the layout
			if (item == this.items.length-1)
			{
				this.layouts.push({
					positions: positions,
					colspans: colspans,
					colHeights: colHeights,
					emptySpace: emptySpace
				});
			}
			else
			{
				// Dive deeper
				this.createLayouts(item+1, positions, colspans, colHeights, emptySpace);
			}
		}
	},

	positionItems: function()
	{
		var colHeights = [];

		for (var i = 0; i < this.totalCols; i++)
		{
			colHeights.push(0);
		}

		for (var i = 0; i < this.items.length; i++)
		{
			var endingCol = this.layout.positions[i] + this.layout.colspans[i] - 1,
				affectedColHeights = [];

			for (var col = this.layout.positions[i]; col <= endingCol; col++)
			{
				affectedColHeights.push(colHeights[col]);
			}

			var top = Math.max.apply(null, affectedColHeights);

			var css = {
				top: top,
				width: this.getItemWidth(this.layout.colspans[i]) + this.sizeUnit
			};
			css[Craft.left] = this.leftPadding + this.getItemWidth(this.layout.positions[i]) + this.sizeUnit;

			this.items[i].css(css);

			// Now add the new heights to those columns
			for (var col = this.layout.positions[i]; col <= endingCol; col++)
			{
				colHeights[col] = top + this.itemHeightsByColspan[i][this.layout.colspans[i]];
			}
		}

		// Set the container height
		this.$container.css({
			height: Math.max.apply(null, colHeights)
		});
	},

	onItemResize: function(ev)
	{
		// Prevent this from bubbling up to the container, which has its own resize listener
		ev.stopPropagation();

		var item = $.inArray(ev.currentTarget, this.$items);

		if (item != -1)
		{
			// Update the height and reposition the items
			var newHeight = this.items[item].outerHeight();

			if (newHeight != this.itemHeightsByColspan[item][this.layout.colspans[item]])
			{
				this.itemHeightsByColspan[item][this.layout.colspans[item]] = newHeight;
				this.positionItems();
			}
		}
	}
},
{
	defaults: {
		itemSelector: '.item',
		cols: null,
		minColWidth: 320,
		mode: 'pct',
		fillMode: 'top',
		colClass: 'col',
		snapToGrid: null
	}
});


/**
 * Handle Generator
 */
Craft.HandleGenerator = Craft.BaseInputGenerator.extend(
{
	generateTargetValue: function(sourceVal)
	{
		// Remove HTML tags
		var handle = sourceVal.replace("/<(.*?)>/g", '');

		// Remove inner-word punctuation
		handle = handle.replace(/['"‘’“”\[\]\(\)\{\}:]/g, '');

		// Make it lowercase
		handle = handle.toLowerCase();

		// Convert extended ASCII characters to basic ASCII
		handle = Craft.asciiString(handle);

		// Handle must start with a letter
		handle = handle.replace(/^[^a-z]+/, '');

		// Get the "words"
		var words = Craft.filterArray(handle.split(/[^a-z0-9]+/)),
			handle = '';

		// Make it camelCase
		for (var i = 0; i < words.length; i++)
		{
			if (i == 0)
			{
				handle += words[i];
			}
			else
			{
				handle += words[i].charAt(0).toUpperCase()+words[i].substr(1);
			}
		}

		return handle;
	}
});


/**
 * postParameters    - an object of POST data to pass along with each Ajax request
 * modalClass        - class to add to the modal window to allow customization
 * uploadButton      - jQuery object of the element that should open the file chooser
 * uploadAction      - upload to this location (in form of "controller/action")
 * deleteButton      - jQuery object of the element that starts the image deletion process
 * deleteMessage     - confirmation message presented to the user for image deletion
 * deleteAction      - delete image at this location (in form of "controller/action")
 * cropAction        - crop image at this (in form of "controller/action")
 * areaToolOptions   - object with some options for the area tool selector
 *   aspectRatio     - aspect ration to enforce in form of "width:height". If empty, then select area is freeform
 *   intialRectangle - object with options for the initial rectangle
 *     mode          - if set to auto, then the part selected will be the maximum size in the middle of image
 *     x1            - top left x coordinate of th rectangle, if the mode is not set to auto
 *     x2            - bottom right x coordinate of th rectangle, if the mode is not set to auto
 *     y1            - top left y coordinate of th rectangle, if the mode is not set to auto
 *     y2            - bottom right y coordinate of th rectangle, if the mode is not set to auto
 *
 * onImageDelete     - callback to call when image is deleted. First parameter will containt respone data.
 * onImageSave       - callback to call when an cropped image is saved. First parameter will contain response data.
 */


/**
 * Image Upload tool.
 */
Craft.ImageUpload = Garnish.Base.extend(
{
	_imageHandler: null,

	init: function(settings)
	{
		this.setSettings(settings, Craft.ImageUpload.defaults);
		this._imageHandler = new Craft.ImageHandler(settings);
	}
},
{
	$modalContainerDiv: null,

	defaults: {
		postParameters: {},

		modalClass: "",
		uploadButton: {},
		uploadAction: "",

		deleteButton: {},
		deleteMessage: "",
		deleteAction: "",

		cropAction:"",

		areaToolOptions:
		{
			aspectRatio: "1:1",
			initialRectangle: {
				mode: "auto",
				x1: 0,
				x2: 0,
				y1: 0,
				y2: 0
			}
		},

		onImageDelete: function(response)
		{
			location.reload();
		},
		onImageSave: function(response)
		{
			location.reload();
		}
	}
});


Craft.ImageHandler = Garnish.Base.extend(
{
	modal: null,
	progressBar: null,
	$container: null,

	init: function(settings)
	{
		this.setSettings(settings);

		var _this = this;

		var element = settings.uploadButton;
		var $uploadInput = $('<input type="file" name="image-upload" id="image-upload" />').hide().insertBefore(element);

		this.progressBar = new Craft.ProgressBar($('<div class="progress-shade"></div>').insertBefore(element));
		this.progressBar.$progressBar.css({
			top: Math.round(element.outerHeight() / 2) - 6
		});

		this.$container = element.parent();

		var options = {
			url: Craft.getActionUrl(this.settings.uploadAction),
			fileInput: $uploadInput,

			element:    this.settings.uploadButton[0],
			action:     Craft.actionUrl + '/' + this.settings.uploadAction,
			formData:   this.settings.postParameters,
			events:     {
				fileuploadstart: $.proxy(function()
				{
					this.$container.addClass('uploading');
					this.progressBar.resetProgressBar();
					this.progressBar.showProgressBar();
				}, this),
				fileuploadprogressall: $.proxy(function(data)
				{
					var progress = parseInt(data.loaded / data.total * 100, 10);
					this.progressBar.setProgressPercentage(progress);
				}, this),
				fileuploaddone: $.proxy(function(event, data)
				{
					this.progressBar.hideProgressBar();
					this.$container.removeClass('uploading');

					var response = data.result;

					if (Craft.ImageUpload.$modalContainerDiv == null)
					{
						Craft.ImageUpload.$modalContainerDiv = $('<div class="modal fitted"></div>').addClass(settings.modalClass).appendTo(Garnish.$bod);
					}

					if (response.html)
					{
						Craft.ImageUpload.$modalContainerDiv.empty().append(response.html);

						if (!this.modal)
						{
							this.modal = new Craft.ImageModal(Craft.ImageUpload.$modalContainerDiv, {
								postParameters: settings.postParameters,
								cropAction:     settings.cropAction
							});

							this.modal.imageHandler = _this;
						}
						else
						{
							this.modal.show();
						}

						this.modal.bindButtons();
						this.modal.addListener(this.modal.$saveBtn, 'click', 'saveImage');
						this.modal.addListener(this.modal.$cancelBtn, 'click', 'cancel');

						this.modal.removeListener(Garnish.Modal.$shade, 'click');

						setTimeout($.proxy(function()
						{
							Craft.ImageUpload.$modalContainerDiv.find('img').load($.proxy(function()
							{
								var profileTool = new Craft.ImageAreaTool(settings.areaToolOptions);
								profileTool.showArea(this.modal);
								this.modal.cropAreaTool = profileTool;
							}, this));
						}, this), 1);
					}
				}, this)
			},
			acceptFileTypes: /(jpg|jpeg|gif|png)/
		};

		this.uploader = new Craft.Uploader(element, options);


		$(settings.deleteButton).click(function()
		{
			if (confirm(settings.deleteMessage))
			{
				$(this).parent().append('<div class="blocking-modal"></div>');
				Craft.postActionRequest(settings.deleteAction, settings.postParameters, $.proxy(function(response, textStatus)
				{
					if (textStatus == 'success')
					{
						_this.onImageDelete.apply(_this, [response]);
					}

				}, this));

			}
		});
		$(settings.uploadButton).on('click', function(event)
		{
			$(this).siblings('input[type=file]').click();
		});

	},

	onImageSave: function(data)
	{
		this.settings.onImageSave.apply(this, [data]);
	},

	onImageDelete: function(data)
	{
		this.settings.onImageDelete.apply(this, [data]);
	}
});


Craft.ImageModal = Garnish.Modal.extend(
{
	$container: null,
	$saveBtn: null,
	$cancelBtn: null,

	areaSelect: null,
	factor: null,
	source: null,
	_postParameters: null,
	_cropAction: "",
	imageHandler: null,
	originalWidth: 0,
	originalHeight: 0,
	constraint: 0,
	cropAreaTool: null,


	init: function($container, settings)
	{
		this.cropAreaTool = null;
		this.base($container, settings);
		this._postParameters = settings.postParameters;
		this._cropAction = settings.cropAction;
		this.addListener(this.$container, 'resize', $.proxy(this, '_onResize'));
		this.addListener(Garnish.$bod, 'resize', $.proxy(this, '_onResize'));
	},

	_onResize: function ()
	{
		var $img = this.$container.find('img'),
			leftDistance = parseInt(this.$container.css('left'), 10),
			topDistance = parseInt(this.$container.css('top'), 10);

		var quotient = this.originalWidth / this.originalHeight,
			leftAvailable = leftDistance - 10,
			topAvailable = topDistance - 10;

		if (leftAvailable / quotient > topAvailable)
		{
			newWidth = this.$container.width() + (topAvailable * quotient);
		}
		else
		{
			newWidth = this.$container.width() + leftAvailable;
		}
		// Set the size so that the image always fits into a constraint x constraint box
		newWidth = Math.min(newWidth, this.constraint, this.constraint * quotient, this.originalWidth);
		this.$container.width(newWidth);

		var newWidth = this.$container.width(),
			factor = newWidth / this.originalWidth,
			newHeight = this.originalHeight * factor;

		$img.height(newHeight).width(newWidth);
		this.factor = factor;
		if (this.cropAreaTool)
		{
			$img.imgAreaSelect({instance: true}).update();
		}
	},

	bindButtons: function()
	{
		this.$saveBtn = this.$container.find('.submit:first');
		this.$cancelBtn = this.$container.find('.cancel:first');
	},

	cancel: function()
	{
		this.hide();
		this.areaSelect.setOptions({remove: true, hide: true, disable: true});
		this.$container.empty();
	},

	saveImage: function()
	{
		var selection = this.areaSelect.getSelection();
		var params = {
			x1: Math.round(selection.x1 / this.factor),
			x2: Math.round(selection.x2 / this.factor),
			y1: Math.round(selection.y1 / this.factor),
			y2: Math.round(selection.y2 / this.factor),
			source: this.source
		};

		params = $.extend(this._postParameters, params);

		Craft.postActionRequest(this._cropAction, params, $.proxy(function(response, textStatus)
		{
			if (textStatus == 'success')
			{
				if (response.error)
				{
					Craft.cp.displayError(response.error);
				}
				else
				{
					this.imageHandler.onImageSave.apply(this.imageHandler, [response]);
				}
			}

			this.hide();
			this.$container.empty();
			this.areaSelect.setOptions({remove: true, hide: true, disable: true});


		}, this));

		this.areaSelect.setOptions({disable: true});
		this.removeListener(this.$saveBtn, 'click');
		this.removeListener(this.$cancelBtn, 'click');

		this.$container.find('.crop-image').fadeTo(50, 0.5);
	}

});


Craft.ImageAreaTool = Garnish.Base.extend(
{
	$container: null,

	init: function(settings)
	{
		this.$container = Craft.ImageUpload.$modalContainerDiv;
		this.setSettings(settings);
	},

	showArea: function(referenceObject)
	{
		var $target = this.$container.find('img');


		var areaOptions = {
			aspectRatio: this.settings.aspectRatio,
			maxWidth: $target.width(),
			maxHeight: $target.height(),
			instance: true,
			resizable: true,
			show: true,
			persistent: true,
			handles: true,
			parent: $target.parent(),
			classPrefix: 'imgareaselect'
		};

		var areaSelect = $target.imgAreaSelect(areaOptions);

		var x1 = this.settings.initialRectangle.x1;
		var x2 = this.settings.initialRectangle.x2;
		var y1 = this.settings.initialRectangle.y1;
		var y2 = this.settings.initialRectangle.y2;

		if (this.settings.initialRectangle.mode == "auto")
		{
			var proportions = this.settings.aspectRatio.split(":");
			var rectangleWidth = 0;
			var rectangleHeight = 0;


			// [0] - width proportion, [1] - height proportion
			if (proportions[0] > proportions[1])
			{
				rectangleWidth = $target.width();
				rectangleHeight = rectangleWidth * proportions[1] / proportions[0];
			} else if (proportions[0] > proportions[1])
			{
				rectangleHeight = $target.height();
				rectangleWidth = rectangleHeight * proportions[0] / proportions[1];
			} else {
				rectangleHeight = rectangleWidth = Math.min($target.width(), $target.height());
			}
			x1 = Math.round(($target.width() - rectangleWidth) / 2);
			y1 = Math.round(($target.height() - rectangleHeight) / 2);
			x2 = x1 + rectangleWidth;
			y2 = y1 + rectangleHeight;

		}
		areaSelect.setSelection(x1, y1, x2, y2);
		areaSelect.update();

		referenceObject.areaSelect = areaSelect;
		referenceObject.factor = $target.data('factor');
		referenceObject.originalHeight = $target.attr('height') / referenceObject.factor;
		referenceObject.originalWidth = $target.attr('width') / referenceObject.factor;
		referenceObject.constraint = $target.data('constraint');
		referenceObject.source = $target.attr('src').split('/').pop();
		referenceObject.updateSizeAndPosition();
	}
});


/**
 * Info icon class
 */
Craft.InfoIcon = Garnish.Base.extend(
{
	$icon: null,
	hud: null,

	init: function(icon)
	{
		this.$icon = $(icon);

		this.addListener(this.$icon, 'click', 'showHud');
	},

	showHud: function()
	{
		if (!this.hud)
		{
			this.hud = new Garnish.HUD(this.$icon, this.$icon.html(), {
				hudClass: 'hud info-hud'
			});
		}
		else
		{
			this.hud.show();
		}
	}
});


/**
 * Light Switch
 */
Craft.LightSwitch = Garnish.Base.extend(
{
	settings: null,
	$outerContainer: null,
	$innerContainer: null,
	$input: null,
	$toggleTarget: null,
	on: null,
	dragger: null,

	dragStartMargin: null,

	init: function(outerContainer, settings)
	{
		this.$outerContainer = $(outerContainer);

		// Is this already a lightswitch?
		if (this.$outerContainer.data('lightswitch'))
		{
			Garnish.log('Double-instantiating a lightswitch on an element');
			this.$outerContainer.data('lightswitch').destroy();
		}

		this.$outerContainer.data('lightswitch', this);

		this.setSettings(settings, Craft.LightSwitch.defaults);

		this.$innerContainer = this.$outerContainer.find('.lightswitch-container:first');
		this.$input = this.$outerContainer.find('input:first');
		this.$toggleTarget = $(this.$outerContainer.attr('data-toggle'));

		this.on = this.$outerContainer.hasClass('on');

		this.addListener(this.$outerContainer, 'mousedown', '_onMouseDown');
		this.addListener(this.$outerContainer, 'keydown', '_onKeyDown');

		this.dragger = new Garnish.BaseDrag(this.$outerContainer, {
			axis:                 Garnish.X_AXIS,
			ignoreHandleSelector: null,
			onDragStart:          $.proxy(this, '_onDragStart'),
			onDrag:               $.proxy(this, '_onDrag'),
			onDragStop:           $.proxy(this, '_onDragStop')
		});
	},

	turnOn: function()
	{
		this.$outerContainer.addClass('dragging');

		var animateCss = {};
		animateCss['margin-'+Craft.left] = 0;
		this.$innerContainer.stop().animate(animateCss, Craft.LightSwitch.animationDuration, $.proxy(this, '_onSettle'));

		this.$input.val('1');
		this.$outerContainer.addClass('on');
		this.on = true;
		this.settings.onChange();

		this.$toggleTarget.show();
		this.$toggleTarget.height('auto');
		var height = this.$toggleTarget.height();
		this.$toggleTarget.height(0);
		this.$toggleTarget.stop().animate({height: height}, Craft.LightSwitch.animationDuration, $.proxy(function() {
			this.$toggleTarget.height('auto');
		}, this));
	},

	turnOff: function()
	{
		this.$outerContainer.addClass('dragging');

		var animateCss = {};
		animateCss['margin-'+Craft.left] = Craft.LightSwitch.offMargin;
		this.$innerContainer.stop().animate(animateCss, Craft.LightSwitch.animationDuration, $.proxy(this, '_onSettle'));

		this.$input.val('');
		this.$outerContainer.removeClass('on');
		this.on = false;
		this.settings.onChange();

		this.$toggleTarget.stop().animate({height: 0}, Craft.LightSwitch.animationDuration);
	},

	toggle: function(event)
	{
		if (!this.on)
		{
			this.turnOn();
		}
		else
		{
			this.turnOff();
		}
	},

	_onMouseDown: function()
	{
		this.addListener(Garnish.$doc, 'mouseup', '_onMouseUp')
	},

	_onMouseUp: function()
	{
		this.removeListener(Garnish.$doc, 'mouseup');

		// Was this a click?
		if (!this.dragger.dragging)
			this.toggle();
	},

	_onKeyDown: function(event)
	{
		switch (event.keyCode)
		{
			case Garnish.SPACE_KEY:
			{
				this.toggle();
				event.preventDefault();
				break;
			}
			case Garnish.RIGHT_KEY:
			{
				if (Craft.orientation == 'ltr')
				{
					this.turnOn();
				}
				else
				{
					this.turnOff();
				}

				event.preventDefault();
				break;
			}
			case Garnish.LEFT_KEY:
			{
				if (Craft.orientation == 'ltr')
				{
					this.turnOff();
				}
				else
				{
					this.turnOn();
				}

				event.preventDefault();
				break;
			}
		}
	},

	_getMargin: function()
	{
		return parseInt(this.$innerContainer.css('margin-'+Craft.left))
	},

	_onDragStart: function()
	{
		this.$outerContainer.addClass('dragging');
		this.dragStartMargin = this._getMargin();
	},

	_onDrag: function()
	{
		if (Craft.orientation == 'ltr')
		{
			var margin = this.dragStartMargin + this.dragger.mouseDistX;
		}
		else
		{
			var margin = this.dragStartMargin - this.dragger.mouseDistX;
		}

		if (margin < Craft.LightSwitch.offMargin)
		{
			margin = Craft.LightSwitch.offMargin;
		}
		else if (margin > 0)
		{
			margin = 0;
		}

		this.$innerContainer.css('margin-'+Craft.left, margin);
	},

	_onDragStop: function()
	{
		var margin = this._getMargin();

		if (margin > (Craft.LightSwitch.offMargin / 2))
		{
			this.turnOn();
		}
		else
		{
			this.turnOff();
		}
	},

	_onSettle: function()
	{
		this.$outerContainer.removeClass('dragging');
	},

	destroy: function()
	{
		this.base();
		this.dragger.destroy();
	}

}, {
	offMargin: -9,
	animationDuration: 100,
	defaults: {
		onChange: $.noop
	}
});


/**
 * Pane class
 */
Craft.Pane = Garnish.Base.extend(
{
	$pane: null,
	$content: null,
	$sidebar: null,
	$sidebarBtn: null,

	tabs: null,
	selectedTab: null,
	hasSidebar: null,
	showingSidebar: null,
	peekingSidebar: null,
	fixedSidebar: null,

	init: function(pane)
	{
		this.$pane = $(pane);

		// Is this already a pane?
		if (this.$pane.data('pane'))
		{
			Garnish.log('Double-instantiating a pane on an element');
			this.$pane.data('pane').destroy();
		}

		this.$pane.data('pane', this);

		this.$content = this.$pane.find('.content:not(.hidden):first');

		// Initialize the tabs
		var $tabsContainer = this.$pane.children('.tabs'),
			$tabs = $tabsContainer.find('a')

		if ($tabs.length)
		{
			this.tabs = {};

			// Find the tabs that link to a div on the page
			for (var i = 0; i < $tabs.length; i++)
			{
				var $tab = $($tabs[i]),
					href = $tab.attr('href');

				if (href && href.charAt(0) == '#')
				{
					this.tabs[href] = {
						$tab: $tab,
						$target: $(href)
					};

					this.addListener($tab, 'activate', 'selectTab');
				}

				if (!this.selectedTab && $tab.hasClass('sel'))
				{
					this.selectedTab = href;
				}
			}

			if (document.location.hash && typeof this.tabs[document.location.hash] != 'undefined')
			{
				this.tabs[document.location.hash].$tab.trigger('activate');
			}
			else if (!this.selectedTab)
			{
				$($tabs[0]).trigger('activate');
			}
		}

		this.initContent();
	},

	/**
	 * Selects a tab.
	 */
	selectTab: function(ev)
	{
		if (!this.selectedTab || ev.currentTarget != this.tabs[this.selectedTab].$tab[0])
		{
			// Hide the selected tab
			this.deselectTab();

			var $tab = $(ev.currentTarget).addClass('sel');
			this.selectedTab = $tab.attr('href');

			var $target = this.tabs[this.selectedTab].$target;
			$target.removeClass('hidden');

			if ($target.hasClass('content'))
			{
				if (this.hasSidebar)
				{
					this.removeListener(this.$content, 'resize');
					this.removeListener(this.$sidebar, 'resize');
					this.removeListener(Garnish.$win, 'scroll resize');
				}

				this.$content = $target;
				this.initContent();
			}

			Garnish.$win.trigger('resize');
		}
	},

	/**
	 * Deselects the current tab.
	 */
	deselectTab: function()
	{
		if (this.selectedTab)
		{
			this.tabs[this.selectedTab].$tab.removeClass('sel');
			this.tabs[this.selectedTab].$target.addClass('hidden');
		}
	},

	initContent: function()
	{
		this.hasSidebar = this.$content.hasClass('has-sidebar');

		if (this.hasSidebar)
		{
			this.$sidebar = this.$content.children('.sidebar');

			this.showingSidebar = true;
			this.updateResponsiveSidebar();
			this.addListener(this.$content, 'resize', function()
			{
				this.updateResponsiveSidebar();
				this.updateSidebarStyles();
			});

			this.addListener(this.$sidebar, 'resize', 'setMinContentSizeForSidebar');
			this.setMinContentSizeForSidebar();

			this.addListener(Garnish.$win, 'scroll resize', 'updateSidebarStyles');
			this.updateSidebarStyles();
		}
	},

	updateResponsiveSidebar: function()
	{
		if (this.$content.width() + parseInt(this.$content.css('margin-'+Craft.left)) < Craft.Pane.minContentWidthForSidebar)
		{
			if (this.showingSidebar)
			{
				this.hideSidebar();
			}
		}
		else
		{
			if (!this.showingSidebar)
			{
				this.showSidebar();
			}
		}
	},

	showSidebar: function()
	{
		this.$content.removeClass('hiding-sidebar');
		this.$sidebarBtn.remove();
		this.showingSidebar = true;
		this.updateSidebarStyles();
		this.setMinContentSizeForSidebar();

		if (this.peekingSidebar)
		{
			this.stopPeeking();
		}
	},

	hideSidebar: function()
	{
		this.$content.addClass('hiding-sidebar');

		this.$sidebarBtn = $('<a class="show-sidebar" title="'+Craft.t('Show sidebar')+'"></a>').appendTo(this.$content);
		this.addListener(this.$sidebarBtn, 'click', 'togglePeekingSidebar');

		this.showingSidebar = false;
		this.setMinContentSizeForSidebar();
	},

	togglePeekingSidebar: function()
	{
		if (this.peekingSidebar)
		{
			this.stopPeeking();
		}
		else
		{
			this.startPeeking();
		}

		this.setMinContentSizeForSidebar();
	},

	startPeeking: function()
	{
		this.$content.animateLeft(194, 'fast');
		this.$sidebarBtn.addClass('showing').attr('title', Craft.t('Hide sidebar'));
		this.peekingSidebar = true;
		this.updateSidebarStyles();

		this.addListener(this.$sidebar, 'click', $.proxy(function(ev)
		{
			if (ev.target.nodeName == 'A')
			{
				this.togglePeekingSidebar();
			}
		}, this))
	},

	stopPeeking: function()
	{
		this.$content.animateLeft(0, 'fast');
		this.$sidebarBtn.removeClass('showing').attr('title', Craft.t('Show sidebar'));
		this.peekingSidebar = false;

		this.removeListener(this.$sidebar, 'click');
	},

	setMinContentSizeForSidebar: function()
	{
		if (this.showingSidebar || this.peekingSidebar)
		{
			this.setMinContentSizeForSidebar._minHeight = this.$sidebar.prop('scrollHeight') - 48;
		}
		else
		{
			this.setMinContentSizeForSidebar._minHeight = 0;
		}

		this.$content.css('min-height', this.setMinContentSizeForSidebar._minHeight);
	},

	updateSidebarStyles: function()
	{
		if (this.showingSidebar || this.peekingSidebar)
		{
			this.updateSidebarStyles._styles = {};

			this.updateSidebarStyles._scrollTop = Garnish.$win.scrollTop();
			this.updateSidebarStyles._contentOffset = this.$content.offset().top;
			this.updateSidebarStyles._contentHeight = this.$content.height() - 24;
			this.updateSidebarStyles._windowHeight = Garnish.$win.height();

			// Have we scrolled passed the top of the content div?
			if (this.updateSidebarStyles._scrollTop > this.updateSidebarStyles._contentOffset - 24)
			{
				// Set the top position to the difference
				this.updateSidebarStyles._styles.top = this.updateSidebarStyles._scrollTop - this.updateSidebarStyles._contentOffset;
			}
			else
			{
				this.updateSidebarStyles._styles.top = -24;
			}

			// Now figure out how tall the sidebar can be
			this.updateSidebarStyles._styles.maxHeight = Math.min(this.updateSidebarStyles._contentHeight - this.updateSidebarStyles._styles.top, this.updateSidebarStyles._windowHeight - 48);

			// The sidebar should be at least 100px tall if possible
			if (this.updateSidebarStyles._styles.top != 0 && this.updateSidebarStyles._styles.maxHeight < 100)
			{
				this.updateSidebarStyles.newTop = Math.max(-24, this.updateSidebarStyles._styles.top - (100 - this.updateSidebarStyles._styles.maxHeight));
				this.updateSidebarStyles._styles.maxHeight += this.updateSidebarStyles._styles.top - this.updateSidebarStyles.newTop;
				this.updateSidebarStyles._styles.top = this.updateSidebarStyles.newTop;
			}

			this.$sidebar.css(this.updateSidebarStyles._styles);
		}
	},

	destroy: function()
	{
		this.base();
		this.$pane.data('pane', null);
	}
},
{
	minContentWidthForSidebar: 514 // 320 + 194
});


/**
 * Password Input
 */
Craft.PasswordInput = Garnish.Base.extend(
{
	$passwordInput: null,
	$textInput: null,
	$currentInput: null,

	$showPasswordToggle: null,
	showingPassword: null,

	init: function(passwordInput, settings)
	{
		this.$passwordInput = $(passwordInput);
		this.settings = $.extend({}, Craft.PasswordInput.defaults, settings);

		// Is this already a password input?
		if (this.$passwordInput.data('passwordInput'))
		{
			Garnish.log('Double-instantiating a password input on an element');
			this.$passwordInput.data('passwordInput').destroy();
		}

		this.$passwordInput.data('passwordInput', this);

		this.$showPasswordToggle = $('<a/>').hide();
		this.$showPasswordToggle.addClass('password-toggle');
		this.$showPasswordToggle.insertAfter(this.$passwordInput);
		this.addListener(this.$showPasswordToggle, 'mousedown', 'onToggleMouseDown');
		this.hidePassword();
	},

	setCurrentInput: function($input)
	{
		if (this.$currentInput)
		{
			// Swap the inputs, while preventing the focus animation
			$input.addClass('focus');
			this.$currentInput.replaceWith($input);
			$input.focus();
			$input.removeClass('focus');

			// Restore the input value
			$input.val(this.$currentInput.val());
		}

		this.$currentInput = $input;

		this.addListener(this.$currentInput, 'keypress,keyup,change,blur', 'onInputChange');
	},

	updateToggleLabel: function(label)
	{
		this.$showPasswordToggle.text(label);
	},

	showPassword: function()
	{
		if (this.showingPassword)
		{
			return;
		}

		if (!this.$textInput)
		{
			this.$textInput = this.$passwordInput.clone(true);
			this.$textInput.attr('type', 'text');
		}

		this.setCurrentInput(this.$textInput);
		this.updateToggleLabel(Craft.t('Hide'));
		this.showingPassword = true;
	},

	hidePassword: function()
	{
		// showingPassword could be null, which is acceptable
		if (this.showingPassword === false)
		{
			return;
		}

		this.setCurrentInput(this.$passwordInput);
		this.updateToggleLabel(Craft.t('Show'));
		this.showingPassword = false;

		// Alt key temporarily shows the password
		this.addListener(this.$passwordInput, 'keydown', 'onKeyDown');
	},

	togglePassword: function()
	{
		if (this.showingPassword)
		{
			this.hidePassword();
		}
		else
		{
			this.showPassword();
		}

		this.settings.onToggleInput(this.$currentInput);
	},

	onKeyDown: function(ev)
	{
		if (ev.keyCode == Garnish.ALT_KEY && this.$currentInput.val())
		{
			this.showPassword();
			this.$showPasswordToggle.hide();
			this.addListener(this.$textInput, 'keyup', 'onKeyUp');
		}
	},

	onKeyUp: function(ev)
	{
		ev.preventDefault();

		if (ev.keyCode == Garnish.ALT_KEY)
		{
			this.hidePassword();
			this.$showPasswordToggle.show();
		}
	},

	onInputChange: function()
	{
		if (this.$currentInput.val())
		{
			this.$showPasswordToggle.show();
		}
		else
		{
			this.$showPasswordToggle.hide();
		}
	},

	onToggleMouseDown: function(ev)
	{
		// Prevent focus change
		ev.preventDefault();

		if (this.$currentInput[0].setSelectionRange)
		{
			var selectionStart = this.$currentInput[0].selectionStart,
				selectionEnd   = this.$currentInput[0].selectionEnd;
		}

		this.togglePassword();

		if (this.$currentInput[0].setSelectionRange)
		{
			this.$currentInput[0].setSelectionRange(selectionStart, selectionEnd);
		}
	}
},
{
	defaults: {
		onToggleInput: $.noop
	}
});


/**
 * File Manager.
 */
Craft.ProgressBar = Garnish.Base.extend(
{
    $progressBar: null,
    $innerProgressBar: null,

    _itemCount: 0,
    _processedItemCount: 0,

    init: function($element)
    {
		this.$progressBar = $('<div class="progressbar pending hidden"/>').appendTo($element);
		this.$innerProgressBar = $('<div class="progressbar-inner"/>').appendTo(this.$progressBar);

        this.resetProgressBar();
    },

    /**
     * Reset the progress bar
     */
    resetProgressBar: function()
    {
		// Since setting the progress percentage implies that there is progress to be shown
		// It removes the pending class - we must add it back.
		this.setProgressPercentage(100);
		this.$progressBar.addClass('pending');

		// Reset all the counters
		this.setItemCount(1);
        this.setProcessedItemCount(0);
    },

    /**
     * Fade to invisible, hide it using a class and reset opacity to visible
     */
    hideProgressBar: function()
    {
        this.$progressBar.fadeTo('fast', 0.01, $.proxy(function() {
            this.$progressBar.addClass('hidden').fadeTo(1, 1, $.noop);
        }, this));
    },

    showProgressBar: function()
    {
        this.$progressBar.removeClass('hidden');
    },

    setItemCount: function(count)
    {
        this._itemCount = count;
    },

    incrementItemCount: function(count)
    {
        this._itemCount += count;
    },

    setProcessedItemCount: function(count)
    {
        this._processedItemCount = count;
    },

    incrementProcessedItemCount: function(count)
    {
        this._processedItemCount += count;
    },

    updateProgressBar: function()
    {
        // Only fools would allow accidental division by zero.
        this._itemCount = Math.max(this._itemCount, 1);

        var width = Math.min(100, Math.round(100 * this._processedItemCount / this._itemCount));

        this.setProgressPercentage(width);
    },

    setProgressPercentage: function(percentage, animate)
    {
		if (percentage == 0)
		{
			this.$progressBar.addClass('pending');
		}
		else
		{
			this.$progressBar.removeClass('pending');

            if (animate)
            {
                this.$innerProgressBar.stop().animate({ width: percentage+'%' }, 'fast');
            }
            else
            {
                this.$innerProgressBar.stop().width(percentage+'%');
            }
		}
    }
});


/**
 * File Manager.
 */
Craft.PromptHandler = Garnish.Base.extend({

    $modalContainerDiv: null,
    $prompt: null,
    $promptApplyToRemainingContainer: null,
    $promptApplyToRemainingCheckbox: null,
    $promptApplyToRemainingLabel: null,
    $promptButtons: null,


    _prompts: [],
    _promptBatchCallback: $.noop,
    _promptBatchReturnData: [],
    _promptBatchNum: 0,

    init: function()
    {

    },

    resetPrompts: function()
    {
        this._prompts = [];
        this._promptBatchCallback = $.noop;
        this._promptBatchReturnData = [];
        this._promptBatchNum = 0;
    },

    addPrompt: function(prompt)
    {
        this._prompts.push(prompt);
    },

    getPromptCount: function()
    {
        return this._prompts.length;
    },

    showBatchPrompts: function(callback)
    {
        this._promptBatchCallback = callback;
        this._promptBatchReturnData = [];
        this._promptBatchNum = 0;

        this._showNextPromptInBatch();
    },

    _showNextPromptInBatch: function()
    {
        var prompt = this._prompts[this._promptBatchNum].prompt,
            remainingInBatch = this._prompts.length - (this._promptBatchNum + 1);

        this._showPrompt(prompt.message, prompt.choices, $.proxy(this, '_handleBatchPromptSelection'), remainingInBatch);
    },

    /**
     * Handles a prompt choice selection.
     *
     * @param choice
     * @param applyToRemaining
     * @private
     */
    _handleBatchPromptSelection: function(choice, applyToRemaining)
    {
        var prompt = this._prompts[this._promptBatchNum],
            remainingInBatch = this._prompts.length - (this._promptBatchNum + 1);

        // Record this choice
        var choiceData = $.extend(prompt, {choice: choice});
        this._promptBatchReturnData.push(choiceData);

        // Are there any remaining items in the batch?
        if (remainingInBatch)
        {
            // Get ready to deal with the next prompt
            this._promptBatchNum++;

            // Apply the same choice to the remaining items?
            if (applyToRemaining)
            {
                this._handleBatchPromptSelection(choice, true);
            }
            else
            {
                // Show the next prompt
                this._showNextPromptInBatch();
            }
        }
        else
        {
            // All done! Call the callback
            if (typeof this._promptBatchCallback == 'function')
            {
                this._promptBatchCallback(this._promptBatchReturnData);
            }
        }
    },

    /**
     * Show the user prompt with a given message and choices, plus an optional "Apply to remaining" checkbox.
     *
     * @param string message
     * @param array choices
     * @param function callback
     * @param int itemsToGo
     */
    _showPrompt: function(message, choices, callback, itemsToGo)
    {
        this._promptCallback = callback;

        if (this.modal == null) {
            this.modal = new Garnish.Modal({closeOtherModals: false});
        }

        if (this.$modalContainerDiv == null) {
            this.$modalContainerDiv = $('<div class="modal fitted prompt-modal"></div>').addClass().appendTo(Garnish.$bod);
        }

        this.$prompt = $('<div class="body"></div>').appendTo(this.$modalContainerDiv.empty());

        this.$promptMessage = $('<p class="prompt-msg"/>').appendTo(this.$prompt);

        $('<p>').html(Craft.t('What do you want to do?')).appendTo(this.$prompt);

        this.$promptApplyToRemainingContainer = $('<label class="assets-applytoremaining"/>').appendTo(this.$prompt).hide();
        this.$promptApplyToRemainingCheckbox = $('<input type="checkbox"/>').appendTo(this.$promptApplyToRemainingContainer);
        this.$promptApplyToRemainingLabel = $('<span/>').appendTo(this.$promptApplyToRemainingContainer);
        this.$promptButtons = $('<div class="buttons"/>').appendTo(this.$prompt);


        this.modal.setContainer(this.$modalContainerDiv);

        this.$promptMessage.html(message);

        for (var i = 0; i < choices.length; i++)
        {
            var $btn = $('<div class="btn" data-choice="'+choices[i].value+'">' + choices[i].title + '</div>');

            this.addListener($btn, 'activate', function(ev)
            {
                var choice = ev.currentTarget.getAttribute('data-choice'),
                    applyToRemaining = this.$promptApplyToRemainingCheckbox.prop('checked');

                this._selectPromptChoice(choice, applyToRemaining);
            });

            this.$promptButtons.append($btn);
        }

        if (itemsToGo)
        {
            this.$promptApplyToRemainingContainer.show();
            this.$promptApplyToRemainingLabel.html(' ' + Craft.t('Apply this to the {number} remaining conflicts?', {number: itemsToGo}));
        }

        this.modal.show();
        this.modal.removeListener(Garnish.Modal.$shade, 'click');
        this.addListener(Garnish.Modal.$shade, 'click', '_cancelPrompt');

    },

    /**
     * Handles when a user selects one of the prompt choices.
     *
     * @param choice
     * @param applyToRemaining
     * @private
     */
    _selectPromptChoice: function(choice, applyToRemaining)
    {
        this.$prompt.fadeOut('fast', $.proxy(function() {
            this.modal.hide();
            this._promptCallback(choice, applyToRemaining);
        }, this));
    },

    /**
     * Cancels the prompt.
     */
    _cancelPrompt: function()
    {
        this._selectPromptChoice('cancel', true);
    }
});

/**
 * Slug Generator
 */
Craft.SlugGenerator = Craft.BaseInputGenerator.extend(
{
	generateTargetValue: function(sourceVal)
	{
		// Remove HTML tags
		sourceVal = sourceVal.replace(/<(.*?)>/g, '');

		// Remove inner-word punctuation
		sourceVal = sourceVal.replace(/['"‘’“”\[\]\(\)\{\}:]/g, '');

		// Make it lowercase
		sourceVal = sourceVal.toLowerCase();

		// Get the "words".  Split on anything that is not a unicode letter or number.
		// Preiods are OK, too.
		var words = Craft.filterArray(XRegExp.matchChain(sourceVal, [XRegExp('[\\p{L}\\p{N}\\.]+')]));

		if (words.length)
		{
			return words.join(Craft.slugWordSeparator);
		}
		else
		{
			return '';
		}
	}
});


/**
 * Structure class
 */
Craft.Structure = Garnish.Base.extend(
{
	id: null,

	$container: null,
	state: null,
	structureDrag: null,

	/**
	 * Init
	 */
	init: function(id, container, settings)
	{
		this.id = id;
		this.$container = $(container);
		this.setSettings(settings, Craft.Structure.defaults);

		// Is this already a structure?
		if (this.$container.data('structure'))
		{
			Garnish.log('Double-instantiating a structure on an element');
			this.$container.data('structure').destroy();
		}

		this.$container.data('structure', this);

		this.state = {};

		if (this.settings.storageKey)
		{
			$.extend(this.state, Craft.getLocalStorage(this.settings.storageKey, {}));
		}

		if (typeof this.state.collapsedElementIds == 'undefined')
		{
			this.state.collapsedElementIds = [];
		}

		var $parents = this.$container.find('ul').prev('.row');

		for (var i = 0; i < $parents.length; i++)
		{
			var $row = $($parents[i]),
				$li = $row.parent(),
				$toggle = $('<div class="toggle" title="'+Craft.t('Show/hide children')+'"/>').prependTo($row);

			if ($.inArray($row.children('.element').data('id'), this.state.collapsedElementIds) != -1)
			{
				$li.addClass('collapsed');
			}

			this.initToggle($toggle);
		}

		if (this.settings.sortable)
		{
			this.structureDrag = new Craft.StructureDrag(this, this.settings.maxLevels);
		}

		if (this.settings.newChildUrl)
		{
			this.initNewChildMenus(this.$container.find('.add'));
		}
	},

	initToggle: function($toggle)
	{
		$toggle.click($.proxy(function(ev)
		{
			var $li = $(ev.currentTarget).closest('li'),
				elementId = $li.children('.row').find('.element:first').data('id'),
				viewStateKey = $.inArray(elementId, this.state.collapsedElementIds);

			if ($li.hasClass('collapsed'))
			{
				$li.removeClass('collapsed');

				if (viewStateKey != -1)
				{
					this.state.collapsedElementIds.splice(viewStateKey, 1);
				}
			}
			else
			{
				$li.addClass('collapsed');

				if (viewStateKey == -1)
				{
					this.state.collapsedElementIds.push(elementId);
				}
			}

			if (this.settings.storageKey)
			{
				Craft.setLocalStorage(this.settings.storageKey, this.state);
			}

		}, this));
	},

	initNewChildMenus: function($addBtns)
	{
		this.addListener($addBtns, 'click', 'onNewChildMenuClick');
	},

	onNewChildMenuClick: function(ev)
	{
		var $btn = $(ev.currentTarget);

		if (!$btn.data('menubtn'))
		{
			var elementId = $btn.parent().children('.element').data('id'),
				newChildUrl = Craft.getUrl(this.settings.newChildUrl, 'parentId='+elementId),
				$menu = $('<div class="menu"><ul><li><a href="'+newChildUrl+'">'+Craft.t('New child')+'</a></li></ul></div>').insertAfter($btn);

			var menuBtn = new Garnish.MenuBtn($btn);
			menuBtn.showMenu();
		}
	},

	getIndent: function(level)
	{
		return Craft.Structure.baseIndent + (level-1) * Craft.Structure.nestedIndent;
	},

	addElement: function($element)
	{
		var $li = $('<li data-level="1"/>').appendTo(this.$container),
			$row = $('<div class="row" style="margin-'+Craft.left+': -'+Craft.Structure.baseIndent+'px; padding-'+Craft.left+': '+Craft.Structure.baseIndent+'px;">').appendTo($li);

		$row.append($element);

		if (this.settings.sortable)
		{
			$row.append('<a class="move icon" title="'+Craft.t('Move')+'"></a>');
			this.structureDrag.addItems($li);
		}

		if (this.settings.newChildUrl)
		{
			var $addBtn = $('<a class="add icon" title="'+Craft.t('New Child')+'"></a>').appendTo($row);
			this.initNewChildMenus($addBtn);
		}

		$row.css('margin-bottom', -30);
		$row.animate({ 'margin-bottom': 0 }, 'fast');
	},

	removeElement: function($element)
	{
		var $li = $element.parent().parent();

		if (this.settings.sortable)
		{
			this.structureDrag.removeItems($li);
		}

		if (!$li.siblings().length)
		{
			var $parentUl = $li.parent();
		}

		$li.css('visibility', 'hidden').animate({ marginBottom: -$li.height() }, 'fast', $.proxy(function()
		{
			$li.remove();

			if (typeof $parentUl != 'undefined')
			{
				this._removeUl($parentUl);
			}
		}, this));
	},

	_removeUl: function($ul)
	{
		$ul.siblings('.row').children('.toggle').remove();
		$ul.remove();
	}
},
{
	baseIndent: 8,
	nestedIndent: 35,

	defaults: {
		storageKey:  null,
		sortable:    false,
		newChildUrl: null,
		maxLevels:   null
	}
});


/**
 * Structure drag class
 */
Craft.StructureDrag = Garnish.Drag.extend(
{
	structure: null,
	maxLevels: null,
	draggeeLevel: null,

	$helperLi: null,
	$targets: null,
	draggeeHeight: null,

	init: function(structure, maxLevels)
	{
		this.structure = structure;
		this.maxLevels = maxLevels;

		this.$insertion = $('<li class="draginsertion"/>');

		var $items = this.structure.$container.find('li');

		this.base($items, {
			handle: '.element:first, .move:first',
			helper: $.proxy(this, 'getHelper')
		});
	},

	getHelper: function($helper)
	{
		this.$helperLi = $helper;
		var $ul = $('<ul class="structure draghelper"/>').append($helper);
		$helper.css('padding-'+Craft.left, this.$draggee.css('padding-'+Craft.left));
		$helper.find('.move').removeAttr('title');
		return $ul;
	},

	onDragStart: function()
	{
		this.$targets = $();

		// Recursively find each of the targets, in the order they appear to be in
		this.findTargets(this.structure.$container);

		// How deep does the rabbit hole go?
		this.draggeeLevel = 0;
		var $level = this.$draggee;
		do {
			this.draggeeLevel++;
			$level = $level.find('> ul > li');
		} while($level.length);

		// Collapse the draggee
		this.draggeeHeight = this.$draggee.height();
		this.$draggee.animate({
			height: 0
		}, 'fast', $.proxy(function() {
			this.$draggee.addClass('hidden');
		}, this));
		this.base();

		this.addListener(Garnish.$doc, 'keydown', function(ev)
		{
			if (ev.keyCode == Garnish.ESC_KEY)
			{
				this.cancelDrag();
			}
		});
	},

	findTargets: function($ul)
	{
		var $lis = $ul.children().not(this.$draggee);

		for (var i = 0; i < $lis.length; i++)
		{
			var $li = $($lis[i]);
			this.$targets = this.$targets.add($li.children('.row'));

			if (!$li.hasClass('collapsed'))
			{
				this.findTargets($li.children('ul'));
			}
		}
	},

	onDrag: function()
	{
		if (this._.$closestTarget)
		{
			this._.$closestTarget.removeClass('draghover');
			this.$insertion.remove();
		}

		// First let's find the closest target
		this._.$closestTarget = null;
		this._.closestTargetPos = null;
		this._.closestTargetYDiff = null;
		this._.closestTargetOffset = null;
		this._.closestTargetHeight = null;

		for (this._.i = 0; this._.i < this.$targets.length; this._.i++)
		{
			this._.$target = $(this.$targets[this._.i]);
			this._.targetOffset = this._.$target.offset();
			this._.targetHeight = this._.$target.outerHeight();
			this._.targetYMidpoint = this._.targetOffset.top + (this._.targetHeight / 2);
			this._.targetYDiff = Math.abs(this.mouseY - this._.targetYMidpoint);

			if (this._.i == 0 || (this.mouseY >= this._.targetOffset.top + 5 && this._.targetYDiff < this._.closestTargetYDiff))
			{
				this._.$closestTarget = this._.$target;
				this._.closestTargetPos = this._.i;
				this._.closestTargetYDiff = this._.targetYDiff;
				this._.closestTargetOffset = this._.targetOffset;
				this._.closestTargetHeight = this._.targetHeight;
			}
			else
			{
				// Getting colder
				break;
			}
		}

		if (!this._.$closestTarget)
		{
			return;
		}

		// Are we hovering above the first row?
		if (this._.closestTargetPos == 0 && this.mouseY < this._.closestTargetOffset.top + 5)
		{
			this.$insertion.prependTo(this.structure.$container);
		}
		else
		{
			this._.$closestTargetLi = this._.$closestTarget.parent();
			this._.closestTargetLevel = this._.$closestTargetLi.data('level');

			// Is there a next row?
			if (this._.closestTargetPos < this.$targets.length - 1)
			{
				this._.$nextTargetLi = $(this.$targets[this._.closestTargetPos+1]).parent();
				this._.nextTargetLevel = this._.$nextTargetLi.data('level');
			}
			else
			{
				this._.$nextTargetLi = null;
				this._.nextTargetLevel = null;
			}

			// Are we hovering between this row and the next one?
			this._.hoveringBetweenRows = (this.mouseY >= this._.closestTargetOffset.top + this._.closestTargetHeight - 5);

			/**
			 * Scenario 1: Both rows have the same level.
			 *
			 *     * Row 1
			 *     ----------------------
			 *     * Row 2
			 */

			if (this._.$nextTargetLi && this._.nextTargetLevel == this._.closestTargetLevel)
			{
				if (this._.hoveringBetweenRows)
				{
					if (!this.maxLevels || this.maxLevels >= (this._.closestTargetLevel + this.draggeeLevel - 1))
					{
						// Position the insertion after the closest target
						this.$insertion.insertAfter(this._.$closestTargetLi);
					}

				}
				else
				{
					if (!this.maxLevels || this.maxLevels >= (this._.closestTargetLevel + this.draggeeLevel))
					{
						this._.$closestTarget.addClass('draghover');
					}
				}
			}

			/**
			 * Scenario 2: Next row is a child of this one.
			 *
			 *     * Row 1
			 *     ----------------------
			 *         * Row 2
			 */

			else if (this._.$nextTargetLi && this._.nextTargetLevel > this._.closestTargetLevel)
			{
				if (!this.maxLevels || this.maxLevels >= (this._.nextTargetLevel + this.draggeeLevel - 1))
				{
					if (this._.hoveringBetweenRows)
					{
						// Position the insertion as the first child of the closest target
						this.$insertion.insertBefore(this._.$nextTargetLi);
					}
					else
					{
						this._.$closestTarget.addClass('draghover');
						this.$insertion.appendTo(this._.$closestTargetLi.children('ul'));
					}
				}
			}

			/**
			 * Scenario 3: Next row is a child of a parent node, or there is no next row.
			 *
			 *         * Row 1
			 *     ----------------------
			 *     * Row 2
			 */

			else
			{
				if (this._.hoveringBetweenRows)
				{
					// Determine which <li> to position the insertion after
					this._.draggeeX = this.mouseX - this.targetItemMouseDiffX;

					if (Craft.orientation == 'rtl')
					{
						this._.draggeeX += this.$helperLi.width();
					}

					this._.$parentLis = this._.$closestTarget.parentsUntil(this.structure.$container, 'li');
					this._.$closestParentLi = null;
					this._.closestParentLiXDiff = null;
					this._.closestParentLevel = null;

					for (this._.i = 0; this._.i < this._.$parentLis.length; this._.i++)
					{
						this._.$parentLi = $(this._.$parentLis[this._.i]);
						this._.parentLiX = this._.$parentLi.offset().left;

						if (Craft.orientation == 'rtl')
						{
							this._.parentLiX += this._.$parentLi.width();
						}

						this._.parentLiXDiff = Math.abs(this._.parentLiX - this._.draggeeX);
						this._.parentLevel = this._.$parentLi.data('level');

						if ((!this.maxLevels || this.maxLevels >= (this._.parentLevel + this.draggeeLevel - 1)) && (
							!this._.$closestParentLi || (
								this._.parentLiXDiff < this._.closestParentLiXDiff &&
								(!this._.$nextTargetLi || this._.parentLevel >= this._.nextTargetLevel)
							)
						))
						{
							this._.$closestParentLi = this._.$parentLi;
							this._.closestParentLiXDiff = this._.parentLiXDiff;
							this._.closestParentLevel = this._.parentLevel;
						}
					}

					if (this._.$closestParentLi)
					{
						this.$insertion.insertAfter(this._.$closestParentLi);
					}
				}
				else
				{
					if (!this.maxLevels || this.maxLevels >= (this._.closestTargetLevel + this.draggeeLevel))
					{
						this._.$closestTarget.addClass('draghover');
					}
				}
			}
		}
	},

	cancelDrag: function()
	{
		this.$insertion.remove();

		if (this._.$closestTarget)
		{
			this._.$closestTarget.removeClass('draghover');
		}

		this.onMouseUp();
	},

	onDragStop: function()
	{
		// Are we repositioning the draggee?
		if (this._.$closestTarget && (this.$insertion.parent().length || this._.$closestTarget.hasClass('draghover')))
		{
			// Are we about to leave the draggee's original parent childless?
			if (!this.$draggee.siblings().length)
			{
				var $draggeeParent = this.$draggee.parent();
			}
			else
			{
				var $draggeeParent = null;
			}

			if (this.$insertion.parent().length)
			{
				// Make sure the insertion isn't right next to the draggee
				var $closestSiblings = this.$insertion.next().add(this.$insertion.prev());

				if ($.inArray(this.$draggee[0], $closestSiblings) == -1)
				{
					this.$insertion.replaceWith(this.$draggee);
					var moved = true;
				}
				else
				{
					this.$insertion.remove();
					var moved = false;
				}
			}
			else
			{
				var $ul = this._.$closestTargetLi.children('ul');

				// Make sure this is a different parent than the draggee's
				if (!$draggeeParent || !$ul.length || $ul[0] != $draggeeParent[0])
				{
					if (!$ul.length)
					{
						var $toggle = $('<div class="toggle" title="'+Craft.t('Show/hide children')+'"/>').prependTo(this._.$closestTarget);
						this.structure.initToggle($toggle);

						$ul = $('<ul>').appendTo(this._.$closestTargetLi);
					}
					else if (this._.$closestTargetLi.hasClass('collapsed'))
					{
						this._.$closestTarget.children('.toggle').trigger('click');
					}

					this.$draggee.appendTo($ul);
					var moved = true;
				}
				else
				{
					var moved = false;
				}
			}

			// Remove the class either way
			this._.$closestTarget.removeClass('draghover');

			if (moved)
			{
				// Now deal with the now-childless parent
				if ($draggeeParent)
				{
					this.structure._removeUl($draggeeParent);
				}

				// Has the level changed?
				var newLevel = this.$draggee.parentsUntil(this.structure.$container, 'li').length + 1;

				if (newLevel != this.$draggee.data('level'))
				{
					// Correct the helper's padding if moving to/from level 1
					if (this.$draggee.data('level') == 1)
					{
						var animateCss = {};
						animateCss['padding-'+Craft.left] = 38;
						this.$helperLi.animate(animateCss, 'fast');
					}
					else if (newLevel == 1)
					{
						var animateCss = {};
						animateCss['padding-'+Craft.left] = Craft.Structure.baseIndent;
						this.$helperLi.animate(animateCss, 'fast');
					}

					this.setLevel(this.$draggee, newLevel);
				}

				// Make it real
				var data = {
					structureId: this.structure.id,
					elementId:   this.$draggee.children('.row').children('.element').data('id'),
					prevId:      this.$draggee.prev().children('.row').children('.element').data('id'),
					parentId:    this.$draggee.parent('ul').parent('li').children('.row').children('.element').data('id')
				};

				Craft.postActionRequest('structures/moveElement', data, function(response, textStatus)
				{
					if (textStatus == 'success')
					{
						Craft.cp.displayNotice(Craft.t('New order saved.'));
					}

				});
			}
		}

		// Animate things back into place
		this.$draggee.stop().removeClass('hidden').animate({
			height: this.draggeeHeight
		}, 'fast', $.proxy(function() {
			this.$draggee.css('height', 'auto');
		}, this));

		this.returnHelpersToDraggees();

		this.base();
	},

	setLevel: function($li, level)
	{
		$li.data('level', level);

		var indent = this.structure.getIndent(level);

		var css = {};
		css['margin-'+Craft.left] = '-'+indent+'px';
		css['padding-'+Craft.left] = indent+'px';
		this.$draggee.children('.row').css(css);

		var $childLis = $li.children('ul').children();

		for (var i = 0; i < $childLis.length; i++)
		{
			this.setLevel($($childLis[i]), level+1);
		}
	}

});


/**
 * Tag select input
 */
Craft.TagSelectInput = Craft.BaseElementSelectInput.extend(
{
	id: null,
	name: null,
	tagGroupId: null,
	sourceElementId: null,
	elementSort: null,
	searchTimeout: null,
	searchMenu: null,

	$container: null,
	$elementsContainer: null,
	$elements: null,
	$addTagInput: null,
	$spinner: null,

	init: function(id, name, tagGroupId, sourceElementId)
	{
		this.id = id;
		this.name = name;
		this.tagGroupId = tagGroupId;
		this.sourceElementId = sourceElementId;

		this.$container = $('#'+this.id);
		this.$elementsContainer = this.$container.children('.elements');
		this.$elements = this.$elementsContainer.children();
		this.$addTagInput = this.$container.children('.add').children('.text');
		this.$spinner = this.$addTagInput.next();

		this.totalElements = this.$elements.length;

		this.elementSelect = new Garnish.Select(this.$elements, {
			multi: true,
			filter: ':not(.delete)'
		});

		this.elementSort = new Garnish.DragSort({
			container: this.$elementsContainer,
			filter: $.proxy(function() {
				return this.elementSelect.getSelectedItems();
			}, this),
			caboose: $('<div class="caboose"/>'),
			onSortChange: $.proxy(function() {
				this.elementSelect.resetItemOrder();
			}, this)
		});

		this.initElements(this.$elements);

		this.addListener(this.$addTagInput, 'textchange', $.proxy(function()
		{
			if (this.searchTimeout)
			{
				clearTimeout(this.searchTimeout);
			}

			this.searchTimeout = setTimeout($.proxy(this, 'searchForTags'), 500);
		}, this));

		this.addListener(this.$addTagInput, 'keypress', function(ev)
		{
			if (ev.keyCode == Garnish.RETURN_KEY)
			{
				ev.preventDefault();

				if (this.searchMenu)
				{
					this.selectTag(this.searchMenu.$options[0]);
				}
			}
		});

		this.addListener(this.$addTagInput, 'focus', function()
		{
			if (this.searchMenu)
			{
				this.searchMenu.show();
			}
		});

		this.addListener(this.$addTagInput, 'blur', function()
		{
			setTimeout($.proxy(function()
			{
				if (this.searchMenu)
				{
					this.searchMenu.hide();
				}
			}, this), 1);
		});
	},

	searchForTags: function()
	{
		if (this.searchMenu)
		{
			this.killSearchMenu();
		}

		var val = this.$addTagInput.val();

		if (val)
		{
			this.$spinner.removeClass('hidden');

			var excludeIds = [];

			for (var i = 0; i < this.$elements.length; i++)
			{
				var id = $(this.$elements[i]).data('id');

				if (id)
				{
					excludeIds.push(id);
				}
			}

			if (this.sourceElementId)
			{
				excludeIds.push(this.sourceElementId);
			}

			var data = {
				search:     this.$addTagInput.val(),
				tagGroupId: this.tagGroupId,
				excludeIds: excludeIds
			};

			Craft.postActionRequest('tags/searchForTags', data, $.proxy(function(response, textStatus)
			{
				this.$spinner.addClass('hidden');

				if (textStatus == 'success')
				{
					var $menu = $('<div class="menu tagmenu"/>').appendTo(Garnish.$bod),
						$ul = $('<ul/>').appendTo($menu);

					for (var i = 0; i < response.tags.length; i++)
					{
						var $li = $('<li/>').appendTo($ul);
						$('<a data-icon="tag"/>').appendTo($li).text(response.tags[i].name).data('id', response.tags[i].id);
					}

					if (!response.exactMatch)
					{
						var $li = $('<li/>').appendTo($ul);
						$('<a data-icon="+"/>').appendTo($li).text(data.search);
					}

					$ul.find('> li:first-child > a').addClass('hover');

					this.searchMenu = new Garnish.Menu($menu, {
						attachToElement: this.$addTagInput,
						onOptionSelect: $.proxy(this, 'selectTag')
					});

					this.searchMenu.show();
				}

			}, this));
		}
		else
		{
			this.$spinner.addClass('hidden');
		}
	},

	selectTag: function(option)
	{
		var $option = $(option),
			id = $option.data('id'),
			name = $option.text();

		var $element = $('<div class="element removable" data-id="'+id+'" data-editable="1"/>').appendTo(this.$elementsContainer),
			$input = $('<input type="hidden" name="'+this.name+'[]" value="'+id+'"/>').appendTo($element)

		$('<a class="delete icon" title="'+Craft.t('Remove')+'"></a>').appendTo($element);
		$('<span class="label">'+name+'</span>').appendTo($element);

		var margin = -($element.outerWidth()+10);
		this.$addTagInput.css('margin-'+Craft.left, margin+'px');

		var animateCss = {};
		animateCss['margin-'+Craft.left] = 0;
		this.$addTagInput.animate(animateCss, 'fast');

		this.$elements = this.$elements.add($element);
		this.totalElements++;

		this.initElements($element);

		this.killSearchMenu();
		this.$addTagInput.val('');
		this.$addTagInput.focus();

		if (!id)
		{
			// We need to create the tag first
			$element.addClass('loading disabled');

			var data = {
				groupId: this.tagGroupId,
				name: name
			};

			Craft.postActionRequest('tags/createTag', data, $.proxy(function(response, textStatus)
			{
				if (textStatus == 'success' && response.success)
				{
					$element.attr('data-id', response.id);
					$input.val(response.id);

					$element.removeClass('loading disabled');
				}
				else
				{
					this.removeElement($element);

					if (textStatus == 'success')
					{
						// Some sort of validation error that still resulted in  a 200 response. Shouldn't be possible though.
						Craft.cp.displayError(Craft.t('An unknown error occurred.'));
					}
				}
			}, this));
		}
	},

	killSearchMenu: function()
	{
		this.searchMenu.hide();
		this.searchMenu.destroy();
		this.searchMenu = null;
	}

});


/**
 * Craft Upgrade Modal
 */
Craft.UpgradeModal = Garnish.Modal.extend(
{
	$container: null,
	$body: null,
	$compareScreen: null,
	$checkoutScreen: null,
	$successScreen: null,

	$checkoutForm: null,
	$checkoutLogo: null,
	$checkoutPrice: null,
	$checkoutSubmitBtn: null,
	$checkoutSpinner: null,
	$checkoutFormError: null,
	$checkoutSecure: null,
	clearCheckoutFormTimeout: null,
	$ccNameInput: null,
	$ccNumInput: null,
	$ccMonthInput: null,
	$ccYearInput: null,
	$ccCvcInput: null,
	submittingPurchase: false,

	editions: null,
	edition: null,

	init: function(settings)
	{
		this.$container = $('<div id="upgrademodal" class="modal loading"/>').appendTo(Garnish.$bod),

		this.base(this.$container, $.extend({
			resizable: true
		}, settings));

		Craft.postActionRequest('app/getUpgradeModal', $.proxy(function(response, textStatus)
		{
			this.$container.removeClass('loading');

			if (textStatus == 'success')
			{
				if (response.success)
				{
					this.editions = response.editions;

					this.$container.append(response.modalHtml);

					this.$compareScreen     = this.$container.children('#upgrademodal-compare');
					this.$checkoutScreen    = this.$container.children('#upgrademodal-checkout');
					this.$successScreen     = this.$container.children('#upgrademodal-success');

					this.$checkoutLogo      = this.$checkoutScreen.find('.logo:first');
					this.$checkoutPrice     = this.$checkoutScreen.find('.price:first');
					this.$checkoutForm      = this.$checkoutScreen.find('form:first');
					this.$checkoutSubmitBtn = this.$checkoutForm.find('.submit:first');
					this.$checkoutSpinner   = this.$checkoutForm.find('.spinner:first');
					this.$ccNameInput       = this.$checkoutForm.find('#cc-name');
					this.$ccNumInput        = this.$checkoutForm.find('#cc-num');
					this.$ccMonthInput      = this.$checkoutForm.find('#cc-month');
					this.$ccYearInput       = this.$checkoutForm.find('#cc-year');
					this.$ccCvcInput        = this.$checkoutForm.find('#cc-cvc');
					this.$checkoutSecure    = this.$checkoutScreen.find('.secure:first');

					var $buyBtns = this.$compareScreen.find('.buybtn');
					this.addListener($buyBtns, 'click', 'onBuyBtnClick');

					var $testBtns = this.$compareScreen.find('.btn.test');
					this.addListener($testBtns, 'click', 'onTestBtnClick');

					this.addListener(this.$checkoutForm, 'submit', 'submitPurchase');

					var $cancelCheckoutBtn = this.$checkoutScreen.find('#upgrademodal-cancelcheckout');
					this.addListener($cancelCheckoutBtn, 'click', 'cancelCheckout');
				}
				else
				{
					if (response.error)
					{
						var error = response.error;
					}
					else
					{
						var error = Craft.t('An unknown error occurred.');
					}

					this.$container.append('<div class="body">'+error+'</div>');
				}

				// Include Stripe.js
				$('<script type="text/javascript" src="https://js.stripe.com/v1/"></script>').appendTo(Garnish.$bod);
			}
		}, this));
	},

	onHide: function()
	{
		this.clearCheckoutFormInABit();
		this.base();
	},

	onBuyBtnClick: function(ev)
	{
		var $btn = $(ev.currentTarget);
		this.edition = $btn.data('edition');

		var editionInfo = this.editions[this.edition],
			width = this.getWidth();

		switch (this.edition)
		{
			case 1:
			{
				this.$checkoutLogo.attr('class', 'logo craftclient').text('Craft Client');
				break;
			}
			case 2:
			{
				this.$checkoutLogo.attr('class', 'logo craftpro').text('Craft Pro');
				break;
			}
		}

		if (editionInfo.salePrice)
		{
			this.$checkoutPrice.html('<span class="listedprice">'+editionInfo.formattedPrice+'</span> '+editionInfo.formattedSalePrice);
		}
		else
		{
			this.$checkoutPrice.html(editionInfo.formattedPrice);
		}

		if (this.clearCheckoutFormTimeout)
		{
			clearTimeout(this.clearCheckoutFormTimeout);
		}

		this.$compareScreen.stop().animateLeft(-width, 'fast', $.proxy(function()
		{
			this.$compareScreen.addClass('hidden');
		}, this));

		this.$checkoutScreen.stop().css(Craft.left, width).removeClass('hidden').animateLeft(0, 'fast');
	},

	onTestBtnClick: function(ev)
	{
		var data = {
			edition: $(ev.currentTarget).data('edition')
		};

		Craft.postActionRequest('app/testUpgrade', data, $.proxy(function(response, textStatus)
		{
			if (textStatus == 'success')
			{
				var width = this.getWidth();

				this.$compareScreen.stop().animateLeft(-width, 'fast', $.proxy(function()
				{
					this.$compareScreen.addClass('hidden');
				}, this));

				this.onUpgrade();
			}
		}, this));
	},

	cancelCheckout: function()
	{
		var width = this.getWidth();

		this.$compareScreen.stop().removeClass('hidden').animateLeft(0, 'fast');
		this.$checkoutScreen.stop().animateLeft(width, 'fast', $.proxy(function()
		{
			this.$checkoutScreen.addClass('hidden');
		}, this))

		this.clearCheckoutFormInABit();
	},

	submitPurchase: function(ev)
	{
		ev.preventDefault();

		if (this.submittingPurchase)
		{
			return;
		}

		this.cleanupCheckoutForm();

		var pkg = ev.data.pkg;

		// Get the CC data
		var ccData = {
			name:      this.$ccNameInput.val(),
		    number:    this.$ccNumInput.val(),
		    exp_month: this.$ccMonthInput.val(),
		    exp_year:  this.$ccYearInput.val(),
		    cvc:       this.$ccCvcInput.val()
		};

		// Validate it
		var validates = true;

		if (!ccData.name)
		{
			validates = false;
			this.$ccNameInput.addClass('error');
		}

		if (!Stripe.validateCardNumber(ccData.number))
		{
			validates = false;
			this.$ccNumInput.addClass('error');
		}

		if (!Stripe.validateExpiry(ccData.exp_month, ccData.exp_year))
		{
			validates = false;
			this.$ccMonthInput.addClass('error');
			this.$ccYearInput.addClass('error');
		}

		if (!Stripe.validateCVC(ccData.cvc))
		{
			validates = false;
			this.$ccCvcInput.addClass('error');
		}

		if (validates)
		{
			this.submittingPurchase = true;

			// Get a CC token from Stripe.js
			this.$checkoutSubmitBtn.addClass('active');
			this.$checkoutSpinner.removeClass('hidden');

			Stripe.setPublishableKey(Craft.UpgradeModal.stripeApiKey);
			Stripe.createToken(ccData, $.proxy(function(status, response)
			{
				if (!response.error)
				{
					// Pass the token along to Elliott to charge the card
					var data = {
						ccTokenId:     response.id,
						edition:       this.edition,
						expectedPrice: (this.editions[this.edition].salePrice ? this.editions[this.edition].salePrice : this.editions[this.edition].price)
					};

					Craft.postActionRequest('app/purchaseUpgrade', data, $.proxy(this, 'onPurchaseUpgrade'));
				}
				else
				{
					this.onPurchaseResponse();
					this.showError(response.error.message);
					Garnish.shake(this.$checkoutForm, 'left');
				}
			}, this));
		}
		else
		{
			Garnish.shake(this.$checkoutForm, 'left');
		}
	},

	onPurchaseResponse: function()
	{
		this.submittingPurchase = false;
		this.$checkoutSubmitBtn.removeClass('active');
		this.$checkoutSpinner.addClass('hidden');
	},

	onPurchaseUpgrade: function(response, textStatus)
	{
		this.onPurchaseResponse();

		if (textStatus == 'success')
		{
			if (response.success)
			{
				var width = this.getWidth();

				this.$checkoutScreen.stop().animateLeft(-width, 'fast', $.proxy(function()
				{
					this.$checkoutScreen.addClass('hidden');
				}, this));

				this.onUpgrade();
			}
			else
			{
				if (response.errors)
				{
					var errorText = '';

					for (var i in response.errors)
					{
						if (errorText)
						{
							errorText += '<br>';
						}

						errorText += response.errors[i];
					}

					this.showError(errorText);
				}
				else
				{
					var errorText = Craft.t('An unknown error occurred.');
				}

				Garnish.shake(this.$checkoutForm, 'left');
			}
		}
	},

	showError: function(error)
	{
		this.$checkoutFormError = $('<p class="error centeralign">'+error+'</p>').insertBefore(this.$checkoutSecure);
	},

	onUpgrade: function()
	{
		this.$successScreen.css(Craft.left, this.getWidth()).removeClass('hidden').animateLeft(0, 'fast');

		var $refreshBtn = this.$successScreen.find('.btn:first');
		this.addListener($refreshBtn, 'click', function()
		{
			location.reload();
		});

		this.trigger('upgrade');
	},

	cleanupCheckoutForm: function()
	{
		this.$checkoutForm.find('.error').removeClass('error');

		if (this.$checkoutFormError)
		{
			this.$checkoutFormError.remove();
			this.$checkoutFormError = null;
		}
	},

	clearCheckoutForm: function()
	{
		this.$ccNameInput.val('');
	    this.$ccNumInput.val('');
	    this.$ccMonthInput.val('');
	    this.$ccYearInput.val('');
	    this.$ccCvcInput.val('');
	},

	clearCheckoutFormInABit: function()
	{
		// Clear the CC info after a period of inactivity
		this.clearCheckoutFormTimeout = setTimeout(
			$.proxy(this, 'clearCheckoutForm'),
			Craft.UpgradeModal.clearCheckoutFormTimeoutDuration
		);
	}
},
{
	stripeApiKey: 'pk_J2nJpozDxit0V6wYuT8xSvCKArONs',
	clearCheckoutFormTimeoutDuration: 30000 // 1000 x 60 x 5
});


/**
 * File Manager.
 */
Craft.Uploader = Garnish.Base.extend(
{
    uploader: null,
	allowedKinds: null,
	_rejectedFiles: [],
	$element: null,
	_extensionList: null,
	_fileCounter: 0,

    init: function($element, settings)
    {
		this._rejectedFiles = [];
		this.$element = $element;
		this.allowedKinds = null;
		this._extensionList = null;
		this._fileCounter = 0;

        settings = $.extend({}, this.defaultSettings, settings);

		var events = settings.events;
		delete settings.events;

		if ( settings.allowedKinds && settings.allowedKinds.length)
		{
			if (typeof settings.allowedKinds == "string")
			{
				settings.allowedKinds = [settings.allowedKinds];
			}

			this.allowedKinds = settings.allowedKinds;
			delete settings.allowedKinds;
			settings.autoUpload = false;
		}

		this.uploader = $element.fileupload(settings);
		for (var event in events)
		{
			this.uploader.on(event, events[event]);
		}

		if (settings.dropZone != null)
		{
			$(document).bind('drop dragover', function(e)
			{
				e.preventDefault();
			});
		}

		if (this.allowedKinds)
		{
			this.uploader.on('fileuploadadd', $.proxy(this, 'onFileAdd'));
		}
	},

    /**
     * Set uploader parameters
     * @param paramObject
     */
    setParams: function(paramObject)
    {
        this.uploader.fileupload('option', {formData: paramObject});
    },

    /**
     * Get the number of uploads in progress
     * @returns {*}
     */
    getInProgress: function()
    {
        return this.uploader.fileupload('active');
    },

	/**
	 * Return true, if this is the last upload
	 * @returns {boolean}
	 */
	isLastUpload: function()
	{
		return this.getInProgress() == 1;
	},

	/**
	 * Called on file add
	 */
	onFileAdd: function(e, data)
	{
		e.stopPropagation();

		if (!this._extensionList)
		{
			this._extensionList = [];

			for (var i = 0; i < this.allowedKinds.length; i++)
			{
				var allowedKind = this.allowedKinds[i];

				for (var j = 0; j < Craft.fileKinds[allowedKind].length; j++)
				{
					var ext = Craft.fileKinds[allowedKind][j];
					this._extensionList.push(ext);
				}
			}
		}

		data.process().done($.proxy(function()
		{
			var file = data.files[0];
			var matches = file.name.match(/\.([a-z0-4_]+)$/i);
			var fileExtension = matches[1];
			if ($.inArray(fileExtension.toLowerCase(), this._extensionList) > -1)
			{
				data.submit();
			}
			else
			{
				this._rejectedFiles.push('"' + file.name + '"');
			}

			if (++this._fileCounter == data.originalFiles.length)
			{
				this._fileCounter = 0;
				this.processErrorMessages();
			}

		}, this));

		return true;
	},

	processErrorMessages: function()
	{
		if (this._rejectedFiles.length)
		{
			if (this._rejectedFiles.length == 1)
			{
				var str = "The file {files} could not be uploaded. The allowed file kinds are: {kinds}.";
			}
			else
			{
				var str = "The files {files} could not be uploaded. The allowed file kinds are: {kinds}.";
			}

			str = Craft.t(str, {files: this._rejectedFiles.join(", "), kinds: this.allowedKinds.join(", ")});
			this._rejectedFiles = [];
			alert(str);
		}
	},

    defaultSettings: {
        dropZone: null,
		pasteZone: null,
		fileInput: null,
		autoUpload: true,
		sequentialUploads: true,
		maxFileSize: Craft.maxUploadSize,
		alloweKinds: null,
		events: {}
	}
});


Craft.WrongEditionModal = Garnish.Modal.extend(
{
	upgradeModal: null,

	init: function($container)
	{
		this.base($container.removeClass('hidden'));

		this.$switchBtn = $('#wrongedition-switchbtn');
		this.$upgradeBtn = $('#wrongedition-upgradebtn');

		this.addListener(this.$switchBtn, 'click', 'switchToLicensedEdition');
		this.addListener(this.$upgradeBtn, 'click', 'showUpgradeModal');
	},

	show: function()
	{
		this.base();

		// Can't get out of this one
		this.removeAllListeners(this.$shade);
		Garnish.escManager.unregister(this);
	},

	switchToLicensedEdition: function()
	{
		this.$switchBtn.addClass('disabled');
		this.$upgradeBtn.addClass('disabled');

		this.removeAllListeners(this.$switchBtn);
		this.removeAllListeners(this.$upgradeBtn);

		Craft.postActionRequest('app/switchToLicensedEdition', $.proxy(function(response, textStatus)
		{
			location.reload();
		}, this))
	},

	showUpgradeModal: function()
	{
		if (!this.upgradeModal)
		{
			this.upgradeModal = new Craft.UpgradeModal({
				closeOtherModals: false
			});

			this.upgradeModal.on('upgrade', $.proxy(function()
			{
				this.hide();
			}, this));
		}
		else
		{
			this.upgradeModal.show();
		}
	}
});


})(jQuery);
