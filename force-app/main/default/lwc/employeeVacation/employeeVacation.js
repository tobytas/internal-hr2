import {api, LightningElement, wire} from 'lwc';
import getVacationInfo from '@salesforce/apex/EmployeeVacationController.getVacationInfo';
import {dateUniformString} from 'c/utils';
import {subscribe, unsubscribe, MessageContext} from "lightning/messageService";
import timeEntryManipulated from '@salesforce/messageChannel/Time_Entry_Manipulated__c';
import {refreshApex} from "@salesforce/apex";

export default class EmployeeVacation extends LightningElement {

    @api recordId;
    vacationInfo = {};

    @wire(MessageContext)
    messageContext;
    subscription = null;
    vacationResponse;

    connectedCallback() {
        this._subscribeToMessageChannel();
    }
    disconnectedCallback() {
        this._unsubscribeToMessageChannel();
    }

    _subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(this.messageContext, timeEntryManipulated, () => {
                refreshApex(this.vacationResponse); //refresh when TimeEntry manipulated in calendar
            });
        }
    }
    _unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    @wire(getVacationInfo, {employeeId: '$recordId'})
    _handleVacationInfo(response) {
        this.vacationResponse = response;
        if (response.data) {
            let vacationDaysUsed = 0;
            let vacationDays = 0;
            if (response.data.itgns__TimeEntries__r) {
                const today = new Date(dateUniformString(new Date()));

                for (const vacation of response.data.itgns__TimeEntries__r) {
                    const day = new Date(vacation.itgns__From__c.substring(0, 10));
                    const end = new Date(vacation.itgns__To__c.substring(0, 10));

                    for (; day <= end; day.setDate(day.getDate() + 1)) {
                        if (day <= today) { //only already used vacation days (no future vacation days included)
                            vacationDaysUsed++;
                        }
                        vacationDays++
                    }
                }
            }
            this.vacationInfo = {
                vacationDays: response.data.itgns__Location__r?.itgns__Vacation_Days_per_Year__c ?? 0,
                vacationDaysYearToDate: response.data.itgns__Vacation_Days_Year_to_Date__c ?? 0,
                vacationDaysUsed: vacationDaysUsed,
                vacationDaysRequested: vacationDays,
                vacationDaysLeft: response.data.itgns__Location__r?.itgns__Vacation_Days_per_Year__c ? response.data.itgns__Location__r.itgns__Vacation_Days_per_Year__c - vacationDays : 0
            };
        }
        else if (response.error) {
            console.error(JSON.stringify(error));
        }
    }

}