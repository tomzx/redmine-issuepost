// TODO: Multi site support
// TODO: Caching for most remote data (prepopulate on first connect then update every X or forced)
// TODO: Support pagination

var in_node_webkit = (typeof require === 'function');

if (in_node_webkit) {
	var lodash = require('lodash');
	var gui = require('nw.gui');

	var tray = new gui.Tray({ icon: 'assets/images/tray_icon.png' });

	tray.on('click', function() {
		gui.Window.get().show();
	});


	var hot_key = new gui.HotKey({
	  key: "Alt+R",
	  activated: function() {
	    console.log("activated");
	  },
	  failed: function(msg) {
	    console.log(msg);
	  }
	});

	gui.App.registerGlobalHotKey(hot_key);
}

var projects = [];
var fetch_projects = function() {
	$.ajax({
		url: redmine_site+'/projects.json',
		data: {
			key: redmine_key,
			limit: 100,
		}
	}).done(function(data) {
		var $select = $('#project_id');

		$select.empty().append($('<option>'));

		$.each(data.projects, function() {
			$select.append($('<option>', { value: this.id }).text(this.name));
		});

		$select.trigger('chosen:updated');

		projects = data.projects;
	});
};

var fetch_project_tracker = function(identifier) {
	$.ajax({
		url: redmine_site+'/projects/'+identifier+'.json',
		data: {
			key: redmine_key,
			include: 'trackers'
		}
	}).done(function(data) {
		var $select = $('#tracker_id');

		$select.empty().append($('<option>'));

		$.each(data.project.trackers, function() {
			$select.append($('<option>', { value: this.id }).text(this.name));
		});

		$select.trigger('chosen:updated');
	});
};

var submit_issue = function(project_id, tracker_id, subject, description) {
	$('#pin').addClass('hidden');
	$('#loading').removeClass('hidden');

	$.ajax({
		type: 'POST',
		url: redmine_site+'/issues.json',
		data: {
			key: redmine_key,
			issue: {
				project_id: project_id,
				tracker_id: tracker_id,
				subject: subject,
				description: description,
			}
		}
	}).done(function() {
		//$('#message').addClass('alert alert-success').html('Success :D');

		if (event.keyCode === 27 && in_node_webkit) {
			gui.Window.get().show();
		}
	}).fail(function() {
		$('#message').addClass('alert alert-danger').html('Error T_T');
	}).complete(function() {
		$('#loading').addClass('hidden');
		$('#pin').removeClass('hidden');
	});
};

$(document).ready(function() {
	$('#subject').focus();

	fetch_projects();

	$('select[data-chosen]').chosen();

	$('#main-form').submit(function(event) {
		event.preventDefault();

		var project_id = parseInt($('#project_id').val(), 10);
		var tracker_id = parseInt($('#tracker_id').val(), 10);
		var subject = $('#subject').val();
		var description = $('#description').val();
		submit_issue(project_id, tracker_id, subject, description);
	});

	$('#project_id').change(function() {
		var $this = $(this);

		var project = lodash.find(projects, { 'id': parseInt($this.val(), 10) });

		if (project !== null) {
			fetch_project_tracker(project.identifier);
		}
	});


	// cmd + enter = submit
	$('form').keydown(function(event) {
		if (event.keyCode === 13 && event.metaKey) {
			$(this).submit();
			return false;
		}
	});

	// esc
	$(window).keydown(function(event) {
		if (event.keyCode === 27 && in_node_webkit) {
			gui.Window.get().hide();
		}
	});

	// Autogrow textarea
	$('textarea').autogrow();

	// Blur
	/*if (in_node_webkit) {
		gui.Window.get().on('blur', function() {
			this.hide();
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
        return this.filter('textarea').each(function(options) {
            var self         = this;
            var $self        = $(self);
            var minHeight    = $self.height();
            var noFlickerPad = $self.hasClass('autogrow-short') ? 0 : parseInt($self.css('lineHeight')) || 0;

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
            }

            $self.change(update).keyup(update).keydown({event:'keydown'},update);
            $(window).resize(update);

            update();
        });
    };
})(jQuery);