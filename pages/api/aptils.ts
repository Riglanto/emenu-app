import { readFileSync, writeFileSync } from 'fs-extra';
import * as sass from 'sass';

import { getSections } from '../../pages/sections';

export const save = () => {
    const content = getSections(12345);
    const css = sass.renderSync({ file: "./styles/sections.scss" }).css.toString();
    const template = readFileSync("./template.html", 'utf8')
    const result = template
        .replace(/{TITLE}/g, "~~ TEST restaurant ~~")
        .replace("{SECTIONS}", content)
        .replace("{STYLES}", `<style>${css}</style>`)
    console.log(result)
    writeFileSync('test.html', result)
}
