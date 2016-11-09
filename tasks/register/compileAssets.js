module.exports = function (grunt) {
	grunt.registerTask('compileAssets', [
		'clean:dev',
		'jst:dev',
		'less:dev',
		'copy:dev',
    'static-i18n',
		'babel:dev',
		'coffee:dev'
	]);
};
