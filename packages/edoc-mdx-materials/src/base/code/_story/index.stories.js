import * as React from 'react';
import { storiesOf } from '@storybook/react';

import { Block } from '..';

const stories = storiesOf('物料 - Block', module);

stories.add('Block', () => {
  return (
    <Block />
  );
});