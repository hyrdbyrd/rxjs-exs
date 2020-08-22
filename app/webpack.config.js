const path = require('path');

module.exports = {
    entry: {
        dragndrop: path.resolve(__dirname, 'src/dragndrop.js'),
        input: path.resolve(__dirname, 'src/input.js')
    },
    output: {
        path: path.resolve(__dirname, 'static/scripts')
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: 'babel-loader'
        }]
    }
};
