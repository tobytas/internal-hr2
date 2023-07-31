trigger ResourceRequestTrigger on Resource_Request__c (before insert, before update, before delete,
                                                       after insert, after update, after delete, after undelete)
{
    new ResourceRequestTriggerHandler(Trigger.new, Trigger.old, Trigger.operationType).handle();

}