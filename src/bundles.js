/**
 * Utility functions for getting/processing js-modules info.
 */

import $ from 'jquery';
import _s from 'underscore.string';
import ModuleSpec from '@jenkins-cd/js-modules/js/ModuleSpec';
import Bundle from './Bundle';

export default {
    jsModulesInfo: function(jsModulesInfo) {
        this.trackingEvents = jsModulesInfo.trackingEvents;
        this.bundles = jsModulesInfo.bundles;

        const self = this;
        this.bundles.forEach(function(bundle) {
            if (bundle.status >= 200 && bundle.status < 300) {
                const decoded = bundle.decoded = JSON.parse(bundle.data);
                const bundleDetails = self.findBundleByScriptPath(bundle.script);

                decoded.bundle = new Bundle(bundleDetails);

                for (const moduleName in decoded.moduleDefs) {
                    if (decoded.moduleDefs.hasOwnProperty(moduleName)) {
                        const moduleDef = decoded.moduleDefs[moduleName];
                        const packageInfo = moduleDef.packageInfo;

                        decoded.bundle.incSize(moduleDef.size);

                        const dPackage = decoded.bundle.getPackage(packageInfo.name, true);
                        dPackage.addVersion(packageInfo.version);
                        dPackage.addModuleDef(moduleDef);
                    }
                }
            }
        });
    },
    whoExports: function (moduleName) {
        const moduleSpec = new ModuleSpec(moduleName);
        const importAs = moduleSpec.importAs();

        for (let i = 0; i < this.trackingEvents.length; i++) {
            const trackingEvent = this.trackingEvents[i];
            if (trackingEvent.event === 'export') {
                if (importAs === trackingEvent.moduleId) {
                    return trackingEvent.bundleId;
                }
            }
        }
        return undefined;
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
    },
    findBundleByScriptPath: function(scriptPath) {
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
        const filteredBundleList = this.bundles.filter(function(bundle) {
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