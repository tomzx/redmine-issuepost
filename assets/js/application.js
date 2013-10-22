// TODO: Multi site support
// TODO: Caching for most remote data (prepopulate on first connect then update every X or forced)
// TODO: Support pagination

var Application = function() {
	console.log('Booting up application');
	this.refresh_config();
	this.projects = [];
	this.trackers = [];
}

Application.prototype.refresh_config = function() {
	console.log('Refreshing configuration');
	var data = Configuration.load();
	this.redmine_site = data ? data.redmine_site : null;
	this.redmine_key = data ? data.redmine_key : null;
};

Application.prototype.fetch_projects = function() {
	console.log('Fetching projects');
	$.ajax({
		url: this.redmine_site+'/projects.json',
		data: {
			key: this.redmine_key,
			limit: 100,
		}
	}).done(function(data) {
		var $select = $('#project_id');

		$select.empty().append($('<option>'));

		$.each(data.projects, function() {
			$select.append($('<option>', { value: this.id }).text(this.name));
		});

		$select.trigger('chosen:updated');

		this.projects = data.projects;
		console.debug(this.projects);
	});
};

Application.prototype.fetch_project_tracker = function(identifier) {
	console.log('Fetching project trackers');
	$.ajax({
		url: this.redmine_site+'/projects/'+identifier+'.json',
		data: {
			key: this.redmine_key,
			include: 'trackers'
		}
	}).done(function(data) {
		var $select = $('#tracker_id');

		$select.empty().append($('<option>'));

		$.each(data.project.trackers, function() {
			$select.append($('<option>', { value: this.id }).text(this.name));
		});

		$select.trigger('chosen:updated');

		this.trackers = data.project.trackers;
		console.info(this.trackers);
	});
};

Application.prototype.submit_issue = function(project_id, tracker_id, subject, description) {
	console.log('Submitting new issue');

	var issue = {
		project_id: project_id,
		tracker_id: tracker_id,
		subject: subject,
		description: description,
	};

	console.log(issue);

	$('#pin').addClass('hidden');
	$('#loading').removeClass('hidden');

	$.ajax({
		type: 'POST',
		url: this.redmine_site+'/issues.json',
		data: {
			key: this.redmine_key,
			issue: issue,
		}
	}).done(function() {
		console.log('Issue successfully submitted!');
		//$('#message').addClass('alert alert-success').html('Success :D');

		if (event.keyCode === 27 && in_node_webkit) {
			gui.Window.get().show();
		}
	}).fail(function() {
		console.warn('There was an error while submitting the issue');
		$('#message').addClass('alert alert-danger').html('Error T_T');
	}).complete(function() {
		$('#loading').addClass('hidden');
		$('#pin').removeClass('hidden');
	});
};