import visit from 'unist-util-visit';
import { EVENT_LISTENER_NAME } from './parser';

import { Node } from 'unist';

export default function ([transformer, debug, emitListener]) {
  const transformerKeys: any = Object.keys(transformer);

  function compile(tree: Node) {
    !!debug && console.log(tree);
    typeof emitListener === 'function' && emitListener(EVENT_LISTENER_NAME.ast, tree);

    visit(tree, transformerKeys, (node, index, parent) => {
      const handler = transformer[node.type] || (() => { });
      return handler(node, index, parent, emitListener);
    });
  }

  return compile;
}