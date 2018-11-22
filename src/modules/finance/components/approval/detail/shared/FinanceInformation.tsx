import { IFinanceDetail } from '@finance/classes/response';
import { financeMessage } from '@finance/locales/messages/financeMessage';
import { GlobalFormat } from '@layout/types';
import { GlobalStyle } from '@layout/types/GlobalStyle';
import { Button, Card, CardContent, CardHeader, InputAdornment, TextField } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';

interface OwnProps {
  data: IFinanceDetail;
  handleToDocument: (moduleUid: string, documentUid: string) => void;
}

type AllProps
  = OwnProps
  & InjectedIntlProps;

export const financeInformation: React.SFC<AllProps> = props => {
  const { data, intl, handleToDocument } = props;

  const documentStyle: Partial<TextFieldProps> = {
    fullWidth: true,
    margin: 'dense',
    InputProps: {
      disableUnderline: true,
      readOnly: true,
      endAdornment: 
        data &&
        <InputAdornment position="end">
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => handleToDocument(data.moduleUid, data.documentUid)}
          >
            {intl.formatMessage(financeMessage.approval.field.goToDocument)}
          </Button>
        </InputAdornment>
      
    }
  };

  const render = (
    <Card square>
      <CardHeader 
        title={intl.formatMessage(financeMessage.approval.section.infoTitle)}
        subheader={intl.formatMessage(financeMessage.approval.section.infoSubTitle)}
      />
      <CardContent>
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          label={intl.formatMessage(financeMessage.approval.field.uid)}
          value={data.uid}
        />
        <TextField
          
          {...GlobalStyle.TextField.ReadOnly}
          label={intl.formatMessage(financeMessage.approval.field.moduleName)}
          value={data.module ? data.module.value : 'N/A'}
        />
        <TextField
          {...documentStyle}
          label={intl.formatMessage(financeMessage.approval.field.documentUid)}
          value={data.documentUid ? data.documentUid : 'N/A'}
        />
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          label={intl.formatMessage(financeMessage.approval.field.requestor)}
          value={data.document.changes.created ? data.document.changes.created.fullName : 'N/A'}
        />
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          label={intl.formatMessage(financeMessage.approval.field.approvalDate)}
          value={data.document.changes.updatedAt ? 
            intl.formatDate(data.document.changes.updatedAt, GlobalFormat.Date) : ''}
        />
        {
          (data.document.amount &&
          data.document.amount.advance) &&
          <TextField
          {...GlobalStyle.TextField.ReadOnly}
            label={intl.formatMessage(financeMessage.approval.field.advance)}
            value={intl.formatNumber(data.document.amount.advance || 0)}
          /> || ''
        }
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          label={intl.formatMessage(financeMessage.approval.field.total)}
          value={data.document.amount ?
            intl.formatNumber(data.document.amount.total || 0) : 0}
        />
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          label={intl.formatMessage(financeMessage.approval.field.status)}
          value={data.status ? data.status.value : 'N/A'}
        />
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          multiline
          label={intl.formatMessage(financeMessage.approval.field.notes)}
          value={data.notes || 'N/A'}
        />
      </CardContent>
    </Card>
  );

  return render;
};

export const FinanceInformation = compose<AllProps, OwnProps>(
  injectIntl
)(financeInformation);