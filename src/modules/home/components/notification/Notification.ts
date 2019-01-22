import { ModuleDefinition, NotificationType, redirector } from '@layout/helper/redirector';
import { WithNotification, withNotification } from '@layout/hoc/withNotification';
import { WithUser, withUser } from '@layout/hoc/withUser';
import { WithStyles, withStyles, WithTheme, withTheme } from '@material-ui/core';
import styles from '@styles';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  compose,
  HandleCreators,
  mapper,
  setDisplayName,
  StateHandler,
  StateHandlerMap,
  StateUpdaters,
  withHandlers,
  withStateHandlers,
} from 'recompose';

import { NotificationView } from './NotificationView';

interface IOwnOption {
  useToolbar?: boolean;
}

interface IOwnItem {
  cIndex: number;
  dIndex: number;
  expanded: boolean;
}

interface IOwnState {
  items: IOwnItem[];
}

interface IOwnStateUpdater extends StateHandlerMap<IOwnState> {
  handleExpandClick: StateHandler<IOwnState>;
  handleReset: StateHandler<IOwnState>;
}

interface IOwnHandler {
  isExpanded: (cIndex: number, dIndex: number) => boolean;
  handleSyncClick: () => void;
  handleNotifClick: (category: ModuleDefinition, type: NotificationType, uid?: string) => void;
}

export type NotificationProps
  = IOwnOption
  & IOwnState
  & IOwnStateUpdater
  & IOwnHandler
  & WithUser
  & WithNotification
  & WithStyles<typeof styles>
  & WithTheme
  & InjectedIntlProps
  & RouteComponentProps;

const createProps: mapper<NotificationProps, IOwnState> = (props: NotificationProps): IOwnState => ({
  items: []
});

const stateUpdaters: StateUpdaters<{}, IOwnState, IOwnStateUpdater> = {
  handleExpandClick: (prevState: IOwnState) => (cIndex: number, dIndex: number): IOwnState => {
    const prevItems = prevState.items;
    const prevItemIndex = prevState.items.findIndex(item =>
      item.cIndex === cIndex &&
      item.dIndex === dIndex
    );

    if (prevItemIndex !== -1) {
      prevItems[prevItemIndex].expanded = !prevItems[prevItemIndex].expanded;
    } else {
      prevItems.push({
        cIndex,
        dIndex,
        expanded: true
      });
    }

    return {
      items: prevItems
    };
  },
  handleReset: (prevState: IOwnState) => (index: number): IOwnState => ({
    items: []
  })
};

const handlerCreators: HandleCreators<NotificationProps, IOwnHandler> = {
  isExpanded: (props: NotificationProps) => (cIndex: number, dIndex: number): boolean => {
    let isExpanded = false;

    const existItem = props.items.find(item =>
      item.cIndex === cIndex &&
      item.dIndex === dIndex
    );

    if (existItem) {
      isExpanded = existItem.expanded;
    }

    return isExpanded;
  },
  handleSyncClick: (props: NotificationProps) => () => {
    const { user } = props.userState;
    const { fetchRequest } = props.notificationDispatch;

    if (user) {
      props.handleReset();

      fetchRequest({
        companyUid: user.company.uid,
        positionUid: user.position.uid
      });
    }
  },
  handleNotifClick: (props: NotificationProps) => (category: ModuleDefinition, type: NotificationType, uid?: string) => {
    const redirect = redirector(category, type, uid);

    props.history.push(redirect.path, redirect.state);
  }
};

export const Notification = compose<NotificationProps, IOwnOption>(
  setDisplayName('Notification'),
  withUser,
  withRouter,
  withNotification,
  injectIntl,
  withStyles(styles),
  withTheme(),
  withStateHandlers(createProps, stateUpdaters),
  withHandlers(handlerCreators)
)(NotificationView);