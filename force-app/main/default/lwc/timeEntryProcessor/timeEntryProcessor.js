import {api, LightningElement} from 'lwc';

import SOBJECT_NAME from '@salesforce/schema/TimeEntry__c';
import TYPE_FIELD from '@salesforce/schema/TimeEntry__c.Type__c';
// import DATE_FIELD from '@salesforce/schema/TimeEntry__c.Date__c';
import HOURS_FIELD from '@salesforce/schema/TimeEntry__c.Hours__c';
import EMPLOYEE_FIELD from '@salesforce/schema/TimeEntry__c.Employee__c';
import LOCATION_FIELD from '@salesforce/schema/TimeEntry__c.Location__c';
import COMMENT_FIELD from '@salesforce/schema/TimeEntry__c.Comment__c';
import STATUS_FIELD from '@salesforce/schema/TimeEntry__c.Status__c';
import FROM_FIELD from '@salesforce/schema/TimeEntry__c.From__c';
import TO_FIELD from '@salesforce/schema/TimeEntry__c.To__c';

const FIELDS = [
    TYPE_FIELD,
    EMPLOYEE_FIELD,
    // DATE_FIELD,
    LOCATION_FIELD,
    HOURS_FIELD,
    COMMENT_FIELD,
    STATUS_FIELD,
    FROM_FIELD,
    TO_FIELD
];

export default class TimeEntryProcessor extends LightningElement {

    @api timeEntryId;
    @api mode = 'view';
    // @api date;
    @api employeeId;
    @api locationId;
    @api from;
    @api to;
    sobjectName = SOBJECT_NAME;
    fields = {
        fieldsArray: FIELDS,
        type: TYPE_FIELD,
        // date: DATE_FIELD,
        hours: HOURS_FIELD,
        employee: EMPLOYEE_FIELD,
        location: LOCATION_FIELD,
        comment: COMMENT_FIELD,
        status: STATUS_FIELD,
        from: FROM_FIELD,
        to: TO_FIELD
    };

    handleSuccess() {
        this.dispatchEvent(new CustomEvent('success'));
    }

    handleReset() {
        for (const input of this.template.querySelectorAll('lightning-input-field')) {
            input.reset();
        }
    }

    handleDateChange(event) {
        this.template.querySelector('.to').value = event.target.value;
    }

}