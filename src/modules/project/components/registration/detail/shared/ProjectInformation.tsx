import { Card, CardContent, CardHeader, TextField } from '@material-ui/core';
import { IProjectDetail } from '@project/classes/response';
import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';

interface OwnProps {
  data: IProjectDetail;
}

type AllProps
  = OwnProps
  & InjectedIntlProps;

const projectInformation: React.SFC<AllProps> = props => {
  const { data, intl } = props;

  const styled = {
    fullWidth: true,
    InputProps: {
      disableUnderline: true,
      readOnly: true
    }
  };

  const render = (
    <Card square>
      <CardHeader 
        title={<FormattedMessage id="project.infoTitle"/>}
        subheader={<FormattedMessage id="project.infoSubTitle" />}
      />
      <CardContent>
        <TextField
          {...styled}
          margin="dense"
          label={<FormattedMessage id="project.field.information.statusType" />}
          value={data.status ? data.status.value : data.statusType}
        />
        <TextField
          {...styled}
          margin="dense"
          label={<FormattedMessage id="project.field.information.uid" />}
          value={data.uid}
        />
        <TextField
          {...styled}
          margin="dense"
          label={<FormattedMessage id="project.field.information.ownerEmployeeUid" />}
          value={data.owner ? data.owner.fullName : 'N/A'}
        />
        <TextField
          {...styled}
          margin="dense"
          label={<FormattedMessage id="project.field.information.customerUid" />}
          value={data.customer ? data.customer.name : 'N/A'}
        />
        <TextField
          {...styled}
          margin="dense"
          label={<FormattedMessage id="project.field.information.projectType" />}
          value={data.project ? data.project.value : 'N/A'}
        />
        <TextField
          {...styled}
          margin="dense"
          label={<FormattedMessage id="project.field.information.name" />}
          value={data.name}
        />
        <TextField
          {...styled}
          margin="dense"
          label={<FormattedMessage id="project.field.information.description" />}
          value={data.description || 'N/A'}
        />
        <TextField
          {...styled}
          margin="dense"
          label={<FormattedMessage id="project.field.information.contractNumber" />}
          value={data.contractNumber || 'N/A'}
        />
        <TextField
          {...styled}
          margin="dense"
          label={<FormattedMessage id="project.field.information.start" />}
          value={intl.formatDate(data.start, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        />
        <TextField
          {...styled}
          margin="dense"
          label={<FormattedMessage id="project.field.information.end" />}
          value={intl.formatDate(data.end, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        />
        <TextField
          {...styled}
          margin="dense"
          label={<FormattedMessage id="project.field.information.currencyType" />}
          value={data.currency ? data.currency.value : 'N/A'}
        />
        <TextField
          {...styled}
          margin="dense"
          label={<FormattedMessage id="project.field.information.rate" />}
          value={intl.formatNumber(data.rate || 0)}
        />
        <TextField
          {...styled}
          margin="dense"
          label={<FormattedMessage id="project.field.information.valueUsd" />}
          value={intl.formatNumber(data.valueUsd)}
        />
        <TextField
          {...styled}
          margin="dense"
          label={<FormattedMessage id="project.field.information.valueIdr" />}
          value={intl.formatNumber(data.valueIdr || 0)}
        />
        <TextField
          {...styled}
          margin="dense"
          label={<FormattedMessage id="project.field.information.hours" />}
          value={intl.formatNumber(data.maxHours)}
        />
      </CardContent>
    </Card>
  );

  return render;
};

export const ProjectInformation = compose<AllProps, OwnProps>(
  injectIntl
)(projectInformation);