public class UtilizationController
{
    private static final String WORK_TYPE = 'Work Hours';
    private static final String HOLIDAY_TYPE = 'Holiday';

//    @AuraEnabled(Cacheable=true)
//    public static Decimal getUtilization(Id employeeId, Date startDate, Date endDate)
//    {
//        Location__c location = [SELECT TargetWorkingHoursPerDay__c, Target_Working_Days__c FROM Location__c WHERE Id IN (SELECT Location__c FROM Employee__c WHERE Id = :employeeId)];
//        List<String> workingDaysNames = location.Target_Working_Days__c.split(';');
//
//        Decimal plannedWorkingHours = 0;
//        for (Date day = startDate; day <= endDate; day = day.addDays(1))
//        {
//            if (workingDaysNames.contains(((Datetime) day).format('E')))
//            {
//                plannedWorkingHours += location.TargetWorkingHoursPerDay__c;
//            }
//        }
//
//        Decimal actualWorkingHours = 0;
//        for (TimeEntry__c each : [SELECT Type__c, Hours__c FROM TimeEntry__c WHERE ((Type__c = :WORK_TYPE AND Employee__c = :employeeId) OR (Type__c = :HOLIDAY_TYPE AND Location__c = :location.Id))
//                                  AND Date__c >= :startDate AND Date__c <= :endDate])
//        {
//            if (each.Type__c == WORK_TYPE)
//            {
//                actualWorkingHours += each.Hours__c;
//            }
//            if (each.Type__c == HOLIDAY_TYPE)
//            {
//                plannedWorkingHours -= each.Hours__c;
//            }
//        }
//
//        System.debug(plannedWorkingHours);
//        System.debug(actualWorkingHours);
//        System.debug(plannedWorkingHours != 0 ? actualWorkingHours / plannedWorkingHours * 100 : 0);
//
//        return plannedWorkingHours != 0 ? actualWorkingHours / plannedWorkingHours * 100 : 0;
//
//        return null;
//    }

}