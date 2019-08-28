import { IHrCompetencyEmployee } from '@hr/classes/response';
import { hrMessage } from '@hr/locales/messages/hrMessage';
import { layoutMessage } from '@layout/locales/messages';
import { GlobalFormat } from '@layout/types';
import { GlobalStyle } from '@layout/types/GlobalStyle';
import { Grid, TextField } from '@material-ui/core';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';

interface OwnProps {
  data: IHrCompetencyEmployee;
}

type AllProps
  = OwnProps
  & InjectedIntlProps;

const hrCompetencySummaryEmployee: React.SFC<AllProps> = props => (
  <Grid container>
    <Grid item xs={12} sm={6} md={3}>
      <TextField
        {...GlobalStyle.TextField.ReadOnly}
        label={props.intl.formatMessage(hrMessage.competency.field.type, {state: 'Employee'})}
        value={props.data.responden && props.data.responden.fullName}
      />
      {/* <TextField
        {...GlobalStyle.TextField.ReadOnly}
        label={props.intl.formatMessage(hrMessage.competency.field.type, {state: 'Year'})}
        value={props.data.assessmentYear}
      /> */}
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
      <TextField
        {...GlobalStyle.TextField.ReadOnly}
        label={props.intl.formatMessage(hrMessage.competency.field.type, {state: 'Company'})}
        value={props.data.position && props.data.position.company && props.data.position.company.name || 'N/A'}
      />
      <TextField
        {...GlobalStyle.TextField.ReadOnly}
        label={props.intl.formatMessage(hrMessage.competency.field.type, {state: 'Position'})}
        value={props.data.position && props.data.position.name}
      />
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
      <TextField
        {...GlobalStyle.TextField.ReadOnly}
        label={props.intl.formatMessage(hrMessage.competency.field.type, {state: 'Status'})}
        value={props.data.status && props.data.status.description}
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

export const HrCompetencySummaryEmployee = compose<AllProps, OwnProps>(
  injectIntl
)(hrCompetencySummaryEmployee);