'use strict';

const config = require('../../config/config');
const mongoose = require('mongoose').set('debug', config.database.mongodb.debug);
const Sequelize = require('sequelize');
const Squel = require("squel");
const appRoot = require('app-root-path');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const relationship = require('./relationship');
const Promise = require('bluebird');
const winston = require('../../library/winston');
const _ = require('lodash');
const dynamoose = require('dynamoose');
const moment = require('moment-timezone');

const sqlModels = function() {
	const db = {},
			modelsDir = appRoot + "/api/models/sql",
			Op = Sequelize.Op,
			operatorsAliases = {
				$eq : Op.eq,
				$ne : Op.ne,
				$gte : Op.gte,
				$gt : Op.gt,
				$lte : Op.lte,
				$lt : Op.lt,
				$not : Op.not,
				$in : Op.in,
				$notIn : Op.notIn,
				$is : Op.is,
				$like : Op.like,
				$notLike : Op.notLike,
				$iLike : Op.iLike,
				$notILike : Op.notILike,
				$regexp : Op.regexp,
				$notRegexp : Op.notRegexp,
				$iRegexp : Op.iRegexp,
				$notIRegexp : Op.notIRegexp,
				$between : Op.between,
				$notBetween : Op.notBetween,
				$overlap : Op.overlap,
				$contains : Op.contains,
				$contained : Op.contained,
				$adjacent : Op.adjacent,
				$strictLeft : Op.strictLeft,
				$strictRight : Op.strictRight,
				$noExtendRight : Op.noExtendRight,
				$noExtendLeft : Op.noExtendLeft,
				$and : Op.and,
				$or : Op.or,
				$any : Op.any,
				$all : Op.all,
				$values : Op.values,
				$col : Op.col
			},
			dbOptions = {
				dialect : config.database.rdbms.driver,
				host : config.database.rdbms.host,
				port : config.database.rdbms.port,
				username : config.database.rdbms.username,
				password : config.database.rdbms.password,
				database : config.database.rdbms.database,
				timezone : moment.tz(config.application.defaultTimezone).format("Z"),
				protocol : 'tcp',
				typeValidation : true,
				operatorsAliases : operatorsAliases
			};
	
	if (!config.database.rdbms.enabled) {
		return {};
	}
	
	/*Sequelize.cls = AWSXRay.getNamespace();*/
	
	const sequelize = new Sequelize(dbOptions);
	
	sequelize.authenticate()
			.then(() => {
				winston.debug("Database connection has been established");
			})
			.catch((err) => {
				winston.error("Database connection error: ", err);
			});
	
	fs.readdirSync(modelsDir).filter((file) => {
		return (file.indexOf(".") !== 0) && (file !== basename) && (file.slice(-3) === ".js");
	}).forEach((file) => {
		const model = sequelize.import(path.join(modelsDir, file));
		db[model.name] = model;
	});
	
	Object.keys(db).forEach((modelName) => {
		if (db[modelName].associate) {
			db[modelName].associate(db);
		}
	});
	
	db.squel = Squel.useFlavour(dbOptions.dialect);
	db.sequelize = sequelize;
	db.Sequelize = Sequelize;
	
	return relationship(db);
};

const mongodbModel = function() {
	const db = {},
			modelsDir = appRoot + "/api/models/mongodb",
			mongoSettings = {
				uri : config.database.mongodb.host,
				options : {
					auth : {
						user : config.database.mongodb.username,
						password : config.database.mongodb.password
					},
					autoIndex : false,
					dbName : config.database.mongodb.database,
					useNewUrlParser : true,
					useCreateIndex : true,
					autoReconnect : true,
					promiseLibrary : Promise,
					poolSize : 20,
					connectTimeoutMS : 10000,
					socketTimeoutMS : 28000,
					family : 4
				}
			};
	
	if (!config.database.mongodb.enabled) {
		return {};
	}
	
	mongoose.connect(mongoSettings.uri, mongoSettings.options)
			.then(() => {
				winston.debug("Mongoose default connection is open ", mongoSettings);
			})
			.catch((err) => {
				winston.error("Mongoose default connection has occured " + err + " error");
			});
	
	mongoose.pluralize(null);
	
	mongoose.connection.on("connected", () => {
		winston.debug("Mongoose default connection is open ", mongoSettings);
	});
	
	mongoose.connection.on("error", (err) => {
		winston.error("Mongoose default connection has occured " + err + " error");
	});
	
	mongoose.connection.on("disconnected", () => {
		winston.error("Mongoose default connection is disconnected");
	});
	
	fs.readdirSync(modelsDir).filter((file) => {
		return (file.indexOf(".") !== 0) && (file !== basename) && (file.slice(-3) === ".js");
	}).forEach((file) => {
		const schema = require(path.join(modelsDir, file)),
				filename = _.trim(file.replace(".js", ""), "");
		
		db[filename] = mongoose.models[filename] || mongoose.model(filename, schema(mongoose, mongoose.Schema.Types));
	});
	
	db.mongoose = mongoose;
	
	return db;
};

const dynamodbModel = function() {
	const db = {},
			modelsDir = appRoot + "/api/models/dynamodb",
			dynamoSettings = {
				region : config.database.dynamodb.region,
				options : {
					create : config.database.dynamodb.autoCreateTable,
					update : config.database.dynamodb.update,
					waitForActive : config.database.dynamodb.waitForActive,
					expires : null,
					streamOptions : {
						enabled : config.database.dynamodb.streamOptions,
						type : undefined
					},
					serverSideEncryption : config.database.dynamodb.encryption,
					defaultReturnValues : 'ALL_NEW'
				}
			};
	
	if (!config.database.dynamodb.enabled) {
		return {};
	}
	
	dynamoose.logger.providers.set(winston);
	
	dynamoose.aws.sdk.config.update({
		accessKeyId : config.amazon.accessKeyId,
		secretAccessKey : config.amazon.secretAccessKey,
		region : dynamoSettings.region
	});
	
	dynamoose.model.defaults.set({
		create : config.database.dynamodb.autoCreateTable,
		prefix : config.database.dynamodb.prefix,
		suffix : config.database.dynamodb.suffix
	});
	
	fs.readdirSync(modelsDir).filter((file) => {
		return (file.indexOf(".") !== 0) && (file !== basename) && (file.slice(-3) === ".js");
	}).forEach((file) => {
		const schema = require(path.join(modelsDir, file)),
				filename = _.trim(file.replace(".js", ""), ""),
				model = schema(dynamoose);
		
		db[filename] = dynamoose.model(model.name, model.schema, _.assignIn(dynamoSettings.options, model.options));
	});
	
	db.dynamoose = dynamoose;
	
	return db;
};

module.exports = {
	sql : sqlModels(),
	mongodb : mongodbModel(),
	dynamodb : dynamodbModel()
};
