import {api, LightningElement, wire} from 'lwc';
import {loadScript, loadStyle} from 'lightning/platformResourceLoader';
import {refreshApex} from '@salesforce/apex';
import {drawLegend, EVENT_TYPES_TO_COLORS, EVENT_HOLIDAY_TYPE, dateUniformString} from 'c/utils';
import getTimeEntries from '@salesforce/apex/FilterController.getTimeEntries';
import timeEntryModal from 'c/timeEntryModal';
import FULL_CALENDAR_RESOURCE_URL from '@salesforce/resourceUrl/fullCalendar5';
import D3_RESOURCE_URL from '@salesforce/resourceUrl/d3';
import {publish, MessageContext} from "lightning/messageService";
import timeEntryManipulated from '@salesforce/messageChannel/Time_Entry_Manipulated__c';

const EVENTS_SHOWN_PER_MONTH = 4;
const EVENTS_SHOWN_PER_WEEK = 20;
const DOUBLE_CLICK_INTERVAL_MS = 600;
const BLACK_COLOR = '#000000';
const TWO_DAYS_MS = 172800000;

export default class HrCalendar extends LightningElement {

    @api employeeIds = [];
    @api locationIds = [];
    @api entryTypes = [];
    @api startDate;
    @api endDate;
    @api mode = 'dayGridMonth';

    timeEntryResponse;
    events = [];
    eventKeyToTimestamp = {}; //for detecting double clicks

    calendar;
    showSpinner = false;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this._drawLegend();
        this._loadFullCalendar();
    }

    refresh() {
        this.showSpinner = true
        refreshApex(this.timeEntryResponse).then(() => {
            this.showSpinner = false;
        });
    }

    _drawLegend() {
        loadScript(this, D3_RESOURCE_URL + '/d3js.org_d3.v4.js').then(() => {
            const svgEl = this.template.querySelector('.legend');
            const svg = d3.select(svgEl);
            drawLegend(svg);
        });
    }

    @wire(getTimeEntries, {employeeIds: '$employeeIds', locationIds: '$locationIds', entryTypes: '$entryTypes', startDate: '$startDate', endDate: '$endDate'})
    _handleTimeEntries(response) {
        this.timeEntryResponse = response;
        if (response.data) {
            const events = [];
            for (const timeEntry of response.data) {
                const d = new Date(timeEntry.itgns__To__c.substring(0, 10));
                const end = dateUniformString(new Date(d.setDate(d.getDate() + 1))); //in fullCalendar end date is exclusive, so add 1 day

                let title;
                if (timeEntry.itgns__Type__c === EVENT_HOLIDAY_TYPE) {
                    title = timeEntry.itgns__Comment__c;
                }
                else {
                    const nameArray = timeEntry.itgns__Employee__r.Name.trim().replace(/\s+/g, ' ').split(' ');
                    title = nameArray.length > 1 ? nameArray[1].substring(0, 1) + '. ' + nameArray[0] : nameArray[0];
                }
                events.push({
                    id: timeEntry.Id,
                    title,
                    start: timeEntry.itgns__From__c,
                    end,
                    type: timeEntry.itgns__Type__c
                });
            }

            this.events = events;
            this._setEventsColors();

            if (this.calendar) {
                for (const event of this.calendar.getEvents()) {
                    event.remove();
                }
            }
            this.calendar.addEventSource(this.events);
        }
        else if (response.error) {
            console.error('There is some error while loading Time Entries: ');
            this._handleError(response.error);
        }

        if (this.showSpinner) {
            this.showSpinner = false;
        }
    }

    _setEventsColors() {
        for (const event of this.events) {
            event.backgroundColor = EVENT_TYPES_TO_COLORS[event.type];
            event.borderColor = EVENT_TYPES_TO_COLORS[event.type];
            event.textColor = BLACK_COLOR;
        }
    }

    _loadFullCalendar() {
        Promise.all([
            loadScript(this, FULL_CALENDAR_RESOURCE_URL + '/lib/main.js'),
            loadStyle(this, FULL_CALENDAR_RESOURCE_URL + '/lib/main.css')
        ]).then(() => loadScript(this, FULL_CALENDAR_RESOURCE_URL + '/lib/locales-all.js').then(() => {
            const calendarEl = this.template.querySelector('.calendar');
            this.calendar = new FullCalendar.Calendar(calendarEl, {
                // headerToolbar: {center: 'dayGridMonth,timeGridWeek,timeGridDay'},
                headerToolbar: {center: 'dayGridMonth,dayGridWeek,dayGridDay'},
                initialView: this.mode,
                // dayMaxEventRows: true,
                views: {
                    dayGridWeek: {
                        dayMaxEventRows: EVENTS_SHOWN_PER_WEEK
                    },
                    dayGridMonth: {
                        dayMaxEventRows: EVENTS_SHOWN_PER_MONTH
                    }
                },
                // events: this.events,
                dateClick: this.dateClickCallback,
                eventClick: this.eventClickCallback,
                moreLinkClick: 'day',
                eventOrder: null,

                datesSet: this.dateSetCallback,

                locale: 'en-gb',
                selectable: true,
                select: this.selectCallback
            });
            this.calendar.render();

            // console.log(this.calendar.getDate().toISOString());//todo: delete
        })
        ).catch(error => {
            console.error('There is some error while loading full Calendar: ');
            this._handleError(error);
        });
    }

    dateClickCallback = info => {
        const timestamp = Date.now();
        const prevTimestamp = this.eventKeyToTimestamp[info.dateStr];
        if (prevTimestamp >= timestamp - DOUBLE_CLICK_INTERVAL_MS) { //double click detected
            this._openCreateModal(info.dateStr, info.dateStr);
        }
        this.eventKeyToTimestamp[info.dateStr] = timestamp;
    }

    selectCallback = selectionInfo => {
        if (selectionInfo.end - selectionInfo.start >= TWO_DAYS_MS) {
            const d = new Date(selectionInfo.end);
            const toDate = new Date(d.setDate(d.getDate() - 1)); //in fullCalendar end date is exclusive, so remove 1 day
            this._openCreateModal(selectionInfo.startStr, dateUniformString(toDate));
        }
    }

    _openCreateModal(starStr, endStr) {
        const options = {size: 'small', from: starStr, to: endStr, label: 'Create Time Entry', mode: 'edit'};
        if (this.employeeIds?.length === 1) {
            options.employeeId = this.employeeIds[0];
        }
        if (this.locationIds?.length === 1) {
            options.locationId = this.locationIds[0];
        }
        timeEntryModal.open(options).then(result => {
            if (result === 'okay') {
                this.refresh();
                publish(this.messageContext, timeEntryManipulated); //notify other components
            }
        });
    }

    eventClickCallback = info => {
        const timestamp = Date.now();
        const prevTimestamp = this.eventKeyToTimestamp[info.event.id];
        if (prevTimestamp >= timestamp - DOUBLE_CLICK_INTERVAL_MS) { //double click detected
            timeEntryModal.open({size: 'small', timeEntryId: info.event.id, label: 'Edit Time Entry', mode: 'edit'}).then(result => {
                if (result === 'okay') {
                    this.refresh();
                    publish(this.messageContext, timeEntryManipulated); //notify other components
                }
            });
        }
        this.eventKeyToTimestamp[info.event.id] = timestamp;
    }

    dateSetCallback = info => {
        this.showSpinner = true;
        this.startDate = info.startStr.substring(0, 10);
        this.endDate = info.endStr.substring(0, 10);
    }

    _handleError(error) {
        console.error(JSON.stringify(error));
    }

}