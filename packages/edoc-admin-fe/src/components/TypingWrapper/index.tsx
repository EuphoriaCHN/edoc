import * as React from 'react';
import ReactTyping from 'react-typing-animation';

export interface ITypingWrapperBase {
  texts: string[];
  disableLoop?: boolean;
  typingSpeed?: number;
  deleteSpeed?: number;
  delaySpeed?: number;

  textWrapperElement?: any;
  textWrapperElementClassName?: string;
}

export interface ITypingWrapperOptions<T> extends ITypingWrapperBase {
  Component: React.ComponentType<T>;
}

export interface ITypingWrapperHOCProps extends Partial<ITypingWrapperBase> {

}

function TypingWrapper<T extends any>(option: ITypingWrapperOptions<T>) {
  return function (props: T & ITypingWrapperHOCProps) {
    const {
      texts: textFromOption,
      disableLoop: disableLoopFromOption,
      typingSpeed: typingSpeedFromOption,
      deleteSpeed: deleteSpeedFromOption,
      delaySpeed: delaySpeedFromOption,
      textWrapperElement: TextWrapperElementFromOption,
      textWrapperElementClassName: textWrapperElementClassNameFromOption
    } = option;

    const {
      texts: textFromProps,
      disableLoop: disableLoopFromProps,
      typingSpeed: typingSpeedFromProps,
      deleteSpeed: deleteSpeedFromProps,
      delaySpeed: delaySpeedFromProps,
      textWrapperElement: TextWrapperElementFromProps,
      textWrapperElementClassName: textWrapperElementClassNameFromProps
    } = props;

    const texts = textFromProps || textFromOption;
    const disableLoop = disableLoopFromProps || disableLoopFromOption;
    const typingSpeed = typingSpeedFromProps || typingSpeedFromOption;
    const deleteSpeed = deleteSpeedFromProps || deleteSpeedFromOption;
    const delaySpeed = delaySpeedFromProps || delaySpeedFromOption;
    const TextWrapperElement = TextWrapperElementFromProps || TextWrapperElementFromOption;
    const textWrapperElementClassName = textWrapperElementClassNameFromProps || textWrapperElementClassNameFromOption;

    return (
      <option.Component {...props}>
        <ReactTyping
          cursorClassName={'typing-cursor'}
          loop={!disableLoop}
        >
          {texts.map(text => (
            <React.Fragment>
              <ReactTyping.Speed ms={typingSpeed || 75} />
              {!!TextWrapperElement ? (
                <TextWrapperElement className={textWrapperElementClassName}>{text}</TextWrapperElement>
              ) : <span className={textWrapperElementClassName}>{text}</span>}
              <ReactTyping.Delay ms={delaySpeed || 1200} />
              <ReactTyping.Speed ms={deleteSpeed || 15} />
              <ReactTyping.Backspace count={text.length + 1} />
              <ReactTyping.Delay ms={delaySpeed || 1200} />
            </React.Fragment>
          ))}
        </ReactTyping>
      </option.Component>
    );
  }
}

export default TypingWrapper;
