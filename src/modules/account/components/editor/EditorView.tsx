import { AccountEmployeeTabs } from '@account/classes/types/AccountEmployeeTabs';
import { AppBar, Tab, Tabs, Typography } from '@material-ui/core';
import * as React from 'react';
import AccountEmployeeEditor from './AccountEmployeeEditor';
import { EditorProps } from './Editor';

export const EditorView: React.SFC<EditorProps> = props => {

  const tabs = Object.keys(AccountEmployeeTabs).map(key => ({
    id: key,
    name: AccountEmployeeTabs[key]
  }));

  const render = (
    <React.Fragment>
      <AppBar position="static">
      <Tabs 
          value={props.tab} 
          onChange={props.handleTab}
          scrollable	
          scrollButtons="auto"
        >
          {tabs.map(item =>
            <Tab label={item.name}/>  
          )}
        </Tabs>
      </AppBar>
      {props.tab === 0 && 
        <div style={{ padding: 8 * 3 }}>
          <AccountEmployeeEditor/>
        </div>
      }
      {props.tab === 1 && <div style={{ padding: 8 * 3 }}><Typography>Tab 1</Typography></div>}
      {props.tab === 2 && <div style={{ padding: 8 * 3 }}><Typography>Tab 2</Typography></div>}
      {props.tab === 3 && <div style={{ padding: 8 * 3 }}><Typography>Tab 3</Typography></div>}
      {props.tab === 4 && <div style={{ padding: 8 * 3 }}><Typography>Tab 4</Typography></div>}
      {props.tab === 5 && <div style={{ padding: 8 * 3 }}><Typography>Tab 5</Typography></div>}
      {props.tab === 6 && <div style={{ padding: 8 * 3 }}><Typography>Tab 6</Typography></div>}
    </React.Fragment> 
  );

  return render;
};