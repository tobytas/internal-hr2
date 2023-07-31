@IsTest
private class FilterControllerTest
{
    @TestSetup
    static void setup()
    {
        Location__c location = new Location__c(Name = 'Test');
        insert location;

        Employee__c employee = new Employee__c(Location__c = location.Id, Email__c = 'employee@email.com');
        insert  employee;

        TimeEntry__c timeEntry = new TimeEntry__c(Type__c = FilterController.HOLIDAY_TIME_ENTRY_TYPE,
                From__c = Date.valueOf('2023-07-06'), To__c = Date.valueOf('2023-07-06'), Location__c = location.Id, Hours__c = 3);
        insert  timeEntry;
    }

    @IsTest
    static void testGetEmployeesForLocations()
    {
        Location__c location = [SELECT Id FROM Location__c LIMIT 1];
        Test.startTest();
            FilterController.getEmployeesForLocations(new List<Id>{location.Id});
        Test.stopTest();
    }

    @IsTest
    static void testGetTimeEntries()
    {
        Location__c location = [SELECT Id FROM Location__c LIMIT 1];
        Employee__c employee = [SELECT Id FROM Employee__c LIMIT 1];
        Test.startTest();
            FilterController.getTimeEntries(new List<Id>{employee.Id}, new List<Id>{location.Id}, new List<String>{}, '2023-07-01', '2023-07-31');
        Test.stopTest();
    }

    @IsTest
    static void testGetEmployeeInfo()
    {
        Employee__c employee = [SELECT Id FROM Employee__c LIMIT 1];
        Test.startTest();
            FilterController.getEmployeeInfo(employee.Id);
        Test.stopTest();
    }

}