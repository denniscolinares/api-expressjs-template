'use strict';

const winston = require('../library/winston');
const sessionCheck = require('../api/middleware/session');
const homeController = require('../api/controllers/home').HomeController;

module.exports = (router) => {
	
	router.use("/", sessionCheck);
	
	router.get("/", homeController.index);
	
	router.get("/env", homeController.getenvironment);
	
	router.get("/sample", homeController.getSampleData);
	
	return router;
};
