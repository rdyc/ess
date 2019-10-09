import AppMenu from '@constants/AppMenu';
import { CollectionPage } from '@layout/components/pages';
import { SearchBox } from '@layout/components/search';
import { layoutMessage } from '@layout/locales/messages';
import { Badge, Button, IconButton, Tooltip } from '@material-ui/core';
import { AddCircle, CheckCircle, Tune } from '@material-ui/icons';
import * as React from 'react';

import { IEmployeeKPI } from '@kpi/classes/response';
import { kpiMessage } from '@kpi/locales/messages/kpiMessage';
import { EmployeeAssignFilter } from './EmployeeAssignFilter';
import { AccountEmployeeAssignListProps } from './EmployeeAssignList';
import { EmployeeAssignSummary } from './EmployeeAssignSummary';

export const EmployeeAssignListView: React.SFC<AccountEmployeeAssignListProps> = props => (
  <React.Fragment>
    <CollectionPage
      // page info
      info={{
        uid: AppMenu.HRKPIAssign,
        parentUid: AppMenu.Lookup,
        title: props.intl.formatMessage(kpiMessage.employee.page.listTitle),
        description: props.intl.formatMessage(kpiMessage.employee.page.listSubHeader),

      }}

      // state & fields
      state={props.employeeKPIState.all}
      fields={props.fields}

      // callback
      onLoadApi={props.handleOnLoadApi}
      onBind={props.handleOnBind}
      
      // row components
      summaryComponent={(item: IEmployeeKPI) => ( 
        <EmployeeAssignSummary data={item} />
      )}
      actionComponent={(item: IEmployeeKPI) => (
        <React.Fragment>
          <Button 
            size="small"
            color="secondary"
            onClick={() => props.history.push(`/kpi/assigns/${item.uid}`, {employeeName: item.fullName})}
          >
            {props.intl.formatMessage(layoutMessage.action.details)}
          </Button>
        </React.Fragment>
      )}

      // app bar component
      appBarSearchComponent={
        <SearchBox
          key="account.employee.kpi"
          default={props.employeeKPIState.all.request && props.employeeKPIState.all.request.filter && props.employeeKPIState.all.request.filter.find}
          fields={props.fields}
          onApply={props.handleOnLoadApiSearch}
        />
      }
      appBarCustomComponent={
        <IconButton
          color="inherit"
          onClick={() => props.history.push('/kpi/assigns/form')}
        >
          <AddCircle/>
        </IconButton>
      }

      // data toolbar component
      toolbarDataComponent={
        <Tooltip
          placement="bottom"
          title={props.intl.formatMessage(layoutMessage.tooltip.filter)}
        >
          <div>
            <IconButton
              id="option-filter"
              disabled={props.employeeKPIState.all.isLoading || props.employeeKPIState.all.isError}
              onClick={props.handleFilterVisibility} 
            >
              <Badge
                invisible={!props.handleFilterBadge()}
                badgeContent={
                  <CheckCircle color="secondary" fontSize="small" />
                }
              >
                <Tune/>
              </Badge>
            </IconButton>
          </div>
        </Tooltip>
      }
    />

    <EmployeeAssignFilter
      isOpen={props.isFilterOpen}
      initialProps={{
        companyUids: props.companyUids,
        positionUids: props.positionUids,
        useAccess: props.useAccess,
        isActive: props.isActive,
      }}
      onClose={props.handleFilterVisibility}
      onApply={props.handleFilterApplied}
    />
</React.Fragment>
);