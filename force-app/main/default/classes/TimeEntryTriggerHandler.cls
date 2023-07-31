public class TimeEntryTriggerHandler
{
    private final List<TimeEntry__c> newList;
    private final List<TimeEntry__c> oldList;
    private final TriggerOperation context;
    
    public TimeEntryTriggerHandler(List<TimeEntry__c> newList, List<TimeEntry__c> oldList, TriggerOperation context)
    {
        this.newList = newList;
        this.oldList = oldList;
        this.context = context;
    }
    
    public void handle()
    {
        if (context == TriggerOperation.AFTER_INSERT)
        {
            invokeApprovalProcesses();
        }
    }
    
    private void invokeApprovalProcesses()
    {
        new TimeEntryApproveHelper(newList).sendForApproval();
    }
}