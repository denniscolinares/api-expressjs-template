'use strict';

const envConfig = require('dotenv').config();
const appRoot = require('app-root-path');
const fs = require('fs');
const winston = require('../library/winston');
const _ = require('lodash');
const pkg = require('../package.json');

const config = (env) => {
	
	let envData = {},
			defEnvData = {
				APP_NAME : env.APP_NAME || process.env.APP_NAME,
				APP_VERSION : pkg.version,
				APP_HOST_SSL : env.APP_HOST_SSL || process.env.APP_HOST_SSL,
				APP_TIMEZONE : env.APP_TIMEZONE || process.env.APP_TIMEZONE,
				APP_DEV_PORT : env.APP_DEV_PORT || process.env.APP_DEV_PORT,
				DOMAIN_BASEPATH : env.DOMAIN_BASEPATH || process.env.DOMAIN_BASEPATH,
				AWS_ACCESS_KEY_ID : env.KEYID || process.env.KEYID,
				AWS_SECRET_ACCESS_KEY : env.ACCESSKEY || process.env.ACCESSKEY,
				DB_DRIVER : env.DB_DRIVER || process.env.DB_DRIVER,
				DB_HOST : env.DB_HOST || process.env.DB_HOST,
				DB_NAME : env.DB_NAME || process.env.DB_NAME,
				DB_USERNAME : env.DB_USERNAME || process.env.DB_USERNAME,
				DB_PASSWORD : env.DB_PASSWORD || process.env.DB_PASSWORD,
				DB_PORT : env.DB_PORT || process.env.DB_PORT,
				DB_SSL : env.DB_SSL || process.env.DB_SSL,
				DB_DIALECT : env.DB_DIALECT || process.env.DB_DIALECT,
			};
	
	if (!envConfig.error) {
		envData = _.extend(defEnvData, env.parsed);
	}
	else {
		winston.debug("Environment Configuration (.env) file not found. ");
		winston.debug("Getting environment configuration from process.env. ");
	}
	
	const staging = envData.NODE_ENV || process.env.NODE_ENV;
	const enFilePath = `./env/${staging}/${staging}`;
	const path = `${appRoot.path}/config/env/${staging}/${staging}.js`;
	
	if (!fs.existsSync(path)) {
		winston.error(`Staging Configuration file not found in "${enFilePath.replace(".", "config")}"`);
		return {};
	}
	
	//Default Type of environment variables are STRING. Make sure to convert STRING to BOOLEAN
	envData.DB_MONGO_SSL = envData.DB_MONGO_SSL === "true";
	envData.DB_SSL = envData.DB_SSL === "true";
	envData.CACHE_CLUSTER = envData.CACHE_CLUSTER === "true";
	envData.APP_HOST_SSL = envData.APP_HOST_SSL === "true";
	
	//Set custom environment data
	envData.APP_ROOT = appRoot.path;
	
	return require(enFilePath)(envData);
};

module.exports = config(envConfig);
