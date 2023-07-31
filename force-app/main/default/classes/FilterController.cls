public class FilterController
{
    public static final String HOLIDAY_TIME_ENTRY_TYPE = 'Holiday';

    @AuraEnabled(Cacheable=true)
    public static List<Employee__c> getEmployeesForLocations(List<Id> locationIds)
    {
        return [SELECT Name FROM Employee__c WHERE Location__c IN :locationIds];
    }

    @AuraEnabled(Cacheable=true)
    public static List<TimeEntry__c> getTimeEntries(List<Id> employeeIds, List<Id> locationIds, List<String> entryTypes, String startDate, String endDate)
    {
        Date leftEdge = Date.valueOf(startDate);
        Date rightEdge = Date.valueOf(endDate);
        String query = 'SELECT Name, Employee__r.Name, Date__c, From__c, To__c, Type__c, Hours__c, Comment__c '
                     + 'FROM TimeEntry__c WHERE To__c >= :leftEdge AND From__c <= :rightEdge';
        if (!locationIds.isEmpty())
        {
            query += ' AND Location__c IN :locationIds';
        }
        if (!employeeIds.isEmpty())
        {
            query += ' AND Employee__c IN :employeeIds';
        }
        if (!entryTypes.isEmpty())
        {
            query += ' AND Type__c IN :entryTypes';
        }
        query += ' ORDER BY Type__c';

        return Database.query(query);
    }

    @AuraEnabled(Cacheable=true)
    public static Employee__c getEmployeeInfo(Id employeeId)
    {
        return [SELECT First_Name__c, Last_Name__c, Location__r.Target_Working_Hours_per_Day__c,
                Location__r.Target_Working_Days__c, Location__r.Target_Working_Hours_Per_Week__c
                FROM Employee__c WHERE Id = :employeeId];
    }


    @AuraEnabled(Cacheable=true)
    public static Employee__c getEmployeeByEmail(String employeeEmail)
    {
        List<Employee__c> employees = [SELECT Id FROM Employee__c WHERE Email__c = :employeeEmail LIMIT 1];
        return employees.size() != 0 ? employees.get(0) : new Employee__c(Id = null);
    }

}