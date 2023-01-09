'use strict';

const _ = require('lodash');

module.exports = function (value) {
	const res = this;
	
	res.type('application/json')
			.status(200)
			.json({
				"status" : "error",
				"code" : 200,
				"messages" : value || ''
			});
};