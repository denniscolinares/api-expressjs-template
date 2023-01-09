'use strict';

const config = require('../config/config');
const axios = require('axios');
const _ = require('lodash');
const Promise = require("bluebird");

const http = axios.create({
	baseURL : "https://translation.googleapis.com/language/translate/v2/",
	responseType : "json",
	responseEncoding : "utf8",
	headers : {
		"Content-Type" : "application/json",
		"Referer" : `https://${config.application.cmsDomain}`
	}
});

const google = {
	translate : function(data) {
		const translateData = {
					q : data.text,
					source : data.sourceLang,
					target : data.targetLang,
					format : "text",
					key : config.google.api.key
				},
				opt = {
					method : "post",
					params : translateData
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

module.exports = google;
