import {api, LightningElement, track, wire} from 'lwc';
import {getRecord, getFieldValue} from 'lightning/uiRecordApi';
import getEmployeesForLocations from '@salesforce/apex/FilterController.getEmployeesForLocations';
import EMPLOYEE_NAME_FIELD from '@salesforce/schema/Employee__c.Name';
// import {getObjectInfo} from 'lightning/uiObjectInfoApi';
// import TIME_ENTRY_OBJECT from '@salesforce/schema/TimeEntry__c';
// import {getPicklistValues} from 'lightning/uiObjectInfoApi';
// import TIME_ENTRY_TYPE_FIELD from '@salesforce/schema/TimeEntry__c.Type__c';

export default class EmployeeFilter extends LightningElement {

    @api locationIds;
    _prevLocationIds = [];
    employeeId;
    @track employeePills = [];
    // get employeeIds() {
    //     return this.employeePills.map(pill => pill.name);
    // }

    @wire(getEmployeesForLocations, {locationIds: '$locationIds'})
    _handleEmployeesForLocations({data, error}) {
        if (data) {
            //check to prevent endless loop (locationFilter rerender and calling this @wire)
            if (this.locationIds.toString() !== this._prevLocationIds.toString()) {
                this.employeePills = [];
                for (const employee of data) {
                    this.employeePills.push({label: employee.Name, name: employee.Id});
                }
                this._notifyWithEmployeeIds();
            }
            this._prevLocationIds = this.locationIds;
        }
        if (error) {
            this._handleError(error);
        }
    }

    handleInputChange() {
        this.employeeId = this.template.querySelector('.employee').value;
    }

    @wire(getRecord, {recordId: '$employeeId', fields: [EMPLOYEE_NAME_FIELD]})
    _handleLocation({data, error}) {
        if (data) {
            if (!this.employeePills.find(pill => pill.name === this.employeeId)) {
                this.employeePills.push({label: getFieldValue(data, EMPLOYEE_NAME_FIELD), name: this.employeeId});

                this._notifyWithEmployeeIds();
            }
        }
        if (error) {
            this._handleError(error);
        }
    }

    handleEmployeeRemove(event) {
        const name = event.detail.item.name;
        const index = this.employeePills.findIndex(pill => pill.name === name);
        this.employeePills.splice(index, 1);

        this._notifyWithEmployeeIds();
    }

    _notifyWithEmployeeIds() {
        this.dispatchEvent(new CustomEvent('employeeids', {detail: this.employeePills.map(pill => pill.name)}));
    }


    // defaultRecordTypeId;
    // typePicklistValues;
    @track typePills = [];
    // get entryTypes() {
    //     return this.typePills.map(pill => pill.name);
    // }
    //
    // @wire(getObjectInfo, {objectApiName: TIME_ENTRY_OBJECT})
    // _handleObjectInfo({data, error}) {
    //     if (data) {
    //         this.defaultRecordTypeId = data.defaultRecordTypeId;
    //     }
    //     else if (error) {
    //         this._handleError(error);
    //     }
    // }
    // @wire(getPicklistValues, {recordTypeId: '$defaultRecordTypeId', fieldApiName: TIME_ENTRY_TYPE_FIELD})
    // _handlePicklistValues({data, error}) {
    //     if (data) {
    //         const picklist = [];
    //         for (const each of data.values) {
    //             picklist.push({label: each.value, value: each.value});
    //         }
    //         this.typePicklistValues = picklist;
    //     }
    //     else if (error) {
    //         this._handleError(error);
    //     }
    // }

    handlePicklistChange() {
        const type = this.template.querySelector('.type').value;
        if (type && !this.typePills.find(pill => pill.name === type)) {
            this.typePills.push({label: type, name: type});

            this._notifyWithEntryTypes();
        }
    }

    handleTypeRemove(event) {
        const name = event.detail.item.name;
        const index = this.typePills.findIndex(pill => pill.name === name);
        this.typePills.splice(index, 1);

        this._notifyWithEntryTypes();
    }

    _notifyWithEntryTypes() {
        this.dispatchEvent(new CustomEvent('entrytypes', {detail: this.typePills.map(pill => pill.name)}));
    }

    _handleError(error) {
        console.error(JSON.stringify(error));
    }

}