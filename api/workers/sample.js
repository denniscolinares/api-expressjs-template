'use strict';

const models = require('../models/index').sql;
const _ = require('lodash');
const Promise = require("bluebird");
const moment = require('moment');
const winston = require('../../library/winston');

const sampleFunction = function(event, context, cb){
	
	return {event};
};

module.exports.sample = sampleFunction;
