const jwt = require('jsonwebtoken');

const Helpers = {
	user : (token) => {
		try {
			if (token) {
				if (token.startsWith('Bearer')) {
					token = token.slice(7, token.length);
				}
				
				let decoded = jwt.decode(token);
				
				return decoded;
			}
		}
		catch (error) {
			throw error;
		}
	}
};

module.exports = Helpers;
