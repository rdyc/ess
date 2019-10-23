import { AppBar, Tab, Tabs } from '@material-ui/core';
import { MonitoringTabs } from '@webjob/classes/types/monitoring/MonitoringTabs';
import { webJobMessage } from '@webjob/locales/messages/webJobMessage';
import * as React from 'react';
import { WebJobMonitoringTabProps } from './WebJobMonitoringTab';

export const WebJobMonitoringTabView: React.SFC<WebJobMonitoringTabProps> = props => {
  const { response } = props.webJobMonitoringState.statisticAll;

  const tabs = Object.keys(MonitoringTabs).map((key, index) => ({
    id: key,
    name: MonitoringTabs[key]
  }));
  
  const render = (
    <React.Fragment>
      {
        response &&
        response.data &&
        <React.Fragment>
          <AppBar position="static">
            <Tabs centered value={props.tabValue} style={{
              color: '#fff',
              background: props.theme.palette.type === 'light' ? '#03a9f4' : '#212121'
            }}>
              {tabs.map(item => (
                <Tab
                  key={item.id}
                  label={
                    response.data[item.name] ?
                    <span className={props.classes.badgeParent}>
                    {props.intl.formatMessage(webJobMessage.shared.fieldFor(item.name, 'fieldTab'))}
                      <span className={props.classes.badgeChild}>
                        {response.data[item.name] > 99 ? '99+' : response.data[item.name]}
                      </span>
                    </span>
                    :
                    props.intl.formatMessage(webJobMessage.shared.fieldFor(item.name, 'fieldTab'))
                  }
                  onClick={() => props.history.push(`/webjob/${item.name}`)}
                />
              ))}
            </Tabs>
          </AppBar>
          {props.children}
        </React.Fragment>
      }
    </React.Fragment>
  );

  return render;
};
