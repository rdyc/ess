import { Billable } from '@summary/components/billable/Billable';
import { Effectiveness } from '@summary/components/effectiveness/Effectiveness';
import { Profitability } from '@summary/components/profitability/Profitability';
import { Progress } from '@summary/components/progress/Progress';
import { WinningRatio } from '@summary/components/winningRatio/WinningRatio';
import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';

export const SummaryRoutingComponents: React.SFC<RouteComponentProps> = props => (
  <Switch>
    <Route path={`${props.match.path}/billable/`} component={Billable}/>
    <Route path={`${props.match.path}/effectiveness/`} component={Effectiveness}/>
    <Route path={`${props.match.path}/winningratio/`} component={WinningRatio}/>
    <Route path={`${props.match.path}/profitability/`} component={Profitability}/>
    <Route path={`${props.match.path}/progress/`} component={Progress}/>
  </Switch>
);
