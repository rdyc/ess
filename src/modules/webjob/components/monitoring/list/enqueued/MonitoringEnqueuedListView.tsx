import { CollectionPage } from '@layout/components/pages';
import { layoutMessage } from '@layout/locales/messages';
import { Button } from '@material-ui/core';
import { IWebJobMonitoringJobEnqueued } from '@webjob/classes/response';
import * as React from 'react';

import { MonitoringEnqueuedListProps } from './MonitoringEnqueuedList';
import { MonitoringEnqueuedSummary } from './MonitoringEnqueuedSummary';

export const MonitoringEnqueuedListView: React.SFC<MonitoringEnqueuedListProps> = props => (
  <CollectionPage
    // state & fields
    state={props.webJobMonitoringState.jobEnqueuedAll}
    fields={props.fields}

    // callback
    onLoadApi={props.handleOnLoadApi}
    onBind={props.handleOnBind}
    
    // row components
    summaryComponent={(item: IWebJobMonitoringJobEnqueued) => ( 
      <MonitoringEnqueuedSummary data={item}/>
    )}
    actionComponent={(item: IWebJobMonitoringJobEnqueued) => (
      <React.Fragment>
        <Button 
          size="small"
          color="secondary"
          onClick={() => props.history.push(`/webjob/monitoring/jobs/${props.match.params.type}/${item.id}`)}
        >
          {props.intl.formatMessage(layoutMessage.action.details)}
        </Button>
      </React.Fragment>
    )}
  />
);