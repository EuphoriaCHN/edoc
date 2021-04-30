export const PREFIX_EVENT_NAME = '$_$EDOC_PARSER_EVENT_';

export function makeEventListenerName(base: string) {
  return PREFIX_EVENT_NAME.concat(base);
}

export const POLYFILL = "function _extends(){_extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key]}}}return target};return _extends.apply(this,arguments)}";

export const CODE_FRAME_RANGE = 4;