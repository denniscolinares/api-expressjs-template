'use strict';

const appRoot = require('app-root-path');
const winston = require('winston');
const moment = require('moment-timezone');

// define the custom settings for each transport (file, console)
const options = {
	file : {
		level : 'info',
		filename : `${appRoot}/logs/system.log`,
		handleExceptions : true,
		json : true,
		maxsize : 100242880,
		maxFiles : 1,
		colorize : false,
	},
	console : {
		level : 'debug',
		format : winston.format.combine(
				winston.format.timestamp({
					format : 'ddd, DD MMM YYYY HH:mm:ss ZZ'
				}),
				winston.format.printf(info => `${moment(info.timestamp).tz(process.env.APP_TIMEZONE)} ${info.level}: ${info.message}`)
		),
		handleExceptions : true,
		json : false,
		colorize : true,
	}
};

// instantiate a new Winston Logger with the settings defined above
const logger = winston.createLogger({
	format : winston.format.combine(
			winston.format.timestamp({
				format : 'ddd, DD MMM YYYY HH:mm:ss ZZ'
			}),
			winston.format.printf(info => `${moment(info.timestamp).tz(process.env.APP_TIMEZONE)} ${info.level}: ${info.message}`)
	),
	transports : [
		new winston.transports.File(options.file),
		new winston.transports.Console(options.console)
	],
	exitOnError : false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
	write : function(message, encoding) {
		// use the 'info' log level so the output will be picked up by both transports (file and console)
		logger.info(message);
	},
};

module.exports = logger;
