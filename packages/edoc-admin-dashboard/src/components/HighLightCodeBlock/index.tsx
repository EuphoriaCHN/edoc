import HighLight, { defaultProps, Language, PrismTheme } from 'prism-react-renderer';
import classnames from 'classnames';

interface IProps {
  children: string;
  language: Language;
  theme?: PrismTheme;

  className?: string;
  style?: React.CSSProperties;
}

function HighLightCodeBlock(props: IProps) {
  return (
    <HighLight Prism={defaultProps.Prism} code={props.children} language={props.language} theme={props.theme || defaultProps.theme}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={classnames(className, props.className)} style={Object.assign({}, style, props.style || {})}>
          {tokens.map((line, index) => (
            <div key={index} {...getLineProps({ line, key: index })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </HighLight>
  );
}

export default HighLightCodeBlock;
