import { Divider, Grid, List, ListItem, ListSubheader, Paper, Typography } from '@material-ui/core';
import { IPurchase } from '@purchase/classes/response/purchaseRequest';
import { PurchaseRequestListProps } from '@purchase/components/purchaseRequest/list/PurchaseRequestList';
import { parseChanges } from '@utils/parseChanges';
import * as moment from 'moment';
import * as React from 'react';
import { FormattedDate, FormattedNumber, FormattedPlural } from 'react-intl';
import { isArray } from 'util';

export const PurchaseRequestListView: React.SFC<PurchaseRequestListProps> = props => {
  const { handleGoToDetail } = props;
  const { isLoading, response } = props.purchaseRequestState.all;

  const renderPurchaseRequestList = (purchases: IPurchase[]) => {
    const len = purchases.length - 1;

    return (
      purchases.map((purchase, i) =>
        <div key={purchase.uid}>
          <ListItem
            button={!isLoading}
            key={purchase.uid}
            onClick={() => handleGoToDetail(purchase.uid)}
          >
            <Grid container spacing={24}>
              <Grid item xs={8} sm={8}>
                <Typography
                  noWrap
                  color="primary"
                  variant="body2"
                >
                  {purchase.uid}
                </Typography>
                <Typography
                  noWrap
                  variant="body1"
                >
                  {purchase.customer && purchase.customer.name} &bull; {purchase.customer && purchase.customer.company && purchase.customer.company.name}
                </Typography>
                <Typography
                  noWrap
                  color="textSecondary"
                  variant="caption"
                >
                  {purchase.projectUid} &bull; {purchase.project && purchase.project.name} &bull; &nbsp;
                  <FormattedDate
                    year="numeric"
                    month="short"
                    day="numeric"
                    value={purchase.date || ''}
                  />
                </Typography>
              </Grid>
              <Grid item xs={4} sm={4}>
                <Typography
                  noWrap
                  variant="body1"
                  align="right"
                >
                  {purchase.status && purchase.status.value}
                </Typography>
                <Typography
                  noWrap
                  color="secondary"
                  variant="caption"
                  align="right"
                >
                  {parseChanges(purchase.changes)}
                </Typography>
                <Typography
                  noWrap
                  variant="caption"
                  align="right"
                >
                  {purchase.changes && moment(purchase.changes.updatedAt ? purchase.changes.updatedAt : purchase.changes.createdAt).fromNow()}
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
          {len !== i && <Divider />}
        </div>
      )
    );
  };

  const RenderList = () => (
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
                  <FormattedPlural one="purchase" other="purchases" value={response.metadata.total} />
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
        renderPurchaseRequestList(response.data)
      }
    </List>
  );

  const render = (
    <React.Fragment>
      {isLoading && response && <Typography variant="body2">loading</Typography>}
      {response &&
        <Paper
          square
          elevation={1}
        >
          <RenderList />
        </Paper>}
    </React.Fragment>
  );

  return render;
};
