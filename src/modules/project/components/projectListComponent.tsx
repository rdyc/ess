import { IBaseChanges, IResponseCollection } from '@generic/interfaces';
import { ConnectedReduxProps } from '@generic/types';
import { Divider, Grid, List, ListItem, Typography, WithStyles, ListSubheader } from '@material-ui/core';
import { IProject } from '@project/interfaces/response';
import styles from '@styles';
import * as moment from 'moment';
import * as React from 'react';
import { FormattedDate, FormattedNumber, FormattedPlural } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import { isArray } from 'util';

interface PropsFromState extends RouteComponentProps<void>, WithStyles<typeof styles> {
  response: IResponseCollection<IProject> | undefined;
  isLoading: boolean;
}

type AllProps = PropsFromState & ConnectedReduxProps;

export const ProjectListComponent: React.StatelessComponent<AllProps> = props => {
  const parseChanges = (changes: IBaseChanges | null) => {
    if (changes === null) {
      return 'Unknown';
    } else {
      if (changes.updatedBy !== null) {
        return changes.updated ? (changes.updated ? changes.updated.fullName : changes.updatedBy) : changes.updatedBy;
      } else {
        return changes.created ? changes.created.fullName : changes.createdBy;
      }
    }
  };

  const renderProjectList = (projects: IProject[]) => {
    const len = projects.length - 1;

    return (
      projects.map((project, i) => 
        <div key={project.uid}>
          <ListItem 
            button={!props.isLoading} 
            key={project.uid} 
            onClick={() => !props.isLoading && props.history.push(`/project/detail/${project.uid}`)}
          >
            <Grid container spacing={24}>
              <Grid item xs={8} sm={8}>
                <Typography 
                  noWrap 
                  color="primary" 
                  variant="body2"
                >
                  {project.name}
                </Typography>
                <Typography 
                  noWrap
                  variant="body1"
                >
                  {project.customer && project.customer.name} {project.contractNumber && `(PO: ${project.contractNumber})`}
                </Typography>
                <Typography 
                  noWrap
                  color="textSecondary" 
                  variant="caption"
                >
                  {project.uid} | {project.project && project.project.value} | &nbsp;
                  <FormattedDate 
                    year="numeric"
                    month="short"
                    day="numeric"
                    value={project.start || ''} 
                  />
                  &nbsp;to&nbsp; 
                  <FormattedDate 
                    year="numeric"
                    month="short"
                    day="numeric"
                    value={project.end || ''} 
                  />
                </Typography>
              </Grid>
              <Grid item xs={4} sm={4}>
                <Typography 
                  noWrap 
                  variant="body1" 
                  align="right"
                >
                  {project.status && project.status.value}
                </Typography>
                <Typography 
                  noWrap 
                  color="secondary"
                  variant="caption" 
                  align="right"
                >
                  {parseChanges(project.changes)}
                </Typography>
                <Typography 
                  noWrap
                  variant="caption" 
                  align="right"
                >
                  {project.changes && moment(project.changes.updatedAt ? project.changes.updatedAt : project.changes.createdAt).fromNow()}
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
          {len !== i && <Divider />}
        </div>
      )
    );
  };

  const { response  } = props;

  return (
    <List
      component="nav"
      subheader={
        <ListSubheader
          component="div"
        >
          {
            response &&
            response.metadata && 
            <Grid container spacing={24}>
              <Grid item xs={6} sm={6}>
                <Typography variant="caption" color="primary">
                  <FormattedNumber value={response.metadata.total} /> &nbsp;
                  <FormattedPlural one="project" other="projects" value={response.metadata.total} />
                </Typography>
              </Grid>
              <Grid item xs={6} sm={6}>
                <Typography variant="caption" align="right" color="primary">
                  <FormattedNumber value={response.metadata.paginate.current} /> of <FormattedNumber value={response.metadata.paginate.total} />
                </Typography>
              </Grid>
            </Grid>
          }
        </ListSubheader>
      }
    >
      {
        response &&
        isArray(response.data) && 
        renderProjectList(response.data)
      }
    </List>
  );
};