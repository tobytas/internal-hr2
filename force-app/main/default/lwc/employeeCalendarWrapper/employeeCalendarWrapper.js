import {api, LightningElement, wire} from 'lwc';
import getEmployeeInfo from '@salesforce/apex/FilterController.getEmployeeInfo';

export default class EmployeeCalendarWrapper extends LightningElement {

    @api recordId;
    employeeIds = [];
    locationIds = [];

    @wire(getEmployeeInfo, {employeeId: '$recordId'})
    _handleEmployeeInfo({data, error}) {
        if (data) {
           this.employeeIds = [data.Id];
           this.locationIds = [data.itgns__Location__c];
        }
        else if (error) {
            console.error(JSON.stringify(error));
        }
    }

}