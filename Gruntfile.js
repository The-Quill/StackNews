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
                        src: ['web/**/*.js', 'web/**/*.js'],
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
                    {expand: true, cwd: 'src', src: ['web/*.json'], dest: 'dist/'},
                    {expand: true, cwd: 'src', src: ['web/resources/*.*'], dest: 'dist/'}
                ]
            }
        },
        watch: {
           sass: {
               files: ['src/web/**/*.{scss,sass}'],
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
                    'dist/web/scss/out.css': 'src/web/components.scss'
                }
            }
        }
    });
    grunt.registerTask('default', ['sass:dev', 'babel', 'copy:main']);
};
