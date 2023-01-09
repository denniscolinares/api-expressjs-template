'use strict';

const uuid = require('../../../library/uuid');
const moment = require('moment');
const config = require('../../../config/config');
const _ = require('lodash');

module.exports = function (sequelize, DataTypes) {
	const sample = sequelize.define("sample", {
		id : {
			type : DataTypes.UUIDV4,
			allowNull : false,
			defaultValue: uuid.v4(),
			validate: {
				isUUID: 4
			},
			primaryKey : true
		},
		organization_id : {
			type : DataTypes.UUIDV4,
			allowNull : false,
			validate: {
				isUUID: 4
			},
			references : {
				model : "organizations",
				key : "id"
			}
		},
		date_created : {
			type : DataTypes.DATE,
			allowNull : false,
			defaultValue : sequelize.literal("CURRENT_TIMESTAMP"),
			get() {
				return moment(this.getDataValue("date_created")).valueOf();
			}
		},
		date_updated : {
			type : DataTypes.DATE,
			allowNull : false,
			defaultValue : sequelize.literal("CURRENT_TIMESTAMP"),
			get() {
				return moment(this.getDataValue("date_updated")).valueOf();
			}
		}
	}, {
		timestamps : true,
		underscored : true,
		createdAt : 'date_created',
		updatedAt : 'date_updated',
		tableName : "sample"
	});
	
	sample.beforeBulkCreate((data, opt) => {
		for(var i=0; i < data.length; i++){
			data[i].dataValues.id = uuid.v4();
		}
	});
	
	sample.beforeCreate((data, options) => {
		data.dataValues.id = uuid.v4();
	});
	
	sample.beforeUpdate((data, options) => {
		
	});
	
	return sample;
};
