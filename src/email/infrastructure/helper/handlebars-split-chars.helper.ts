import Handlebars, { HelperDeclareSpec } from 'handlebars';

export const handlebarsSplitCharsHelper: HelperDeclareSpec = {
  handlebarsSplitChars: (text: string) => {
    return new Handlebars.SafeString(
      text
        .split('')
        .map((char) => {
          return `<span class="code">${Handlebars.escapeExpression(char)}</span>`;
        })
        .join(''),
    );
  },
};
