'use strict';

const production = (env) => {
	return {
		application : {
			version : env.APP_VERSION,
			ssl : env.APP_HOST_SSL,
			cmsDomain: "",
			cdnDomain: "",
			defaultTimezone: env.APP_TIMEZONE,
			dateFormat: "YYYY-MM-DD HH:MM:ss.SSSS"
		},
		database : {
			rdbms : {
				enabled : false,
				driver : env.DB_DRIVER,
				host : env.DB_HOST,
				port : env.DB_PORT,
				username : env.DB_USERNAME,
				password : env.DB_PASSWORD,
				database : "",
				ssl : env.DB_SSL,
				pool : false
			},
			mongodb : {
				enabled : false,
				driver : "mongodb",
				host : env.DB_MONGO_HOST,
				port : env.DB_MONGO_PORT,
				username : env.DB_MONGO_USERNAME,
				password : env.DB_MONGO_PASSWORD,
				database : "",
				ssl : env.DB_MONGO_SSL,
				debug: false
			},
			dynamodb : {
				enabled : false,
				region : "us-east-1",
				autoCreateTable : true,
				update : true,
				waitForActive : {
					enabled : true,
					check : {
						timeout : 180000,
						frequency : 1000
					}
				},
				encryption : false,
				streamOptions : false,
				prefix : "",
				suffix : "-prod"
			},
			cache : {
				enabled : false,
				driver : env.CACHE_DRIVER,
				database : env.CACHE_NAME,
				host : env.CACHE_HOST,
				port : env.CACHE_PORT,
				cluster : env.CACHE_CLUSTER
			}
		},
		session : {
			name: "SESS",
			prefix : "seaoil-sess",
			secretKey : "",
			proxy: undefined,
			ttl: 260,
			db: 0
		},
		cookies : {
			domain: "",
			path: "/",
			secure: true,
			httpOnly: true,
			maxAge: null,
			sameSite: true
		},
		headers : {
			cors : {
				allowAll: false,
				whitelist : [
					""
				],
				methods : [
					"DELETE",
					"GET",
					"HEAD",
					"OPTIONS",
					"POST",
					"PUT"
				],
				allowedHeaders : [
					"Content-Type",
					"Referer",
					"User-Agent"
				],
				maxAge: 3600,
				credentials: true
			}
		},
		amazon: {
			accessKeyId: env.AWS_ACCESS_KEY_ID,
			secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
			s3: {
				region: "ap-southeast-1",
				bucketName: ""
			},
			ses:{
				server: "",
				port: 465,
				tls: true,
				auth: {
					user: "",
					pass: ""
				}
			}
		},
		google: {
			firebase : {
				admin : {
					type : "service_account",
					projectId : "",
					privateKeyId : "",
					privateKey : "",
					clientEmail : "",
					clientId : "",
					authUri : "",
					tokenUri : "",
					authProvider_x509_certUrl : "",
					client_x509_certUrl : "",
					databaseUrl : ""
				},
				client : {
					apiKey : "",
					authDomain : "",
					databaseURL : "",
					projectId : "",
					storageBucket : "",
					messagingSenderId : "",
					appId : "",
					measurementId : ""
				}
			},
			projectId: "",
			api: {
				key: ""
			}
		},
		sso: {
			domain: "",
			clientId: "",
			secretKey: "",
			audience: "",
			scope: "openid offline_access",
			connection: "Username-Password-Authentication"
		},
		sentry: {
			publicKey: "",
			projectId: "",
			debug: false,
			attachStacktrace: true
		}
	};
};

module.exports = production;
