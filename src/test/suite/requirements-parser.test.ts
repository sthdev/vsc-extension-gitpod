import { expect } from "chai";
import MarkdownIt = require("markdown-it");
import Token = require("markdown-it/lib/token");
import { requirementsPlugin, REQUIREMENT_TOKEN } from "../../requirements-parser";

suite("requirements-parser", () => {
    const parser = new MarkdownIt().use(requirementsPlugin);

    let requirementTokens: Token[];

    const parseInput = (input: string) => {
        const ast = parser.parse(input, {});

        requirementTokens = ast.filter(token => token.type === REQUIREMENT_TOKEN);
    };

    suite("input contains no requirements", () => {
        setup("parse input", () =>
            parseInput("This is probably some markdown."));

        test("no requirement_token created", () => {
            expect(requirementTokens).to.be.empty;
        });
    });

    suite("input contains '#@Req='", () => {
        setup("parse input", () =>
            parseInput("#@Req=\nThis is a requirement."));

        test("create one requirement_token", () => {
            expect(requirementTokens).to.have.lengthOf(1);
        });

        test("create requirement_token with reqId", () => {
            expect(requirementTokens[0].meta.reqId).to.be.equal("");
        });

    });

    suite("input contains '#@Req=XYZ'", () => {
        setup("parse input", () =>
            parseInput("#@Req=XYZ\nThis is a requirement."));

        test("create one requirement_token", () => {
            expect(requirementTokens).to.have.lengthOf(1);
        });

        test("create requirement_token with reqId", () => {
            expect(requirementTokens[0].meta.reqId).to.be.equal("XYZ");
        });
    });
});