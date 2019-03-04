import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import * as React from 'react';

interface OwnProps {
  isOpen: boolean;
  fullScreen?: boolean | false;
  title?: string;
  content?: string;
  labelCancel?: string;
  labelConfirm?: string;
  onClickCancel: (event: React.MouseEvent) => void;
  onClickConfirm: (event: React.MouseEvent) => void;
}

export const DialogConfirmation: React.SFC<OwnProps> = props => (
  <Dialog
    fullScreen={props.fullScreen}
    open={props.isOpen}
    aria-labelledby="dialog-confirm-title"
    aria-describedby="dialog-confirm-description"
  >
    <DialogTitle id="dialog-confirm-title">
      {props.title || 'title'}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="dialog-confirm-description">
        {props.content || 'content'}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button color="secondary" onClick={props.onClickCancel}>
        {props.labelCancel || 'cancel'}
      </Button>
      <Button color="secondary" onClick={props.onClickConfirm} autoFocus>
        {props.labelConfirm || 'confirm'}
      </Button>
    </DialogActions>
  </Dialog>
);