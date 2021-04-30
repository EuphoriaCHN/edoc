import * as React from 'react';

export default function (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>) {
  return (
    <div className={'markdown'}>
      <pre {...props} />
    </div>
  );
}