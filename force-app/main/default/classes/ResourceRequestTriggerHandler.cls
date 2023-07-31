public class ResourceRequestTriggerHandler
{
    private final List<Resource_Request__c> newList;
    private final List<Resource_Request__c> oldList;
    private final TriggerOperation context;

    public ResourceRequestTriggerHandler(List<Resource_Request__c> newList, List<Resource_Request__c> oldList, TriggerOperation context)
    {
        this.newList = newList;
        this.oldList = oldList;
        this.context = context;
    }

    public void handle()
    {
        if (context == TriggerOperation.BEFORE_INSERT || context == TriggerOperation.BEFORE_UPDATE)
        {
            checkDates();
            checkCapacity();
        }
    }

    private void checkDates()
    {
        for (Resource_Request__c request : newList)
        {
            if (((Datetime) request.From__c).format('E') != 'Mon' || ((Datetime) request.To__c).format('E') != 'Sun')
            {
                request.addError('From must be Monday, To must be Sunday');
            }
        }
    }

    private void checkCapacity()
    {
        Set<Id> employeeIds = new Set<Id>();
        Date leftEdge = Date.today().toStartOfWeek();
        Date rightEdge = leftEdge.addDays(6);
        for (Resource_Request__c request : newList)
        {
            if (request.hasErrors()) //if wrong dates in ResourceRequest, then exit
            {
                return;
            }
            employeeIds.add(request.Employee__c);
            leftEdge = leftEdge > request.From__c ? request.From__c : leftEdge;
            rightEdge = rightEdge < request.To__c ? request.To__c : rightEdge;
        }

        Map<Id, Employee__c> employeeMap = new Map<Id, Employee__c>([SELECT Name, (SELECT From__c, To__c, Resource_Allocation__c FROM Resource_Requests__r
                WHERE To__c >= :leftEdge AND From__c <= :rightEdge) FROM Employee__c WHERE Id IN :employeeIds]);

        Map<String, Decimal> employeeWeekToAllocation = new Map<String, Decimal>();
        for (Employee__c employee : employeeMap.values())
        {
            for (Resource_Request__c request : employee.Resource_Requests__r)
            {
                for (Date monday = request.From__c, sunday = monday.addDays(6); sunday <= request.To__c;)
                {
                    String key = employee.Id + '_' + ((Datetime) monday).format('YYYY-MM-dd') + '÷' + ((Datetime) sunday).format('YYYY-MM-dd');
                    if (!employeeWeekToAllocation.containsKey(key))
                    {
                        employeeWeekToAllocation.put(key, 0);
                    }
                    employeeWeekToAllocation.put(key, employeeWeekToAllocation.get(key) + Decimal.valueOf(request.Resource_Allocation__c.replaceAll('%', '')));

                    monday = monday.addDays(7);
                    sunday = monday.addDays(6);
                }
            }
        }

        for (Resource_Request__c request : newList)
        {
            for (Date monday = request.From__c, sunday = monday.addDays(6); sunday <= request.To__c;)
            {
                String key = request.Employee__c + '_' + ((Datetime) monday).format('YYYY-MM-dd') + '÷' + ((Datetime) sunday).format('YYYY-MM-dd');
                if (!employeeWeekToAllocation.containsKey(key)) //if no existing ResourceRequests for this period
                {
                    employeeWeekToAllocation.put(key, 0);
                }

                Decimal value = employeeWeekToAllocation.get(key);
                if (value + Decimal.valueOf(request.Resource_Allocation__c.replaceAll('%', '')) > 100)
                {
                    request.addError(employeeMap.get(request.Employee__c).Name + ' already has allocation of ' + value + '%' + ' for period ' + key.split('_').get(1));
                }
                employeeWeekToAllocation.put(key, value + Decimal.valueOf(request.Resource_Allocation__c.replaceAll('%', '')));

                monday = monday.addDays(7);
                sunday = monday.addDays(6);
            }
        }
    }

}