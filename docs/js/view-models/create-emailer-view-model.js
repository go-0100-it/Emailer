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

            const electron = require('electron');
            const { ipcRenderer } = electron;
            let $ = require('jquery');
            let filePath = 'data/contacts';

            // creating a template observable to render the views html.
            this.template = ko.observable();

            // creating an observable to toggle the views state, true for visible and false for hidden.
            this.showView = ko.observable(true);

            // creating an observable to toggle the views state, true for visible and false for hidden.
            this.showName = ko.observable(true);

            // creating an observable to toggle the views state, true for visible and false for hidden.
            this.showContacts = ko.observable(false);

            // creating an observable to toggle the views state, true for visible and false for hidden.
            this.showDetails = ko.observable(false);

            // creating an observable to toggle the views state, true for visible and false for hidden.
            this.showNextBtn = ko.observable(true);

            // creating an observable to toggle the views state, true for visible and false for hidden.
            this.showPrevBtn = ko.observable(false);

            // creating an observable to toggle the views state, true for visible and false for hidden.
            this.showSaveBtn = ko.observable(false);

            this.emailerName = ko.observable();

            this.dept = ko.observable();

            this.title = ko.observable();

            this.cc = ko.observable();

            this.name = ko.observable();

            this.email = ko.observable();

            this.primaryContacts = ko.observableArray();

            this.ccContacts = ko.observableArray();

            this.subject = ko.observable();

            this.body = ko.observable();

            this.emailer = ko.observable({});
            
            this.Emailer = function(){ 
                return {
                    name: _this.emailerName(),
                    primary_contacts: _this.primaryContacts(),
                    carbon_copy_contacts: _this.ccContacts(),
                    email_subject: _this.subject(),
                    email_body: _this.body()
                }
            };

            // keeping reference to the main controller object
            var Main = main;

            this.onAddClick = function(){
                let validatedEntry = _this.validateEntry();
                if(validatedEntry.result){
                    _this.addContact(validatedEntry.contact);
                }
            };


            this.onNextClick = function(){
                if(_this.showName()){
                    if(_this.emailerName()){
                        _this.showName(false);
                        _this.showContacts(true);
                        _this.showPrevBtn(true);
                    }else{
                        window.alert('Our new emailer needs a name.');
                    }
                }else{
                    if(_this.emailerName()){
                        _this.showContacts(false);
                        _this.showDetails(true);
                        _this.showNextBtn(false);
                        _this.showSaveBtn(true);
                    }else{
                        window.alert('Our new emailer needs at least one contact.');
                    }
                }
            };

            this.onPrevClick = function(){
                if(_this.showContacts()){
                    _this.showContacts(false);
                    _this.showName(true);
                    _this.showPrevBtn(false);
                }else{
                    _this.showDetails(false);
                    _this.showContacts(true);
                    _this.showNextBtn(true);
                    _this.showSaveBtn(false);
                }
            };

            this.onSaveClick = function(){
                window.alert('You clicked Save.');
            };


            /**
             * A function to delegate to the Main Controllers addEmailer function, the addition of a new emailer object to the drawer list.
             */
            this.addContact = function(contact) {
                if(contact.cc){
                    _this.ccContacts.push(contact);
                }else{
                    _this.primaryContacts.push(contact);
                }
                
            }


            /**
             * A function to delegate to the Main Controllers addEmailer function, the addition of a new emailer object to the drawer list.
             */
            this.addEmailer = function(contact) {

                ipcRenderer.send('request:addContact', contact, filePath);

                ipcRenderer.on('return:addContactSuccess', (event, msg, contact) => {
                    //addEntry(contact);
                    window.alert(msg);
                    _this.dept('');
                    _this.title('');
                    _this.name('');
                    _this.email('');
                    _this.cc(false);
                });
                
                // creating a new place object from the event object.
                var newEmailer = {
                    
                };

                // delegating the addition of a new place object to the drawerListViewModel's addPlace function.
                Main.drawerListViewModel.addEmailer(newEmailer);
            };

            this.validateEntry = function(){

                let contact = { 
                        dept: _this.dept(),
                        title: _this.title(),
                        name: _this.name(),
                        email: _this.email(),
                        cc: _this.cc()
                    };

                result = false;
                if(contact.dept !== 'QC' && contact.dept !== "MTC" && contact.dept !== "PROD"){
                    window.alert("You must enter a valid department.\n\n- QC\n- MTC\n- PROD");
                }else if(contact.title !== 'TM' && contact.title !== "TL" && contact.title !== "GL" && contact.title !== "AM"){
                    window.alert("You must enter a valid title.\n\n- TM\n- TL\n- GL\n- AM");
                }else if(contact.name === "" || contact.name === " " || contact.name === "  " || contact.name === undefined){
                    window.alert("You must enter a name.");
                }else if(contact.email === "" || contact.email === " " || contact.email === "  " || contact.email === undefined){
                    window.alert("You must enter a email address.");
                }else if(!contact.email.includes('@') || (!contact.email.includes('.com') && !contact.email.includes('.ca')) || (contact.email.lastIndexOf('.ca') !== (contact.email.length - 3) && contact.email.lastIndexOf('.com') !== contact.email.length - 4)){
                    window.alert("Please enter a valid email address.");
                }else{
                    result = true;
                }
                return {
                    result: result,
                    contact: contact
                    };
            };

            // returning the EventsListViewModel
            return this;
        };

        // returning the EventsListViewModel constructor
        return CreateEmailerViewModel;
    });
