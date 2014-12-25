var Configuration = {};

Configuration.configuration_file = 'config.json';

Configuration.load = function() {
	if (!fs.existsSync(this.configuration_file)) {
		this.data = {};
	} else {
		var data = fs.readFileSync(this.configuration_file, {encoding: 'utf8'});
		this.data = JSON.parse(data);
	}
	return this.data;
};

Configuration.save = function(redmine_site, redmine_key) {
	var data = {
		redmine_site: redmine_site,
		redmine_key: redmine_key,
	};

	if (this.data && this.data.redmine_key === data.redmine_key && this.data.redmine_site === data.redmine_site) {
		console.log('same!');
		return;
	}

	fs.writeFileSync(this.configuration_file, JSON.stringify(data, null, "\t"));
};