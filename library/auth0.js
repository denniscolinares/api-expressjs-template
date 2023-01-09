'use strict';

const config = require('../config/config');
const axios = require('axios');
const _ = require('lodash');
const Promise = require("bluebird");
const bcrypt = require('bcryptjs');

const http = axios.create({
	baseURL : `https://${config.sso.domain}/`,
	responseType : "json",
	responseEncoding : "utf8",
	headers : {
		"Content-Type" : "application/json"
	}
});

const auth0 = {
	getOpenIDConfig : function() {
		const opt = {
					url : "/.well-known/openid-configuration",
					method : "get"
				};
		
		let request = async function() {
			return await http(opt)
					.then((resp) => {
						return resp.data;
					})
					.catch((err) => {
						return err.response.data;
					});
		};
		
		return request();
	},
	getJWKS : function() {
		const opt = {
			url : "/.well-known/jwks.json",
			method : "get"
		};
		
		let request = async function() {
			return await http(opt)
					.then((resp) => {
						return resp.data;
					})
					.catch((err) => {
						return err.response.data;
					});
		};
		
		return request();
	},
	getToken : function(data) {
		const authDataDefault = {
					client_id : config.sso.clientId,
					client_secret : config.sso.secretKey,
					audience : config.sso.audience,
					grant_type : "password",
					scope : config.sso.scope,
					username : "",
					password : ""
				},
				authData = _.assign(authDataDefault, data),
				opt = {
					url : "/oauth/token",
					method : "post",
					data : authData
				};
		
		let request = async function() {
			return await http(opt)
					.then((resp) => {
						return resp.data;
					})
					.catch((err) => {
						return err.response.data;
					});
		};
		
		return request();
	},
	refreshToken : function(refreshToken) {
		const authData = {
					client_id : config.sso.clientId,
					client_secret : config.sso.secretKey,
					audience : config.sso.audience,
					grant_type : "refresh_token",
					scope : config.sso.scope,
					refresh_token : refreshToken
				},
				opt = {
					url : "/oauth/token",
					method : "post",
					data : authData
				};
		
		let request = async function() {
			return await http(opt)
					.then((resp) => {
						return resp.data;
					})
					.catch((err) => {
						return err.response.data;
					});
		};
		
		return request();
	},
	revokeToken : function(refreshToken) {
		const authData = {
					client_id : config.sso.clientId,
					client_secret : config.sso.secretKey,
					token : refreshToken
				},
				opt = {
					url : "/oauth/revoke",
					method : "post",
					data : authData
				};
		
		let request = async function() {
			return await http(opt)
					.then((resp) => {
						return resp.status.data;
					})
					.catch((err) => {
						return err.response.data;
					});
		};
		
		return request();
	},
	changePassword : function(data) {
		const authDataDefault = {
					client_id : config.sso.clientId,
					connection : config.sso.connection,
					email : "",
					password : ""
				},
				authData = _.assign(authDataDefault, data),
				opt = {
					url : "/dbconnections/change_password",
					method : "post",
					data : authData
				};
		
		let request = async function() {
			return await http(opt)
					.then((resp) => {
						return resp.data;
					})
					.catch((err) => {
						return err.response.data;
					});
		};
		
		return request();
	},
	createUser : function(data) {
		const authDataDefault = {
					client_id : config.sso.clientId,
					connection : config.sso.connection,
					email : "",
					password : "",
					user_metadata : {}
				},
				authData = _.assign(authDataDefault, data),
				opt = {
					url : "/dbconnections/signup",
					method : "post",
					data : authData
				};
		
		let request = async function() {
			return await http(opt)
					.then((resp) => {
						return resp.data;
					})
					.catch((err) => {
						return err.response.data;
					});
		};
		
		return request();
	}
};

module.exports = auth0;
