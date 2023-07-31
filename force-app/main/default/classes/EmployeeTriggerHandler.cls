public class EmployeeTriggerHandler
{
    private final List<Employee__c> newList;
    private final List<Employee__c> oldList;
    private final TriggerOperation context;

    public EmployeeTriggerHandler(List<Employee__c> newList, List<Employee__c> oldList, TriggerOperation context)
    {
        Exceptions.whenever(newList == null && oldList == null)?.raise.bad.argument(EmployeeTriggerHandler.class.getName() + '.<constructor>(List<Employee__c> newList, List<Employee__c> oldList, TriggerOperation context): ERROR: '
            + 'Argument newList:List<Employee__c> and oldList:List<Employee__c> cannot both be null!');

        this.newList = newList;
        this.oldList = oldList;
        this.context = context;
    }

    public void handle()
    {
        if (context == TriggerOperation.BEFORE_INSERT || context == TriggerOperation.BEFORE_UPDATE)
        {
            handleName();
        }
    }

    private void handleName()
    {
        for (Integer i = 0, n = this.newList.size(); i < n; i++)
        {
            Employee__c newRecord = this.newList.get(i);
            Employee__c oldRecord = this.oldList?.get(i);
            if (newRecord.Name != oldRecord?.Name)
            {
                List<String> nameList = newRecord.Name.normalizeSpace().split(' ');
                newRecord.Last_Name__c = nameList.get(0);
                newRecord.First_Name__c = nameList.size() > 1 ? nameList.get(1) : null;
            }
        }
    }

}