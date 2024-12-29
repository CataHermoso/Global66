import { LightningElement, track } from 'lwc';
import getContacts from '@salesforce/apex/ContactManagementSystemController.rContacts';
import createContacts from '@salesforce/apex/ContactManagementSystemController.cContacts';
import deleteContacts from '@salesforce/apex/ContactManagementSystemController.dContacts';
import updateContacts from '@salesforce/apex/ContactManagementSystemController.uContacts';

export default class contactManagementSystem extends LightningElement {
    @track contacts = []; //stores list of fetched contacts
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
        { label: 'Phone', fieldName: 'Phone__c', type: 'phone', editable: true },
        {
            type: 'button',
            typeAttributes: {
                label: 'Delete',
                name: 'delete',
                variant: 'destructive'
            }
        }
    ];

    connectedCallback() {
        this.fetchContacts();
    }

    fetchContacts() {
        this.isLoading = true;
        getContacts()
            .then((result) => {
                this.contacts = result;
            })
            .catch((error) => {
                console.error('No Contact was retrieved:', error);
                this.showToast('Error', 'We could not fetch the information about the Contacts', 'error');
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    handleSave(event) {
            this.updatedContacts = event.detail.updatedContacts;
            updateContacts ({ contacts: this.updatedContacts })
            .then(() => {
                this.updatedContacts = [];
                this.fetchContacts;
                this.showToast('Success', 'Contact updated successfully', 'success');
            })
            .catch((error) => {
                console.error('Contact updated successfully:', error);
                this.showToast('Error', 'Contact updated successfully', 'error');
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

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
        createContacts({ contacts: [newContact] })
            .then(() => {
                this.getContacts;
                this.clearForm();
                this.showToast('Success', 'Contact created successfully', 'success');
            })
            .catch((error) => {
                console.error('Contact could not be created successfully:', error);
                this.showToast('Error', 'Contact could not be created successfully', 'error');
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    //for after adding a new contact
    clearForm() {
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.phone = '';
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        if (actionName === 'delete') {
            this.deleteContact(row.Id);
        }
    }

    deleteContacts(contactId) {
        this.isLoading = true;
        deleteContacts({ contactIds: [contactId] })
            .then(() => {
                this.contacts = this.contacts.filter(contact => contact.Id !== contactId);
                this.showToast('Success', 'Contact deleted successfully', 'success');
            })
            .catch((error) => {
                console.error('Error al eliminar contacto:', error);
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