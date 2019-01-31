import AppMenu from '@constants/AppMenu';
import { IAnnouncement } from '@home/classes/response/announcement';
import { withAnnouncement, WithAnnouncement } from '@home/hoc/withAnnouncement';
import { WithLayout, withLayout } from '@layout/hoc/withLayout';
import { IGallery } from '@lookup/classes/response/gallery';
import { WithWidth } from '@material-ui/core/withWidth';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import {
  compose,
  HandleCreators,
  lifecycle,
  mapper,
  ReactLifeCycleFunctions,
  StateHandler,
  StateHandlerMap,
  StateUpdaters,
  withHandlers,
  withStateHandlers,
} from 'recompose';
import { AnnouncementEditorView } from './AnnouncementEditorView';

interface OwnOption {
}

interface OwnState {
  imageUid?: string;
  announcementImages: IAnnouncementImage[];
  loadImages: boolean;
}

interface OwnHandlers {
  handleSetAnnouncementImages: (images: IAnnouncement[]) => void;
  handleAddAnnouncementImage: (imageGallery: IGallery) => void;
  handleRemoveAnnouncementImage: (imageUid: string) => void;
  handleMoveAnnouncementImage: (index: number, direction: 'forward' | 'backward') => void;
}

interface OwnStateUpdater extends StateHandlerMap<OwnState> {
  updateImages: StateHandler<OwnState>;
  afterLoad: StateHandler<OwnState>;
}

export interface IAnnouncementImage {
  imageUid: string;
  imageName: string;
  order: number;
  imgPath: string;
}

export type AnnouncementEditorProps
  = OwnOption
  & OwnHandlers
  & WithAnnouncement
  & OwnState
  & OwnStateUpdater
  & InjectedIntlProps
  & RouteComponentProps
  & WithLayout
  & WithWidth;

const createProps: mapper<AnnouncementEditorProps, OwnState> = (props: AnnouncementEditorProps): OwnState => ({ 
  announcementImages: [],
  loadImages: true,
});

const handlerCreators: HandleCreators<AnnouncementEditorProps, OwnHandlers> = {
  handleSetAnnouncementImages: (props: AnnouncementEditorProps) => (images: IAnnouncement[]) => {
    const announcementImages: IAnnouncementImage[] = images.map((item, index) => 
      ({
      imageUid: item.imageUid,
      imageName: item.name,
      order: index + 1,
      imgPath: item.path && item.path.medium,
      })
    );

    props.afterLoad();
    props.updateImages(announcementImages);
  },
  handleAddAnnouncementImage: (props: AnnouncementEditorProps) => (imageGallery: IGallery) => {
    const newAnnouncementImages = props.announcementImages.splice(props.announcementImages.length, 0, {
      imageUid: imageGallery.uid,
      imageName: imageGallery.name,
      order: props.announcementImages.length + 1,
      imgPath: imageGallery.path && imageGallery.path.small,
    });

    rearrangeImages(props, newAnnouncementImages);
  },
  handleRemoveAnnouncementImage: (props: AnnouncementEditorProps) => (imageUid: string) => {
    const newAnnouncementImages = props.announcementImages.filter(image => {
      return image.imageUid !== imageUid;
    });

    rearrangeImages(props, newAnnouncementImages);
  },
  handleMoveAnnouncementImage: (props: AnnouncementEditorProps) => (index: number, direction: 'forward' | 'backward') => {
    const newAnnouncementImages = props.announcementImages;

    if (direction === 'forward') {
      const currentImage = newAnnouncementImages[index];

      newAnnouncementImages[index] = newAnnouncementImages[index + 1];
      newAnnouncementImages[index + 1] = currentImage;
    } else if (direction === 'backward') {
      const currentImage = newAnnouncementImages[index];

      newAnnouncementImages[index] = newAnnouncementImages[index - 1];
      newAnnouncementImages[index - 1] = currentImage;
    }

    rearrangeImages(props, newAnnouncementImages);
  },
};

const rearrangeImages = (props: AnnouncementEditorProps, newImages: IAnnouncementImage[]) => {
  const announcementImages = newImages.map((item, index) => 
      ({
      imageUid: item.imageUid,
      imageName: item.imageName,
      order: index + 1,
      imgPath: item.imgPath,
      })
    );

  props.updateImages(announcementImages);
};

const stateUpdaters: StateUpdaters<OwnOption, OwnState, OwnStateUpdater> = {
  updateImages: (prevState: OwnState) => (images: IAnnouncementImage[]) => ({
    announcementImages: images
  }),
  afterLoad: (prevState: OwnState) => () => ({
    loadImages: false,
  })
};

const lifeCycleFunctions: ReactLifeCycleFunctions<AnnouncementEditorProps, OwnState> = {
  componentWillMount() {
    const { layoutDispatch } = this.props;
    const { loadRequest } = this.props.announcementDispatch;
    const { response, isLoading } = this.props.announcementState.all;

    layoutDispatch.setupView({
      view: {
        uid: AppMenu.Gallery,
        parentUid: AppMenu.Lookup,
        title: 'edit slider', // intl.formatMessage(organizationMessage.workflowSetup.page.listTitle),
        subTitle : '' // intl.formatMessage(organizationMessage.workflowSetup.page.listSubHeader)
      },
      status: {
        isNavBackVisible: false,
        isSearchVisible: false,
        isActionCentreVisible: false,
        isMoreVisible: false,
        isModeSearch: false
      }
    });

    if (!response && !isLoading) {
      loadRequest({});
    }
  },
  componentWillUnmount() {
    const { layoutDispatch } = this.props;
    const { loadDispose } = this.props.announcementDispatch;
    
    layoutDispatch.changeView(null);
    layoutDispatch.modeListOff();
    layoutDispatch.searchHide();
    layoutDispatch.modeSearchOff();
    layoutDispatch.moreHide();
    loadDispose();
  }
};

export const AnnouncementEditor = compose<AnnouncementEditorProps, {}>(
  withLayout,
  withAnnouncement,
  injectIntl,
  withStateHandlers(createProps, stateUpdaters),
  withHandlers<AnnouncementEditorProps, OwnHandlers>(handlerCreators),
  lifecycle(lifeCycleFunctions)
)(AnnouncementEditorView);