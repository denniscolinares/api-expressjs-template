'use strict';

const _ = require('lodash');

module.exports = function (value) {
	const res = this;
	
	res.type('application/json')
			.status(404)
			.json({
				"status" : "error",
				"code" : 403,
				"messages" : value || "You don't have permission to access / on this server."
			});
};