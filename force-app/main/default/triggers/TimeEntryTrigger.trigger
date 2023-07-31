trigger TimeEntryTrigger on TimeEntry__c (before insert, before update, before delete,
                                          after insert, after update, after delete, after undelete)
{
    new TimeEntryTriggerHandler(Trigger.new, Trigger.old, Trigger.operationType).handle();

}