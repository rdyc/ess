import { IKPIFinal } from '@account/classes/response/employeeKPI';
import { kpiMessage } from '@kpi/locales/messages/kpiMessage';
import { layoutMessage } from '@layout/locales/messages';
import { GlobalFormat } from '@layout/types';
import { GlobalStyle } from '@layout/types/GlobalStyle';
import { Card, CardContent, CardHeader, TextField } from '@material-ui/core';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';

interface OwnProps {
  data: IKPIFinal;
}
type AllProps
  = OwnProps
  & InjectedIntlProps;

const myKPIFinalInformation: React.SFC<AllProps> = props => {
  const render = (
    <Card square>
      <CardHeader
        title={props.intl.formatMessage(kpiMessage.employee.section.infoTitle)}
        // subheader={props.intl.formatMessage(lookupMessage.mileageException.field.infoSubHeader)}
      />
      <CardContent>
        {/* <TextField
          {...GlobalStyle.TextField.ReadOnly}
          label={props.intl.formatMessage(kpiMessage.employee.field.uid)}
          value={props.data.uid}
        /> */}
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          label={props.intl.formatMessage(kpiMessage.employee.field.employeeUid)}
          value={props.data.employee && props.data.employee.fullName || 'N/A'}
        />
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          label={props.intl.formatMessage(kpiMessage.employee.field.year)}
          value={props.data.year.toString()}
        />
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          label={props.intl.formatMessage(kpiMessage.employee.field.period)}
          value={props.data.period === 1 && props.intl.formatMessage(kpiMessage.employee.field.periodMidYear) || props.intl.formatMessage(kpiMessage.employee.field.periodFullYear)}
        />
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          label={props.intl.formatMessage(kpiMessage.employee.field.totalScore)}
          value={`${props.data.totalScore.toString()} %`}
        />
        {
          props.data.note &&
          <TextField
            {...GlobalStyle.TextField.ReadOnly}
            label={props.intl.formatMessage(kpiMessage.employee.field.note)}
            value={props.data.note}
          />
        }
        {
          props.data.notes &&
          <TextField
            {...GlobalStyle.TextField.ReadOnly}
            label={props.intl.formatMessage(kpiMessage.employee.field.kpiNotes)}
            value={props.data.notes}
          />
        }
        {
          props.data.changes &&
          <React.Fragment>

            {
              (props.data.changes.updated && props.data.changes.updatedAt) &&
              <TextField
                {...GlobalStyle.TextField.ReadOnly}
                label={props.intl.formatMessage(layoutMessage.field.updatedBy)}
                value={props.data.changes.updated.fullName || 'N/A'}
                helperText={props.intl.formatDate(props.data.changes.updatedAt, GlobalFormat.DateTime) || 'N/A'}
              />
              ||
              <TextField
                {...GlobalStyle.TextField.ReadOnly}
                label={props.intl.formatMessage(layoutMessage.field.createdBy)}
                value={props.data.changes.created && props.data.changes.created.fullName || 'N/A'}
                helperText={props.intl.formatDate(props.data.changes.createdAt, GlobalFormat.DateTime) || 'N/A'}
              />
            }
          </React.Fragment>
      }
      </CardContent>
    </Card>
  );

  return render;
};

export const MyKPIFinalInformation = compose<AllProps, OwnProps>(injectIntl)(myKPIFinalInformation);