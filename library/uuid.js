'use strict';

const uuidv5 = require('uuid/v5');
const uuidv4 = require('uuid/v4');
const uuidv3 = require('uuid/v3');
const uuidv1 = require('uuid/v1');
const moment = require('moment');

module.exports = {
	v1 : function(){
		return uuidv1();
	},
	v3 : function(name){
		return uuidv3(name, uuidv3.URL);
	},
	v4 : function () {
		return uuidv4();
	},
	v5 : function (name) {
		return uuidv5(name+this.v4(), uuidv5.URL);
	}
};