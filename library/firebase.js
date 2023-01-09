'use strict';

const config = require('../config/config');
const _ = require('lodash');
const Promise = require("bluebird");
const bcrypt = require('bcryptjs');
const firebaseAdmin = require('firebase-admin');
const firebaseApp = firebaseAdmin;

const firebaseConfigOptions = {
	type : config.google.firebase.admin.type,
	project_id : config.google.firebase.admin.projectId,
	private_key_id : config.google.firebase.admin.privateKeyId,
	private_key : config.google.firebase.admin.privateKey,
	client_email : config.google.firebase.admin.clientEmail,
	client_id : config.google.firebase.admin.clientId,
	auth_uri : config.google.firebase.admin.authUri,
	token_uri : config.google.firebase.admin.tokenUri,
	auth_provider_x509_cert_url : config.google.firebase.admin.authProvider_x509_certUrl,
	client_x509_cert_url : config.google.firebase.admin.client_x509_certUrl
};

if (firebaseAdmin.apps.length === 0) {
	firebaseAdmin.initializeApp({
		credential : firebaseAdmin.credential.cert(firebaseConfigOptions),
		databaseURL : config.google.firebase.admin.databaseUrl
	});
}

const auth0 = {
	getOpenIDConfig : function() {
	
	},
	getJWKS : function() {
	
	},
	getToken : function(data) {
	
	},
	refreshToken : function(refreshToken) {
	
	},
	revokeToken : function(refreshToken) {
	
	},
	changePassword : function(data) {
	
	},
	createUser : function(data) {
		return firebaseApp.auth().verifyIdToken("eyJhbGciOiJSUzI1NiIsImtpZCI6IjI1OTc0MmQyNjlhY2IzNWZiNjU3YzBjNGRkMmM3YjcyYWEzMTRiNTAiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiRGVubmlzIENvbGluYXJlcyIsInBpY3R1cmUiOiJodHRwczovL2xoNC5nb29nbGV1c2VyY29udGVudC5jb20vLU1TWmY2QW1QWDlvL0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FDSGkzcmZ0cmZGWGVtdTJ5VUpoU2ZWRXNaZUlqb0NJLXcvcGhvdG8uanBnIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3ByaWNlLXRvb2wtZGV2IiwiYXVkIjoicHJpY2UtdG9vbC1kZXYiLCJhdXRoX3RpbWUiOjE1ODA3MTQyMzAsInVzZXJfaWQiOiJySmVKQld4QmR6ZUQzc1FIQ01nUUxKQWdnZjQyIiwic3ViIjoickplSkJXeEJkemVEM3NRSENNZ1FMSkFnZ2Y0MiIsImlhdCI6MTU4MDcxNDIzMCwiZXhwIjoxNTgwNzE3ODMwLCJlbWFpbCI6ImRlbm5pc19jb2xpbmFyZXNAc2Vhb2lsLmNvbS5waCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTA4NDE0NzUyMDc0OTgwNDEyMzE5Il0sImVtYWlsIjpbImRlbm5pc19jb2xpbmFyZXNAc2Vhb2lsLmNvbS5waCJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.JH5Q2O_3Igv4SokZ-ZF8czubAp3JJnxsGzDnO7SindNArdEsuuuDF8iA-T5-qEuOYFPmJA3tKk6a1dywX6gS8yntSJeaNZMx5QLDyATjInZCn6SkpXy08j6sFRNMX-rYXsX2TOBwx9mCTJzIUfMiu-pq0bRWaxN8r3PAQ9E888whJHpsX_gUaLvV_H-lnR3UHxRKfMUo9eJd6z2cCoE8Bv5m6uCA7M0lKw6cBGATNJvXCq2XdQppHsfxz0M62AyM-ErO2o5YTxq3n3BfCQQmnd_XaA0dZugaZc647ymj_Hzvu4o1USlofPg3HiIlTCmeVjShulCRFhpfCQ5EbOJy4Q")
				.then((a) => {
					return a;
				})
				.catch((err) => {
					console.log('Error listing users:', err);
				});
	},
	listUser : function(data) {
		return firebaseApp.auth().listUsers().then(function(listUsersResult) {
					listUsersResult.users.forEach(function(userRecord) {
						console.log('user', userRecord.toJSON());
					});
					if (listUsersResult.pageToken) {
						// List next batch of users.
						this.listUser(listUsersResult.pageToken);
					}
				})
				.catch(function(error) {
					console.log('Error listing users:', error);
				});
	}
};

module.exports = auth0;
