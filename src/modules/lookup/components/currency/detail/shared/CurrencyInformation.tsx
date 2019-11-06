import { layoutMessage } from '@layout/locales/messages';
import { GlobalFormat } from '@layout/types';
import { GlobalStyle } from '@layout/types/GlobalStyle';
import { ICurrencyDetail } from '@lookup/classes/response/currency';
import { lookupMessage } from '@lookup/locales/messages/lookupMessage';
import { Card, CardContent, CardHeader, TextField } from '@material-ui/core';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';

interface OwnProps {
  data: ICurrencyDetail;
}

type AllProps
  = OwnProps
  & InjectedIntlProps;

const currencyInformation: React.SFC<AllProps> = props => {
  const { data, intl } = props;

  const render = (
    <Card square >
      <CardHeader
        title={intl.formatMessage(lookupMessage.currency.section.infoTitle)}
        subheader={intl.formatMessage(lookupMessage.currency.section.infoSubHeader)}
      />
      <CardContent >
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          margin="dense"
          label={intl.formatMessage(lookupMessage.currency.field.uid)}
          value={data.uid}
        />
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          margin="dense"
          label={intl.formatMessage(lookupMessage.currency.field.symbol)}
          value={data.symbol}
        />
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          margin="dense"
          label={intl.formatMessage(lookupMessage.currency.field.name)}
          value={data.name}
          multiline
        />
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          margin="dense"
          label={intl.formatMessage(lookupMessage.currency.field.rate)}
          value={props.intl.formatNumber(data.rate || 0)}
        />
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          margin="dense"
          label={props.intl.formatMessage(lookupMessage.currency.field.status)}
          value={props.data.isActive ?
            props.intl.formatMessage(lookupMessage.currency.field.isActive) :
            props.intl.formatMessage(lookupMessage.currency.field.isNotActive)}
        />
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          margin="dense"
          label={'Created By'}
          value={data.changes && data.changes.created ? data.changes.created.fullName : 'N/A'}
          multiline
        />{
          data.changes &&
          <TextField
            {...GlobalStyle.TextField.ReadOnly}
            margin="dense"
            label={props.intl.formatMessage(layoutMessage.field.createdBy)}
            value={data.changes.created && data.changes.created.fullName || 'N/A'}
            helperText={props.intl.formatDate(data.changes.createdAt, GlobalFormat.DateTime) || 'N/A'}
          />
        }
        {
          data.changes &&
          data.changes.updated &&
          data.changes.updatedAt &&
          <TextField
            {...GlobalStyle.TextField.ReadOnly}
            margin="dense"
            label={props.intl.formatMessage(layoutMessage.field.updatedBy)}
            value={data.changes.updated.fullName || 'N/A'}
            helperText={props.intl.formatDate(data.changes.updatedAt, GlobalFormat.DateTime) || 'N/A'}
          />
        }
      </CardContent>
    </Card>
  );
  return render;
};

export const CurrencyInformation = compose<AllProps, OwnProps>(
  injectIntl
)(currencyInformation);
