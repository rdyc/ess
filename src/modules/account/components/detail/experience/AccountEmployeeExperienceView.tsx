import { IEmployeeExperience } from '@account/classes/response/employeeExperience';
import { AccountEmployeeExperienceHeaderTable } from '@account/classes/types';
import { AccountEmployeeTabs } from '@account/classes/types/AccountEmployeeTabs';
import AccountEmployeeExperienceEditor from '@account/components/editor/AccountEmployeeExperienceEditor';
import { accountMessage } from '@account/locales/messages/accountMessage';
import AppMenu from '@constants/AppMenu';
import { IBaseMetadata } from '@generic/interfaces';
import { SingleConfig, SingleHandler, SinglePage } from '@layout/components/pages';
import { layoutMessage } from '@layout/locales/messages';
import {
  Fade,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Tooltip,
  Typography
} from '@material-ui/core';
import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage
} from '@material-ui/icons';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SyncIcon from '@material-ui/icons/Sync';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { DetailPage } from '../DetailPage';
import { AccountEmployeeExperienceProps } from './AccountEmployeeExperience';

const config: SingleConfig<IEmployeeExperience, AccountEmployeeExperienceProps> = {
  // page info
  page: (props: AccountEmployeeExperienceProps) => ({
    uid: AppMenu.Account,
    parentUid: AppMenu.Lookup,
    title: props.intl.formatMessage(accountMessage.shared.page.detailTitle, { state: 'Employee'}),
    description: props.intl.formatMessage(accountMessage.shared.page.detailSubHeader),
  }),

  // parent url
  parentUrl: () => '/account/employee',
  
  // action centre
  showActionCentre: true,

  // more
  hasMore: false,

  // events
  onDataLoad: (props: AccountEmployeeExperienceProps, callback: SingleHandler, forceReload?: boolean | false) => {
    const { page, size } = props;
    const { user } = props.userState;
    const { isLoading, request, response } = props.accountEmployeeExperienceState.all;
    const { loadAllRequest } = props.accountEmployeeExperienceDispatch;

    // when user is set and not loading and has projectUid in route params
    if (user && !isLoading && props.match.params.employeeUid) {
      // when projectUid was changed or response are empty or force to reload
      if ((request && request.employeeUid !== props.match.params.employeeUid) || !response || forceReload) {
        loadAllRequest({
          employeeUid: props.match.params.employeeUid,
          filter: {
            page,
            size,
            direction: 'ascending'
          }
        });
      } else {
        // just take data from previous response
        callback.handleResponse(response);
      }
    }
  },
  onUpdated: (states: AccountEmployeeExperienceProps, callback: SingleHandler) => {
    const { response } = states.accountEmployeeExperienceState.all;
    
    callback.handleResponse(response);
  },
};

export const AccountEmployeeExperienceView: React.SFC<
  AccountEmployeeExperienceProps
> = props => {
  const { isOpenDialog, isOpenMenu, experienceItemIndex, editAction, initialValues, page, size, classes } = props;
  const { handleDialogClose, handleEdit, handleMenuClose, handleMenuOpen, handleReload, handleGoToNext, handleGoToPrevious, handleChangePage, handleChangeSize } = props;

  const { response, isLoading } = props.accountEmployeeExperienceState.all;

  const handlePage = (_page: any) => {
    return handleChangePage(_page);
  };

  const tablePaginationAction = (total: any) => (
    <div className={classes.tableReportAction}>
      <IconButton
        onClick={() => handleChangePage(1)}
        disabled={page === 1}
        aria-label="First Page"
      >
        <FirstPage />
      </IconButton>
      <IconButton
        onClick={handleGoToPrevious}
        disabled={page === 1}
        aria-label="Previous Page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleGoToNext}
        disabled={page >= Math.ceil(total / size)}
        aria-label="Next Page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={() => handleChangePage(Math.max(0, Math.ceil(total / size)))}
        disabled={page >= Math.ceil(total / size)}
        aria-label="Last Page"
      >
        <LastPage />
      </IconButton>
    </div>
  );

  const header = Object.keys(AccountEmployeeExperienceHeaderTable).map(key => ({
    id: key,
    name: AccountEmployeeExperienceHeaderTable[key]
  }));

  const renderExperience = (data: IEmployeeExperience[], metadata: IBaseMetadata) => {
    return (
      <Fade in={!isLoading} timeout={1000} mountOnEnter unmountOnExit>
        <Paper square className={classes.rootTable}>
          <Table>
            <TableHead>
              <TableRow>
                {header.map(headerIdx =>
                    <TableCell key={headerIdx.id}
                      numeric={headerIdx.id === 'No' ? true : false}
                      padding="default"
                    >{headerIdx.name}</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.company}</TableCell>
                    <TableCell>{item.position}</TableCell>
                    <TableCell>{item.start}</TableCell>
                    <TableCell>{item.end}</TableCell>
                    <TableCell>
                      <IconButton
                        id={`experience-item-button-${index}`}
                        color="inherit"
                        aria-label="More"
                        onClick={() => handleMenuOpen(item, index)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                <Menu
                  anchorEl={document.getElementById(`experience-item-button-${experienceItemIndex}`)}
                  open={isOpenMenu}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => handleEdit('update')}>
                    {props.intl.formatMessage(accountMessage.shared.option.modify)}
                  </MenuItem>
                  <MenuItem onClick={() => handleEdit('delete')}>
                    {props.intl.formatMessage(accountMessage.shared.option.remove)}
                  </MenuItem> 
                </Menu>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination 
                  rowsPerPageOptions={[10, 15, 25]}
                  count={metadata.total}
                  rowsPerPage={size}
                  page={page - 1}
                  onChangePage={handlePage}
                  onChangeRowsPerPage={e => (handleChangeSize(Number(e.target.value)))}
                  ActionsComponent={() => tablePaginationAction(metadata.total)}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </Paper>
      </Fade>
    );
  };

  const renderAction = (
    <Paper square>
      <Toolbar>
        <Typography
          noWrap
          variant="body2"
          className={props.classes.flex}
        >
          {
            isLoading &&
            <FormattedMessage {...layoutMessage.text.loading} />
          }
        </Typography>
        
        <Tooltip	
          placement="bottom"
          title={props.intl.formatMessage(layoutMessage.tooltip.createNew)}
        >
          <IconButton
            disabled={isLoading}
            onClick={props.handleNew} 
          >
            <AddCircleIcon />
          </IconButton>
        </Tooltip>

        <Tooltip
          placement="bottom"
          title={props.intl.formatMessage(layoutMessage.tooltip.refresh)}
        >
          <IconButton 
            id="option-sync"
            disabled={isLoading}
            onClick={handleReload}
          >
            <SyncIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </Paper>
  );
  
  return (
    <React.Fragment>
      <DetailPage
        tab={AccountEmployeeTabs.experience}        
      >
        {renderAction}
        <SinglePage
          config={config}
          connectedProps={props}
        >
          {(( !isLoading && response && !response.data) ||
            ( !isLoading && response && response.data && response.data.length === 0)) && (
            <Typography variant="body2">No Data</Typography>
          )}
          { !isLoading && response && response.data && response.data.length >= 1 && renderExperience(response.data, response.metadata)}
        </SinglePage>
      </DetailPage>

      <AccountEmployeeExperienceEditor 
        formMode={props.formMode}
        experienceUid={props.experienceUid}
        employeeUid={props.match.params.employeeUid}
        isOpenDialog={isOpenDialog}
        editAction={editAction}
        initialValues={initialValues}
        handleDialogClose={handleDialogClose}
      />
    </React.Fragment>
  );
};
