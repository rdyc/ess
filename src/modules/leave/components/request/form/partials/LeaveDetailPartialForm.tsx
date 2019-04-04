import { ISystemListFilter } from '@common/classes/filters';
import { CommonSystemOption } from '@common/components/options/CommonSystemOption';
import { FormMode } from '@generic/types';
import { ISelectFieldOption, SelectField } from '@layout/components/fields/SelectField';
import { layoutMessage } from '@layout/locales/messages';
import { leaveMessage } from '@leave/locales/messages/leaveMessage';
import { ILookupLeaveGetListFilter } from '@lookup/classes/filters';
import { Card, CardContent, CardHeader, TextField } from '@material-ui/core';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import { Field, FieldProps, FormikProps } from 'formik';
import { DatePicker } from 'material-ui-pickers';
import { Moment } from 'moment';
import * as React from 'react';
import { InjectedIntl } from 'react-intl';

import { ILeaveRequestFormValue } from '../LeaveRequestForm';

type LeaveDetailPartialFormProps = {
  formMode: FormMode;
  formikBag: FormikProps<ILeaveRequestFormValue>;
  intl: InjectedIntl;
  isRequestor: boolean;
  filterLookupLeave?: ILookupLeaveGetListFilter;
  filterCommonSystem?: ISystemListFilter;
  allowedLeaveTypes?: string[];
};

