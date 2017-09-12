/**
 * Using Require.js to define a module responsible for creating a KO view model.
 */
define(
    [
        'jquery',
        'knockout'
    ],
    function(
        $,
        ko
    ) {
        /**
         * @constructor - A function constructor to create a KO view model for the events list view. This view model is responsible for all the functions 
         * related to the corresponding events view and creates a two way data binding between the view and the view model for simplifying DOM manipulation.
         */
        var CreateEmailerViewModel = function(main) {

            var _this = this;

            // creating a template observable to render the views html.
            this.template = ko.observable();

            // creating an observable to toggle the views state, true for visible and false for hidden.
            this.showView = ko.observable(true);

            // keeping reference to the main controller object
            var Main = main;


            /**
             * A function to delegate to the Main Controllers addEmailer function, the addition of a new emailer object to the drawer list.
             */
            this.addEmailer = function() {

                // creating a new place object from the event object.
                var newEmailer = {
                    
                };

                // delegating the addition of a new place object to the drawerListViewModel's addPlace function.
                Main.drawerListViewModel.addEmailer(newEmailer);
            };

            // returning the EventsListViewModel
            return this;
        };

        // returning the EventsListViewModel constructor
        return CreateEmailerViewModel;
    });