'use strict';

const _ = require('lodash');

module.exports = function(data) {
	const res = this,
			defaultObj = {
				status : "ok",
				code : 200,
				messages : 'success',
				totalRecords : 0,
				data : []
			},
			resObj = _.assign(defaultObj, data);
	
	if(!_.has(data, "totalRecords")){
		delete resObj.totalRecords;
	}
	
	resObj.data = resObj.data || [];
	
	res.type('application/json')
			.status(200)
			.json(resObj);
};