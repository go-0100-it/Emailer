/**
 * Using Require.js to define a module responsible for creating a require configuration object and initializing the app.
 */
requirejs.config({
    //By default load any module IDs from js
    baseUrl: 'js',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        /* Library modules*/
        jquery: 'libs/jquery.min',
        underscore: 'libs/underscore.min',
        backbone: 'libs/backbone.min',
        knockout: 'libs/knockout.min',
        app: 'app',
        util: 'util',

        /*Controller modules*/
        main_controller: 'controllers/main-controller',
        data_controller: 'controllers/data-controller',
        cache: 'controllers/cache',

        /*ViewsModel modules*/
        drawer_list_view_model: 'view-models/drawer-list-view-model',
        create_emailer_view_model: 'view-models/create-emailer-view-model',
        edit_emailer_view_model: 'view-models/edit-emailer-view-model',
        spinner_view_model: 'view-models/spinner-view-model',
        error404_view_model: 'view-models/error404-view-model'
    }
});
// requiring all the base modules needed
requirejs(
    [
        'jquery',
        'underscore',
        'backbone',
        'knockout',
        'util',
        'css!css/navbar-view.css',
        'css!css/main-view.css',
        'css!css/drawer-menu.css', 
    ],
    function(
        $,
        _,
        bb,
        ko,
        tpl
    ) {

        // loading the html templates via the util module
        tpl.loadTemplates(
            [
                'drawer-list-view',
                'tabs-view',
                'create-emailer-view',
                'spinner-view',
                'error404-view'
            ],
            function() {
                requirejs(
                    [
                        'app'
                    ],
                    function(
                        app
                    ) {
                        // initializing the app
                        app.initialize();
                    });
            });
    });
