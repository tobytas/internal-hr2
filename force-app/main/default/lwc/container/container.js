import {LightningElement} from 'lwc';
import SOBJECT_NAME from '@salesforce/schema/TimeEntry__c'
import TYPE_FIELD from '@salesforce/schema/TimeEntry__c.Type__c'
import HOURS_FIELD from '@salesforce/schema/TimeEntry__c.Hours__c'
import EMPLOYEE_FIELD from '@salesforce/schema/TimeEntry__c.Employee__c'
import LOCATION_FIELD from '@salesforce/schema/TimeEntry__c.Location__c'

const FIELDS = [
    TYPE_FIELD,
    EMPLOYEE_FIELD,
    LOCATION_FIELD,
    HOURS_FIELD,
];

export default class Container extends LightningElement {

    timeEntryId = 'a021y000008eQ0XAAU';
    mode = 'view';
    sobjectName = SOBJECT_NAME;
    fields = {
        fieldsArray: FIELDS,
        type: TYPE_FIELD,
        hours: HOURS_FIELD,
        employee: EMPLOYEE_FIELD,
        location: LOCATION_FIELD
    };

}