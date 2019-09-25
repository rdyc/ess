import { ICompetencyEmployeeItem, IHrCompetencyEmployeeDetail, IHrCompetencyEmployeeDetailList, IHrCompetencyMappedList } from '@hr/classes/response';
import { hrMessage } from '@hr/locales/messages/hrMessage';
import { Card, CardHeader, Table, TableBody, TableCell, TableRow, Typography, WithStyles, withStyles } from '@material-ui/core';
import { Done } from '@material-ui/icons';
import styles from '@styles';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';

interface OwnProps {
  data: IHrCompetencyEmployeeDetail;
  mapped: IHrCompetencyMappedList;
  responders: IHrCompetencyEmployeeDetailList[];
}

type AllProps
  = OwnProps
  & WithStyles<typeof styles>
  & InjectedIntlProps;

const hrCompetencyResultRespond: React.SFC<AllProps> = props => {

  const findNote = (item?: ICompetencyEmployeeItem) => {
    return item && item.note;
  };

  const render = (
    <Card square className={props.classes.hrTable}>
      <CardHeader 
        title={props.intl.formatMessage(hrMessage.competency.field.type, {state: 'Assessment Result'})}
      />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              
            </TableCell>
            {
              props.responders.map(responder => 
                !responder.isHR &&
                <TableCell key={responder.uid} className={props.classes.hrTableResponder}>
                  {responder.employee && responder.employee.fullName}
                </TableCell>  
              )
            }
            <TableCell className={props.classes.hrTableResponder} style={{padding: '0 15px'}}>
              {props.intl.formatMessage(hrMessage.competency.field.type, {state: 'HR'})}
            </TableCell>
          </TableRow>
          {
            props.mapped &&
            props.mapped.categories.map((item, index) => 
            <React.Fragment key={item.uid}>
              <TableRow>
                <TableCell colSpan={props.responders.length + 1} className={props.classes.toolbar} >
                  <Typography variant="body1" color="inherit">
                    {item.category.name}
                  </Typography> 
                </TableCell>
              </TableRow>
              {
                item.category.levels.map((level) =>           
                <React.Fragment key={level.uid}>         
                  <TableRow>
                    <TableCell className={props.classes.hrTableVerAlign}>
                        <Typography className={props.classes.hrTableChild}>
                          {`Level ${level.level} - ${level.description}`}
                        </Typography>
                        <Typography className={props.classes.hrTableChild}>
                          <ul>
                          {
                            level.indicators.map(indicator =>
                              <li key={indicator.uid}>
                                {indicator.description}
                              </li>
                            )
                          }    
                          </ul>
                        </Typography>
                    </TableCell>
                    {
                      props.responders.map(responder => 
                        !responder.isHR &&
                        <TableCell key={responder.uid} style={{padding: 0, textAlign: 'center'}}>
                          {
                            responder.items.length > 0 &&
                            responder.items.find(findData => findData.levelUid === level.uid) &&
                            <Typography>
                              <Done />
                            </Typography>
                          }
                        </TableCell>
                      )
                    }
                    <TableCell style={{padding: '0 15px', textAlign: 'center'}}>
                      {
                        props.data.items.find(findData => findData.levelUid === level.uid) &&
                        <Typography>
                          <Done />
                        </Typography>
                      }
                    </TableCell>
                  </TableRow>
                  
                  {
                    // NOTE HERE
                    props.data.items.find(findData => findData.levelUid === level.uid) &&
                    <TableRow>
                      <TableCell colSpan={props.responders.length + 1}>
                        <Typography>
                          {
                            findNote(props.data.items.find(findData => findData.levelUid === level.uid))
                          }
                        </Typography>
                      </TableCell>
                    </TableRow>
                  }
                </React.Fragment>
                ) 
              } 
            </React.Fragment>
            )
          }
        </TableBody>
      </Table>
    </Card>
  );

  return render;
};

export const HrCompetencyResultRespond = compose<AllProps, OwnProps>(
  withStyles(styles),
  injectIntl
)(hrCompetencyResultRespond);