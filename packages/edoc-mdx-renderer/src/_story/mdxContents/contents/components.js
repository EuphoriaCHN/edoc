export default `---
title: 组件测试
----

<Button type="primary">Primary Button</Button>
<Button>Default Button</Button>
<Button type="dashed">Dashed Button</Button>
<Button type="text">Text Button</Button>
<Button type="link">Link Button</Button>

<Tooltip title="search">
  <Button type="primary" shape="circle" icon={<Icon type={'SearchOutlined'} />} />
</Tooltip>
<Button type="primary" shape="circle">
  A
</Button>
<Button type="primary" icon={<Icon type={'SearchOutlined'} />}>
  Search
</Button>
<Tooltip title="search">
  <Button shape="circle" icon={<Icon type={'SearchOutlined'} />} />
</Tooltip>
<Button icon={<Icon type={'SearchOutlined'} />}>Search</Button>
<br />
<Tooltip title="search">
  <Button shape="circle" icon={<Icon type={'SearchOutlined'} />} />
</Tooltip>
<Button icon={<Icon type={'SearchOutlined'} />}>Search</Button>
<Tooltip title="search">
  <Button type="dashed" shape="circle" icon={<Icon type={'SearchOutlined'} />} />
</Tooltip>
<Button type="dashed" icon={<Icon type={'SearchOutlined'} />}>
  Search
</Button>`;