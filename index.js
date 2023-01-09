'use strict';

/*
* Third Party Libraries
* */
require('dotenv').config();

const compression = require('compression');
const cookieParser = require('cookie-parser');
const session = require("express-session");
const redis = require('ioredis');
const redisStore = require('connect-redis')(session);
const createError = require('http-errors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const moment = require('moment');
const pkg = require('./package');

/*
* Define properties of a GLOBAL Object
* */
Object.defineProperty(global, '$', {
	configurable : false,
	enumerable : false,
	writable : true,
	value : {}
});

global.$ = {
	config : {},
	db : {
		sql : {},
		nosql : {}
	}
};

Object.defineProperty(global, 'express', {
	configurable : false,
	enumerable : false,
	writable : true,
	value : {}
});

global.express = require('express');

Object.defineProperty(global, 'app', {
	configurable : false,
	enumerable : false,
	writable : true,
	value : {}
});

global.app = express();

/*
* Application Files
* 
* */
const bin = require('./bin/system');
const config = require('./config/config');
const winston = require('./library/winston');
const cors = require('./api/middleware/cors');

require('moment-timezone').tz.setDefault(config.application.defaultTimezone);

/*
* Initialize ExpressJS APP
* */
app.set('env', process.env.NODE_ENV || 'production');
app.set('etag', 'strong');
app.set('query parser', 'extended');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.enable('strict routing');
app.disable('x-powered-by');
app.locals.config = config;
bin.loadCustomResponse(express);

/*
* Initialize Middleware Dependencies
* */
app.set('trust proxy', 1);
app.use(cors);
app.use(helmet());

/*
* Security Headers
* */
app.use(
	helmet.referrerPolicy({
		policy: ["no-referrer", "strict-origin-when-cross-origin"],
	})
);
app.use(
	helmet.expectCt({
		maxAge: 86400,
		enforce: true,
	})
);
app.use(
	helmet.hsts({
		maxAge: 2592000,
		includeSubDomains: true,
		preload: true,
	})
);
app.use((req, res, next) => {
	const permissionPolicyValues = [
		"accelerometer=(self)",
		"autoplay=(self)",
		"camera=(self)",
		"cross-origin-isolated=(self)",
		"display-capture=(self)",
		"document-domain=(self)",
		"encrypted-media=(self)",
		"fullscreen=(self)",
		"geolocation=(self)",
		"gyroscope=(self)",
		"keyboard-map=(self)",
		"magnetometer=(self)",
		"microphone=(self)",
		"midi=(self)",
		"payment=(self)",
		"picture-in-picture=(self)",
		"publickey-credentials-get=(self)",
		"screen-wake-lock=(self)",
		"sync-xhr=(self)",
		"usb=(self)",
		"xr-spatial-tracking=(self)",
		"clipboard-read=(self)",
		"clipboard-write=(self)",
		"hid=(self)",
		"serial=(self)",
		"window-placement=(self)",
	];

	res.header("Permissions-Policy", permissionPolicyValues.join(", "));
	
	next();
});

app.use(compression());
app.use(cookieParser());

const checkRedisCluster = (cacheConfig) => {
	
	if (cacheConfig.database.cache.cluster === true) {
		return new redis.Cluster([
			{
				host : cacheConfig.database.cache.host,
				port : cacheConfig.database.cache.port
			}
		], {
			scaleReads : 'all',
			redisOption : {
				disable_resubscribing : false,
				maxRetriesPerRequest : 16
			},
			maxRedirections : 16,
			clusterRetryStrategy : (times) => {
				return Math.min(times * 50, 1000);
			}
		});
	}
	
	return redis.createClient({
		host : config.database.cache.host,
		port : config.database.cache.port,
		disable_resubscribing : false,
		maxRetriesPerRequest : 16,
		retryStrategy : (times) => {
			return Math.min(times * 50, 1000);
		}
	});
};

/*
app.use(session({
	secret : config.session.secretKey,
	proxy : config.session.proxy,
	saveUninitialized : false,
	resave : true,
	rolling : true,
	cookie : {
		domain : config.cookies.domain,
		path : config.cookies.path,
		secure : config.cookies.secure,
		httpOnly : config.cookies.httpOnly,
		maxAge : config.cookies.maxAge,
		sameSite : config.cookies.sameSite
	},
	store : new redisStore({
		prefix : config.session.prefix,
		host : config.database.cache.host,
		port : config.database.cache.port,
		ttl : config.session.ttl,
		db : config.session.db,
		logErrors : true,
		client : checkRedisCluster(config)
	})
}));
*/

app.use(express.json());

app.use(express.urlencoded({
	extended : true,
	inflate : true,
	limt : "100kb",
	parameterLimit : 1000,
	type : "application/x-www-form-urlencoded"
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('combined', {stream : winston.stream}));

const basePath = "/" + (process.env.DOMAIN_BASEPATH || "");
app.use(basePath, bin.loadRoutes(express));

app.use(function(err, req, res, next) {
	res.notfound(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

app.use(function(err, req, res, next) {
	res.notfound(err);
});

process.on('exit', function() {
	winston.debug("ExpressJS Shutdown");
});

process.on('uncaughtException', function(err) {
	winston.debug(err);
});

process.on('SIGINT', function() {
	process.exit(0);
});

winston.debug(`Starting server (${app.get('env')})`);
winston.debug("Domain basePath = {{URL}}" + basePath);

if (process.env.NODE_ENV !== "production") {
	app.listen(process.env.APP_DEV_PORT);
	winston.debug("Development server started at PORT : " + process.env.APP_DEV_PORT);
}

module.exports.http = app;
