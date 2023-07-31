import {LightningElement, track, wire} from 'lwc';
import {getRecord, getFieldValue} from 'lightning/uiRecordApi';
import LOCATION_NAME_FIELD from '@salesforce/schema/Location__c.Name'

export default class LocationFilter extends LightningElement {

    locationId;
    @track pills = [];
    get locationIds() {
        return this.pills.map(pill => pill.name);
    }
    employeeIds = [];
    entryTypes = [];

    handleChange() {
        this.locationId = this.template.querySelector('lightning-input-field').value;
    }

    @wire(getRecord, {recordId: '$locationId', fields: [LOCATION_NAME_FIELD]})
    _handleLocation({data, error}) {
        if (data) {
            if (!this.pills.find(pill => pill.name === this.locationId)) {
                this.pills.push({label: getFieldValue(data, LOCATION_NAME_FIELD), name: this.locationId});
            }
        }
        if (error) {
            console.error(JSON.stringify(error));
        }
    }

    handleRemove(event) {
        const name = event.detail.item.name;
        const index = this.pills.findIndex(pill => pill.name === name);
        this.pills.splice(index, 1);
    }

    handleEmployeeIds(event) {
        this.employeeIds = event.detail;
    }

    handleEntryTypes(event) {
        this.entryTypes = event.detail;
    }

}