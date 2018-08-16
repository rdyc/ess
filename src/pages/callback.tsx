import * as React from "react"
import { connect } from "react-redux"
import { RouteComponentProps } from "react-router";
import { CallbackComponent } from "redux-oidc"
import { User } from "oidc-client";
import { push } from "react-router-redux"
import userManager from "../utils/userManager"

class CallbackPage extends React.Component<RouteComponentProps<{}> & { dispatch: any }, {}> {

  public successCallback = (user: User) => {
    // get the user's previous location, passed during signinRedirect()
    const redirectPath = user.state.path as string;
    this.props.dispatch(push(redirectPath));
  }

  public errorCallback = (error: Error) => {
    console.log(error);
    this.props.dispatch(push('/'));
  }

  public render() {
    return (
      <CallbackComponent
        userManager={userManager}
        successCallback={this.successCallback}
        errorCallback={this.errorCallback}
      >
        <div>Loading...</div>
      </CallbackComponent>
    );
  }
}

export default connect()(CallbackPage);
