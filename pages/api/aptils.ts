import { writeFileSync } from 'fs-extra';
import * as sass from 'sass';

import { getSections } from '../../pages/sections';

export const save = () => {
    const content = getSections(12345);
    const css = sass.renderSync({ file: "./styles/sections.scss" }).css.toString();
    // const x = readFileSync("./styles/sections.scss", 'utf8')
    console.log(css)
    writeFileSync('test.html', content)
}
