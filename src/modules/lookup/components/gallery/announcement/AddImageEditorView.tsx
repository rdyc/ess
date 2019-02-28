import { IBaseMetadata } from '@generic/interfaces';
import { layoutMessage } from '@layout/locales/messages';
import { IGallery } from '@lookup/classes/response/gallery';
import { lookupMessage } from '@lookup/locales/messages/lookupMessage';
import {
  AppBar,
  Dialog,
  DialogContent,
  Divider,
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CloseIcon from '@material-ui/icons/Close';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { AddImageEditorProps } from './AddImageEditor';

export const AddImageEditorView: React.SFC<AddImageEditorProps> = props => { 
  const { isLoading, response } = props.imageGalleryState.all;

  const RenderImageList = (images: IGallery[]) => {
    return (
      <div>
        <GridList cellHeight={180} cols={4} spacing={12}>
          {images.map(image => (
            <GridListTile key={image.uid} onClick={() => props.handleSelect(image)}>
              <img src={image.path.small} alt={image.name} />
              <GridListTileBar
                title={image.name}
              />
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
  };
  
  const navigation = (metadata: IBaseMetadata) => {
    return (
      <Toolbar>
        <Tooltip
          placement="right"
          title={props.intl.formatMessage(layoutMessage.tooltip.prevPage)}
        >
          <div>
            {
              metadata.paginate &&
              <IconButton
                disabled={isLoading || !metadata.paginate.previous}
                onClick={() => props.setPagePrevious()}
              >
                <ChevronLeftIcon />
              </IconButton>
            }
          </div>
        </Tooltip>

        <Typography
            noWrap
            variant="body2"
            align="center"
            className={props.classes.flex}
          >
            {
              props.isLoading &&
              <FormattedMessage {...layoutMessage.text.loading} />
            }

            {
              !isLoading &&
              metadata.paginate &&
              <FormattedMessage 
              {...layoutMessage.text.pagingInfo} 
              values={{
                current: metadata.paginate.current,
                total: metadata.paginate.total
              }}
              />
            }
          </Typography>    

          <Tooltip
            placement="left"
            title={props.intl.formatMessage(layoutMessage.tooltip.nextPage)}
          >
            <div>
            {
              metadata.paginate && 
              <IconButton 
                disabled={isLoading || !metadata.paginate.next}
                onClick={() => props.setPageNext()}
                >
                <ChevronRightIcon />
              </IconButton>
            }
            </div>
          </Tooltip>
      </Toolbar>
    );
  };

  const render = (
    <React.Fragment>
      <Dialog
        fullScreen
        disableBackdropClick
        open={props.isOpen}
        onClose={props.onClose}
        className={props.theme.direction === 'rtl' ? props.classes.contentShiftRight : props.classes.contentShiftLeft}
      >
        <AppBar 
          elevation={0}
          position="fixed" 
          color="default"
          className={props.classes.appBarDialog}
        >
          <Toolbar>
            <IconButton color="inherit" onClick={props.onClose} aria-label="Close">
              <CloseIcon />
            </IconButton>

            <Typography variant="h6" color="inherit" className={props.classes.flex}>
              {props.intl.formatMessage(lookupMessage.gallery.section.addTitle)}
            </Typography>

          </Toolbar>
        </AppBar>
        
        <Divider/>

        <DialogContent style={{ paddingTop : 8 }}>
          {
            isLoading &&
            <Typography>
              {props.intl.formatMessage(layoutMessage.text.loading)}
            </Typography>
          }
          {
            !isLoading &&
            response &&
            response.data &&
            RenderImageList(response.data)
          }
        </DialogContent>
          {
            !isLoading &&
            response &&
            response.metadata &&
            navigation(response.metadata)
          }
      </Dialog>
    </React.Fragment>
  );

  return render;
};