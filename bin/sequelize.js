'use strict';

const config = require("../config/config");

const env = (envData) => {
	
	const sequelizeEnv = {};
	
	sequelizeEnv[envData] = {
		username : config.database.rdbms.username,
		password : config.database.rdbms.password,
		database : config.database.rdbms.database,
		host : config.database.rdbms.host,
		port : config.database.rdbms.port,
		dialect : config.database.rdbms.driver,
		dialectOptions : {
			bigNumberStrings : true
		},
		migrationStorage : "sequelize",
		migrationStorageTableName : "SequelizeMigrations"
	};
	
	return sequelizeEnv;
};

module.exports = env(process.env.NODE_ENV);
