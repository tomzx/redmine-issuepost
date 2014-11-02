$(document).ready(function() {
	// esc
	$(window).keydown(function(event) {
		if (event.keyCode === 27 && in_node_webkit) {
			Configuration.save($('#redmine_site').val(), $('#redmine_key').val());
			gui.Window.get().close();
		}
	});

	var configuration = Configuration.load();

	$('#redmine_site').val(configuration.redmine_site);
	$('#redmine_key').val(configuration.redmine_key);
});