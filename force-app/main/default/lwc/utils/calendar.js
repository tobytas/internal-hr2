function drawLegend(svg) {
    svg.append('circle').attr('cx', 20).attr('cy', 20).attr('r', 6).style('fill', EVENT_COLORS[0]);
    svg.append('circle').attr('cx', 20).attr('cy', 50).attr('r', 6).style('fill', EVENT_COLORS[1]);
    svg.append('circle').attr('cx', 20).attr('cy', 80).attr('r', 6).style('fill', EVENT_COLORS[2]);
    svg.append('circle').attr('cx', 150).attr('cy', 20).attr('r', 6).style('fill', EVENT_COLORS[3]);
    svg.append('circle').attr('cx', 150).attr('cy', 50).attr('r', 6).style('fill', EVENT_COLORS[4]);
    svg.append('circle').attr('cx', 150).attr('cy', 80).attr('r', 6).style('fill', EVENT_COLORS[5]);
    svg.append('circle').attr('cx', 330).attr('cy', 20).attr('r', 6).style('fill', EVENT_COLORS[6]);
    svg.append('circle').attr('cx', 330).attr('cy', 50).attr('r', 6).style('fill', EVENT_COLORS[7]);
    svg.append('circle').attr('cx', 330).attr('cy', 80).attr('r', 6).style('fill', EVENT_COLORS[8]);
    svg.append('circle').attr('cx', 510).attr('cy', 20).attr('r', 6).style('fill', EVENT_COLORS[9]);

    svg.append('text').attr('x', 40).attr('y', 20).text(EVENT_TYPES[0]).style('font-size', '15px').attr('alignment-baseline', 'middle');
    svg.append('text').attr('x', 40).attr('y', 50).text(EVENT_TYPES[1]).style('font-size', '15px').attr('alignment-baseline', 'middle');
    svg.append('text').attr('x', 40).attr('y', 80).text(EVENT_TYPES[2]).style('font-size', '15px').attr('alignment-baseline', 'middle');
    svg.append('text').attr('x', 170).attr('y', 20).text(EVENT_TYPES[3]).style('font-size', '15px').attr('alignment-baseline', 'middle');
    svg.append('text').attr('x', 170).attr('y', 50).text(EVENT_TYPES[4]).style('font-size', '15px').attr('alignment-baseline', 'middle');
    svg.append('text').attr('x', 170).attr('y', 80).text(EVENT_TYPES[5]).style('font-size', '15px').attr('alignment-baseline', 'middle');
    svg.append('text').attr('x', 350).attr('y', 20).text(EVENT_TYPES[6]).style('font-size', '15px').attr('alignment-baseline', 'middle');
    svg.append('text').attr('x', 350).attr('y', 50).text(EVENT_TYPES[7]).style('font-size', '15px').attr('alignment-baseline', 'middle');
    svg.append('text').attr('x', 350).attr('y', 80).text(EVENT_TYPES[8]).style('font-size', '15px').attr('alignment-baseline', 'middle');
    svg.append('text').attr('x', 530).attr('y', 20).text(EVENT_TYPES[9]).style('font-size', '15px').attr('alignment-baseline', 'middle');
}

const EVENT_TYPES_TO_COLORS = {
    'Holiday':                      '#F7CEDA',
    'Work Hours':                   '#D7EAFC',
    'Training':                     '#7FFFD4',
    'Paid Vacation':                '#F5F5DC',
    'Sickness / Accident':          '#6495ED',
    'Parental Leave':               '#FF69B4',
    'Unpaid Leave':                 '#FF7F50',
    'Approved paid absence':        '#008B8B',
    'Paid Education':               '#9370DB',
    'Child Sickness / Accident':    '#BDB76B'
};
const EVENT_TYPES = Object.keys(EVENT_TYPES_TO_COLORS);
const EVENT_COLORS = Object.values(EVENT_TYPES_TO_COLORS);
const EVENT_WORK_TYPE = EVENT_TYPES[1]
const EVENT_HOLIDAY_TYPE = EVENT_TYPES[0];
const EVENT_TYPES_WITH_APPROVALS = [EVENT_TYPES[3], EVENT_TYPES[4], EVENT_TYPES[5],
    EVENT_TYPES[6], EVENT_TYPES[7], EVENT_TYPES[8], EVENT_TYPES[9]];

const CHART_TYPES_TO_COLORS = {
    'Holiday':                      '#F7CEDA',
    'Work Hours':                   '#D7EAFC',
    'Training':                     '#7FFFD4',
    'Paid Vacation':                '#F5F5DC',
    'Sickness / Accident':          '#6495ED',
    'Parental Leave':               '#FF69B4',
    'Unpaid Leave':                 '#FF7F50',
    'Approved paid absence':        '#008B8B',
    'Paid Education':               '#9370DB',
    'Child Sickness / Accident':    '#BDB76B',
    'Unreported':                   '#D61C1F'
};
const CHART_TYPES = Object.keys(CHART_TYPES_TO_COLORS);
const CHART_COLORS = Object.values(CHART_TYPES_TO_COLORS);
const CHART_WORK_TYPE = CHART_TYPES[1];
const CHART_HOLIDAY_TYPE = CHART_TYPES[0];
const CHART_UNREPORTED_TYPE = CHART_TYPES[10];
const CHART_TYPES_EXCLUDE_WEEKENDS = [CHART_TYPES[0], CHART_TYPES[3], CHART_TYPES[4], CHART_TYPES[5],
    CHART_TYPES[6], CHART_TYPES[7], CHART_TYPES[8], CHART_TYPES[9]];
const CHART_PAID_ABSENCES = [CHART_TYPES[4], CHART_TYPES[5], CHART_TYPES[7], CHART_TYPES[8], CHART_TYPES[9]];
const CHART_UNPAID_ABSENCES = [CHART_TYPES[6]];

const CHART_TYPES_TO_COLORS_SHORT = {
    'Holiday':                      '#F7CEDA',
    'Work Hours':                   '#D7EAFC',
    'Training':                     '#7FFFD4',
    'Paid Vacation':                '#F5F5DC',
    'Paid Absence':                 '#4682B4',
    'Unpaid Absence':               '#708090',
    'Unreported':                   '#D61C1F'
}
const CHART_SHORT_TYPES = Object.keys(CHART_TYPES_TO_COLORS_SHORT);
const CHART_SHORT_COLORS = Object.values(CHART_TYPES_TO_COLORS_SHORT);
const CHART_SHORT_PAID_ABSENCE = CHART_SHORT_TYPES[4];
const CHART_SHORT_UNPAID_ABSENCE = CHART_SHORT_TYPES[5];

export {drawLegend,
    EVENT_TYPES_TO_COLORS, EVENT_TYPES, EVENT_COLORS,
    CHART_TYPES_TO_COLORS, CHART_TYPES, CHART_COLORS,
    CHART_TYPES_TO_COLORS_SHORT, CHART_SHORT_TYPES, CHART_SHORT_COLORS,
        EVENT_WORK_TYPE, EVENT_HOLIDAY_TYPE, EVENT_TYPES_WITH_APPROVALS,
        CHART_WORK_TYPE, CHART_HOLIDAY_TYPE, CHART_UNREPORTED_TYPE, CHART_TYPES_EXCLUDE_WEEKENDS, CHART_PAID_ABSENCES, CHART_UNPAID_ABSENCES,
        CHART_SHORT_PAID_ABSENCE, CHART_SHORT_UNPAID_ABSENCE};