@IsTest
private class EmployeeVacationControllerTest
{
    @TestSetup
    static void setup()
    {
        Location__c location = new Location__c(Name = 'Minsk');
        insert location;

        Employee__c employee = new Employee__c(Email__c = 'employee@email.com');
        insert employee;

        TimeEntry__c timeEntry = new TimeEntry__c(From__c = Date.today(), To__c = Date.today(), Employee__c = employee.Id, Location__c = location.Id, Type__c = 'Training', Hours__c = 3);
        insert timeEntry;
    }

    @IsTest
    static void testGetVacationInfo()
    {
        Employee__c employee = [SELECT Id FROM Employee__c LIMIT 1];
        Test.startTest();
            EmployeeVacationController.getVacationInfo(employee.Id);
        Test.stopTest();
    }

}