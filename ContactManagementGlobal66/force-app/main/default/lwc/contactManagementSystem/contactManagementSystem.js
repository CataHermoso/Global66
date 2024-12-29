import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import fetchContacts from '@salesforce/apex/contactmanagementsystemcontroller.rContacts';
import createContact from '@salesforce/apex/contactmanagementsystemcontroller.cContacts';
import deleteContacts from '@salesforce/apex/contactmanagementsystemcontroller.dContacts';
import updateContacts from '@salesforce/apex/contactmanagementsystemcontroller.uContacts';

export default class contactManagementSystem extends LightningElement {
    @track contact = {
        FirstName__c: '',
         LastName__c: '',
         Email__c: '',
         Phone__c: ''
    };
    @track contacts = []; //stores list of fetched contacts
    selectedContactIds = [];
    @track updatedContacts = []; // tracks the updated values in the table
    @track firstName = '';
    @track lastName = '';
    @track email = '';
    @track phone = '';
    @track isLoading = false;

    columns = [
        { label: 'First Name', fieldName: 'FirstName__c', type: 'text', editable: true },
        { label: 'Last Name', fieldName: 'LastName__c', type: 'text', editable: true },
        { label: 'Email', fieldName: 'Email__c', type: 'email', editable: true },
        { label: 'Phone', fieldName: 'Phone__c', type: 'phone', editable: true }
    ];

    handleFetchContacts() {

        this.isLoading = true;
        
        fetchContacts(  )
            .then((result) => {
                this.contacts = result;
            })
            .catch((error) => {
                this.showToast('Error', 'We could not fetch the information about the Contacts', 'error');
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    connectedCallback() {
        this.handleFetchContacts();
    }

    /*updating contacts
    handleSave(event) {
        if (!this.email) {
            this.showToast('Error', 'Email is required', 'error');
            return;
        }

        this.updatedContacts = event.detail.updatedContacts;

        updateContacts ({ contacts: this.updatedContacts })
            .then(() => {
                this.updatedContacts = [];
                this.handleFetchContacts();
                this.showToast('Success', 'Contact updated successfully', 'success');
            })
            .catch((error) => {
                console.error('Contact not updated: ', error);
                this.showToast('Error', 'Contact could not be updated successfully', 'error');
            })
            .finally(() => {
                this.isLoading = false;
            });
    }*/

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
                console.error('Contact not created: ', error);
                this.showToast('Error', 'Contact could not be created successfully', 'error');
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    //clearing all form fields
    clearForm() {
        this.refs.textArea.value = '';
        this.refs.textArea1.value = '';
        this.refs.textArea2.value = '';
        this.refs.textArea3.value = '';
    }
 
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const selectedRows = event.detail.selectedRows;
        console.log('Row data:', selectedRow);

        if (selectedRows && selectedRows.length > 0) {
            this.selectedContactIds = selectedRows.map(row => row.Id);  
            console.log('Selected Contact IDs:', this.selectedContactIds); 
        } else {
            this.selectedContactIds = []; 
            console.log('No rows selected.');
        }

        if (actionName === 'delete' && this.selectedContactIds.length > 0) {
            this.handleDeleteContacts()
        } else if (actionName === 'delete'){
            this.showToast('Error', 'No contac/s were selected for deletion', 'error')
        }
    }

    //deleting contacts
    handleDeleteContacts(contactId) {
        console.log('Deleting contact with ID:', contactId);
        if (this.selectedContactIds.length === 0) {
            this.showToast('Error', 'No Contact/s selected for deletion', 'error');
            return;
        }        
        
        this.isLoading = true;
        
        deleteContacts({ contactsIds: [this.selectedContactIds] })
            .then((result) => {
                this.contacts = this.contacts.filter(contact => !this.selectedContactIds.includes(contact.Id));
                this.showToast('Success', 'Contact deleted successfully', 'success');
                this.handleFetchContacts();
            })
            .catch((error) => {
                console.error('Error al eliminar contacto: ', error);
                this.showToast('Error', 'Contact could not be deleted successfully', 'error');
            })
            .finally(() => {
                this.isLoading = false;
            });
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