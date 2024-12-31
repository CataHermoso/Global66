import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import fetchContacts from '@salesforce/apex/contactmanagementsystemcontroller.rContacts';
import createContact from '@salesforce/apex/contactmanagementsystemcontroller.cContacts';
import deleteContacts from '@salesforce/apex/contactmanagementsystemcontroller.dContacts';
import updateContacts from '@salesforce/apex/contactmanagementsystemcontroller.uContacts';

export default class contactManagementSystem extends LightningElement {
    contact = {
        FirstName__c: '',
         LastName__c: '',
         Email__c: '',
         Phone__c: ''
    };
    @track contacts = []; //stores list of fetched contacts
    selectedRows = [];
    @track draftValues = []; // tracks the updated values in the table
    @track filteredContacts = [];
    firstName = '';
    lastName = '';
    email = '';
    phone = '';
    @track searchKey = '';
    columns = [
        { label: 'First Name', fieldName: 'FirstName__c', type: 'text', editable: true },
        { label: 'Last Name', fieldName: 'LastName__c', type: 'text', editable: true },
        { label: 'Email', fieldName: 'Email__c', type: 'email', editable: true },
        { label: 'Phone', fieldName: 'Phone__c', type: 'phone', editable: true }
    ];
    @track isEditing = false;
    isLoading = false;

    connectedCallback() {
        this.handleFetchContacts();
    }

    handleFetchContacts() {        
        fetchContacts(  )
            .then((result) => {
                this.contacts = result;
                this.filteredContacts = [...this.contacts];
            })
            .catch((error) => {
                this.showToast('Error', 'We could not fetch the information about the Contacts', 'error');
            })
            .finally(() => {
                this.isLoading = false;
            });
    }
    
    handleInputChange(event) {
        const field = event.target.name;
        this[field] = event.target.value;
    }

    //creating a contact
    handleAddContact() {
        if (!this.email) {
            this.showToast('Error', 'Email is required', 'error');
            return;
        }
        const newContact = {
            FirstName__c: this.firstName,
            LastName__c: this.lastName,
            Email__c: this.email,
            Phone__c: this.phone
        };
        this.isLoading = true;

        createContact({ contact: newContact })
            .then((result) => {
                this.handleFetchContacts();
                this.clearForm();
                this.showToast('Success', 'Contact created successfully', 'success');
            })
            .catch((error) => {
                this.showToast('Error', 'Contact could not be created successfully', 'error');
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    //clearing all form fields
    clearForm() {
        this.template.querySelectorAll('lightning-input').forEach(input => (input.value = ''));
    }   
    
    handleRowSelection(event) {
        try {
            const selectedRows = event.detail.selectedRows;
            this.selectedRows = selectedRows ? selectedRows.map(row => row.Id) : [];
        } catch (error) {
            console.error('Error in handleRowSelection:', error);
        }
    }
    
    //deleting contacts
    handleDeleteContacts(contactIds) {
        if (!this.selectedRows || this.selectedRows.length === 0) {
            this.showToast('Error', 'No contacts selected for deletion', 'error');
            return;
        }
        contactIds = Array.isArray(this.selectedRows) ? this.selectedRows : [this.selectedRows];
        if (!Array.isArray(this.selectedRows) || this.selectedRows.length === 0) {
            this.showToast('Error', 'Invalid selection', 'error');
            return;
        }
        this.isLoading = true;
        
        deleteContacts({ contactIds: this.selectedRows })
            .then(() => {
                this.contacts = this.contacts.filter(contact => !this.selectedRows.includes(contact.Id));
                this.filteredContacts = this.filteredContacts.filter((contact) => !this.selectedRows.includes(contact.Id));
                this.selectedRows = [];
                this.showToast('Success', 'Contact deleted successfully', 'success');
                this.handleFetchContacts();
            })
            .catch((error) => {
                this.showToast('Error', 'Contact could not be deleted successfully', 'error');
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    //updating contacts
    handleSaveContacts(event) {
        const updatedContacts = event.detail.draftValues;
        const contactsToUpdate = updatedContacts.map(draft => {
            const originalRecord = this.contacts.find(contact => contact.Id === draft.Id);
            return { ...originalRecord, ...draft }; // Merge original and draft value s
        });
        if (!updatedContacts || updatedContacts.length === 0) {
            this.showToast('Error', 'No changes to save', 'error');
            return;
        }
        const invalidContact = contactsToUpdate.find(contact => !contact.Email__c);
        if (invalidContact) {
            this.showToast('Error', 'Email is required', 'error');
            return;
        }

        updateContacts ({ contacts: contactsToUpdate })
            .then(() => {
                this.showToast('Success', 'Contact updated successfully', 'success');
                this.draftValues = [];
                this.isEditing = false;
                this.handleFetchContacts();
            })
            .catch((error) => {
                this.showToast('Error', 'Contact/s could not be updated successfully', 'error');
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    handleSearchContactList(event) {
        this.searchKey = event.target.value.toLowerCase(); 
        if (this.searchKey.length > 1) {
            this.filteredContacts = this.contacts.filter(
                (contact) =>
                    (contact.FirstName__c && contact.FirstName__c.toLowerCase().startsWith(this.searchKey)) ||
                    (contact.LastName__c && contact.LastName__c.toLowerCase().startsWith(this.searchKey))
            );
        } else {
            this.filteredContacts = [...this.contacts];
        } 
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(event);
    }
}