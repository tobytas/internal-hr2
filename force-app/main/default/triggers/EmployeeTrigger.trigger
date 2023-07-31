trigger EmployeeTrigger on Employee__c (before insert, before update, before delete,
                                        after insert, after update, after delete, after undelete)
{
    new EmployeeTriggerHandler(Trigger.new, Trigger.old, Trigger.operationType).handle();

}