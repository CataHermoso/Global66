public with sharing class ContactManagementSystemController {

    // Create Contact
    @AuraEnabled
    private static void cContacts(List<Contacto> contacts) {
        try {
            for (Contact c : contacts) {
                if (String.isEmpty(c.Email)) {
                    throw new AuraHandledException('Email is Required');
                }
            }
            insert contacts;
        } catch (Exception e) {
            throw new AuraHandledException('Error creating new Contact/s');
        }
    }

    //Update Contact
    @AuraEnabled
    private static void uContacts(List<Contact> contacts) {
        try {
            for (Contact c : contacts) {
                if (String.isEmpty(c.Email)) {
                    throw new AuraHandledException('Email is Required ' + e.getMessage());
                }
            }
            update contacts;
        } catch (Exception e) {
            throw new AuraHandledException('Error updating new Contact/s ' + e.getMessage());
        }
    }

    //Delete Contact
    @AuraEnabled
    private static void dContacts(List<Contacto> contactsIds) {
        try {
            List<Contact__c> contactsToDelete = [SELECT Id FROM Contact__c WHERE Id IN :contactsIds]
            delete contactsToDelete;
        } catch (Exception e) {
            throw new AuraHandledException('Error deleting Contact/s ' + e.getMessage());
        }
    }

    //Get Contacts
    @AuraEnabled (cacheable=true)
    private static List<Contact> rContacts() {
        try {
            return [
                SELECT Id, FirstName__c, LastName__c, Email__c, Phone__c 
                FROM Contact__c
                WHERE Email__c != null
            ];
        } catch (Exception e) {
            throw new AuraHandledException('Error retrieving Contact/s ' + e.getMessage());
        }
    }
}