import {LightningElement, wire} from 'lwc';
import {getWeekFirstDay, getWeekLastDay, isoWeekNumber, dateUniformString} from "c/utils";
import getEmployeesWithRequests from '@salesforce/apex/ResourceRequestInfoController.getEmployeesWithRequests';
import resourceRequestModal from 'c/resourceRequestModal';
import {refreshApex} from "@salesforce/apex";

const WEEKS_BACK = 0;
const WEEKS_FORWARD = 6;

export default class ResourceRequestInfo extends LightningElement {

    period = 0;
    startDate;
    endDate;
    weekInfo = [];

    employeeResponse;
    teams = [];

    requestsByEmployeeByWeek = {};
    get key() {
        return Math.random().toString(16).substring(2, 14);
    }

    showSpinner = false;

    constructor() {
        super();
        this._init()
    }

    _init() {
        const startDate = getWeekFirstDay(new Date(), WEEKS_BACK + this.period * (WEEKS_BACK + 1 + WEEKS_FORWARD));
        const endDate = getWeekLastDay(new Date(), WEEKS_FORWARD + this.period * (WEEKS_BACK + 1 + WEEKS_FORWARD));
        this._initWeekInfo(startDate, endDate);

        this.showSpinner = true;
        this.startDate = startDate;
        this.endDate = endDate;
    }
    _initWeekInfo(startDate, endDate) {
        const weekInfo = [];
        for (let date = new Date(startDate), end = new Date(endDate); date <= end; date.setDate(date.getDate() + 7)) {
            const d = new Date(date);
            const monday = dateUniformString(d);
            const sunday = dateUniformString(new Date(d.setDate(d.getDate() + 6)));
            const label = monday + ' / ' + sunday;
            weekInfo.push({weekNumber: isoWeekNumber(date), monday, sunday, label});
        }
        this.weekInfo = weekInfo;
    }

    decreasePeriod() {
        this.period--;
        this._init();
    }
    increasePeriod() {
        this.period++;
        this._init();
    }

    refresh() {
        this.showSpinner = true;
        refreshApex(this.employeeResponse).then(() => {
            this.showSpinner = false;
        });
    }

    @wire(getEmployeesWithRequests, {startDate: '$startDate', endDate: '$endDate'})
    _handleEmployeesWithRequests(response) {
        this.employeeResponse = response;
        if (response.data) {
            const teams = [];
            const employees = JSON.parse(JSON.stringify(response.data));
            for (const employee of employees) {
                employee.cellClasses = [];
                for (const info of this.weekInfo) {
                    employee.cellClasses.push('dataCell ' + employee.Id + '_' + info.weekNumber);
                }

                if (!employee.itgns__Team__c) {
                    employee.itgns__Team__c = 'Other';
                }
                let team = teams.find(team => team.teamName === employee.itgns__Team__c);
                if (!team) {
                    team = {teamName: employee.itgns__Team__c, employees: []};
                    teams.push(team);
                }
                team.employees.push(employee);
            }
            this._padTeamNames(teams);
            this.teams = teams;
        }
        else if (response.error) {
            console.error(JSON.stringify(error));
        }

        if (this.showSpinner) {
            this.showSpinner = false;
        }
    }

    _padTeamNames(teams) {
        for (const team of teams) {
            team.teamName = team.teamName.padStart(25, String.fromCharCode(160)); //Non-breakable space is char 160
        }
    }

    renderedCallback() {
        this.requestsByEmployeeByWeek = {};
        this._pushRequests();
    }

    _pushRequests() {
        for (const team of this.teams) {
            for (const employee of team.employees) {
                for (const request of employee.itgns__Resource_Requests__r || []) {
                    for (let date = new Date(request.itgns__From__c), end = new Date(request.itgns__To__c); date <= end; date.setDate(date.getDate() + 7)) {
                        const weekNumber = isoWeekNumber(date);
                        const cell = this.template.querySelector('.dataCell.' + employee.Id + '_' + weekNumber);
                        if (cell) {
                            cell.innerHTML = Number(cell.innerHTML?.replaceAll('%', '') || '0') + Number(request.itgns__Resource_Allocation__c.replaceAll('%', '')) + '%';

                            let requestsByWeek = this.requestsByEmployeeByWeek[employee.Id];
                            if (!requestsByWeek) {
                                requestsByWeek = {};
                                this.requestsByEmployeeByWeek[employee.Id] = requestsByWeek;
                            }
                            let requests = requestsByWeek[weekNumber];
                            if (!requests) {
                                requests = [];
                                requestsByWeek[weekNumber] = requests;
                            }
                            requests.push(request);
                        }
                    }
                }
            }
        }
    }

    handleDblClick(event) {
        const [employeeId, weekNumber] = event.target.classList[1].split('_');
        const requestsByWeek = this.requestsByEmployeeByWeek[employeeId] ?? {};
        const requests = requestsByWeek[weekNumber] ?? [];

        resourceRequestModal.open({size: 'small', requests, label: 'Resource Requests'}).then(result => {
            if (result === 'okay') {
            }
        });
    }

}