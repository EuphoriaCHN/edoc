import yaml from 'js-yaml';
import MdxCodeFrameError from '../MdxCodeFrameError';

import { Node, Parent } from 'unist';
import { SKIP } from 'unist-util-visit';
import { IEdocEmitListener, EVENT_LISTENER_NAME } from '../parser';

export default function (node: Node, index: number, parent: Parent, emitter: IEdocEmitListener) {
  const value = node.value as string;
  // remove
  // parent.children.splice(index, 1);

  // parse
  try {
    const doc = yaml.load(value);
    emitter(EVENT_LISTENER_NAME.yaml, doc);
  } catch (error) {
    if (!error.mark) {
      throw error;
    }
    throw new MdxCodeFrameError({
      message: !!error.reason ? `${error.name}: ${error.reason}` : error.message,
      line: error.mark.line + node.position.start.line + 1,
      column: error.mark.column
    });
  }

  return SKIP;
}