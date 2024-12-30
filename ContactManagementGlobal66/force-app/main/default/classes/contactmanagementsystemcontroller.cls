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
        if (contactIds == null || contactIds.isEmpty()) {
            throw new AuraHandledException('No contact IDs provided');
        }
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

    //search contacts
    @AuraEnabled(cacheable=true)
    public static List<Contact__c> getContactList(string searchKey) {
        string searchKeyword = '%' + searchKey + '%';
		
       // contact list to store search result 
    List<Contact__c> contactListRecord = new List<Contact__c>();
     
	   // query contact records
        for(Contact__c contactSearched : [
            SELECT Id, FirstName__c, LastName__c, Email__c, Phone__c 
            FROM Contact__c
            WHERE name LIKE : searchKeyword]){
            contactListRecord.add(contactSearched);
        }
        
         if(contactListRecord.size() == 0){
            throw new AuraHandledException('No Record Found..'); 
         }
         
        return contactListRecord;
    }
}