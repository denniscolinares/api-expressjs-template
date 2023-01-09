'use strict';

const uuid = require('../../../library/uuid');
const moment = require('moment-timezone');
const _ = require('lodash');
const config = require('../../../config/config');

module.exports = function(dynamoose) {
	
	const dynamoSchema = new dynamoose.Schema({
		ownerId : {
			type : Number,
			validate : function(v) {
				return v > 0;
			},
			hashKey : true
		},
		name : {
			type : String
		},
		age : {
			type : Number,
			index : {
				global : true,
				name : 'AgeIndex',
				project : true,
				throughput : 5
			}
		},
		all : {
			type : String,
			default : "true",
			forceDefault : true,
			index : {
				global : true,
				rangeKey : "ownerId",
				name : "AllIndex",
				project : true,
				throughput : 5
			}
		},
		createdAt : {
			type : Date
		},
		updatedAt : {
			type : Date
		}
	}, {
		throughput : {
			read : 5,
			write : 5
		},
		timestamps : true
	});
	
	const models = {
		name : "seaoil_api_serverless_template",
		schema : dynamoSchema
	};
	
	return models;
};
