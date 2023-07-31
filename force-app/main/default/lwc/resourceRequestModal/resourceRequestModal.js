import {api} from 'lwc';
import LightningModal from 'lightning/modal';

const FIELDS = [
    {label: 'Role', fieldName: 'itgns__Role__c', type: 'text'},
    {label: 'Employee', fieldName: 'itgns__Employee_Name__c', type: 'text'},
    {label: 'Project', fieldName: 'itgns__Project_Name__c', type: 'text'},
    {label: 'From', fieldName: 'itgns__From__c', type: 'date'},
    {label: 'To', fieldName: 'itgns__To__c', type: 'date'},
    {label: 'Allocation %', fieldName: 'itgns__Resource_Allocation__c', type: 'text'}
];

export default class ResourceRequestModal extends LightningModal {

    @api label;
    @api requests;
    fields = FIELDS;

}