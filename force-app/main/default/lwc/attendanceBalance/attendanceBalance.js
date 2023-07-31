import {LightningElement, wire} from 'lwc';
import {subscribe, unsubscribe, MessageContext} from "lightning/messageService";
import utilizationCalculated from '@salesforce/messageChannel/Utilization_Calculated__c';

export default class AttendanceBalance extends LightningElement {

    @wire(MessageContext)
    messageContext;
    subscription = null;

    attendanceBalance = {};
    workHours = {};

    connectedCallback() {
        this._subscribeToMessageChannel();
    }
    disconnectedCallback() {
        this._unsubscribeToMessageChannel();
    }

    _subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(this.messageContext, utilizationCalculated, message => {
                this._handleMessage(message);
            });
        }
    }
    _unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    _handleMessage(message) {
        this.attendanceBalance = {
            plannedWorkingHours: message.plannedWorkingHours,
            reportedWorkingHours: message.reportedWorkingHours,
            remainingWorkingHours: message.plannedWorkingHours - message.reportedWorkingHours
        };
        this.workHours = {
            workingDays: message.plannedWorkingHours / message.dayWorkingHours,
            weekWorkingHours: message.weekWorkingHours
        };
    }

}