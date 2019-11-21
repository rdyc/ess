import AppMenu from '@constants/AppMenu';
import { hrMessage } from '@hr/locales/messages/hrMessage';
import FormikJsonValues from '@layout/components/formik/FormikJsonValues';
import { FormPage } from '@layout/components/pages/formPage/FormPage';
import { SubmissionDraft } from '@layout/components/submission/SubmissionDraft';
import { layoutMessage } from '@layout/locales/messages';
import { Form, Formik, FormikProps } from 'formik';
import * as React from 'react';
import { HrAssessmentResponderItem } from '../../detail/assessment/HrAssessmentResponderItem';
import { HrInputInformation } from '../../shared/HrInputInformation';
import { CompetencyResultCategory } from './CompetencyResultCategory';
import { CompetencyResultFormProps, ICompetencyResultFormValue } from './CompetencyResultForm';
import CompetencyResultPartial from './CompetencyResultPartial';

export const CompetencyResultFormView: React.SFC<CompetencyResultFormProps> = props => (
  <FormPage
    info={{
      uid: AppMenu.CompetencyAssessment,
      parentUid: AppMenu.HumanResource,
      parentUrl: props.history.location.state && `/hr/assessment/${props.history.location.state.respondenUid}` || '/hr/assessment',
      title: props.intl.formatMessage(hrMessage.shared.page.listTitle, {state: '360 Assessment Result'}),
      description: props.intl.formatMessage(hrMessage.shared.page.listSubHeader, {state: '360 Assessment Result'})
    }}
    state={props.hrCompetencyResultState.detail}
    onLoadApi={props.handleOnLoadDetail}
  >
    <Formik
      enableReinitialize
      initialValues={props.initialValues}
      validationSchema={props.validationSchema}
      onSubmit={props.handleOnSubmit}
      render={(formikBag: FormikProps<ICompetencyResultFormValue>) => (
        <Form>
          <div className={props.classes.flexRow}>
            <div className={props.classes.flexColumn}>
              <div className={props.classes.flexContent}>
                <CompetencyResultPartial 
                  formMode={props.formMode}
                  intl={props.intl}
                  formikBag={formikBag}
                  filterCompany={props.filterCompany}
                />
              </div>
            </div>

            <div className={props.classes.flexColumn}>
              <div className={props.classes.flexContent}>
                {
                  props.hrCompetencyAssessmentState.detail.response &&
                  <HrAssessmentResponderItem data={props.hrCompetencyAssessmentState.detail.response.data} />
                }
              </div>
            </div>
            
            <div className={props.classes.flexColumn}>
              <div className={props.classes.flexContent}>
                <HrInputInformation />
              </div>
              <div className={props.classes.flexContent}>
              <SubmissionDraft 
                  title={props.intl.formatMessage(hrMessage.shared.section.submission, {state: '360 Assessment Result'})}
                  className={props.classes.flexContent}
                  formikProps={formikBag}
                  buttonLabelProps={{
                    reset: props.intl.formatMessage(layoutMessage.action.reset),
                    submit: props.intl.formatMessage(layoutMessage.action.submit),
                    processing: props.intl.formatMessage(layoutMessage.text.processing)
                  }}
                  confirmationDialogDraftProps={{
                    title: props.intl.formatMessage(hrMessage.shared.confirm.saveAsTitle, {state: 'draft'}),
                    message: props.intl.formatMessage(hrMessage.shared.confirm.saveAsDescription, {state: 'draft'}),
                    labelCancel: props.intl.formatMessage(layoutMessage.action.discard),
                    labelConfirm: props.intl.formatMessage(layoutMessage.action.continue)
                  }}
                  confirmationDialogFinalProps={{
                    title: props.intl.formatMessage(hrMessage.shared.confirm.saveAsTitle, {state: 'final'}),
                    message: props.intl.formatMessage(hrMessage.shared.confirm.saveAsDescription, {state: 'final'}),
                    labelCancel: props.intl.formatMessage(layoutMessage.action.discard),
                    labelConfirm: props.intl.formatMessage(layoutMessage.action.continue)
                  }}  
                  saveAs={props.handleSaveType}
                  isFinal={!formikBag.values.levelRespond.every(item => item.levelUid !== '')}
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
            <div className={props.classes.flexContent}>
              {
                props.hrCompetencyResultState.detailList.response &&
                props.hrCompetencyResultState.detailList.response.data &&
                props.hrCompetencyMappedState.list.response &&
                props.hrCompetencyMappedState.list.response.data &&
                props.hrCompetencyMappedState.list.response.data[0] &&
                <CompetencyResultCategory 
                  formMode={props.formMode}
                  intl={props.intl}
                  formikBag={formikBag}
                  mapped={props.hrCompetencyMappedState.list.response.data[0]}
                  responders={props.hrCompetencyResultState.detailList.response.data}
                />
              }
            </div>
          </div>
        </Form>
      )}
    />
  </FormPage>
);