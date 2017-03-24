/**
 * http://usejsdoc.org/
 */
var log4js = require('log4js');
var logger = log4js.getLogger('Account');
var moment = require('moment')

function Account() {
	logger.debug('create Account')
};

// Constructor
function Account(id, code, company, _profiles, _traders) {
	this.id = id;
	this.code = code;
	this.company = company;

	this.profiles = _profiles;
	this.profiles.sort();
	this.profiles = [];
	if (_profiles) {
		for (i=0; i<_profiles.length; i++) {
			this.profiles.push(_profiles[i].id);
		}
		try {
			this.profiles.sort();
		}
		catch (err) {}
	}
	this.traders = [];
	if (_traders) {
		for (i=0; i<_traders.length; i++) {
			this.traders.push(_traders[i].name);
		}
		try {
			this.traders.sort();
		}
		catch (err) {}
	}
};

Account.prototype.json = function() {
	data = {
		'Id' : 		this.id,
		'Code' : 	this.code,
		'Company': 	this.company, 
		'Profiles': this.profiles,
		'Traders': this.traders,
	};
	return data;
}

// export the class
module.exports = Account;