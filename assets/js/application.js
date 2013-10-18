// TODO: Multi site support
// TODO: Caching for most remote data (prepopulate on first connect then update every X or forced)
// TODO: Support pagination

var lodash = require('lodash')

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
		$('#message').addClass('alert alert-success').html('Success :D');
	}).fail(function() {
		$('#message').addClass('alert alert-danger').html('Error T_T');
	});
}

$(document).ready(function() {
	var x= lodash.first([1,2,3,4]);
	fetch_projects();

	$('select[data-chosen]').chosen();

	$('#main-form').submit(function(event) {
		event.preventDefault();

		project_id = parseInt($('#project_id').val(), 10);
		tracker_id = parseInt($('#tracker_id').val(), 10);
		subject = $('#subject').val();
		description = $('#description').val();
		submit_issue(project_id, tracker_id, subject, description);
	});

	$('#project_id').change(function() {
		var $this = $(this);

		var project = lodash.find(projects, { 'id': parseInt($this.val(), 10) });

		if (project !== null) {
			fetch_project_tracker(project.identifier);
		}
	});
});