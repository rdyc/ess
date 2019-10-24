import { LoadingCircular } from '@layout/components/loading/LoadingCircular';
import { Divider, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Hidden, Typography } from '@material-ui/core';
import { isWidthDown } from '@material-ui/core/withWidth';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { IWebJobMonitoringServer } from '@webjob/classes/response';
import { MonitoringTabs } from '@webjob/classes/types/monitoring/MonitoringTabs';
import { WebJobMonitoringTab } from '@webjob/components/tabs/WebJobMonitoringTab';
import * as React from 'react';
import { WebJobServerListProps } from './WebJobServerList';
import { WebJobServerSummary } from './WebJobServerSummary';

export const WebJobServerListView: React.SFC<WebJobServerListProps> = props => {

  const summaryComponent = (item: IWebJobMonitoringServer) => {
    return <WebJobServerSummary data={item}/>;
  };

  const render = (
    <WebJobMonitoringTab
      tab={MonitoringTabs.Servers}      
    >
      {
        props.webJobMonitoringState.serverAll.isLoading &&
        <LoadingCircular />
      }
      {
        props.webJobMonitoringState.serverAll.response &&
        props.webJobMonitoringState.serverAll.response.data &&
        props.webJobMonitoringState.serverAll.response.data.map((item, index) => 

          <ExpansionPanel key={`EPS${index}`} tabIndex={index}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>            
              <Grid container>
                <Grid item xs={9} md={9}>
                  <Grid container>
                    <Grid item xs={12} sm={8} md={3}>
                      <Typography
                        variant="body2"
                        noWrap={true}
                        paragraph={false}
                      >
                        {item.name}
                      </Typography>
                    </Grid>

                    <Hidden xsDown>
                      <Grid item sm={4} md={3}>
                        <Typography
                          variant="body2"
                          noWrap={true}
                          paragraph={false}
                        >
                          {item.queues[0]}
                        </Typography>
                      </Grid>

                      <Grid item sm={8} md={3}>
                        <Typography
                          variant={isWidthDown('sm', props.width) ? 'caption' : 'body2'}
                          noWrap={true}
                          paragraph={false}
                        >
                          {item.workersCount.toString()}
                        </Typography>
                      </Grid>
                    </Hidden>

                    <Grid item xs={12} sm={4} md={3}>
                      <Typography 
                        variant={isWidthDown('sm', props.width) ? 'caption' : 'body2'}
                        noWrap={true}
                        paragraph={false}
                      >
                        {item.startedAt}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={3} md={3}>
                  <Grid container>
                    <Grid item xs={12} md={6}>
                      <Typography 
                        variant="body2"
                        noWrap={true}
                        paragraph={false} 
                        align={isWidthDown('sm', props.width) ? 'right' : 'inherit'}
                      >
                        {''}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography
                        variant={isWidthDown('sm', props.width) ? 'caption' : 'body2'}
                        noWrap={true}
                        paragraph={false}
                        align="right"
                      >
                        {item.heartbeat}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </ExpansionPanelSummary>
              
            <Divider/>
            
            <ExpansionPanelDetails>
              {summaryComponent(item)}
            </ExpansionPanelDetails>
            
            <Divider/>
          </ExpansionPanel>

        )

      }
    </WebJobMonitoringTab>
  );

  return render;
};