import * as React from 'react';
import { Core } from './Core';
import ErrorView from './ErrorView';

import { omit } from '../lib/util';

export class EdocMDXRenderer extends React.Component<any, any> {
  errorElement: ReturnType<typeof React.createElement>;

  constructor(props) {
    super(props);

    this.state = {
      renderError: null
    };

    this.errorElement = <ErrorView />;
  }

  componentDidCatch(error, errorInfo) {
    typeof this.props.onRenderError === 'function' && this.props.onRenderError(error, errorInfo);
    this.setState({
      renderError: { error, errorInfo }
    });
  }

  componentDidUpdate(_, { renderError }) {
    if (renderError) {
      this.setState({ renderError: null });
    }
  }

  getOnRenderErrorElement(rendererError = {}) {
    const { errorView: ErrorViewFromProp } = this.props;
    const isValidElement = React.isValidElement(ErrorViewFromProp);

    let errorElement = <ErrorView {...rendererError} />;

    if (typeof ErrorViewFromProp === 'function') {
      errorElement = <ErrorViewFromProp {...rendererError} />;
    } else if (isValidElement || typeof ErrorViewFromProp === 'string') {
      errorElement = ErrorViewFromProp;
    }

    this.errorElement = errorElement;
    return errorElement;
  }

  onParseMdxError(err) {
    this.setState({ renderError: { error: err } });
    typeof this.props.onRenderError === 'function' && this.props.onRenderError(err);
  }

  render() {
    const { renderError } = this.state;

    if (!!Object.keys(renderError || {}).length) {
      return this.getOnRenderErrorElement(renderError);
    }

    const coreProps = omit(this.props, ['errorView', 'onRenderError']);

    return (
      <Core
        {...coreProps}
        onRenderError={this.onParseMdxError.bind(this)}
      />
    );
  }
}

export default EdocMDXRenderer;
