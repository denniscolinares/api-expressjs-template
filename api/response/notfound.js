'use strict';

const _ = require('lodash');

module.exports = function (value) {
	const res = this;
	
	res.type('application/json')
			.status(404)
			.json({
				"status" : "Not Found",
				"code" : 404,
				"messages" : value || "The requested URL was not found on this server"
			});
};