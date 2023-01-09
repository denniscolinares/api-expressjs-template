'use strict';

const models = require('../models/index').dynamodb;
const _ = require('lodash');
const Promise = require("bluebird");
const moment = require('moment');

const HomeController = {
	index : function(req, res, next) {
		
		res.success();
	},
	getenvironment : function(req, res, next) {
		
		res.success({
			data : process.env
		});
	},
	getSampleData : function(req, res, next){
		
		models.sample.query('all').eq('true').all(0, 0).exec()
				.then(function(data) {
					res.success({
						totalRecords : _.size(data),
						data : data
					});
				})
				.catch((err) => {
					res.error(err);
				});
	}
};

module.exports = {
	HomeController
};
