import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { DatePicker } from 'material-ui-pickers';
// import { MaterialUiPickersDate } from 'material-ui-pickers/typings/date';
import { Moment } from 'moment';
import * as React from 'react';

import { InputDateClearableProps } from './InputDateClearable';

export const InputDateClearableView: React.SFC<InputDateClearableProps> = props => {
  const { dateFormat, input, required, label, disabled, meta, intl, disablePast } = props;

  // const labelFunction = (date: MaterialUiPickersDate, invalidLabel: string): string => {
  //   let result: string = invalidLabel;

  //   if (date.isValid()) {
  //     result = date.format('MMM DD, YYYY');
  //   } 

  //   return result;
  // };

  const render = (
    <DatePicker
      fullWidth
      clearable={true}
      margin="normal"
      leftArrowIcon={<ChevronLeftIcon />}
      rightArrowIcon={<ChevronRightIcon />}
      okLabel={intl.formatMessage({id: 'global.action.ok'})}
      cancelLabel={intl.formatMessage({id: 'global.action.cancel'})}
      clearLabel={intl.formatMessage({id: 'global.action.clear'})}
      emptyLabel={intl.formatMessage({id: 'global.date.empty'})}
      format={input.value ? dateFormat || 'MMM DD, YYYY' : undefined}
      {...input}
      label={label}
      required={required}
      disabled={disabled || meta.submitting}
      error={meta.touched && !(meta.error === undefined || meta.error === null)}
      helperText={meta.touched && meta.error}
      // onChange={(moment: Moment) => input.onChange(moment.toISOString(true))}
      value={props.value}
      onChange={(moment: Moment) => props.handleOnChange(moment)}
      // labelFunc={labelFunction}
      invalidLabel={''}
      disablePast={disablePast}
    />
  );

  return render;
};