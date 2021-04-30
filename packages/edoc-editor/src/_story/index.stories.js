import * as React from 'react';
import { storiesOf } from '@storybook/react';

import { EdocEditor } from '..';

const stories = storiesOf('Editor', module);

stories.add('index', () => {
    return (
        <h1>Hello</h1>
        // <EdocEditor
        //     height={'500px'}
        //     previewWidth={'calc(50vw - 1px)'}
        // />
    );
});