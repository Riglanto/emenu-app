import { save } from "../pages/api/aptils";
import { DEFAULT_SECTIONS } from "../utils";

describe("Aptils", () => {
    it("works", async () => {
        const content = await save("domain", "title", DEFAULT_SECTIONS);
        const checklist = ["<svg", "<style>", "</style", "\"sections\""];
        checklist.map(expected =>
            expect(content).toEqual(expect.stringContaining(expected)))

    })
})