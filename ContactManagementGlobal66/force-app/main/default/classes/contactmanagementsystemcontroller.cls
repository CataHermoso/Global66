public with sharing class contactmanagementsystemcontroller {

    // Create Contact
    @AuraEnabled
    public static void cContacts(Contact__c contact) {
        try {
            insert contact;
        } catch (Exception e) {
            throw new AuraHandledException('Error creating new Contact ' + e.getMessage());
        }
    }

    //Update Contact
    @AuraEnabled
    public static void uContacts(List<Contact__c> contacts) {
        try {
            update contacts;
        } catch (Exception e) {
            throw new AuraHandledException('Error updating new Contact/s ' + e.getMessage());
        }
    }

    //Delete Contact
    @AuraEnabled
    public static void dContacts(List<Id> contactIds) {
        try {
            delete [SELECT Id FROM Contact__c WHERE Id IN :contactIds];
        } catch (Exception e) {
            throw new AuraHandledException('Error deleting Contact/s ' + e.getMessage());
        }
    }

    //Get Contacts
    @AuraEnabled (cacheable = false)
    public static List<Contact__c> rContacts() {
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

    /*search contacts
    @AuraEnabled
    public static List<Contact__c> sContacts (string searchKey) {
        
        try { 
            if (String.isBlank(searchKey)) {
            return new List<Contact__c>();
            }
            String searchKeyWithWildcards = '%' + searchKey + '%';
            return [
                SELECT Id, FirstName__c, LastName__c, Email__c, Phone__c
                FROM Contact__c 
                WHERE FirstName__c LIKE :searchKeyWithWildcards 
                OR LastName__c LIKE :searchKeyWithWildcards
                LIMIT 3
                ];
        } catch (Exception e) {
        	throw new AuraHandledException('Error searching for contacts: ' + e.getMessage());

        }
    }*/
}