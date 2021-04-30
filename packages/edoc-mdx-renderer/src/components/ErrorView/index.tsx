import * as React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

export const ErrorView = props => {
  return (
    <div className={'edoc-mdx-error-view'}>
      <pre>{(props.error || {}).message || props.value || 'Something Error'}</pre>
      <pre>{(props.error || {}).codeFrame || ''}</pre>
      <pre>{(props.errorInfo || {}).componentStack || ''}</pre>
      <pre>{(props.error || {}).stack || 'Maybe you wrote the wrong MDX syntax'}</pre>
    </div>
  );
};

export default ErrorView;

ErrorView.propTypes = {
  value: PropTypes.string,

  error: PropTypes.shape({
    message: PropTypes.string,
    stack: PropTypes.string
  }),
  errorInfo: PropTypes.shape({
    componentStack: PropTypes.string
  })
};