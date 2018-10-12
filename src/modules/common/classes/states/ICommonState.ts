import { ISystemAllRequest, ISystemByIdRequest, ISystemListRequest } from '@common/classes/queries';
import { ISystem, ISystemDetail, ISystemList } from '@common/classes/response';
import { IQueryCollectionState, IQuerySingleState } from '@generic/interfaces';

export interface ICommonState {
  commonActivityGetAll: IQueryCollectionState<ISystemAllRequest, ISystem>;
  commonActivityGetList: IQueryCollectionState<ISystemListRequest, ISystemList>;
  commonActivityGetById: IQuerySingleState<ISystemByIdRequest, ISystemDetail>;

  commonCurrencyGetAll: IQueryCollectionState<ISystemAllRequest, ISystem>;
  commonCurrencyGetList: IQueryCollectionState<ISystemListRequest, ISystemList>;
  commonCurrencyGetById: IQuerySingleState<ISystemByIdRequest, ISystemDetail>;

  commonDocumentGetAll: IQueryCollectionState<ISystemAllRequest, ISystem>;
  commonDocumentGetList: IQueryCollectionState<ISystemListRequest, ISystemList>;
  commonDocumentGetById: IQuerySingleState<ISystemByIdRequest, ISystemDetail>;

  commonDocumentPresalesGetAll: IQueryCollectionState<ISystemAllRequest, ISystem>;
  commonDocumentPresalesGetList: IQueryCollectionState<ISystemListRequest, ISystemList>;
  commonDocumentPresalesGetById: IQuerySingleState<ISystemByIdRequest, ISystemDetail>;

  commonProjectGetAll: IQueryCollectionState<ISystemAllRequest, ISystem>;
  commonProjectGetList: IQueryCollectionState<ISystemListRequest, ISystemList>;
  commonProjectGetById: IQuerySingleState<ISystemByIdRequest, ISystemDetail>;

  commonSiteGetAll: IQueryCollectionState<ISystemAllRequest, ISystem>;
  commonSiteGetList: IQueryCollectionState<ISystemListRequest, ISystemList>;
  commonSiteGetById: IQuerySingleState<ISystemByIdRequest, ISystemDetail>;

  systemGetAll: IQueryCollectionState<ISystemAllRequest, ISystem>;
  systemGetList: IQueryCollectionState<ISystemListRequest, ISystemList>;
  systemGetById: IQuerySingleState<ISystemByIdRequest, ISystemDetail>;
}