import AppMenu from '@constants/AppMenu';
import { CollectionPage } from '@layout/components/pages';
import { SearchBox } from '@layout/components/search';
import { layoutMessage } from '@layout/locales/messages';
import { Badge, Button, IconButton, Tooltip } from '@material-ui/core';
import { AddCircle, CheckCircle, Tune } from '@material-ui/icons';
import * as React from 'react';

import { IKPITemplate } from '@kpi/classes/response';
import { kpiMessage } from '@kpi/locales/messages/kpiMessage';
import { KPITemplateSummary } from '../detail/shared/KPITemplateSummary';
import { KPITemplateListProps } from './KPITemplateList';
import { KPITemplateFilter } from './KPITemplateListFilter';

export const KPITemplateListView: React.SFC<KPITemplateListProps> = props => (
  <React.Fragment>
    <CollectionPage 
      // page info
      info={{
        uid: AppMenu.KPITemplate,
        parentUid: AppMenu.Lookup,
        title: props.intl.formatMessage(kpiMessage.template.page.listTitle),
        description: props.intl.formatMessage(kpiMessage.template.page.listSubHeader),
      }}

      // state & fields
      state={props.kpiTemplateState.all}
      fields={props.fields}

      // callback
      onLoadApi={props.handleOnLoadApi}
      onBind={props.handleOnBind}
      
      // row components
      summaryComponent={(item: IKPITemplate) => (
        <KPITemplateSummary data={item} />
      )}
      actionComponent={(item: IKPITemplate) => (
        <React.Fragment>
           <Button 
            size="small"
            color="secondary"
            onClick={() => props.history.push(`/kpi/templates/form`, { uid: item.uid, companyUid: item.companyUid, positionUid: item.positionUid })}
          >
            {props.intl.formatMessage(layoutMessage.action.modify)}
          </Button>

          <Button 
            size="small"
            color="secondary"
            onClick={() => props.history.push(`/kpi/templates/${item.uid}`, {companyUid: item.companyUid, positionUid: item.positionUid})}
          >
            {props.intl.formatMessage(layoutMessage.action.details)}
          </Button>
        </React.Fragment>
      )}
      
      // app bar component
      appBarSearchComponent={
        <SearchBox
          key="kpi.template"
          default={props.kpiTemplateState.all.request && props.kpiTemplateState.all.request.filter && props.kpiTemplateState.all.request.filter.find}
          fields={props.fields}
          onApply={props.handleOnLoadApiSearch}
        />
      }
      appBarCustomComponent={
        <IconButton
          color="inherit"
          onClick={() => props.history.push('/kpi/templates/form')}
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
              disabled={props.kpiTemplateState.all.isLoading || props.kpiTemplateState.all.isError}
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
    <KPITemplateFilter 
      isOpen={props.isFilterOpen}
      initialProps={{
        companyUid: props.companyUid,
        positionUid: props.positionUid
      }}
      onClose={props.handleFilterVisibility}
      onApply={props.handleFilterApplied}
    />
  </React.Fragment>
);