public class EmployeeVacationController
{
    private static final String TIME_ENTRY_VACATION_TYPE = 'Paid Vacation';

    @AuraEnabled(Cacheable=true)
    public static Employee__c getVacationInfo(Id employeeId)
    {
        return [SELECT Location__r.Vacation_Days_per_Year__c, Vacation_Days_Year_to_Date__c, (SELECT From__c, To__c FROM TimeEntries__r
                WHERE Type__c = :TIME_ENTRY_VACATION_TYPE AND From__c = THIS_YEAR) FROM Employee__c WHERE Id = :employeeId];
    }

}