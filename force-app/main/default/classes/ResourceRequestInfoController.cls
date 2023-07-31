public class ResourceRequestInfoController
{
    @AuraEnabled(Cacheable=true)
    public static List<Employee__c> getEmployeesWithRequests(String startDate, String endDate)
    {
        return [SELECT Name, Team__c, (SELECT Role__c, Employee_Name__c, Project_Name__c, From__c, To__c,  Resource_Allocation__c FROM Resource_Requests__r
                WHERE To__c >= :Date.valueOf(startDate) AND From__c <= :Date.valueOf(endDate)) FROM Employee__c ORDER BY Team__c NULLS LAST, Name];
    }

}