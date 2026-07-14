import Handlebars from 'handlebars';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { handlebarsSplitCharsHelper } from '../helper/handlebars-split-chars.helper';
export interface IContextTemplate {
  username: string;
  resetPasswordURL?: string;
  activeUrl?: string;
  code?: string;
}
interface IConfigService {
  nodeEnv: string;
}
export const HANDLEBARS_RENDER = Symbol('HANDLEBARS_RENDER');
export class HandlebarsRender {
  private readonly handlebars: typeof Handlebars;
  constructor(private readonly configService: IConfigService) {
    this.handlebars = Handlebars;
  }
  async renderTemplate(
    template: string,
    data: IContextTemplate,
  ): Promise<string> {
    template = template.endsWith('.hbs') ? template : `${template}.hbs`;
    const templatePath = join(
      process.cwd(),
      (this.configService.nodeEnv !== 'dev' ? 'dist/' : '') +
        'src/email/infrastructure/templates',
      template,
    );
    const templateFile = await readFile(templatePath, 'utf-8');
    this.handlebars.registerHelper(
      'handlebarsSplitChars',
      handlebarsSplitCharsHelper.handlebarsSplitChars,
    );
    const templateCompiled = this.handlebars.compile(templateFile);
    return templateCompiled(data);
  }
}
