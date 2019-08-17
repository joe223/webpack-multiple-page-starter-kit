/**
 * Register website modules.
 *
 * All of your modules must save in modules directory.
 */

module.exports = {
    // Home module with 'index' and 'en' entry
    home: {
        entries: {
            // EntryName is 'index'
            index: {
                title: 'nest',
                // Absolute path is allowable
                entry: 'home/index.js',
                template: 'home/index.pug',
                // If did not set output configuration，the result file would be:
                //      `[outer output]/[entryName]/index.html`.
                // The output file is 'dist/index.html' when we set output to 'index.html',
                // dist is the default target directory which can not be modified
                output: 'index.html',
                templateParameters: {
                    title: 'Title'
                }
            },
            // EntryName is 'en'
            en: {
                title: 'nest',
                entry: 'home/index.js',
                template: 'home/index.pug',
                output: 'en/index.html',
                templateParameters: {
                    title: 'Title'
                }
            }
        },
        // Static directory
        static: 'home/static',
        // Outer output
        output: '/'
    }
}
