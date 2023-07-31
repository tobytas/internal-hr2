import {api} from 'lwc';
import LightningModal from 'lightning/modal';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
const TOAST_TITLE = 'Success';
const TOAST_MESSAGE = 'Record saved';
const TOAST_VARIANT = 'success';

export default class TimeEntryModal extends LightningModal {

    @api label;
    @api timeEntryId;
    @api mode = 'view';
    // @api date;
    @api employeeId;
    @api locationId;
    @api from;
    @api to;

    handleSuccess() {
        this.close('okay');
        this.dispatchEvent(new ShowToastEvent({title: TOAST_TITLE, message: TOAST_MESSAGE, variant: TOAST_VARIANT}));
    }

}