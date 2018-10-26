import { InjectedIntlProps, injectIntl } from 'react-intl';

import { compose } from 'recompose';
import { BaseFieldProps, WrappedFieldProps } from 'redux-form';

import { InputYearView } from './InputYearView';

interface OwnProps extends WrappedFieldProps, BaseFieldProps {
  type?: string;
  placeholder?: string;
  required?: boolean;
  label: string;
  disabled: boolean;
}

export type InputYearProps = OwnProps & InjectedIntlProps;

export const InputYear = compose<InputYearProps, OwnProps>(injectIntl)(
  InputYearView
);
