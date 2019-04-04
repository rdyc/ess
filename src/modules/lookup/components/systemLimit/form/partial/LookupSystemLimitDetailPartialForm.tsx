import { ISystemListFilter } from '@common/classes/filters';
import { CommonSystemOption } from '@common/components/options/CommonSystemOption';
import { FormMode } from '@generic/types';
import { NumberFormatter } from '@layout/components/fields/NumberFormatter';
import { ISelectFieldOption, SelectField } from '@layout/components/fields/SelectField';
import { layoutMessage } from '@layout/locales/messages';
import { ILookupCompanyGetListFilter } from '@lookup/classes/filters/company';
import { LookupCompanyOption } from '@lookup/components/company/options/LookupCompanyOption';
import { lookupMessage } from '@lookup/locales/messages/lookupMessage';
import { Card, CardContent, CardHeader, TextField } from '@material-ui/core';
import { Field, FieldProps, FormikProps } from 'formik';
import * as React from 'react';
import { InjectedIntl } from 'react-intl';
import { ISystemLimitFormValue } from '../LookupSystemLimitForm';

type LookupSystemLimitDetailPartialFormProps = {
  formMode: FormMode; 
  formikBag: FormikProps<ISystemLimitFormValue>;
  intl: InjectedIntl;
  filterLookupCompany?: ILookupCompanyGetListFilter;
  filterCommonSystem?: ISystemListFilter;
};

const LookupSystemLimitDetailPartialForm: React.ComponentType<LookupSystemLimitDetailPartialFormProps> = props => (
  <Card square>
    <CardHeader 
      title={props.intl.formatMessage(lookupMessage.systemLimit.section.infoTitle)}
    />
    <CardContent>
      <Field 
        name="uid"
        render={({ field}: FieldProps<ISystemLimitFormValue>) => (
          <TextField 
            {...field}
            fullWidth
            disabled
            margin="normal"
            label={props.intl.formatMessage(lookupMessage.systemLimit.fieldFor(field.name, 'fieldName'))}
            helperText={props.formMode === FormMode.New && props.intl.formatMessage(layoutMessage.text.autoField)}
          />
        )}
      />
      
      <Field
        name="companyUid"
        render={({ field, form }: FieldProps<ISystemLimitFormValue>) => (
          <LookupCompanyOption filter={props.filterLookupCompany}>
            <SelectField
              isSearchable
              menuPlacement="auto"
              menuPosition="fixed"
              isDisabled={props.formikBag.isSubmitting}
              isClearable={field.value !== ''}
              escapeClearsValue={true}
              valueString={field.value}
              textFieldProps={{
                label: props.intl.formatMessage(lookupMessage.systemLimit.fieldFor(field.name, 'fieldName')),
                required: true,
                helperText: form.touched.companyUid && form.errors.companyUid,
                error: form.touched.companyUid && Boolean(form.errors.companyUid)
              }}
              onMenuClose={() => props.formikBag.setFieldTouched(field.name)}
              onChange={(selected: ISelectFieldOption) => {
                props.formikBag.setFieldValue(field.name, selected && selected.value || '');
              }}
            />
          </LookupCompanyOption>
        )}
      />

      <Field
        name="categoryType"
        render={({ field, form }: FieldProps<ISystemLimitFormValue>) => (
          <CommonSystemOption category="limiter" filter={props.filterCommonSystem}>
            <SelectField
              isSearchable
              menuPlacement="auto"
              menuPosition="fixed"
              isDisabled={props.formikBag.isSubmitting}
              isClearable={field.value !== ''}
              escapeClearsValue={true}
              valueString={field.value}
              textFieldProps={{
                label: props.intl.formatMessage(lookupMessage.systemLimit.fieldFor(field.name, 'fieldName')),
                required: true,
                helperText: form.touched.categoryType && form.errors.categoryType,
                error: form.touched.categoryType && Boolean(form.errors.categoryType)
              }}
              onMenuClose={() => props.formikBag.setFieldTouched(field.name)}
              onChange={(selected: ISelectFieldOption) => props.formikBag.setFieldValue(field.name, selected && selected.value || '')}
            />
          </CommonSystemOption>
        )}
      />

      <Field
        name="days"
        render={({ field, form }: FieldProps<ISystemLimitFormValue>) => (
          <TextField 
            {...field}
            fullWidth
            required={true}
            margin="normal"
            autoComplete="off"
            disabled={form.isSubmitting}
            label={props.intl.formatMessage(lookupMessage.systemLimit.fieldFor(field.name, 'fieldName'))}
            placeholder={props.intl.formatMessage(lookupMessage.systemLimit.fieldFor(field.name, 'fieldPlaceholder'))}
            helperText={form.touched.days && form.errors.days}
            error={form.touched.days && Boolean(form.errors.days)}
            InputProps={{
              inputComponent: NumberFormatter,
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              // set current field
              props.formikBag.setFieldValue(field.name, parseFloat(e.target.value));
          }}
          />
        )}
      />

    </CardContent>
  </Card>
);

export default LookupSystemLimitDetailPartialForm;