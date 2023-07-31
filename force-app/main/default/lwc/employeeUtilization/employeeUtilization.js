import {api, LightningElement, wire} from 'lwc';
import getEmployeeInfo from '@salesforce/apex/FilterController.getEmployeeInfo';
import getTimeEntries from '@salesforce/apex/FilterController.getTimeEntries';
import {getWeekFirstDay, getWeekLastDay, getMonthFirstDay, getMonthLastDay} from "c/utils";
import {CHART_TYPES, CHART_COLORS, CHART_WORK_TYPE, CHART_HOLIDAY_TYPE, CHART_UNREPORTED_TYPE, CHART_TYPES_EXCLUDE_WEEKENDS} from "c/utils";
import {subscribe, unsubscribe, publish, MessageContext} from "lightning/messageService";
import timeEntryManipulated from '@salesforce/messageChannel/Time_Entry_Manipulated__c';
import utilizationCalculated from '@salesforce/messageChannel/Utilization_Calculated__c';
import {refreshApex} from "@salesforce/apex";
import {CHART_SHORT_TYPES, CHART_SHORT_COLORS, CHART_SHORT_PAID_ABSENCE, CHART_SHORT_UNPAID_ABSENCE, CHART_PAID_ABSENCES, CHART_UNPAID_ABSENCES} from "c/utils";

const BACKGROUND_COLOR = JSON.stringify(CHART_SHORT_COLORS);

export default class EmployeeUtilization extends LightningElement {

    @api recordId;
    @api startDate;
    @api endDate;
    @api period;

    employee;
    employeeIds;
    locationIds;

    labels = [];
    detail = [];
    backgroundColor = BACKGROUND_COLOR;
    utilization;
    get chartLabel() {
        return 'Time Entry Chart' + (this.period ? ' (' + this.period + ')' : '');
    }

    @wire(MessageContext)
    messageContext;
    subscription = null;
    timeEntryResponse;

    connectedCallback() {
        this._subscribeToMessageChannel();

        if (this.period === 'current week') {
            this.startDate = getWeekFirstDay(new Date(), 0);
            this.endDate = getWeekLastDay(new Date(), 0);
        }
        else if (this.period === 'last week') {
            this.startDate = getWeekFirstDay(new Date(), -1);
            this.endDate = getWeekLastDay(new Date(), -1);
        }
        else if (this.period === 'current month') {
            this.startDate = getMonthFirstDay(new Date(), 0);
            this.endDate = getMonthLastDay(new Date(), 0);
        }
        else if (this.period === 'last month') {
            this.startDate = getMonthFirstDay(new Date(), -1);
            this.endDate = getMonthLastDay(new Date(), -1);
        }
    }
    disconnectedCallback() {
        this._unsubscribeToMessageChannel();
    }

    _subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(this.messageContext, timeEntryManipulated, () => {
                refreshApex(this.timeEntryResponse); //refresh when TimeEntry manipulated in calendar
            });
        }
    }
    _unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    @wire(getEmployeeInfo, {employeeId: '$recordId'})
    _handleEmployeeInfo({data, error}) {
        if (data) {
            this.employee = data;
            this.employeeIds = [data.Id];
            this.locationIds = [data.itgns__Location__c];
        }
        else if (error) {
            this._handleError(error);
        }
    }

    @wire(getTimeEntries, {employeeIds: '$employeeIds', locationIds: '$locationIds', startDate: '$startDate', endDate: '$endDate'})
    _handleTimeEntries(response) {
        this.timeEntryResponse = response;
        if (response.data) {
            this._calculateChartData(response.data);
        }
        else if (response.error) {
            this._handleError(error);
        }
    }

    _calculateChartData(timeEntries) {
        const typesToHours = {};
        for (const type of CHART_SHORT_TYPES) {
            typesToHours[type] = 0;
        }

        let reportedHours = 0;
        let plannedWorkingHours = this._calculatePlannedWorkingHours();

        for (const timeEntry of timeEntries) {
            const hours = this._calculateTimeEntryHours(timeEntry);

            if (timeEntry.itgns__Type__c === CHART_HOLIDAY_TYPE) {
                plannedWorkingHours -= hours;
            }
            else {
                reportedHours += hours;
            }

            if (CHART_PAID_ABSENCES.includes(timeEntry.itgns__Type__c)) {
                typesToHours[CHART_SHORT_PAID_ABSENCE] += hours
            }
            else if (CHART_UNPAID_ABSENCES.includes(timeEntry.itgns__Type__c)) {
                typesToHours[CHART_SHORT_UNPAID_ABSENCE] += hours
            }
            else {
                typesToHours[timeEntry.itgns__Type__c] += hours;
            }
        }

        typesToHours[CHART_UNREPORTED_TYPE] = Math.max(0, plannedWorkingHours - reportedHours); //last element

        const labels = [];
        const detail = [];
        for (const key in typesToHours) {
            labels.push(key);
            detail.push(typesToHours[key]);
        }

        this.labels = JSON.stringify(labels);
        this.detail = JSON.stringify(detail);

        this.utilization = Math.round(typesToHours[CHART_WORK_TYPE] / plannedWorkingHours * 100).toString();

        if (this.period === 'current month') {
            const payload = {
                plannedWorkingHours: plannedWorkingHours,
                reportedWorkingHours: typesToHours[CHART_WORK_TYPE],
                weekWorkingHours: this.employee.itgns__Location__r.itgns__Target_Working_Hours_Per_Week__c,
                dayWorkingHours: this.employee.itgns__Location__r.itgns__Target_Working_Hours_per_Day__c
            };
            publish(this.messageContext, utilizationCalculated, payload);
        }
    }

    _calculateTimeEntryHours(timeEntry) {
        const weekends = ['Sun', 'Sat'];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const startDate = new Date(this.startDate);
        const endDate = new Date(this.endDate);
        let day = new Date(timeEntry.itgns__From__c.substring(0, 10));
        const end = new Date(timeEntry.itgns__To__c.substring(0, 10));

        let hours = 0;
        for (; day <= end; day.setDate(day.getDate() + 1)) {
            if (day < startDate || day > endDate) { //date from TimeEntry range not in required range
                continue;
            }
            //weekends not included for TimeEntries with approvals and for TimeEntries with Holiday type
            if (CHART_TYPES_EXCLUDE_WEEKENDS.includes(timeEntry.itgns__Type__c) && weekends.includes(days[day.getDay()])) {
                continue;
            }

            hours += timeEntry.itgns__Hours__c ?? 0
        }

        return hours;
    }

    _calculatePlannedWorkingHours() {
        const workingDaysNames = this.employee.itgns__Location__r.itgns__Target_Working_Days__c.split(';');
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        let plannedWorkingHours = 0;
        for (let day = new Date(this.startDate), end = new Date(this.endDate); day <= end; day.setDate(day.getDate() + 1)) {
           if (workingDaysNames.includes(days[day.getDay()])) {
               plannedWorkingHours += this.employee.itgns__Location__r.itgns__Target_Working_Hours_per_Day__c ?? 0;
           }
        }

        return plannedWorkingHours;
    }

    _handleError(error) {
        console.error(JSON.stringify(error));
    }

}