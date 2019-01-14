import { WorkflowStatusType } from '@common/classes/types';
import { layoutMessage } from '@layout/locales/messages';
import { GlobalFormat } from '@layout/types';
import { GlobalStyle } from '@layout/types/GlobalStyle';
import { Card, CardContent, CardHeader, TextField } from '@material-ui/core';
import { ITravelSettlementDetail } from '@travel/classes/response';
import { travelMessage } from '@travel/locales/messages/travelMessage';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';

interface OwnProps {
  data: ITravelSettlementDetail;
}

type AllProps
  = OwnProps
  & InjectedIntlProps;

const travelSettlementInformation: React.SFC<AllProps> = props => {
  const { data, intl } = props;

  const render = (
    <Card square>
      <CardHeader 
        title={props.intl.formatMessage(travelMessage.settlement.section.infoTitle)}
        // subheader={props.intl.formatMessage(travelMessage.settlement.section.infoSubHeader)}
      />
      <CardContent>
      <TextField
          {...GlobalStyle.TextField.ReadOnly}
          margin="dense"
          label={props.intl.formatMessage(travelMessage.settlement.field.uid)}
          value={data.uid}
        />
    
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          margin="dense"
          label={props.intl.formatMessage(travelMessage.request.field.statusType)}
          value={data.status ? data.status.value : 'N/A'}
        />
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          margin="dense"
          label={props.intl.formatMessage(travelMessage.request.field.employeeUid)}
          value={data.employee ? data.employee.fullName : 'N/A'}
        />
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          margin="dense"
          label={props.intl.formatMessage(travelMessage.request.field.positionUid)}
          value={data.position ? data.position.name : 'N/A'}
        />
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          margin="dense"
          label={props.intl.formatMessage(travelMessage.request.field.destinationType)}
          value={data.destination ? data.destination.value : 'N/A'}
        />
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          margin="dense"
          label={props.intl.formatMessage(travelMessage.request.field.start)}
          value={intl.formatDate(data.start, GlobalFormat.Date)}
        />
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          margin="dense"
          label={props.intl.formatMessage(travelMessage.request.field.end)}
          value={intl.formatDate(data.end, GlobalFormat.Date)}
        />
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          margin="dense"
          label={props.intl.formatMessage(travelMessage.request.field.customerUid)}
          value={data.customer ? data.customer.name : 'N/A'}
        />
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          multiline
          margin="dense"
          label={props.intl.formatMessage(travelMessage.request.field.projectUid)}
          value={`${ data && data.projectUid} - ${ data && data.project ? data.project.name : '' }`}
        />
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          margin="dense"
          label={props.intl.formatMessage(travelMessage.request.field.siteUid)}
          value={data.site ? data.site.name : 'N/A'}
        />
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          margin="dense"
          label={props.intl.formatMessage(travelMessage.request.field.activityType)}
          value={data.activity ? data.activity.value : 'N/A'}
        />
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          margin="dense"
          label={props.intl.formatMessage(travelMessage.request.field.objective)}
          value={data.objective || 'N/A'}
        />
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          margin="dense"
          label={props.intl.formatMessage(travelMessage.request.field.target)}
          value={data.target || 'N/A'}
        />
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          margin="dense"
          label={props.intl.formatMessage(travelMessage.request.field.comment)}
          value={data.comment || 'N/A'}
        />
        {
           props.data.statusType === WorkflowStatusType.Rejected &&
          <TextField
            {...GlobalStyle.TextField.ReadOnly}
            margin="dense"
            label={props.intl.formatMessage(travelMessage.request.field.rejectReason)}
            value={data.rejectReason || 'N/A'}
          />
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

      </CardContent>
    </Card>
  );
  return render;
};

export const TravelSettlementInformation = compose<AllProps, OwnProps>(
  injectIntl
)(travelSettlementInformation);