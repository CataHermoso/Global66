public with sharing class ContactManagementSystemController {
    private static void cContacts(List<Contacto> contacts) {
        for (Contact c : contacts) {
            if (c.Email != null) {
                insert c;
            } else {
                System.addError('Email is required');
            }
        }
    }

    private static void uContacts(List<Contact> contacts) {
        for (Contact c : contacts) {
            if (c.Email != null) {
                update c;
            } else {
                System.addError('Email is required');
            }
        }
    }

    private static void dContacts(List<Contacto> contacts) {
        for (Contact c : contacts) {
            delete c;
        }
    }

    private static List<Contact> rContacts() {
        List<Contact> contacts = [SELECT Id, FirstName, LastName, Email, Phone FROM Contact__c];
        List<Contact> result = new List<Contact>();
        for (Contact c : contacts) {
            if(c.Email <> null) {
                results.add(c);
            }
        }
        // return result;
    }
}