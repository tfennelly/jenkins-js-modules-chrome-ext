var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    plugins: [
        new CopyWebpackPlugin([
            { from: 'dist/panel.css' },
            { from: 'dist/bootstrap/css/bootstrap.css', to: 'css' },
            { from: 'dist/font-awesome', to: 'font-awesome' },
            { from: 'play/sample-data', to: 'sample-data' }
        ])
    ]
};