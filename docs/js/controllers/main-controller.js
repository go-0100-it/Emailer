/**
 * Using Require.js to define a module responsible for creating a main controller object.
 */
define([
        'jquery',
        'knockout',
        'util',
        'drawer_list_view_model',
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
            _this.dataController = new DataController();

            /**
             * A function to create, if not yet created, a new DrawerListViewModel, fetch the Drawer list data and render the Drawer List View html
             * template and returned Drawer list data to the UI.
             */
            this.renderDrawerListView = function(emailer, view) {

                // if the drawerListViewModel has not been created previously.
                if (!_this.drawerListViewModel) {

                    // Create a new DrawerListViewModel.
                    _this.drawerListViewModel = new DrawerListViewModel(_this.dataController.getMenu());

                    // Apply the KO bindings between the newly created view model and the existing view container.
                    ko.applyBindings(_this.drawerListViewModel, $('#nav')[0]);

                    // Add the drawer list view html template(view) to the view model which will render in the UI.
                    _this.drawerListViewModel.template(tpl.get('drawer-list-view'));

                    // remove the bindings from the container, so we can add bindings to the added template later.
                    ko.cleanNode($('#nav')[0]);

                    // applying KO bindings to the drawerListViewModel and the drawer view.
                    ko.applyBindings(_this.drawerListViewModel, $('#drawer-menu-container')[0]);

                    // if the drawerListViewModel has already been rendered.
                }
                _this.renderViews(emailer, view)
            };



            /**
             * A function to initialize the rendering of a tab view. Creates view config data and initializes the data requests.
             * @param {string} view - the type of view needed to display the requested data.
             */
            this.renderViews = function(emailer, view) {

                // requiring the view model modules and css required for the views.
                requirejs(
                    [
                        'css!css/spinner-view.css',
                        'css!css/error404-view.css',
                        'css!css/create-emailer-view.css',
                        'css!css/edit-emailer-view.css',
                        'emailer_list_view_model',
                        'create_emailer_view_model',
                        'edit_emailer_view_model',
                        'settings_view_model',
                        'error404_view_model'
                    ],
                    function(
                        spinnerCss,
                        error404Css,
                        createEmailerCss,
                        editEmailerCss,
                        EmailerListViewModel,
                        CreateEmailerViewModel,
                        EditEmailerViewModel,
                        SettingsViewModel,
                        Error404ViewModel
                    ) {
                        let isError = false;
                        let viewConfigData;

                        console.log(view);

                        switch (view) {

                            case 'listEmailer':

                                // Creating an object literal containing the necessary data to later (after receiving a data response) render
                                // the view corresponding to the data returned.
                                viewConfigData = {
                                    viewVariable: 'emailerListView',
                                    viewModelVariable: 'emailerListViewModel',
                                    viewModelConstructor: EmailerListViewModel,
                                    containerView: '#emailer-list-container-view',
                                    template: tpl.get('emailer-list-view'),
                                    el: '#emailer-list-view',
                                };
                                break;

                            case 'createEmailer':

                                // Creating an object literal containing the necessary data to later (after receiving a data response) render
                                // the view corresponding to the data returned.
                                viewConfigData = {
                                    viewVariable: 'createEmailerView',
                                    viewModelVariable: 'createEmailerViewModel',
                                    viewModelConstructor: CreateEmailerViewModel,
                                    containerView: '#create-emailer-container-view',
                                    template: tpl.get('create-emailer-view'),
                                    el: '#create-emailer-view',
                                };
                                break;

                            case 'editEmailer':

                                // Creating an object literal containing the necessary data to later (after receiving a data response) render
                                // the view corresponding to the data returned.
                                viewConfigData = {
                                    viewVariable: 'editEmailerView',
                                    viewModelVariable: 'editEmailerViewModel',
                                    viewModelConstructor: EditEmailerViewModel,
                                    containerView: '#edit-emailer-container-view',
                                    template: tpl.get('edit-emailer-view'),
                                    el: '#edit-emailer-view',
                                    emailer: emailer
                                };
                                break;

                            case 'settings':

                                // Creating an object literal containing the necessary data to later (after receiving a data response) render
                                // the view corresponding to the data returned.
                                viewConfigData = {
                                    viewVariable: 'settingsView',
                                    viewModelVariable: 'settingsViewModel',
                                    viewModelConstructor: SettingsViewModel,
                                    containerView: '#settings-container-view',
                                    template: tpl.get('settings-view'),
                                    el: '#settings-view'
                                };
                                break;

                            case 'error404':

                                // Creating an object literal containing the necessary data to later (after receiving a data response) render
                                // the view corresponding to the data returned.
                                viewConfigData = {
                                    viewVariable: 'error404View',
                                    viewModelVariable: 'error404ViewModel',
                                    viewModelConstructor: Error404ViewModel,
                                    containerView: '#error404-container-view',
                                    template: tpl.get('error404-view'),
                                    el: '#error404-view'
                                };
                                isError = true;
                                break;

                            case 'spinner':

                                // Creating an object literal containing the necessary data to later (after receiving a data response) render
                                // the view corresponding to the data returned.
                                viewConfigData = {
                                    viewVariable: 'spinnerView',
                                    viewModelVariable: 'spinnerViewModel',
                                    viewModelConstructor: SpinnerViewModel,
                                    containerView: '#spinner-container-view',
                                    template: tpl.get('spinner-view'),
                                    el: '#spinner-view'
                                };
                                break;
                        }
                        if (!_this[viewConfigData.viewModelVariable]) {

                            _this.renderView(emailer, viewConfigData, isError)

                        } else {

                            _this.toggleViews(viewConfigData);

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

                // Calling custom function to hide the currently rendered view.
                _this.hideCurrentView();

                // Creating the new view model from vcd (viewConfigData) parameter.
                _this[vcd.viewModelVariable] = new vcd.viewModelConstructor(vcd.place, data, isError, _this);

                // Checking if the element has bindings applied. If no bindings have previously been applied to this element then apply bindings. 
                if (!!!ko.dataFor($(vcd.containerView)[0])) {
                    ko.applyBindings(_this[vcd.viewModelVariable], $(vcd.containerView)[0]);
                }

                // Setting the html template of the newly created viewModel 
                _this[vcd.viewModelVariable].template(vcd.template);

                // Removing the KO bindings once the template has been rendered.
                ko.cleanNode($(vcd.containerView)[0]);

                console.log('Step-1');
                // Applying the bindings to the newly rendered html template.
                ko.applyBindings(_this[vcd.viewModelVariable], $(vcd.el)[0]);
                console.log('Step-2');
                // Creating a object literal containing the currently active viewModel and currently visible element.
                // Need this reference when removing the view.
                _this.currentView = { currentView: $(vcd.el)[0], viewModel: _this[vcd.viewModelVariable] };
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
             * a function to hide the previously rendered view.  This function is called prior to showing/rendering of a new view. This is necessary to avoid massive
             * memory leaks.
             */
            this.toggleViews = function(vcd) {

                // if the view exists
                if (_this.currentView.viewModel) {
                    _this.currentView.viewModel.showView(false);
                }
                _this.currentView = { currentView: $(vcd.el)[0], viewModel: _this[vcd.viewModelVariable] };
                _this.currentView.viewModel.showView(true); 
            };



            /**
             * a function to hide the previously rendered view.  This function is called prior to showing/rendering of a new view. This is necessary to avoid massive
             * memory leaks.
             */
            this.hideCurrentView = function() {

                // if the view exists
                if (_this.currentView) {

                    _this.currentView.viewModel.showView(false);
                }
            };
        };

        // retruning a new Main object.
        return new Main();
    });
