@IsTest
public class contactmanagementsystemcontroller_Test {

    @IsTest
    static void testCreateContact() {
		Contact__c contact = new Contact__c (
            FirstName__c = 'TestCreate',
            LastName__c = 'Contact',
            Email__c = 'testCreate@example.com',
        	Phone__c = 123-456-7890
        );
        
        Test.startTest();
        contactmanagementsystemcontroller.cContacts(contact);
        Test.stopTest();

        List<Contact__c> insertedContacts = [SELECT Id FROM Contact__c WHERE Email__c LIKE 'testCreate@example.com'];
        System.assertEquals(1, insertedContacts.size());
    }

    @IsTest
    static void testUpdateContact() {
        Contact__c testContact = new Contact__c(
            FirstName__c = 'John',
            LastName__c = 'Doe',
            Email__c = 'test@example.com',
            Phone__c = 123-456-7890
        );
        insert testContact;
        testContact.Email__c = 'newemail@example.com';
        List<Contact__c> contactsToUpdate = new List<Contact__c>{testContact};

        Test.startTest();
        contactmanagementsystemcontroller.uContacts(contactsToUpdate);
        Test.stopTest();

        Contact__c updatedContact = [SELECT Email__c FROM Contact__c WHERE Id = :testContact.Id];
        System.assertEquals('newemail@example.com', updatedContact.Email__c);
    }

    @IsTest
    static void testDeleteContact() {
        Contact__c testContact = new Contact__c(
            FirstName__c = 'Jane',
            LastName__c = 'Doe',
            Email__c = 'delete@example.com',
            Phone__c = 123-456-7890
        );
        insert testContact;

        Test.startTest();
        contactmanagementsystemcontroller.dContacts(new List<Id>{testContact.Id});
        Test.stopTest();

        Integer deletedContactsCount = [SELECT COUNT() FROM Contact__c WHERE Id = :testContact.Id];
        System.assertEquals(0, deletedContactsCount);
    }

    @IsTest
    static void testRetrieveContacts() {
        Contact__c testContact = new Contact__c(
            FirstName__c = 'Alice',
            LastName__c = 'Smith',
            Email__c = 'retrieve@example.com',
            Phone__c = 123-456-7890
        );
        insert testContact;

        Test.startTest();
        List<Contact__c> retrievedContacts = contactmanagementsystemcontroller.rContacts();
        Test.stopTest();

        System.assert(retrievedContacts.size() > 0);
        Boolean isTestContactPresent = false;
        for (Contact__c contact : retrievedContacts) {
            if (contact.Email__c == 'retrieve@example.com') {
                isTestContactPresent = true;
                break;
            }
        }
        System.assertEquals(false, isTestContactPresent);
    }
}