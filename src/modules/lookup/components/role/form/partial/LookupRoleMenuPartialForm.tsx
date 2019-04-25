import { layoutMessage } from '@layout/locales/messages';
import { lookupMessage } from '@lookup/locales/messages/lookupMessage';
import { Card, CardContent, CardHeader, Checkbox, CircularProgress, Collapse, Divider, List, ListItem, ListItemSecondaryAction, ListItemText, Typography, withStyles, WithStyles } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import styles from '@styles';
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, FormikProps } from 'formik';
import * as React from 'react';
import { InjectedIntl } from 'react-intl';
import { compose, HandleCreators, mapper, StateHandler, StateHandlerMap, StateUpdaters, withHandlers, withStateHandlers } from 'recompose';
import { IRoleFormValue } from '../LookupRoleForm';

interface IOwnProps {
  formikBag: FormikProps<IRoleFormValue>;
  intl: InjectedIntl;
}

interface ChildList {
  uid: string;
  parentUid?: string;
}

interface IOwnState {
  active?: string;
  isExpanded: boolean;
  childList: ChildList[];
}

interface IOwnHandler {
  handleCheckChild: (uid: string, parentUid: string) => void;
}

interface IOwnStateHandler extends StateHandlerMap<IOwnState> {
  handleToggle: (uid: string) => IOwnState;
  stateUpdate: StateHandler<IOwnState>;
}

type AllProps
  = IOwnProps
  & IOwnHandler
  & IOwnState
  & IOwnStateHandler
  & WithStyles<typeof styles>;

const createProps: mapper<AllProps, IOwnState> = (props: AllProps): IOwnState => ({
  active: undefined,
  isExpanded: false,
  childList: [],
});

const handlerCreators: HandleCreators<AllProps, IOwnHandler> = {
  handleCheckChild: (props: AllProps) => (uid: string, parentUid: string) => {
    const { childList } = props;
    let findChild: number = 0;

    // find child on the list
    findChild = childList.findIndex(item => item.uid === uid);
    // if not found
    if (findChild === -1) {
      childList.push({uid, parentUid});
    } else {
      // if found
      childList.splice(childList.findIndex(item => item.uid === uid), 1);
    }
  }
};

const stateUpdaters: StateUpdaters<{}, IOwnState, IOwnStateHandler> = {
  handleToggle: (state: IOwnState) => (uid: string) => ({
    active: uid,
    isExpanded: state.active === uid ? !state.isExpanded : true
  }),
  stateUpdate: (prevState: IOwnState) => (newState: IOwnState) => ({
    ...prevState,
    ...newState
  })
};

const MenuPartialForm: React.ComponentType<AllProps> = props => {
  const { active, isExpanded, formikBag} = props;

  const render = (
    <Card square>
      <CardHeader 
        title={props.intl.formatMessage(lookupMessage.role.section.roleMenuTitle)}
      />
      <CardContent>
        {
          formikBag.values.menus.length === 0 &&
          <div className={props.classes.preloader}>
            <div className={props.classes.preloaderContent}>
              <CircularProgress 
                style={{margin: 'auto'}} 
                color="secondary"
              />

              <Typography
                className={props.classes.marginFarTop}
              >
                {props.intl.formatMessage(layoutMessage.text.waiting)}
              </Typography>
            </div>    
          </div>
        }
        {
          formikBag.values.menus.length > 0 && (
            <List>
              <FieldArray 
                name="menus"
                render={(fields: FieldArrayRenderProps) => 
                  formikBag.values.menus.map((parent, idxParent) => (
                    !parent.parentUid &&
                    (
                      <React.Fragment key ={idxParent}>
                        <ListItem
                          button
                          disableGutters
                          selected={parent.uid === active && isExpanded}
                        >
                          <Field 
                            name={`menus.${idxParent}.isAccess`}
                            render={({ field }: FieldProps<IRoleFormValue>) => (
                              <Checkbox 
                                {...field}
                                value={parent.uid}
                                checked={parent.isAccess}
                                disabled={props.formikBag.isSubmitting}
                                onChange={() => {
                                  // set check
                                  formikBag.setFieldValue(`menus.${idxParent}.isAccess`, !parent.isAccess);
                                  formikBag.values.menus.map((item, index) => {
                                    // check value for his child
                                    if (item.parentUid && item.parentUid === parent.uid) {
                                      // if parent is true and child is false, then make the child is true
                                      if (!parent.isAccess && !item.isAccess) {
                                        props.handleCheckChild(item.uid, parent.uid);
                                        formikBag.setFieldValue(`menus.${index}.isAccess`, true);
                                        // if parent is false and child is true, then make the child is false
                                      } else if (parent.isAccess && item.isAccess) {
                                        props.handleCheckChild(item.uid, parent.uid);
                                        formikBag.setFieldValue(`menus.${index}.isAccess`, false);
                                      }
                                    }
                                  });
                                }}
                                style={{
                                  height: 10,
                                  width: 10,
                                  marginRight: 5,
                                  marginLeft: 5,
                                }}
                              />
                            )}
                          />
                          <div onClick={() => props.handleToggle(parent.uid)}>
                            <ListItemText primary={parent.name}/>
                            <ListItemSecondaryAction>
                              {active === parent.uid && isExpanded ? <ExpandLess /> : <ExpandMore />}
                            </ListItemSecondaryAction>
                          </div>
                        </ListItem>
                        <Divider />            
                        <Collapse
                          in={active === parent.uid && isExpanded}
                          timeout="auto"
                          unmountOnExit
                        >
                          {
                            formikBag.values.menus.map((child, idxChild) => 
                              child.parentUid === parent.uid &&
                              <div key={idxChild}>
                                <ListItem
                                  color="inherit"
                                  className={props.classes.marginFarLeft}
                                  button
                                  style={{
                                    marginLeft: 0,
                                    marginRight: 10
                                  }}
                                >
                                  <Field 
                                    name={`menus.${idxChild}.isAccess`}
                                    render={({ field }: FieldProps<IRoleFormValue>) => (
                                      <Checkbox 
                                        {...field}
                                        value={child.uid}
                                        checked={child.isAccess}
                                        disabled={props.formikBag.isSubmitting} 
                                        onChange={() => {
                                          props.handleCheckChild(child.uid, parent.uid);
                                          formikBag.setFieldValue(`menus.${idxChild}.isAccess`, !child.isAccess);
                                          if (!child.isAccess && !parent.isAccess) {
                                            formikBag.setFieldValue(`menus.${idxParent}.isAccess`, true);
                                          }
                                          // to find the child of parent is still on the list or no
                                          const parentIsFound: number = props.childList.findIndex(item => item.parentUid === child.parentUid);
                                          // if no then uncheck it's parent
                                          if (parentIsFound === -1) {
                                            formikBag.setFieldValue(`menus.${idxParent}.isAccess`, !child.isAccess);
                                          }
                                        }}
                                        style={{
                                          height: 10,
                                          width: 10,
                                          marginLeft: 5,
                                          marginRight: 5
                                        }}
                                      />
                                    )}
                                  />
                                  <ListItemText primary={child.name}/>
                                </ListItem>
                              </div>
                            )
                          }
                        </Collapse>
                      </React.Fragment>
                    )
                  ))
                }
              />
              
            </List>
          )
        }        
      </CardContent>
    </Card>
  );

  return render;
};

export const LookupRoleMenuPartialForm = compose<AllProps, IOwnProps>(
  withStyles(styles),
  withStateHandlers(createProps, stateUpdaters),
  withHandlers(handlerCreators),
)(MenuPartialForm);