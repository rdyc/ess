import { IEmployeeListFilter } from '@account/classes/filters';
import { AccountEmployeeOption } from '@account/components/options/AccountEmployeeOption';
import { WorkflowStatusType } from '@common/classes/types';
import { FormMode } from '@generic/types';
import { kpiMessage } from '@kpi/locales/messages/kpiMessage';
import { ISelectFieldOption, SelectField } from '@layout/components/fields/SelectField';
import { InputYearOption } from '@layout/components/input/year/InputYearOption';
import { layoutMessage } from '@layout/locales/messages';
import { GlobalStyle } from '@layout/types/GlobalStyle';
import { Card, CardContent, CardHeader, TextField } from '@material-ui/core';
import { Field, FieldProps, FormikProps } from 'formik';
import * as React from 'react';
import { InjectedIntl } from 'react-intl';
import { IKPIEmployeeFormValue, IKPIPartialLatestValue } from '../KPIEmployeeForm';

type KPIEmployeeDetailPartialFormProps = {
  formMode: FormMode; 
  formikBag: FormikProps<IKPIEmployeeFormValue>;
  intl: InjectedIntl;
  
  handleLoadAssign: (employeeUid: string, year: string) => void;
  handleSetLoadAssign: () => void;
  handleLoadLatest: (employeeUid: string) => void;
  handleSetLoadLatest: () => void;
  assignData: IKPIEmployeeFormValue;
  latestData: IKPIPartialLatestValue;
  filterAccountEmployee: IEmployeeListFilter;
  loadAssign: boolean;
  loadLatest: boolean;
};

