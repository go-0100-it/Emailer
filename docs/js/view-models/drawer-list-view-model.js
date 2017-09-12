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
         * @constructor - A function constructor to create a KO view model for the drawer list view. This view model is responsible for all the functions 
         * related to the corresponding drawer view and creates a two way data binding between the view and the model for simplifying DOM manipulation.
         * @param {array} menu - the array of menu items to render as a list in the drawer list view.
         */
        var DrawerListViewModel = function(menu) {

            // Getting a reference to this execution context for later reference.
            var _this = this;

            // creating a template observable to render the views html.
            this.template = ko.observable();

            // creating an id observable to keep reference to the menu item.
            this.id = ko.observable();

            // // creating an name observable to keep reference to the menu item name.
            this.name = ko.observable();

            // creating an observable for the place object that the user selected from the search results list.
            this.selectedName = ko.observable();

            // creating an observable for the formatted address of the place the user selected from the search results list.
            this.selectedId = ko.observable();

            // creating an observable array for the list of user places
            this.items = ko.observableArray(menu);

            // creating an observable to keep track of the state of the drawer list.
            this.expanded = ko.observable(false);

            // creating an observable to add and remove a css class to style the drawer list.
            this.expandedClass = ko.observable('');




            /**
             * A function to open and close the Drawer List on user click
             */
            this.toggleDrawerList = function() {

                // if the drawer list is open
                if (_this.expanded()) {

                    // remove the css style
                    _this.expandedClass('');

                    // if the drawer is closed
                } else {

                    // add the css style
                    _this.expandedClass('responsive');
                }

                // negate the state :)
                _this.expanded(!_this.expanded());
            };



            /**
             * A function to capture the item the user selected.
             * @param {object} item - the item from the results array selected by the user.
             */
            this.onClick = function() {

                let txt = $(event.target).text();

                if(txt.indexOf("Create") !== -1){

                    window.alert('You clicked "Create new emailer".');
                    Backbone.history.navigate('#create-emailer', { trigger: true });

                }else if(txt.indexOf("Edit") !== -1){

                    window.alert('You clicked "Edit existing emailer".');

                }else if(txt.indexOf("Settings") !== -1){

                    window.alert('You clicked "Settings".');

                }
            };

            // returning this drawerListViewModel
            return this;
        };

        // returning the DrawerListViewModel constructor
        return DrawerListViewModel;
    });
