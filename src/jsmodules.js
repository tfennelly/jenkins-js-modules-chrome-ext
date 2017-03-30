/**
 * Utility functions for getting/processing js-modules info.
 */

import $ from 'jquery';

export default {
    getBundleData: function(pageScriptUrls, onLoad) {
        const responses = [];

        function doGet(scriptUrl) {
            $.ajax({
                url: scriptUrl + '-info.js',
                complete: function(response) {
                    responses.push({
                        script: scriptUrl,
                        status: response.status,
                        data: response.responseText
                    });
                    // If we have a response for all the gets, call the callback.
                    if (responses.length === pageScriptUrls.length) {
                        onLoad(responses);
                    }
                },
                dataType: 'text/plain'
            });
        }

        for (var i = 0; i < pageScriptUrls.length; i++) {
            doGet(pageScriptUrls[i]);
        }
    }
}