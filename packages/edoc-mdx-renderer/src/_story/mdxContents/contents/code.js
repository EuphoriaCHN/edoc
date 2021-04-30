export default `---
title: 代码块测试
---

\`\`\`jsx
import * as React from 'react';

export default function (props) {
  return <h1>Hello</h1>;
}
\`\`\`

\`\`\`tsx
import * as React from 'react';

export interface IProps {}

export default function (props: IProps) { // 我是注释很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长
  return <h1>Hello</h1>;
}
\`\`\`

\`\`\`markdown
## Markdown 代码

> Markdown 代码测试
\`\`\``;