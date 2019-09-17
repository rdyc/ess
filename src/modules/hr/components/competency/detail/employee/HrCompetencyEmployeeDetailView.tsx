import AppMenu from '@constants/AppMenu';
import { IHrCompetencyEmployeeDetail } from '@hr/classes/response';
import { hrMessage } from '@hr/locales/messages/hrMessage';
import { DialogConfirmation } from '@layout/components/dialogs';
import { PreviewPage } from '@layout/components/pages/PreviewPage/PreviewPage';
import { PopupMenu } from '@layout/components/PopupMenu';
import { GlobalStyle } from '@layout/types/GlobalStyle';
import { Card, CardContent, CardHeader, TextField } from '@material-ui/core';
import * as React from 'react';
import { HrCompetencyEmployeeCategoryItem } from './HrCompetencyEmployeeCategoryItem';
import { HrCompetencyEmployeeDetailProps } from './HrCompetencyEmployeeDetail';
import { HrCompetencyEmployeeInformation } from './HrCompetencyEmployeeInformation';

export const HrCompetencyEmployeeDetailView: React.SFC<HrCompetencyEmployeeDetailProps> = props => (
  <React.Fragment>
    <PreviewPage 
      info={{
        uid: AppMenu.CompetencyAssessmentInput,
        parentUid: AppMenu.HumanResource,
        parentUrl: '/hr/assessmentinput',
        title: props.intl.formatMessage(hrMessage.shared.page.detailTitle, {state: '360 Assessment Input'}),
        description: props.intl.formatMessage(hrMessage.shared.page.detailSubHeader)
      }}
      state={props.hrCompetencyEmployeeState.detail}
      onLoadApi={props.handleOnLoadApi}
      primary={(data: IHrCompetencyEmployeeDetail) => ([
        <HrCompetencyEmployeeInformation data={data} />
      ])}
      appBarComponent={
        props.menuOptions &&
        <PopupMenu
          id="hr-competency-assessment-input-option"
          selectable={false}
          menuOptions={props.menuOptions}
          onSelected={props.handleOnSelectedMenu}
        />
      }
    >
      <DialogConfirmation 
        isOpen={props.dialogOpen}
        fullScreen={props.dialogFullScreen}
        title={props.dialogTitle}
        content={props.dialogContent}
        labelCancel={props.dialogCancelLabel}
        labelConfirm={props.dialogConfirmLabel}
        onClickCancel={props.handleOnCloseDialog}
        onClickConfirm={props.handleOnConfirm}
      />  
    </PreviewPage>
    {
      !props.hrCompetencyEmployeeState.detail.isLoading &&
      (
        props.hrCompetencyEmployeeState.detail.response &&
        props.hrCompetencyEmployeeState.detail.response.data &&
        props.hrCompetencyEmployeeState.detail.response.data.items.length > 0 ?
        <HrCompetencyEmployeeCategoryItem 
          data={props.hrCompetencyEmployeeState.detail.response.data}
        />
        :
        <Card square>
          <CardHeader
            title={props.intl.formatMessage(hrMessage.shared.section.infoTitle, {state: 'Respond'})}
          />
          <CardContent>
            <TextField
              {...GlobalStyle.TextField.ReadOnly}
              margin="dense"
              value={props.intl.formatMessage(hrMessage.competency.field.type, {state: 'No item is recorded'})}
            />
          </CardContent>
        </Card>
      )
    }
  </React.Fragment>
);