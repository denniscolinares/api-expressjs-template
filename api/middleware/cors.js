"use strict";

const config = require('../../config/config');
const _ = require('lodash');

module.exports = (req, res, next) => {
	
	const headers = {
		"Access-Control-Allow-Origin" : `${req.protocol}://${config.application.cmsDomain}`,
		"Access-Control-Allow-Methods" : config.headers.cors.methods.join(),
		"Access-Control-Allow-Headers" : config.headers.cors.allowedHeaders.join(),
		"Access-Control-Allow-Credentials" : config.headers.cors.credentials,
		"Access-Control-Max-Age" : config.headers.cors.maxAge
	};
	
	let originHost = (req.get("Origin") || "").split("//");
	
	if(config.headers.cors.allowAll){
		headers["Access-Control-Allow-Origin"] = "*";
		headers["Access-Control-Allow-Credentials"] = "false";
	}
	else{
		if (_.isArray(config.headers.cors.whitelist) && originHost.length === 2) {
			if (config.headers.cors.whitelist.includes(originHost[1]) === true) {
				headers["Access-Control-Allow-Origin"] = `${req.protocol}://${originHost[1]}`;
				res.vary("Origin");
			}
		}
	}
	
	res.set(headers);
	
	if (req.method === 'OPTIONS') {
		res.send(200);
	}
	else {
		next();
	}
};