/**
 * Utility functions for getting/processing js-modules info.
 */

import $ from 'jquery';
import _s from 'underscore.string';
import ModuleSpec from '@jenkins-cd/js-modules/js/ModuleSpec';
import Bundle from './Bundle';
import BundleList from './BundleList';

const bundleList = new BundleList();

export default {
    jsModulesInfo: function(jsModulesInfo) {
        this.trackingEvents = jsModulesInfo.trackingEvents;

        // Process the "load" events, creating Bundle instances for each and
        // adding them to the BundleList.
        jsModulesInfo.trackingEvents.forEach(function (trackingEvent) {
            if (trackingEvent.event === 'load') {
                const rawBundle = findBundleByScriptPath(trackingEvent.bundlePath, jsModulesInfo.bundles);
                if (rawBundle && rawBundle.status >= 200 && rawBundle.status < 300) {
                    const bundleData = JSON.parse(rawBundle.data);
                    const bundle = new Bundle(rawBundle.script, trackingEvent, bundleData);

                    bundleList.addBundle(bundle);
                }
            }
        });

        // Process the "export" events, adding the info to the Bundle instance of
        // the bundle that performed the export.
        jsModulesInfo.trackingEvents.forEach(function (trackingEvent) {
            if (trackingEvent.event === 'export') {
                const bundle = bundleList.getBundleById(trackingEvent.bundleId);
                if (bundle) {
                    bundle.addExport(trackingEvent.moduleId, trackingEvent.at);
                } else {
                    console.error(`Unexpected Error. Bundle "export" event for moduleId ${trackingEvent.moduleId} from unknown bundle ${trackingEvent.bundleId}.`);
                }
            }
        });

        //console.log(bundleList);

        return bundleList;
    },
    whoExports: function (moduleName) {
        return bundleList.whoExports(moduleName);
    },
    setBundleListingComponent: function(bundleListingComponent) {
        this.bundleListingComponent = bundleListingComponent;
    },
    showBundle: function(bundleId) {
        this.bundleListingComponent.selectBundle(bundleId);
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
    }
}

function findBundleByScriptPath(scriptPath, bundles) {
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