const LeaveDetailPartialForm: React.ComponentType<LeaveDetailPartialFormProps> = props => (
  <Card square>
    <CardHeader title={props.intl.formatMessage(leaveMessage.request.section.infoTitle)} />
    <CardContent>
      <Field
        name="uid"
        render={({ field, form }: FieldProps<ILeaveRequestFormValue>) => (
          <TextField
            {...field}
            fullWidth
            disabled
            margin="normal"
            label={props.intl.formatMessage(leaveMessage.request.fieldFor(field.name, 'fieldName'))}
            helperText={props.formMode === FormMode.New && props.intl.formatMessage(layoutMessage.text.autoField)}
          />
        )}
      />

      <Field
        name="leaveType"
        render={({ field, form }: FieldProps<ILeaveRequestFormValue>) => (
          <React.Fragment>
            <CommonSystemOption category="leave" filter={props.filterCommonSystem}>
              <SelectField
                isSearchable
                isDisabled={props.formMode === FormMode.Edit || props.formikBag.isSubmitting}
                isClearable={props.formMode === FormMode.New && field.value !== ''}
                escapeClearsValue={true}
                valueString={field.value}
                filterOption={option => {
                  // filter options from allowed leave types
                  if (props.allowedLeaveTypes) {
                    return props.allowedLeaveTypes.findIndex(item => item === option.value) !== -1;
                  }

                  return true;
                }}
                textFieldProps={{
                  label: props.intl.formatMessage(leaveMessage.request.fieldFor(field.name, 'fieldName')),
                  required: true,
                  helperText: form.touched.leaveType && form.errors.leaveType,
                  error: form.touched.leaveType && Boolean(form.errors.leaveType)
                }}
                onMenuClose={() => props.formikBag.setFieldTouched(field.name)}
                onChange={(selected: ISelectFieldOption) => props.formikBag.setFieldValue(field.name, selected && selected.value || '')}
              />
            </CommonSystemOption>
          </React.Fragment>
        )}
      />

      <Field
        name="regularType"
        render={({ field, form }: FieldProps<ILeaveRequestFormValue>) => (
          <LookupLeaveOption filter={props.filterLookupLeave}>
            <SelectField
              isSearchable
              isDisabled={props.formikBag.isSubmitting}
              isClearable={field.value !== ''}
              escapeClearsValue={true}
              valueString={field.value}
              textFieldProps={{
                label: props.intl.formatMessage(leaveMessage.request.fieldFor(field.name, 'fieldName')),
                required: true,
                helperText: form.touched.leaveUid && form.errors.leaveUid,
                error: form.touched.leaveUid && Boolean(form.errors.leaveUid)
              }}
              onMenuClose={() => props.formikBag.setFieldTouched(field.name)}
              onChange={(selected: ISelectFieldOption) => props.formikBag.setFieldValue(field.name, selected && selected.value || '')}
            />
          </LookupLeaveOption>
        )}
      />

      <Field
        name="start"
        render={({ field, form }: FieldProps<ILeaveRequestFormValue>) => (
          <DatePicker
            {...field}
            fullWidth
            required={true}
            margin="normal"
            disabled={form.isSubmitting}
            showTodayButton
            label={props.intl.formatMessage(leaveMessage.request.fieldFor(field.name, 'fieldName'))}
            placeholder={props.intl.formatMessage(leaveMessage.request.fieldFor(field.name, 'fieldPlaceholder'))}
            leftArrowIcon={<ChevronLeft />}
            rightArrowIcon={<ChevronRight />}
            format="MMMM DD, YYYY"
            helperText={form.touched.start && form.errors.start}
            error={form.touched.start && Boolean(form.errors.start)}
            onChange={(moment: Moment) => props.formikBag.setFieldValue('start', moment.toDate())}
            invalidLabel=""
          />
        )}
      />

      <Field
        name="end"
        render={({ field, form }: FieldProps<ILeaveRequestFormValue>) => (
          <DatePicker
            {...field}
            fullWidth
            required={props.formikBag.values.start !== ''}
            showTodayButton
            margin="normal"
            disabled={props.formikBag.values.start === '' || form.isSubmitting}
            label={props.intl.formatMessage(leaveMessage.request.fieldFor(field.name, 'fieldName'))}
            placeholder={props.intl.formatMessage(leaveMessage.request.fieldFor(field.name, 'fieldPlaceholder'))}
            leftArrowIcon={<ChevronLeft />}
            rightArrowIcon={<ChevronRight />}
            format="MMMM DD, YYYY"
            helperText={form.touched.end && form.errors.end}
            error={form.touched.end && Boolean(form.errors.end)}
            onChange={(moment: Moment) => props.formikBag.setFieldValue(field.name, moment.toDate())}
            invalidLabel=""
            minDate={props.formikBag.values.start}
          />
        )}
      />

      <Field
        name="address"
        render={({ field, form }: FieldProps<ILeaveRequestFormValue>) => (
          <TextField
            {...field}
            fullWidth={true}
            disabled={form.isSubmitting}
            margin="normal"
            autoComplete="off"
            label={props.intl.formatMessage(leaveMessage.request.fieldFor(field.name, 'fieldName'))}
            placeholder={props.intl.formatMessage(leaveMessage.request.fieldFor(field.name, 'fieldPlaceholder'))}
            helperText={form.touched.address && form.errors.address}
            error={form.touched.address && Boolean(form.errors.address)}
          />
        )}
      />

      <Field
        name="contactNumber"
        render={({ field, form }: FieldProps<ILeaveRequestFormValue>) => (
          <TextField
            {...field}
            fullWidth={true}
            disabled={form.isSubmitting}
            margin="normal"
            autoComplete="off"
            label={props.intl.formatMessage(leaveMessage.request.fieldFor(field.name, 'fieldName'))}
            placeholder={props.intl.formatMessage(leaveMessage.request.fieldFor(field.name, 'fieldPlaceholder'))}
            helperText={form.touched.contactNumber && form.errors.contactNumber}
            error={form.touched.contactNumber && Boolean(form.errors.contactNumber)}
          />
        )}
      />

      <Field
        name="reason"
        render={({ field, form }: FieldProps<ILeaveRequestFormValue>) => (
          <TextField
            {...field}
            fullWidth={true}
            disabled={form.isSubmitting}
            margin="normal"
            autoComplete="off"
            label={props.intl.formatMessage(leaveMessage.request.fieldFor(field.name, 'fieldName'))}
            placeholder={props.intl.formatMessage(leaveMessage.request.fieldFor(field.name, 'fieldPlaceholder'))}
            helperText={form.touched.reason && form.errors.reason}
            error={form.touched.reason && Boolean(form.errors.reason)}
          />
        )}
      />
    </CardContent>
  </Card>
);

export default LeaveDetailPartialForm;