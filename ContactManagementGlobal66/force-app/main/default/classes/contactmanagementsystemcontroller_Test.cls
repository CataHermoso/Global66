@IsTest
public class contactmanagementsystemcontroller_Test {

    @IsTest
    static void testCContacts() {
        Contact__c testContact = new Contact__c(FirstName__c = 'TestCreate', LastName__c = 'Contact', Email__c = 'testCreate@example.com');
        Contact__c testContactFail = new Contact__c(FirstName__c = 'TestCreate', LastName__c = 'Contact');

        Test.startTest();
        contactmanagementsystemcontroller.cContacts(testContact);
        Boolean exceptionThrown = false;
        try {
        	contactmanagementsystemcontroller.cContacts(testContactFail);
        } catch (AuraHandledException  e) {
    		System.debug('Actual Exception Message: ' + e.getMessage());
            System.assert(e.getMessage().startsWith('Error creating new Contact '), 'Unexpected exception message: ' + e.getMessage());
        	exceptionThrown = true;
        }
        Test.stopTest();

        List<Contact__c> insertedContacts = [SELECT Id FROM Contact__c WHERE Email__c LIKE 'testCreate@example.com'];
        System.assertEquals(1, insertedContacts.size());
        System.assert(exceptionThrown, 'Expected AuraHandledException to be thrown.');
    }
    
    @IsTest
    static void testUContacts() {
        Contact__c testContact = new Contact__c(FirstName__c = 'TestUpdate', LastName__c = 'Contact', Email__c = 'testUpdate@example.com');
        Contact__c testContactFail = new Contact__c(FirstName__c = 'TestCreate', LastName__c = 'Contact', Email__c = 'testUpdate@example.com');

        insert testContact;
        insert testContactFail;

        testContact.FirstName__c = 'TestUpdate_Updated';
        testContactFail.Email__c = '';
        List<Contact__c> contactsToUpdate = new List<Contact__c>{testContact};
        List<Contact__c> contactsToUpdateFail = new List<Contact__c>{testContactFail};

        Test.startTest();
        Boolean exceptionThrown = false;
        contactmanagementsystemcontroller.uContacts(contactsToUpdate);
        try {
	        contactmanagementsystemcontroller.uContacts(contactsToUpdateFail);            
        } catch (AuraHandledException  e) {
        	exceptionThrown = true;
            System.assert(e.getMessage().startsWith('Error updating new Contact/s '));
        }
        Test.stopTest();

        Contact__c updatedContact = [SELECT FirstName__c FROM Contact__c WHERE Id = :testContact.Id];
        System.assertEquals('TestUpdate_Updated', updatedContact.FirstName__c);
    }
    
    @IsTest
    static void testDContacts() {
        Contact__c testContact = new Contact__c(FirstName__c = 'TestDelete', LastName__c = 'Contact', Email__c = 'testDelete@example.com');
        insert testContact;

        List<Id> contactIdsToDelete = new List<Id>{testContact.Id};

        Test.startTest();
        contactmanagementsystemcontroller.dContacts(contactIdsToDelete);
        try {
        	contactmanagementsystemcontroller.dContacts(contactIdsToDelete);
        } catch (Exception e) {
        	throw new AuraHandledException('Error deleting Contact/s ' + e.getMessage());
        }
        Test.stopTest();

        List<Contact__c> deletedContacts = [SELECT Id FROM Contact__c WHERE Id = :testContact.Id];
        System.assertEquals(0, deletedContacts.size());
    }
    
    @IsTest
    static void testRContacts() {
        Contact__c testContact = new Contact__c(FirstName__c = 'TestRetrieve', LastName__c = 'Contact', Email__c = 'testRetrieve@example.com');
        Contact__c testContact1 = new Contact__c(FirstName__c = 'TestRetrieve', LastName__c = 'Contact', Email__c = 'testRetrieve@example.com');
        insert new List<Contact__c> { testContact, testContact1 };
        List<Id> contactIdsToDelete = new List<Id>{testContact.Id, testContact1.Id};

        Test.startTest();
        List<Contact__c> retrievedContacts = contactmanagementsystemcontroller.rContacts();
        Test.stopTest();

        System.assert(retrievedContacts.size() > 0, 'Contacts should have been retrieved');
    }
}