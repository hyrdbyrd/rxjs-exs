const path = require('path');

module.exports = {
    entry: {
        script: path.resolve(__dirname, 'src/script.js'),
        'rxjs-script': path.resolve(__dirname, 'src/rxjs-script.js')
    },
    output: {
        path: path.resolve(__dirname, 'static')
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: 'babel-loader'
        }]
    }
};
