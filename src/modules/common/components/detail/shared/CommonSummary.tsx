import { ISystem } from '@common/classes/response';
import { isWithCompany, isWithParent } from '@common/helper';
import { commonMessage } from '@common/locales/messages/commonMessage';
import { layoutMessage } from '@layout/locales/messages';
import { GlobalFormat } from '@layout/types';
import { GlobalStyle } from '@layout/types/GlobalStyle';
import { Grid, TextField } from '@material-ui/core';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';

interface OwnProps {
  data: ISystem;
  category?: string;
}

type AllProps
  = OwnProps
  & InjectedIntlProps;

const commonSummary: React.SFC<AllProps> = props => (
    <Grid container>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          label={props.intl.formatMessage(commonMessage.system.field.name)}
          value={props.data.name}
        />
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          label={props.intl.formatMessage(commonMessage.system.field.description)}
          value={props.data.description || 'N/A'}
        />
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          label={props.intl.formatMessage(commonMessage.system.field.type)}
          value={props.data.type}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        {
          isWithCompany(props.category) &&
          <TextField
            {...GlobalStyle.TextField.ReadOnly}
            label={props.intl.formatMessage(commonMessage.system.field.companyUid)}
            value={props.data.company && props.data.company.name || 'N/A'}
          />
        }
        {
          
          isWithParent(props.category) &&
          <TextField
            {...GlobalStyle.TextField.ReadOnly}
            label={props.intl.formatMessage(commonMessage.system.field.parentCode)}
            value={props.data.parent && props.data.parent.value || 'N/A'}
          />
        }
        <TextField
          {...GlobalStyle.TextField.ReadOnly}
          label={props.intl.formatMessage(commonMessage.system.field.isActive)}
          value={props.data.isActive ? 
            props.intl.formatMessage(commonMessage.system.text.active)
            : props.intl.formatMessage(commonMessage.system.text.inActive)
          }
        />
      </Grid>
      {
      props.data.changes &&
      <Grid item xs={12} sm={6} md={3}>
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
      </Grid>
    }
    </Grid>
);

export const CommonSummary = compose<AllProps, OwnProps>(
  injectIntl
)(commonSummary);