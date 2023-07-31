@IsTest
private class ResourceRequestTriggerHandlerTest
{
    @TestSetup
    static void setup()
    {
        Location__c location = new Location__c(Name = 'Minsk');
        insert location;
        Employee__c employee = new Employee__c(Name = 'Toby Green', Location__c = location.Id, Email__c = 'toby@email.com');
        insert employee;
        Project__c project = new Project__c(Name = 'Good Project');
        insert project;
        Resource_Request__c resourceRequest = new Resource_Request__c(Employee__c = employee.Id, Project__c = project.Id,
                From__c = Date.today().toStartOfWeek(), To__c = Date.today().toStartOfWeek().addDays(6), Resource_Allocation__c = '50%');
        insert resourceRequest;
    }

    @IsTest
    static void testCheckDatesCheckCapacity()
    {
        Employee__c employee = [SELECT Id FROM Employee__c LIMIT 1].get(0);
        Project__c project = [SELECT Id FROM Project__c LIMIT 1].get(0);
        Test.startTest();
            insert new Resource_Request__c(Employee__c = employee.Id, Project__c = project.Id,
                    From__c = Date.today().toStartOfWeek(), To__c = Date.today().toStartOfWeek().addDays(6), Resource_Allocation__c = '50%');
        Test.stopTest();
    }

}