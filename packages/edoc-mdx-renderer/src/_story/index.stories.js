import * as React from 'react';
import { storiesOf } from '@storybook/react';

import { Renderer } from '..';

import testContents from './mdxContents';

const stories = storiesOf('Edoc MDX Renderer', module);

testContents.forEach(({ key, module }) => {
  stories.add(key, () => {
    return (
      <Renderer markdown={module.default} />
    );
  });
});