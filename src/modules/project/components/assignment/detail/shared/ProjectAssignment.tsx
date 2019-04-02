import { FormMode } from '@generic/types';
import { layoutMessage } from '@layout/locales/messages';
import { GlobalFormat } from '@layout/types';
import { GlobalStyle } from '@layout/types/GlobalStyle';
import { Card, CardContent, CardHeader, TextField } from '@material-ui/core';
import { IProjectAssignmentDetail } from '@project/classes/response';
import { projectMessage } from '@project/locales/messages/projectMessage';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';

interface IOwnProps {
  formMode: FormMode;
  data: IProjectAssignmentDetail | undefined;
  showProjectHours?: boolean | true;
}

type AllProps
  = IOwnProps
  & InjectedIntlProps;

const projectAssignment: React.SFC<AllProps> = props => (
  <Card square>
    <CardHeader 
      title={props.intl.formatMessage(projectMessage.assignment.section.projectTitle)}
      // subheader={props.intl.formatMessage(projectMessage.assignment.section.projectSubHeader)}
    />
    <CardContent>
      {
        props.formMode === FormMode.New &&
        props.children
      }

      {
        props.data &&
        <React.Fragment>
          {
            props.formMode !== FormMode.New &&  
            <React.Fragment>
              <TextField
                {...GlobalStyle.TextField.ReadOnly}
                label={props.intl.formatMessage(projectMessage.assignment.field.uid)}
                value={props.data.uid}
              />
              <TextField
                {...GlobalStyle.TextField.ReadOnly}
                label={props.intl.formatMessage(projectMessage.registration.field.uid)}
                value={props.data.projectUid}
              />
            </React.Fragment>
          }

          <TextField
            {...GlobalStyle.TextField.ReadOnly}
            label={props.intl.formatMessage(projectMessage.registration.field.ownerEmployeeUid)}
            value={props.data.owner ? props.data.owner.fullName : 'N/A'}
          />
          <TextField
            {...GlobalStyle.TextField.ReadOnly}
            label={props.intl.formatMessage(projectMessage.registration.field.customerUid)}
            value={props.data.customer ? props.data.customer.name : 'N/A'}
          />
          <TextField
            {...GlobalStyle.TextField.ReadOnly}
            label={props.intl.formatMessage(projectMessage.registration.field.projectType)}
            value={props.data.project ? props.data.project.value : 'N/A'}
          />
          <TextField
            {...GlobalStyle.TextField.ReadOnly}
            label={props.intl.formatMessage(projectMessage.registration.field.name)}
            value={props.data.name}
          />
          <TextField
            {...GlobalStyle.TextField.ReadOnly}
            multiline={true}
            label={props.intl.formatMessage(projectMessage.registration.field.description)}
            value={props.data.description || 'N/A'}
          />
          <TextField
            {...GlobalStyle.TextField.ReadOnly}
            label={props.intl.formatMessage(projectMessage.registration.field.start)}
            value={props.intl.formatDate(props.data.start, GlobalFormat.Date)}
          />
          <TextField
            {...GlobalStyle.TextField.ReadOnly}
            label={props.intl.formatMessage(projectMessage.registration.field.end)}
            value={props.intl.formatDate(props.data.end, GlobalFormat.Date)}
          />

          {
            props.showProjectHours &&
            <React.Fragment>
              <TextField
                {...GlobalStyle.TextField.ReadOnly}
                label={props.intl.formatMessage(projectMessage.registration.field.maxHours)}
                value={props.intl.formatNumber(props.data.maxHours)}
              />
              <TextField
                {...GlobalStyle.TextField.ReadOnly}
                label={props.intl.formatMessage(projectMessage.assignment.field.assignedHours)}
                value={props.intl.formatNumber(props.data.assignedHours)}
              />
              <TextField
                {...GlobalStyle.TextField.ReadOnly}
                label={props.intl.formatMessage(projectMessage.assignment.field.unassignedHours)}
                value={props.intl.formatNumber(props.data.unassignedHours)}
              />
            </React.Fragment>
          }

          {
            props.data.changes &&
            <React.Fragment>
              <TextField
                {...GlobalStyle.TextField.ReadOnly}
                label={props.intl.formatMessage(layoutMessage.field.createdBy)}
                value={props.data.changes.created && props.data.changes.created.fullName || 'N/A'}
                helperText={props.intl.formatDate(props.data.changes.createdAt, GlobalFormat.DateTime) || 'N/A'}
              />

              {
                (props.data.changes.updated && props.data.changes.updatedAt) &&
                <TextField
                  {...GlobalStyle.TextField.ReadOnly}
                  label={props.intl.formatMessage(layoutMessage.field.updatedBy)}
                  value={props.data.changes.updated.fullName || 'N/A'}
                  helperText={props.intl.formatDate(props.data.changes.updatedAt, GlobalFormat.DateTime) || 'N/A'}
                />
              }
            </React.Fragment>
          }
        </React.Fragment>
      }
      
      {
        props.formMode !== FormMode.New &&
        props.children
      }
    </CardContent>
  </Card>
);

export const ProjectAssignment = compose<AllProps, IOwnProps>(
  injectIntl
)(projectAssignment);