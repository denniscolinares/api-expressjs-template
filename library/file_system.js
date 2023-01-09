const fs = require('fs');

module.exports = class file_system {
	
	constructor () {
	
	}
	
	/**
	 * `require`s every module in the given array, returns an object where the required objects are attached
	 * @param {array} modules - module paths
	 * @param {object} attach - where the required files should be attached
	 * @return {object} - required modules
	 */
	load (modules, attach = {}) {
		if (!Array.isArray(modules)) {
			modules = [modules];
		}
		
		modules.forEach((a) => {
			const varname = a.split('|');
			
			attach[varname[1] || a.split('/').pop()] =
					varname.length > 2
							? require(varname[0])()
							: require(varname[0]);
		});
		
		return attach;
	}
	
	
	/**
	 * requires every js file inside the given folder, fires callback with 2 arguments, error and the object where the required objects are attached
	 * @param {string} path - folder path
	 * @param {function} callback - receives 2 arguments, error and object
	 * @param {object} attach - where the required files should be attached
	 * @return undefined
	 */
	dirload (path, cb, imports = {}) {
		
		function start () {
			path = path.replace(/\/$/, '');
			fs.readdir(path, require_all_js);
		}
		
		function require_all_js (err, files) {
			if (err) {
				return cb(err);
			}
			
			files.forEach((file) => {
				let ext = file.split('.').slice(-1)[0];
				if (!~['js', 'json'].indexOf(ext)) {
					return;
				}
				
				file = file.replace('.' + ext, '');
				imports[file] = require(path + '/' + file);
			});
			
			cb(null, imports);
		}
		
		start();
	}
	
	
	
	
	/**
	 * Requires every js file inside the given folder, return object where the required objects are attached
	 * @param {string} path - folder path
	 * @param {object} attach - where the required files should be attached
	 * @return {object}
	 */
	dirloadSync (path, attach = {}) {
		function start (_path, imports) {
			const files = fs.readdirSync(_path);
			let len = files.length;
			let file;
			
			while (len--) {
				file = files[len];
				
				let ext = file.split('.').slice(-1)[0];
				if (!~['js', 'json'].indexOf(ext)) {
					if (fs.statSync(_path + '/' + file).isDirectory()) {
						imports[file] = {};
						start(_path + '/' + file, imports[file]);
					}
					
					continue;
				}
				
				file = file.replace('.' + ext, '');
				imports[file] = require(_path + '/' + file);
			}
			
			return imports;
		}
		
		return start(path.replace(/\/$/, ''), attach);
	}
};
