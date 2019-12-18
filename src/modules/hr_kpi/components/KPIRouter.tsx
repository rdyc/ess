import AppMenu from '@constants/AppMenu';
import { SecureMenuRoute } from '@layout/components/SecureMenuRoute';
import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';
import { KPIApprovalDetail } from './approval/detail/KPIApprovalDetail';
import { KPIApprovalList } from './approval/list/KPIApprovalList';
import { KPIAssignDetail } from './assign/detail/KPIAssignDetail';
import { KPIAssignBulkForm } from './assign/form/createbulk/KPIAssignBulkForm';
import { KPIAssignForm } from './assign/form/edit/KPIAssignForm';
import { EmployeeAssignList } from './assign/list/employee/EmployeeAssignList';
import { KPIAssignList } from './assign/list/kpi/KPIAssignList';
import { KPICategoryDetail } from './category/Detail/KPICategoryDetail';
import { KPICategoryForm } from './category/form/KPICategoryForm';
import { KPICategoryList } from './category/list/KPICategoryList';
import { KPIEmployeeDetail } from './employee/detail/KPIEmployeeDetail';
import { KPIEmployeeForm } from './employee/form/KPIEmployeeForm';
import { KPIEmployeeList } from './employee/list/KPIEmployeeList';
import { KPIFinalDetail } from './final/detail/KPIFinalDetail';
import { EmployeeFinalList } from './final/list/employee/EmployeeFinalList';
import { KPIFinalList } from './final/list/kpi/KPIFinalList';
import { KPIOpenDetail } from './open/Detail/KPIOpenDetail';
import { KPIOpenForm } from './open/form/KPIOpenForm';
import { KPIOpenList } from './open/list/KPIOpenList';
import { KPIFinalSubOrdinateDetail } from './subordinate/detail/KPIFinalSubOrdinateDetail';
import { EmployeeFinalSubOrdinateList } from './subordinate/list/employee/EmployeeFinalSubOrdinateList';
import { KPIFinalSubOrdinateList } from './subordinate/list/kpi/KPIFinalSubOrdinateList';
import { KPITemplateDetail } from './template/detail/KPITemplateDetail';
import { KPITemplateForm } from './template/form/KPITemplateForm';
import { KPITemplateList } from './template/list/KPITemplateList';

const subordinate = (props: RouteComponentProps) => (
  <Switch>
    <Route path={`${props.match.path}/:employeeUid/:kpiUid`} component={KPIFinalSubOrdinateDetail} />
    <Route path={`${props.match.path}/:employeeUid`} component={KPIFinalSubOrdinateList} />
    <Route path={`${props.match.path}`} component={EmployeeFinalSubOrdinateList} />
  </Switch>
);

const final = (props: RouteComponentProps) => (
  <Switch>
    <Route path={`${props.match.path}/:employeeUid/:kpiUid`} component={KPIFinalDetail} />
    <Route path={`${props.match.path}/:employeeUid`} component={KPIFinalList} />
    <Route path={`${props.match.path}`} component={EmployeeFinalList} />
  </Switch>
);

const approval = (props: RouteComponentProps) => (
  <Switch>
    <Route path={`${props.match.path}/:kpiUid`} component={KPIApprovalDetail} />
    <Route path={`${props.match.path}`} component={KPIApprovalList} />
  </Switch>
);

const employee = (props: RouteComponentProps) => (
  <Switch>
    <Route path={`${props.match.path}/form`} component={KPIEmployeeForm} />
    <Route path={`${props.match.path}/:kpiUid`} component={KPIEmployeeDetail} />
    <Route path={`${props.match.path}`} component={KPIEmployeeList} />
  </Switch>
);

const assign = (props: RouteComponentProps) => (
  <Switch>
    <Route path={`${props.match.path}/:employeeUid/form`} component={KPIAssignForm} />
    <Route path={`${props.match.path}/:employeeUid/:kpiAssignUid`} component={KPIAssignDetail} />
    <Route path={`${props.match.path}/form`} component={KPIAssignBulkForm} />
    <Route path={`${props.match.path}/:employeeUid`} component={KPIAssignList} />
    <Route path={`${props.match.path}`} component={EmployeeAssignList} />
  </Switch>
);

const template = (props: RouteComponentProps) => (
  <Switch>
    <Route path={`${props.match.path}/form`} component={KPITemplateForm} />
    <Route path={`${props.match.path}/:templateUid`} component={KPITemplateDetail} />
    <Route path={`${props.match.path}`} component={KPITemplateList} />
  </Switch>
);

const open = (props: RouteComponentProps) => (
  <Switch>
    <Route path={`${props.match.path}/form`} component={KPIOpenForm} /> 
    <Route path={`${props.match.path}/:openUid`} component={KPIOpenDetail} />
    <Route path={`${props.match.path}`} component={KPIOpenList} />
  </Switch>
);

const category = (props: RouteComponentProps) => (
  <Switch>
    <Route path={`${props.match.path}/form`} component={KPICategoryForm} /> 
    <Route path={`${props.match.path}/:categoryUid`} component={KPICategoryDetail} />
    <Route path={`${props.match.path}`} component={KPICategoryList} />
  </Switch>
);

export const KPIRoutingComponents: React.SFC<RouteComponentProps> = props => (
  <Switch>
    <SecureMenuRoute 
      path={`${props.match.path}/templates`}
      menu={AppMenu.Lookup} 
      subMenu={AppMenu.KPITemplate} 
      component={template} 
    />
    <SecureMenuRoute 
      path={`${props.match.path}/opens`}
      menu={AppMenu.Lookup} 
      subMenu={AppMenu.KPITemplate} 
      component={open} 
    />
    <SecureMenuRoute 
      path={`${props.match.path}/categories`}
      menu={AppMenu.Lookup} 
      subMenu={AppMenu.KPITemplate} 
      component={category} 
    />
    <SecureMenuRoute 
      path={`${props.match.path}/assigns`}
      menu={AppMenu.Lookup} 
      subMenu={AppMenu.HRKPIAssign} 
      component={assign} 
    />
    <SecureMenuRoute 
      path={`${props.match.path}/finals`}
      menu={AppMenu.HumanResource} 
      subMenu={AppMenu.KPIEmployee} 
      component={final} 
    />
    <SecureMenuRoute 
      path={`${props.match.path}/subordinates`}
      menu={AppMenu.HumanResource} 
      subMenu={AppMenu.KPISubOrdinate} 
      component={subordinate} 
    />
    <SecureMenuRoute 
      path={`${props.match.path}/employees`}
      menu={AppMenu.HumanResource} 
      subMenu={AppMenu.ManagerKPIInput} 
      component={employee} 
    />
    <SecureMenuRoute 
      path={`${props.match.path}/approvals`}
      menu={AppMenu.HumanResource} 
      subMenu={AppMenu.HRKPIInput} 
      component={approval} 
    />
  </Switch>
);