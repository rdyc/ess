import AppMenu from '@constants/AppMenu';
import { FormMode } from '@generic/types';
import { hrMessage } from '@hr/locales/messages/hrMessage';
import FormikJsonValues from '@layout/components/formik/FormikJsonValues';
import { FormPage } from '@layout/components/pages/formPage/FormPage';
import { SubmissionForm } from '@layout/components/submission/SubmissionForm';
import { layoutMessage } from '@layout/locales/messages';
import { Form, Formik, FormikProps } from 'formik';
import * as React from 'react';
import { CompetencyResponderFormProps, ICompetencyResponderFormValue } from './CompetencyResponderForm';
import CompetencyResponderPartial from './CompetencyResponderPartial';
// import { Waini } from './Waini';
import { WainiV2 } from './WainiV2';

export const CompetencyResponderFormView: React.SFC<CompetencyResponderFormProps> = props => (
  <FormPage
    info={{
      uid: AppMenu.CompetencyEmployee,
      parentUid: AppMenu.HumanResource,
      parentUrl: '/hr/competencyemployee',
      title: props.intl.formatMessage(props.formMode === FormMode.New ? hrMessage.shared.page.newTitle :  hrMessage.shared.page.modifyTitle, {state: 'Responder'}),
      description: props.intl.formatMessage(props.formMode === FormMode.New ?  hrMessage.shared.page.newSubHeader :  hrMessage.shared.page.modifySubHeader, {state: 'Responder'})
    }}
    state={props.hrCompetencyClusterState.detail}
    onLoadApi={props.handleOnLoadDetail}
  >
    <Formik
      enableReinitialize
      initialValues={props.initialValues}
      validationSchema={props.validationSchema}
      onSubmit={props.handleOnSubmit}
      render={(formikBag: FormikProps<ICompetencyResponderFormValue>) => (
        <Form>
          <div className={props.classes.flexRow}>
            <div className={props.classes.flexColumn}>
              <div className={props.classes.flexContent}>
                <CompetencyResponderPartial 
                  formMode={props.formMode}
                  intl={props.intl}
                  formikBag={formikBag}
                />
              </div>
            </div>

            <div className={props.classes.flexColumn}>
              <div className={props.classes.flexContent}>
                <SubmissionForm 
                  title={props.intl.formatMessage(hrMessage.shared.section.submission, {state: 'Assessment'})}
                  className={props.classes.flexContent}
                  formikProps={formikBag}
                  buttonLabelProps={{
                    reset: props.intl.formatMessage(layoutMessage.action.reset),
                    submit: props.intl.formatMessage(layoutMessage.action.submit),
                    processing: props.intl.formatMessage(layoutMessage.text.processing)
                  }}
                  confirmationDialogProps={{
                    title: props.intl.formatMessage(props.formMode === FormMode.New ? hrMessage.shared.confirm.createTitle : hrMessage.shared.confirm.modifyTitle, {state: 'Assessment'}),
                    message: props.intl.formatMessage(props.formMode === FormMode.New ? hrMessage.shared.confirm.createDescription : hrMessage.shared.confirm.modifyDescription, {state: 'Assessment'}),
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
          <div className={props.classes.flexRow}>
            {/* <div className={props.classes.flexColumn}>
              <div className={props.classes.flexContent}>
                <Waini 
                  formMode={props.formMode}
                  intl={props.intl}
                  formikBag={formikBag}
                />
              </div>
            </div> */}
            <div className={props.classes.flexContent}>
              <WainiV2 
                formMode={props.formMode}
                intl={props.intl}
                formikBag={formikBag}
              />
            </div>
          </div>
        </Form>
      )}
    />
  </FormPage>
);