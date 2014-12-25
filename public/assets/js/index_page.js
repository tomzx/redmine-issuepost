var gkm = require('gkm');

var application = new Application();
var configuration_window = null;

var CurrentWindow = function() {
	this.window = gui.Window.get();
	this.visible = true;
};

CurrentWindow.prototype.show = function() {
	this.visible = true;
	this.window.show(this.visible);
}

CurrentWindow.prototype.hide = function() {
	this.visible = false;
	this.window.show(this.visible);
};

CurrentWindow.prototype.toggle = function() {
	this.visible = !this.visible;
	this.window.show(this.visible);
}

CurrentWindow.prototype.focus = function() {
	this.window.focus();
}

var openConfigWindow = function() {
	if (in_node_webkit) {
		if (configuration_window === null) {
			console.log('Opening configuration window');
			configuration_window = gui.Window.open('configuration.html', {
				width: 500,
				height: 100,
				resizable: false,
				toolbar: false,
				frame: false,
				focus: true,
			});

			configuration_window.on('closed', function() {
				console.log('Closing configuration window');
				configuration_window = null;
				application.refresh_config();
				application.fetch_projects();
			});
		} else {
			configuration_window.focus();
		}
	}
};

$(document).ready(function() {
	$('#subject').focus();

	application.on('projects:fetched', function(data) {
		var projects_name = $.map(data.projects, function(item) {
			return item.name;
		});

		$('#project').inlineComplete({
			terms: projects_name
		});
	});

	application.on('trackers:fetched', function(data) {
		var trackers_name = $.map(data.trackers, function(item) {
			return item.name;
		});

		$('#tracker').inlineComplete({
			terms: trackers_name
		});
	});

	application.fetch_projects();

	$('#main-form').submit(function(event) {
		event.preventDefault();

		var project = application.find_project_from_name($('#project').val());
		var tracker = application.find_tracker_from_name($('#tracker').val());
		var subject = $('#subject').val();
		var description = $('#description').val();
		application.submit_issue(project, tracker, subject, description);
	});

	$('#project').blur(function() {
		var $this = $(this);

		var project = application.find_project_from_name($this.val());

		if (project) {
			application.fetch_project_trackers(project.identifier);
		}
	});

	$('#config').click(function() {
		openConfigWindow();
	});

	// cmd + enter = submit
	$('form').keydown(function(event) {
		var windowsCommand = event.keyCode === 13 && event.ctrlKey;
		var macCommand = event.keyCode === 13 && event.metaKey;
		if (windowsCommand || macCommand) {
			$(this).submit();
			return false;
		}
	});

	// esc
	$(window).keydown(function(event) {
		if (event.keyCode === 27 && in_node_webkit) {
			current_window.hide();
		}
	});

	// Autogrow textarea
	$('textarea').autogrow({
		update: function() {
			if (in_node_webkit) {
				gui.Window.get().height = $('body').height() + $('footer').outerHeight() + 10;
			}
		}
	});

	// Blur
	/*if (in_node_webkit) {
		gui.Window.get().on('blur', function() {
			this.hide();
			windowVisible = false;
		});
	}*/
});

//==============================================================================

(function($)
{
	/**
	 * Auto-growing textareas; technique ripped from Facebook
	 *
	 * http://github.com/jaz303/jquery-grab-bag/tree/master/javascripts/jquery.autogrow-textarea.js
	 */
	$.fn.autogrow = function(options)
	{
		return this.filter('textarea').each(function() {
			var self         = this;
			var $self        = $(self);
			var minHeight    = $self.height();
			var noFlickerPad = $self.hasClass('autogrow-short') ? 0 : parseInt($self.css('lineHeight')) || 0;
			var onUpdate     = options['update'] || (function() {});

			var shadow = $('<div></div>').css({
				position:    'absolute',
				top:         -10000,
				left:        -10000,
				width:       $self.width(),
				fontSize:    $self.css('fontSize'),
				fontFamily:  $self.css('fontFamily'),
				fontWeight:  $self.css('fontWeight'),
				lineHeight:  $self.css('lineHeight'),
				resize:      'none',
				'word-wrap': 'break-word'
			}).appendTo(document.body);

			var update = function(event)
			{
				var times = function(string, number)
				{
					for (var i=0, r=''; i<number; i++) r += string;
					return r;
				};

				var val = self.value.replace(/</g, '&lt;')
									.replace(/>/g, '&gt;')
									.replace(/&/g, '&amp;')
									.replace(/\n$/, '<br/>&nbsp;')
									.replace(/\n/g, '<br/>')
									.replace(/ {2,}/g, function(space){ return times('&nbsp;', space.length - 1) + ' ' });

				// Did enter get pressed?  Resize in this keydown event so that the flicker doesn't occur.
				if (event && event.data && event.data.event === 'keydown' && event.keyCode === 13) {
					val += '<br />';
				}

				shadow.css('width', $self.width());
				shadow.html(val + (noFlickerPad === 0 ? '...' : '')); // Append '...' to resize pre-emptively.
				$self.height(Math.max(shadow.height() + noFlickerPad, minHeight));

				onUpdate();
			}

			$self.change(update).keyup(update).keydown({event:'keydown'},update);
			$(window).resize(update);

			update();
		});
	};
})(jQuery);

// Setup tray/menu

var current_window = new CurrentWindow();

if (in_node_webkit) {
	var tray = new gui.Tray({ icon: 'assets/images/tray_icon.png' });

	var menu = new gui.Menu();
	menu.append(new gui.MenuItem({ label: 'Settings', click: function() {
		openConfigWindow();
	}}));
	menu.append(new gui.MenuItem({ type: 'separator' }));
	menu.append(new gui.MenuItem({ label: 'Exit', click: function() {
		gui.App.quit();
	}}));

	tray.menu = menu;

	tray.on('click', function() {
		current_window.show();
		current_window.focus();
	});
}
