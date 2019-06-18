import FormikJsonValues from '@layout/components/formik/FormikJsonValues';
import { SubmissionForm } from '@layout/components/submission/SubmissionForm';
import { layoutMessage } from '@layout/locales/messages';
import { lookupMessage } from '@lookup/locales/messages/lookupMessage';
import { Form, Formik, FormikProps } from 'formik';
import * as React from 'react';
import { COGSFormProps, ICOGSFormValue } from './COGSUploadForm';
import COGSDetailPartialForm from './partial/COGSDetailPartialForm';

export const COGSUploadFormView: React.SFC<COGSFormProps> = props => (
  <Formik
    enableReinitialize
    initialValues={props.initialValues}
    validationSchema={props.validationSchema}
    onSubmit={props.handleOnSubmit}
    render={(formikBag: FormikProps<ICOGSFormValue>) => (
      <Form>
        <div className={props.classes.flexRow}>
          <div className={props.classes.flexColumn}>
            <div className={props.classes.flexContent}>
              <COGSDetailPartialForm 
                intl={props.intl}
                formikBag={formikBag}
              />
            </div>
          </div>

          <div className={props.classes.flexColumn}>
            <div className={props.classes.flexContent}>
              <SubmissionForm 
                title={props.intl.formatMessage(lookupMessage.shared.submission.form, {state: 'COGS Upload'})}
                className={props.classes.flexContent}
                formikProps={formikBag}
                buttonLabelProps={{
                  reset: props.intl.formatMessage(layoutMessage.action.reset),
                  submit: props.intl.formatMessage(layoutMessage.action.submit),
                  processing: props.intl.formatMessage(layoutMessage.text.processing)
                }}
                confirmationDialogProps={{
                  title: props.intl.formatMessage(lookupMessage.shared.confirm.createTitle, {state: 'COGS Upload'}),
                  message: props.intl.formatMessage(lookupMessage.shared.confirm.createDescription, {state: 'COGS Upload'}),
                  labelCancel: props.intl.formatMessage(layoutMessage.action.discard),
                  labelConfirm: props.intl.formatMessage(layoutMessage.action.continue)
                }} 
              />
            </div>
          </div>

          <div className={props.classes.flexColumn}>
            <div className={props.classes.flexContent}>
              <FormikJsonValues formikBag={formikBag} />
            </div>
          </div>
        </div>
      </Form>
    )}
  />
);