public class TimeEntryApproveHelper
{
    public enum ApproveAction {Approve, Reject, Removed}
    
    private final List<TimeEntry__c> timeEntriesToApprove;

    public TimeEntryApproveHelper(List<TimeEntry__c> timeEntriesToApprove)
    {
        this.timeEntriesToApprove = timeEntriesToApprove;
    }

    public void sendForApproval()
    {
        List<Approval.ProcessSubmitRequest> requests = new List<Approval.ProcessSubmitRequest>();
        List<TimeEntry__c> timeEntries = [SELECT Location__r.Vacation_Approval_Process_API_Name__c, Employee__r.Manager__r.User__c FROM TimeEntry__c WHERE Id IN :timeEntriesToApprove];
        for (TimeEntry__c timeEntry : timeEntries)
        {
            Approval.ProcessSubmitRequest req = new Approval.ProcessSubmitRequest();
            req.setProcessDefinitionNameOrId(timeEntry.Location__r.Vacation_Approval_Process_API_Name__c);
            req.setComments('Submitting request for approval.');
            req.setObjectId(timeEntry.Id);
            List<Id> approverIds = timeEntry.Employee__r.Manager__r?.User__c != null ? new List<Id>{timeEntry.Employee__r.Manager__r.User__c} : new List<Id>{UserInfo.getUserId()};
            req.setNextApproverIds(approverIds);

            requests.add(req);
        }
        List<Approval.ProcessResult> results = Approval.process(requests, false);

        List<Approval.ProcessWorkitemRequest> selfApprovedRequests = new List<Approval.ProcessWorkitemRequest>();
        for (Integer i = 0, n = results.size(); i < n; i++)
        {
            if (results.get(i).isSuccess() && timeEntries.get(i).Employee__r.Manager__r?.User__c == null)
            {
                Approval.ProcessWorkitemRequest req = new Approval.ProcessWorkitemRequest();
                req.setComments('Approving request.');
                req.setAction('Approve');
                req.setNextApproverIds(new List<Id>{UserInfo.getUserId()});
                req.setWorkitemId(results.get(i).getNewWorkitemIds().get(0));

                selfApprovedRequests.add(req);
            }
        }

        Approval.process(selfApprovedRequests, false);
    }

}