const KPIEmployeeDetailPartialForm: React.ComponentType<KPIEmployeeDetailPartialFormProps> = props => {
  const setAssignValue = () => {
    props.formikBag.setValues({
      kpiUid: props.formikBag.values.kpiUid,
      kpiAssignUid: props.assignData.kpiAssignUid,
      employeeUid: props.formikBag.values.employeeUid,
      employeeName: props.formikBag.values.employeeName,
      templateName: props.assignData.templateName,
      statusType: props.formikBag.values.statusType,
      year: props.formikBag.values.year,
      period: props.assignData.period,
      revision: props.formikBag.values.revision,
      totalScore: props.formikBag.values.totalScore,
      items: props.assignData.items,
    });

    props.handleSetLoadAssign();
  };

  const setLatestPartialValue = () => {
    props.formikBag.setFieldValue('period', props.latestData.period);
    props.formikBag.setFieldValue('totalScore', props.latestData.totalScore);

    if (props.latestData.items) {
      props.latestData.items.forEach((item, index) => {
        props.formikBag.setFieldValue(`items.${index}.achieved`, item.achieved);
        props.formikBag.setFieldValue(`items.${index}.progress`, item.progress);
        props.formikBag.setFieldValue(`items.${index}.score`, item.score);
      });
    }

    props.handleSetLoadLatest();
  };
  
  return (
    <Card square>
      <CardHeader 
        title={props.intl.formatMessage(kpiMessage.employee.section.infoTitle)}
      />
      <CardContent>
        <Field 
          name="kpiUid"
          render={({ field}: FieldProps<IKPIEmployeeFormValue>) => (
            <TextField 
              {...field}
              {...GlobalStyle.TextField.ReadOnly}
              disabled={props.formikBag.isSubmitting}
              label={props.intl.formatMessage(kpiMessage.employee.field.uid)}
              helperText={props.formMode === FormMode.New && props.intl.formatMessage(layoutMessage.text.autoField)}
            />
          )}
        />
        
        {
          props.formMode === FormMode.New && 
          <Field
            name="employeeUid"
            render={({ field, form }: FieldProps<IKPIEmployeeFormValue>) => (
              <AccountEmployeeOption filter={props.filterAccountEmployee}>
                <SelectField
                  isSearchable
                  isDisabled={props.formikBag.isSubmitting}
                  isClearable={field.value !== ''}
                  escapeClearsValue={true}
                  valueString={field.value}
                  textFieldProps={{
                    label: props.intl.formatMessage(kpiMessage.employee.field.employeeUid),
                    required: true,
                    helperText: form.touched.employeeUid && form.errors.employeeUid,
                    error: form.touched.employeeUid && Boolean(form.errors.employeeUid)
                  }}
                  onMenuClose={() => props.formikBag.setFieldTouched(field.name)}
                  onChange={(selected: ISelectFieldOption) => {
                    props.formikBag.setFieldValue(field.name, selected && selected.value || '');
                    props.formikBag.setFieldValue('employeeName', selected && selected.data && selected.data.fullName || '');

                    if ((selected && selected.value !== '') && (props.formikBag.values.year !== '' && props.formikBag.values.year !== '0')) {
                      props.handleLoadAssign(selected && selected.value, props.formikBag.values.year);
                    }
                  }}
                />
              </AccountEmployeeOption>
            )}
          /> 
          ||
          <Field 
            name="employeeName"
            render={({ field}: FieldProps<IKPIEmployeeFormValue>) => (
              <TextField 
                {...field}
                {...GlobalStyle.TextField.ReadOnly}
                disabled={props.formikBag.isSubmitting}
                label={props.intl.formatMessage(kpiMessage.employee.field.employeeUid)}
              />
            )}
          />
        }

        <Field
          name="year"
          render={({ field, form }: FieldProps<IKPIEmployeeFormValue>) => (
            <InputYearOption withPast>
              <SelectField
                isSearchable
                isDisabled={props.formikBag.isSubmitting}
                isClearable={field.value !== ''}
                escapeClearsValue={true}
                valueString={field.value}
                textFieldProps={{
                  label: props.intl.formatMessage(kpiMessage.employee.field.year),
                  required: true,
                  helperText: form.touched.year && form.errors.year,
                  error: form.touched.year && Boolean(form.errors.year)
                }}
                onMenuClose={() => props.formikBag.setFieldTouched(field.name)}
                onChange={(selected: ISelectFieldOption) => {
                  props.formikBag.setFieldValue(field.name, selected && selected.value || '');

                  if (props.formikBag.values.employeeUid !== '' && ((selected && selected.value !== '') && (selected && selected.value !== '0'))) {
                    props.handleLoadAssign(props.formikBag.values.employeeUid, selected && selected.value);
                  }
                }}
              />
            </InputYearOption>
          )}
        />
        
        {/* <Field
          name="period"
          render={({ field, form }: FieldProps<IKPIEmployeeFormValue>) => (
            <InputSemesterOption>
              <SelectField
                isSearchable
                menuPlacement="auto"
                menuPosition="fixed"
                isDisabled={props.formikBag.isSubmitting}
                isClearable={field.value !== ''}
                escapeClearsValue={true}
                valueString={field.value}
                textFieldProps={{
                  label: props.intl.formatMessage(kpiMessage.employee.field.period),
                  required: true,
                  helperText: form.touched.period && form.errors.period,
                  error: form.touched.period && Boolean(form.errors.period)
                }}
                onMenuClose={() => props.formikBag.setFieldTouched(field.name)}
                onChange={(selected: ISelectFieldOption) => {
                  props.formikBag.setFieldValue(field.name, selected && selected.value || '');
                }}
              />
            </InputSemesterOption>
          )}
        /> */}

        <Field
          name="period"
          render={({ field, form }: FieldProps<IKPIEmployeeFormValue>) => (
            <TextField
              {...GlobalStyle.TextField.ReadOnly}
              {...field}
              disabled={props.formikBag.isSubmitting}
              label={props.intl.formatMessage(kpiMessage.employee.field.period)}
              value={props.formikBag.values.period !== '' &&
                (parseInt(props.formikBag.values.period, 10) === 1 && 
                  props.intl.formatMessage(kpiMessage.employee.field.periodMidYear) || 
                  props.intl.formatMessage(kpiMessage.employee.field.periodFullYear)) ||
                ''}
              helperText={form.touched.period && form.errors.period}
              error={form.touched.period && Boolean(form.errors.period)}
            />
          )}
        />

        {
          props.formikBag.values.statusType === WorkflowStatusType.Accepted &&
          <Field
            name="revision"
            render={({ field, form }: FieldProps<IKPIEmployeeFormValue>) => (
              <TextField
                {...field}
                fullWidth
                required={true}
                margin="normal"
                autoComplete="off"
                disabled={form.isSubmitting}
                label={props.intl.formatMessage(kpiMessage.employee.field.revision)}
                placeholder={props.intl.formatMessage(kpiMessage.employee.field.revision)}
                helperText={(form.touched.revision) && (form.errors.revision)}
                error={(form.touched.revision) && Boolean(form.errors.revision)}
              />
            )}
          />
        }

        <Field
          name="totalScore"
          render={({ field, form }: FieldProps<IKPIEmployeeFormValue>) => (
            <TextField
              {...GlobalStyle.TextField.ReadOnly}
              {...field}
              disabled={props.formikBag.isSubmitting}
              label={props.intl.formatMessage(kpiMessage.employee.field.totalScore)}
              value={props.intl.formatNumber(field.value)}
              helperText={form.touched.totalScore && form.errors.totalScore}
              error={form.touched.totalScore && Boolean(form.errors.totalScore)}
            />
          )}
        />
      </CardContent>
      {
        props.loadAssign &&
        setAssignValue()
      }
      {
        props.loadLatest &&
        setLatestPartialValue()
      }
    </Card>
  );
};

export default KPIEmployeeDetailPartialForm;