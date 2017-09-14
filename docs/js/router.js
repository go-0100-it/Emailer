/**
 * Using Require.js to define a module responsible for creating a backbone router
 */
define(
    [
        'jquery',
        'main_controller'
    ],
    function(
        $,
        MainController
    ) {

        // creating a Backbone router
        var Router = Backbone.Router.extend({

            initialize: function() {

                //Required for Backbone to start listening to hashchange events
                Backbone.history.start();
            },

            routes: {

                // Calls the placesOnMap method when there is no hashtag in the url
                '': 'main',
                'main': 'main',
                'create': 'create',
                'edit': 'edit',
                'settings': 'settings',
                '*path': 'error404' // (default) this path is called for all other urls
            },


            /**
             * A function to render the menu and the main page
             */
            'main': function() {

                // Calling function @ Maincontroller to create the drawerListView
                //NOTE: *******************************************************************************************************
                MainController.renderDrawerListView({}, 'listEmailer');
            },

            /**
             * A function to render the menu and the main page
             */
            'create': function() {

                // Calling function @ Maincontroller to create the drawerListView
                //NOTE: *******************************************************************************************************
                MainController.renderViews({}, 'createEmailer');
            },


            /**
             * A function to render the menu and the main page
             */
            'edit': function() {

                // Calling function @ Maincontroller to create the drawerListView
                //NOTE: *******************************************************************************************************
                MainController.renderViews({}, 'editEmailer');
            },


            /**
             * A function to render the 404 error view for page not found
             */
            'error404': function() {

                // Calling the renderErrorView function @ Maincontroller to create the Error view, passing in the view type as a string
                // to the render function to determine tab view required.
                MainController.renderViews({}, 'error404');
            },


            /**
             * A function to render the 404 error view for page not found
             */
            'settings': function() {

                // Calling the renderErrorView function @ Maincontroller to create the Error view, passing in the view type as a string
                // to the render function to determine tab view required.
                MainController.renderViews({}, 'settings');
            }
        });

        // returning the router
        return Router;
    });
