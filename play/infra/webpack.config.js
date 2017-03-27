var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    plugins: [
        new CopyWebpackPlugin([
            { from: 'dist/bootstrap/css/bootstrap.css', to: 'css' },
            { from: 'play/sample-data', to: 'sample-data' }
        ])
    ]
};