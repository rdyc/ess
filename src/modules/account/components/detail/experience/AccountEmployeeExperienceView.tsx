// import { IEmployeeExperienceList } from '@account/classes/response/employeeExperience';
import {
  AccountEmployeeExperienceHeaderTable,
  // AccountEmployeeExperienceSubHeaderTable
} from '@account/classes/types';
import {
  Fade,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
  // Typography
} from '@material-ui/core';
import * as React from 'react';
import { AccountEmployeeExperienceProps } from './AccountEmployeeExperience';

export const AccountEmployeeExperienceView: React.SFC<
  AccountEmployeeExperienceProps
> = props => {
  const { classes } = props;
  const { isLoading } = props.accountEmployeeExperienceState.list;

  const header = Object.keys(AccountEmployeeExperienceHeaderTable).map(key => ({
    id: key,
    name: AccountEmployeeExperienceHeaderTable[key]
  }));

  const renderExperience = () => {
    return (
      <Fade in={!isLoading} timeout={1000} mountOnEnter unmountOnExit>
        <Paper className={classes.table}>
          <Table className={classes.minTable}>
            <TableHead>
              <TableRow>
                {header.map(headerIdx =>
                  headerIdx.name ===
                  AccountEmployeeExperienceHeaderTable.workPeriod ? (
                    <TableCell colSpan={2} padding="dense">{headerIdx.name}</TableCell>
                  ) : (
                    <TableCell/>
                  )
                )}
              </TableRow>
              <TableRow>
                {header.map(headerIdx =>
                  headerIdx.name ===
                  AccountEmployeeExperienceHeaderTable.workPeriod ? (
                    null
                  ) : (
                    <TableCell>{headerIdx.name}</TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>1</TableCell>
                <TableCell>1</TableCell>
                <TableCell>1</TableCell>
                <TableCell>1</TableCell>
              </TableRow>
              {/* {data &&
                data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.company}</TableCell>
                    <TableCell>{item.start}</TableCell>
                    <TableCell>{item.end}</TableCell>
                    <TableCell>{item.position}</TableCell>
                  </TableRow>
                ))} */}
            </TableBody>
          </Table>
        </Paper>
      </Fade>
    );
  };

  return (
    <React.Fragment>
      {/* {((response && !response.data) ||
        (response && response.data && response.data.length === 0)) && (
        <Typography>No Data</Typography>
      )} */}
      {renderExperience()}
      {/* {response && response.data && renderExperience(response.data)} */}
    </React.Fragment>
  );
};
