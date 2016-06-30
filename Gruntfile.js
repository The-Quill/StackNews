module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        babel: {
            options: {
                presets: ["es2015"],
                plugins: [
                    "syntax-async-functions",
                    "transform-regenerator",
                    "transform-async-to-generator",
                    "transform-react-jsx"
                ]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['web_server/**/*.js', 'web_server/**/*.js'],
                        dest: 'dist/',
                        ext: '.js'
                    },
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['modules/*.js'],
                        dest: 'dist/',
                        ext: '.js'
                    }
                ]
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'src', src: ['web_server/*.json'], dest: 'dist/'},
                    {expand: true, cwd: 'src', src: ['web_server/resources/*.*'], dest: 'dist/'}
                ]
            }
        },
        watch: {
           sass: {
               files: ['src/web_server/**/*.{scss,sass}'],
               tasks: ['sass:dev']
           }
       },
        sass: {
            dev: {
                options: {
                    sourceMap: true,
                    outputStyle: 'compressed'
                },
                files: {
                    'dist/web_server/css_modules/out.css': 'src/web_server/components.scss'
                }
            }
        }
    });
    grunt.registerTask('default', ['sass:dev', 'babel', 'copy:main']);
};
