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
	var self = this;

	console.log('Fetching projects');
	$.ajax({
		url: this.redmine_site+'/projects.json',
		data: {
			key: this.redmine_key,
			limit: 100,
		}
	}).done(function(data) {
		self.projects = data.projects;
		console.debug(self.projects);

		self.on_project_fetched();
	});
};

// TODO: Use jQuery on/trigger mecanism
Application.prototype.on_project_fetched = function() {
	var projects = $.map(this.projects, function(item) {
		return item.name;
	});

	$('#project').inlineComplete({
		terms: projects
	});
};

Application.prototype.fetch_project_tracker = function(identifier) {
	var self = this;

	console.log('Fetching project trackers');
	$.ajax({
		url: this.redmine_site+'/projects/'+identifier+'.json',
		data: {
			key: this.redmine_key,
			include: 'trackers'
		}
	}).done(function(data) {
		self.trackers = data.project.trackers;
		console.info(self.trackers);

		self.on_project_tracker_fetched();
	});
};

// TODO: Use jQuery on/trigger mecanism
Application.prototype.on_project_tracker_fetched = function() {
	var trackers = $.map(this.trackers, function(item) {
		return item.name;
	});

	$('#tracker').inlineComplete({
		terms: trackers
	});
};

Application.prototype.submit_issue = function(project, tracker, subject, description) {
	console.log('Submitting new issue');

	var issue = {
		project_id: project.id,
		tracker_id: tracker.id,
		subject: subject,
		description: description,
	};

	console.log(issue);

	if (isNaN(issue.project_id) || isNaN(issue.tracker_id)) {
		console.error('Cannot submit issue with no project_id or tracker_id');
		return;
	}

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

		if (event.keyCode === 27 && in_node_webkit) {
			gui.Window.get().show();
		}
		// TODO: Move this out of application?
		$('#subject').val('');
		$('#description').val('');
	}).fail(function() {
		console.error('There was an error while submitting the issue');
		$('#message').addClass('alert alert-danger').html('Error T_T');
	}).complete(function() {
		$('#loading').addClass('hidden');
		$('#pin').removeClass('hidden');
	});
};

Application.prototype.find_project_from_name = function(name) {
	return lodash.find(this.projects, { 'name': name });
}

Application.prototype.find_tracker_from_name = function(name) {
	return lodash.find(this.trackers, { 'name': name });
}