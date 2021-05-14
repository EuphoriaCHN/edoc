import * as React from 'react';
import ReactDOM from 'react-dom';
import { debounce } from 'lodash-es';
import { Renderer } from 'edoc-mdx-renderer';
import { override } from 'edoc-mdx-materials';

export interface IViewerProps {
  instance: tuiEditor.Editor;
}

interface IViewerState {
  markdown: string;
}

class Viewer extends React.Component<IViewerProps, IViewerState> {
  private _onChanged: Function;

  constructor(props: IViewerProps) {
    super(props);

    this.state = { markdown: '' };

    this._onChanged = debounce(() => {
      this.setState({
        markdown: this.props.instance.getMarkdown()
      });
    }, 500);
  }

  static bundleViewer(editorInstance: IViewerProps['instance']) {
    ReactDOM.render(<Viewer instance={editorInstance} />, (editorInstance as any).preview.$el[0]);
  }

  componentDidMount() {
    const { instance } = this.props;

    (instance as any).eventManager.listen('change', this._onChanged);

    // 初始化赋值
    this.setState({
      markdown: instance.getMarkdown()
    });
  }

  componentWillUnmount() {
    const { instance } = this.props;

    (instance as any).eventManager.removeEventHandler('change', this._onChanged);
  }

  render() {
    return (
      <Renderer
        components={Object.assign({}, override)}
        markdown={this.state.markdown}
        withoutAnchor={false}
        withoutLinkTitle
      />
    );
  }
}

export default Viewer;