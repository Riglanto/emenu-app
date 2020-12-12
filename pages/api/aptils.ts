import { readFileSync, writeFileSync } from 'fs-extra';
import * as sass from 'sass';
import QRCode from 'qrcode'

import { getSections } from '../../pages/sections';

export const save = async (domain, title, sections) => {
    const url = `https://${domain}.emenu.today`
    const content = getSections(sections);
    const css = sass.renderSync({ file: "./styles/sections.scss" }).css.toString();
    const template = readFileSync("./template.html", 'utf8')
    const qr = await QRCode.toString(url, { type: "svg", width: 200, margin: 1 })
    const result = template
        .replace(/{TITLE}/g, title)
        .replace("{SECTIONS}", content)
        .replace("{STYLES}", `<style>${css}</style>`)
        .replace("{QR}", qr)
    writeFileSync(`${domain}.html`, result)
    return result;
}
