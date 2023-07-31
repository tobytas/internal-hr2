import {api, LightningElement} from 'lwc';
import {EVENT_HOLIDAY_TYPE} from "c/utils";

export default class LocationCalendarWrapper extends LightningElement {

    @api recordId;
    get locationIds() {
        return [this.recordId];
    }

    entryTypes = [EVENT_HOLIDAY_TYPE];

}