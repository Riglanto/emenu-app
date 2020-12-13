import { writeFileSync } from 'fs-extra';

import { generateMenuHtml } from "../pages/api/aptils";
import { DEFAULT_SECTIONS } from "../utils";

describe("Aptils", () => {
    it("works", async () => {
        const content = await generateMenuHtml("domain", "title", DEFAULT_SECTIONS);
        const checklist = ["<svg", "<style>", "</style", "\"sections\""];
        checklist.map(expected =>
            expect(content).toEqual(expect.stringContaining(expected))
        )
        writeFileSync(`test.html`, content)
    })
})