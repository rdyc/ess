import { MileageApprovalDetail } from '@mileage/components/approval/detail/MileageApprovalDetail';
import { MileageApprovalList } from '@mileage/components/approval/list/MileageApprovalList';
import { MileageRequestDetail } from '@mileage/components/request/detail/MileageRequestDetail';
import MileageRequestEditor from '@mileage/components/request/editor/MileageRequestEditor';
import { MileageRequestList } from '@mileage/components/request/list/MileageRequestList';
import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';

const request = (props: RouteComponentProps) => (
  <Switch>
    <Route path={`${props.match.path}/form`} component={MileageRequestEditor} />
    <Route path={`${props.match.path}/:mileageUid`} component={MileageRequestDetail} />
    <Route path={`${props.match.path}`} component={MileageRequestList} />
  </Switch>
);

const approval = (props: RouteComponentProps) => (
  <Switch>
    <Route path={`${props.match.path}/:mileageUid`} component={MileageApprovalDetail} />
    <Route path={`${props.match.path}`} component={MileageApprovalList} />
  </Switch>
);

export const MileageRoutingComponents: React.SFC<RouteComponentProps> = props => (
  <Switch>
    <Route path={`${props.match.path}/request`} component={request} />
    <Route path={`${props.match.path}/approval`} component={approval} />
  </Switch>
);