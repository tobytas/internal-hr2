import {LightningElement, wire} from 'lwc';
import Id from '@salesforce/user/Id';
import {getFieldValue, getRecord} from 'lightning/uiRecordApi';
import USER_EMAIL from '@salesforce/schema/User.Email';
import getEmployeeByEmail from '@salesforce/apex/FilterController.getEmployeeByEmail';
import {NavigationMixin} from 'lightning/navigation';

export default class EmployeeHomeInfo extends NavigationMixin(LightningElement) {

    userId = Id;
    userEmail;
    employeeExists = true;

    @wire(getRecord, {recordId: '$userId', fields: [USER_EMAIL]})
    _handleUserInfo({data, error}) {
        if (data) {
            this.userEmail = getFieldValue(data, USER_EMAIL);
        }
        else if (error) {
            this._handleError(error);
        }
    }

    @wire(getEmployeeByEmail, {employeeEmail: '$userEmail'})
    _handleEmployeeId({data, error}) {
        if (data) {
            if (data.Id) {
                const recordId = data.Id;
                const pageRef = {
                    type: 'standard__recordPage',
                    attributes: {
                        recordId,
                        objectApiName: 'itgns__Employee__c',
                        actionName: 'view'
                    }
                };
                this[NavigationMixin.Navigate](pageRef);
            }
            else {
                this.employeeExists = false;
            }
        }
        else if (error) {
            this._handleError(error);
        }
    }

    _handleError(error) {
        console.error(JSON.stringify(error));
    }

}