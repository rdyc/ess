import { action } from 'typesafe-actions';

import { INotification, INotificationMark } from '../../interfaces';
import { INotificationQuery } from '../../interfaces/INotificationQuery';
import { NotificationAction } from '../../types';

// tslint:disable-next-line:max-line-length
export const notificationFetchRequest = (params: INotificationQuery) => action(NotificationAction.FETCH_REQUEST, params);
export const notificationFetchSuccess = (data: INotification) => action(NotificationAction.FETCH_SUCCESS, data);
export const notificationFetchError = (message: any) => action(NotificationAction.FETCH_ERROR, message);
export const notificationComplete = (params: INotificationMark) => action(NotificationAction.COMPLETE, params);