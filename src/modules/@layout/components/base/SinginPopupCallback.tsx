import { AppUserManager } from '@utils/index';
import * as React from 'react';
import { compose, lifecycle, ReactLifeCycleFunctions } from 'recompose';

const callback: React.SFC = props => (
  <div>Signed in...</div>
);

const lifecycles: ReactLifeCycleFunctions<{}, {}> = ({
  componentDidMount() {
    AppUserManager.signinPopupCallback();
  }
});

export const SigninPopupCallback = compose<{}, {}>(
  lifecycle(lifecycles)
)(callback);