/**
 * Using Require.js to define a module responsible for creating a main controller object.
 */
define([
        'jquery',
        'knockout',
        'util',
        'drawer_list_view_model', ,
        'data_controller'
    ],
    function(
        $,
        ko,
        tpl,
        DrawerListViewModel,
        DataController
    ) {


        /**
         * @constructor - Creates a main controller object.
         * The created main controller object is, as the name implies, the main controller.  It controls the majority of the functions of the application.  
         * Nearly every function of the application is controlled or delegated via this main controller object.  The purpose of the main controller is to be 
         * the hub in which all other modules can communicate through and in which all of the main functionality of the application is generated.  Having this 
         * main controller helps to keep concerns seperate and helps keep code modulal and improve maintainability.  
         * @return {object} - returns a new main controller object.
         */
        var Main = function() {

            // Getting a reference to this execution context for later reference.
            var _this = this;
            let VISIBLE = true;
            let HIDDEN = false;

            // Creating a new Data controller object.
            //_this.dataController = new DataController();



            /**
             * A function to create, if not yet created, a new DrawerListViewModel, fetch the Drawer list data and render the Drawer List View html
             * template and returned Drawer list data to the UI.
             * @param {object} place - the place object to derive the location from to pass to the map view (to center the map on the place coordinates).
             */
            this.renderDrawerListView = function(menu) {

                // if the drawerListViewModel has not been created previously.
                if (!_this.drawerListViewModel) {

                    // Create a new DrawerListViewModel.
                    _this.drawerListViewModel = new DrawerListViewModel(menu);

                    // Apply the KO bindings between the newly created view model and the existing view container.
                    ko.applyBindings(_this.drawerListViewModel, $('#nav')[0]);

                    // Add the drawer list view html template(view) to the view model which will render in the UI.
                    _this.drawerListViewModel.template(tpl.get('drawer-list-view'));

                    // remove the bindings from the container, so we can add bindings to the added template later.
                    ko.cleanNode($('#nav')[0]);

                    // applying KO bindings to the drawerListViewModel and the drawer view.
                    ko.applyBindings(_this.drawerListViewModel, $('#drawer-menu-container')[0]);

                    // if the drawerListViewModel has already been rendered.
                } else {

                }
            };



            /**
             * A function to create a new tabs view if one was not already created or show the previously created but hidden tabs view then
             * render the tab view.
             * @param {object} place - the place object to render in the tabs view.
             * @param {object} view - the type of tab view requested to be rendered for the tabs view.  
             */
            this.renderTabsView = function(place, view) {

                // calling the renderDrawerListView to render the drawer and map if it has not already been rendered.
                _this.renderDrawerListView(place);

                // hide the map view if it is visible.
                _this.setMapVisibility(HIDDEN);

                // hide the error view if it is visible.
                _this.setErrorVisibility(HIDDEN);

                // if the tabsViewModel exists.
                if (_this.tabsViewModel) {

                    // show the tabs view and update the place to display.
                    _this.setTabsVisibility(VISIBLE, null, place);

                    // if the tabsViewModel does not exist
                } else {

                    // create the tabs view.
                    _this.createTabsView(place);
                }

                // render the spinner to show while we wait for the data request response.
                _this.renderSpinner();

                // calling the renderTabView function to render the requested tab, will also fetch the corresponding data.
                _this.renderTabView(place, view);
            };




            /**
             * A function to create the tabs view and apply KO bindings between the view and view model.
             * @param {object} place - the place object to render in the tabs view.
             */
            this.createTabsView = function(place) {

                // requiring the view model module and the css for the view
                requirejs(
                    [
                        'tabs_view_model',
                        'css!css/tabs-view.css'
                    ],
                    function(
                        TabsViewModel
                    ) {
                        // creating the tabs view model
                        _this.tabsViewModel = new TabsViewModel(place);

                        // initially applying the bindings to the empty container so the template can be rendered.
                        ko.applyBindings(_this.tabsViewModel, $('#tabs-container-view')[0]);

                        // rendering the html template for the tabs view.
                        _this.tabsViewModel.template(tpl.get('tabs-view'));

                        // removing the bindings from the container because we need to apply the bindings to the newly rendered html template.
                        ko.cleanNode($('#tabs-container-view')[0]);

                        // applying the bindings to the new view
                        ko.applyBindings(_this.tabsViewModel, $('#tabs-view')[0]);
                    });
            };



            /**
             * A function to initialize the rendering of a tab view. Creates view config data and initializes the data requests.
             * @param {object} place - the place object (location) for which the data is being requested.
             * @param {string} view - the type of view needed to display the requested data.
             */
            this.renderTabView = function(place, view) {

                // requiring the view model modules and css required for the views.
                requirejs(
                    [
                        'css!css/weather-view.css',
                        'css!css/events-view.css',
                        'events_list_view_model',
                        'weather_list_view_model',
                        'restaurants_list_view_model'
                    ],
                    function(
                        weatherCss,
                        eventsCss,
                        EventsListViewModel,
                        WeatherListViewModel,
                        RestaurantsListViewModel
                    ) {

                        switch (view) {
                            case 'events':

                                // Creating an object literal containing the necessary data to later (after receiving a data response) render
                                // the view corresponding to the data returned.
                                viewConfigData = {
                                    viewVariable: 'eventsView',
                                    viewModelVariable: 'eventsListViewModel',
                                    viewModelConstructor: EventsListViewModel,
                                    template: tpl.get('events-view'),
                                    el: '#events-view',
                                    place: place
                                };

                                _this.tabsViewModel.title('Local Events');

                                // Calling the queryCache function to first check if the requested data has been cached, passing in 2 functions,
                                // the first one will be called if no data was found in the cache.  The second function will be called when data
                                // becomes available, either by retriving it from the cache or receiving a response from a AJAX request.
                                _this.dataController.queryCache(viewConfigData, _this.dataController.getEventsDataList, _this.renderView);
                                break;

                            case 'weather':

                                // Creating an object literal containing the necessary data to later (after receiving a data response) render
                                // the view corresponding to the data returned.
                                viewConfigData = {
                                    viewVariable: 'weatherView',
                                    viewModelVariable: 'weatherListViewModel',
                                    viewModelConstructor: WeatherListViewModel,
                                    template: tpl.get('weather-view'),
                                    el: '#weather-view',
                                    place: place
                                };

                                _this.tabsViewModel.title('Local Weather');

                                // Calling the queryCache function to first check if the requested data has been cached, passing in 2 functions,
                                // the first one will be called if no data was found in the cache.  The second function will be called when data
                                // becomes available, either by retriving it from the cache or receiving a response from a AJAX request.
                                _this.dataController.queryCache(viewConfigData, _this.dataController.getCurrentWeather, _this.renderView);
                                break;

                            case 'restaurants':



                                // Creating an object literal containing the necessary data to later (after receiving a data response) render
                                // the view corresponding to the data returned.
                                viewConfigData = {
                                    viewVariable: 'restaurantsView',
                                    viewModelVariable: 'restaurantsListViewModel',
                                    viewModelConstructor: RestaurantsListViewModel,
                                    template: tpl.get('restaurants-view'),
                                    el: '#restaurants-view',
                                    place: place
                                };

                                // setting the tabsViewModel title to display the correct title.
                                _this.tabsViewModel.title('Local Restaurants');

                                // Calling the queryCache function to first check if the requested data has been cached, passing in 2 functions,
                                // the first one will be called if no data was found in the cache.  The second function will be called when data
                                // becomes available, either by retriving it from the cache or receiving a response from a AJAX request.
                                _this.dataController.queryCache(viewConfigData, _this.dataController.getRestaurantsList, _this.renderView);
                                break;
                        }
                    });
            };




            /**
             * A function to remove the current tab view, create a new tab viewModel and render the newly created viewModels html template.
             * @param {array} data - The data result received from the data request to be rendered in the view.
             * @param {object} vcd - The view configuration data containing the data required for rendering the view.
             * @param {boolean} isError - A boolean value indicating if this function is being called as a result of an error.
             */
            this.renderView = function(data, vcd, isError) {

                // Calling custom function to remove the currently rendered Tab view.
                _this.removeCurrentTab();

                // Creating the new view model from vcd (viewConfigData) parameter.
                _this[vcd.viewModelVariable] = new vcd.viewModelConstructor(vcd.place, data, isError, _this);

                // Checking if the element has bindings applied. If no bindings have previously been applied to this element then apply bindings. 
                if (!!!ko.dataFor($('#tab-container')[0])) {
                    ko.applyBindings(_this[vcd.viewModelVariable], $('#tab-container')[0]);
                }

                // Setting the html template of the newly created viewModel 
                _this[vcd.viewModelVariable].template(vcd.template);

                // Removing the KO bindings once the template has been rendered.
                ko.cleanNode($('#tab-container')[0]);

                // Applying the bindings to the newly rendered html template.
                ko.applyBindings(_this[vcd.viewModelVariable], $(vcd.el)[0]);

                // Creating a object literal containing the currently active viewModel and currently visible element.
                // Need this reference when removing the view.
                _this.currentTab = { tab: $(vcd.el)[0], viewModel: _this[vcd.viewModelVariable] };
            };




            /**
             * A function to render the spinner view.  This view is rendered to the UI and displayed while the data request is being processed and
             * will be removed once the request response is processed.
             */
            this.renderSpinner = function() {

                // requiring the view model module required for the view.
                requirejs(
                    [
                        'spinner_view_model'
                    ],
                    function(
                        SpinnerViewModel
                    ) {

                        // Creating an object literal containing the necessary data used to render the view.
                        viewConfigData = {
                            viewVariable: 'spinnerView',
                            viewModelVariable: 'spinnerViewModel',
                            viewModelConstructor: SpinnerViewModel,
                            template: tpl.get('spinner-view'),
                            el: '#spinner-view',
                            place: null
                        };

                        // calling the common renderView function to render the view.
                        _this.renderView(null, viewConfigData, false);
                    });
            };




            /**
             * a function to remove the previously rendered tab.  This function is called prior to rendering a new tab. This is necessary to avoid massive
             * memory leaks.
             */
            this.removeCurrentTab = function() {

                // if a tab exists
                if (_this.currentTab) {

                    // remove the existing tab
                    ko.removeNode(_this.currentTab.tab);

                    // there is no longer an existing tab so set the currentTab variable to null
                    _this.currentTab = null;
                }
            };



            /**
             * A function to set the Visibility of the tabs view.  Can be hidden by passing the boolean value HIDDEN(false) as the state parameter or 
             * visible by passing the value VISIBLE(true) as the state parameter.
             * @param {boolean} state - the boolean value indicating the visibility state requested.  True for visible, false for hidden.
             * @param {boolean} remove - the boolean value indicating if the tab view is to be removed, passing true will remove the current tab false will not.
             * @param {object} place - the place object to render in the tabs view.
             */
            this.setTabsVisibility = function(state, remove, place) {

                // if a tabs view exists
                if (_this.tabsViewModel) {

                    // if a place object was pass in
                    if (place) {

                        // update the tabsViewModel place object to render to the view.
                        _this.tabsViewModel.place(place);
                    }

                    // if the remove value is true
                    if (remove) {

                        // remove the current tab
                        _this.removeCurrentTab();
                    }

                    // call the showTabs function passing the requested state.
                    _this.tabsViewModel.showTabs(state);
                }
            };




            /**
             * A function to set the visibility of the errorViewModel's data-bound element.
             * @param {boolean} state - the boolean value indicating the visibility state requested.  True for visible, false for hidden.
             */
            this.setErrorVisibility = function(state) {

                // Checking if the view model exists
                if (_this.errorViewModel) {

                    // If it does exist, set the data-bound element 
                    _this.errorViewModel.showError(state);
                }
            };




            /**
             * A function to create an error view if one does not already exist or show the previously created hidden view.
             */
            this.renderErrorView = function() {

                // calling render the drawer list view, this renders the drawer list view and the map ifb they don't already exist.
                _this.renderDrawerListView();

                // hiding the map view
                _this.setMapVisibility(HIDDEN);

                // hiding the tabs view
                _this.setTabsVisibility(HIDDEN, null, true);

                // if the error view exists
                if (_this.errorViewModel) {

                    // show the existing error view
                    _this.setErrorVisibility(VISIBLE);

                    // if the error view does not exist
                } else {

                    // create the error view
                    _this.createErrorView();
                }
            };




            /**
             * A function to create an errorViewModel and render the error html template.  This error view is displayed when
             * the requested URL is not found.
             */
            this.createErrorView = function() {

                // requiring the view model module and css required for the view.
                requirejs(
                    [
                        'error404_view_model',
                        'css!css/error404-view.css'
                    ],
                    function(
                        ErrorViewModel
                    ) {
                        // creating the errorViewModel to render the error html template.
                        _this.errorViewModel = new ErrorViewModel();

                        // applyiung the bindings to the view model and the dom element.
                        ko.applyBindings(_this.errorViewModel, $('#error-container-view')[0]);

                        // updating the viewModel template to render the html.
                        _this.errorViewModel.template(tpl.get('error404-view'));

                        // removing the bindings from the container view.
                        ko.cleanNode($('#error-container-view')[0]);

                        // applying new bindings to the view models newly updated html template.
                        ko.applyBindings(_this.errorViewModel, $('#error-view')[0]);
                    });
            };
        };

        // retruning a new Main object.
        return new Main();
    });