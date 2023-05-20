import dashify from 'dashify';

import { CaseType } from './case-type';

export class CaseChanger {
  private constructor() {}

  public static changeCase(caseType: CaseType, str: string): string {
    switch (caseType) {
      case CaseType.KebabCase:
        return CaseChanger.kebabCase(str);
      default:
        throw new Error(`Case type {${caseType}} is not supported.`);
    }
  }

  public static kebabCase(str: string): string {
    const hasLeadingAtSign = str.startsWith('@');
    const transformedStr = dashify(str).replace(/_/g, '-');
    if (hasLeadingAtSign) return `@${transformedStr}`;
    else return transformedStr;
  }
}
