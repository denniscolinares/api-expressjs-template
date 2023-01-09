'use strict';

const models = require('../models/index').dynamodb;
const _ = require('lodash');
const Promise = require("bluebird");
const moment = require('moment');

const HomeController = {
	index : function(req, res, next) {	
		res.success();
	}
};

module.exports = {
	HomeController
};
