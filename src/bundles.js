/**
 * Utility functions for getting/processing js-modules info.
 */

import $ from 'jquery';
import _s from 'underscore.string';

export default {
    trackingEvents: function(trackingEvents) {
        if (trackingEvents) {
            this.trackingEvents = trackingEvents;
        }
        return this.trackingEvents;
    },
    bundles: function(bundles) {
        if (bundles) {
            this.bundles = bundles;
        }
        return this.bundles;
    },
    whoExports: function (moduleName) {
        for (let i = 0; i < this.trackingEvents.length; i++) {
            const trackingEvent = this.trackingEvents[i];
            if (trackingEvent.event === 'export') {
                if (moduleName === trackingEvent.moduleId) {
                    return trackingEvent.bundleId;
                }
            }
        }
        return undefined;
    },
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
    },
    findBundleByScriptPath: function(scriptPath, bundles) {
        // The scriptPath set in the bundle load event can have build time
        // prefixes that we want to remove before using to check againts the
        // actual script URLs used in the page.
        if (_s.startsWith(scriptPath, './')) {
            scriptPath = scriptPath.substring('./'.length);
        }
        if (_s.startsWith(scriptPath, 'target/classes')) {
            scriptPath = scriptPath.substring('target/classes'.length);
        } else if (_s.startsWith(scriptPath, 'src/main/webapp')) {
            scriptPath = scriptPath.substring('src/main/webapp'.length);
        }

        // Now compare the scriptPath for a match against the end of the
        // scriptPaths as set on the bundles.
        const filteredBundleList = bundles.filter(function(bundle) {
            return _s.endsWith(bundle.script, scriptPath);
        });

        if (filteredBundleList.length === 0) {
            console.error(`Failed to find a bundle matching scriptPath ${scriptPath}`);
            return undefined;
        } else if (filteredBundleList.length > 1) {
            console.warn(`Found multiple bundles matching scriptPath ${scriptPath}. Returning the first.`, filteredBundleList.map((bundle) => bundle.script));
        }

        return filteredBundleList[0];
    }
}