import $ from 'jquery';

export default {
    getBundleTrackingData: function(onLoad) {
        $.ajax({
            url: '/sample-data/tracking-events.json',
            complete: function(response) {
                onLoad(response.responseText);
            },
            dataType: 'text/plain'
        });
    },
    getBundleData: function(onLoad) {
        $.ajax({
            url: '/sample-data/bundle-data.json',
            complete: function(response) {
                onLoad(response.responseText);
            },
            dataType: 'text/plain'
        });
    }
}