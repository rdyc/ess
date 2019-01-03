import { Layout } from '@layout/components/base';
import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';
import { OrganizationHierarchyDetail } from './hierarchy/detail/OrganizationHierarchyDetail';
import OrganizationHierarchyEditor from './hierarchy/editor/OrganizationHierarchyEditor';
import { OrganizationHierarchyList } from './hierarchy/list/OrganizationHierarchyList';
import { StructureDetail } from './structure/detail/StructureDetail';
import OrganizationStructureEditor from './structure/editor/OrganizationStructureEditor';
import { StructureList } from './structure/list/StructureList';

const OrganizationHierarchy = (props: RouteComponentProps) => (
  <Switch>
    <Route path={`${props.match.path}/form`} component={OrganizationHierarchyEditor} />
    <Route path={`${props.match.path}/:hierarchyUid`} component={OrganizationHierarchyDetail} />
    <Route path={`${props.match.path}`} component={OrganizationHierarchyList} />
  </Switch>
);

const OrganizationStructure = (props: RouteComponentProps) => (
  <Switch>
    <Route path={`${props.match.path}/form`} component={OrganizationStructureEditor} />
    <Route path={`${props.match.path}/:structureUid`} component={StructureDetail} />
    <Route path={`${props.match.path}`} component={StructureList} />
  </Switch>
);

export const OrganizationRoutingComponents: React.SFC<RouteComponentProps> = props => (
  <Switch>
    <Layout>
      <Route path={`${props.match.path}/hierarchy`} component={OrganizationHierarchy} />
      <Route path={`${props.match.path}/structure`} component={OrganizationStructure} />
    </Layout>
  </Switch>
);