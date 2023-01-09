'use strict';

const fs = require('fs');
const path = require('path');
const appRoot = require('app-root-path');

module.exports = {
	loadCustomResponse : function(express) {
		const responseDir = appRoot + "/api/response";
		
		if (fs.existsSync(responseDir)) {
			fs.readdirSync(responseDir).filter((file) => {
				return (file.indexOf(".") !== 0) && (file.slice(-3) === ".js");
			}).forEach((file) => {
				const filename = file.split(".")[0];
				express.response[filename] = require(responseDir + "/" + filename);
			});
		}
	},
	loadRoutes : function(express) {
		const router = express.Router(),
					routesDir = appRoot + "/routes";
		
		if (fs.existsSync(routesDir)) {
			fs.readdirSync(routesDir).filter((file) => {
				return (file.indexOf(".") !== 0) && (file.slice(-3) === ".js");
			}).forEach((file) => {
				const filename = file.split(".")[0];
				router.use(require(routesDir + "/" + filename)(express.Router()));
			});
		}
		
		return router;
	}
};
