'use strict';

const uuid = require('../../../library/uuid');
const moment = require('moment-timezone');
const _ = require('lodash');
const config = require('../../../config/config');

module.exports = function(mongoose, DataType) {
	
	const parentSchema = new mongoose.Schema({
		pid : {
			type : DataType.String,
			trim: true,
			index : true,
			unique : true,
			default : function() {
				return uuid.v4();
			},
			get : function(v) {
				return v;
			},
			set : function(v) {
				return v || uuid.v4();
			},
			alias : "id",
			required : true
		},
		organization_id : {
			type : DataType.String,
			trim: true,
			default : "",
			required : true
		},
		date_created : {
			type : DataType.Date,
			get : function(v) {
				return moment(v).valueOf();
			}
		},
		date_updated : {
			type : DataType.Date,
			get : function(v) {
				return moment(v).valueOf();
			}
		}
	}, {
		timestamps : {
			createdAt : "date_created",
			updatedAt : "date_updated"
		},
		id : false,
		versionKey : false,
		toObject : {
			getters : true,
			virtuals : true,
			transform : function(doc, ret, options) {
				delete ret.pid;
				delete ret._id;
				return ret;
			}
		},
		toJSON : {
			getters : true,
			virtuals : true,
			transform : function(doc, ret, options) {
				delete ret.pid;
				delete ret._id;
				return ret;
			}
		}
	});
	
	return parentSchema;
};
