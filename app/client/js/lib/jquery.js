/*
    Backbone imports jQuery and Webpack complains if it can't import
    jQuery. Here we are faking out the jQuery import (see alias in
    webpack.config.js) and then only implementing the absolute 
    minimum that Backbone requires
*/
module.exports = {

    // Backbone.ajax calls $.ajax – create our own ajax
    ajax(opts) {
        fetch(opts.url, {
            method: opts.type,
            headers: {
                'Content-Type': 'application/json'
            },
            body: opts.data
        }).then(r=>r.json())
        .then(resp=>{
            opts.success(resp)
        }, err=>{
            opts.error(null, err.message, err)
        })
    }

}