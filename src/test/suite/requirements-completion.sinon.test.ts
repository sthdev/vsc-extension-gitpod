import { expect } from "chai";
import { Position, Range, TextDocument, TextLine } from "vscode";
import { RequirementsCompletionProvider } from "../../requirements-completions";
import { Requirement, RequirementsService } from "../../requirements/requirements-service";
import * as sinon from "ts-sinon";

/**
 * This test suite demonstrates using ts-sinon for creating mocks.
 */
suite("requirements-completion (ts-sinon)", () => {
    const requirement1: Requirement = {
        name: "My Requirement",
        reqId: "req1",
        description: "Some description"
    };

    const requirement2: Requirement = {
        name: "My Other Requirement",
        reqId: "req2",
        description: "Some more description"
    };

    const requirementsServiceStub = sinon.stubInterface<RequirementsService>();
    requirementsServiceStub.requirementExists.withArgs(requirement1.reqId).returns(true);
    requirementsServiceStub.requirementExists.withArgs(requirement2.reqId).returns(true);
    requirementsServiceStub.getRequirements.returns([requirement1, requirement2]);


    const completionProvider = new RequirementsCompletionProvider(requirementsServiceStub);

    suite("line contains no '#@Req='", () => {
        const doc = createTextDocument("Hello World");

        test("return no items", () => {
            const position = new Position(0, 0);

            const completionItems = completionProvider.provideCompletionItems(doc, position);

            expect(completionItems).to.be.empty;
        });
    });

    suite("line contains '#@Req='", () => {
        const doc = createTextDocument("#@Req=XYZ");

        test("cursor before '=', return no items", () => {
            const position = new Position(0, 4);

            const completionItems = completionProvider.provideCompletionItems(doc, position);

            expect(completionItems).to.be.empty;
        });

        test("cursor on '=', return no items", () => {
            const position = new Position(0, 5);

            const completionItems = completionProvider.provideCompletionItems(doc, position);

            expect(completionItems).to.be.empty;
        });

        test("cursor immediately after '=', return items", () => {
            const position = new Position(0, 6);

            const completionItems = completionProvider.provideCompletionItems(doc, position);

            expect(completionItems).to.have.lengthOf(2);
            expect(completionItems[0].label).to.be.equal(requirement1.reqId);
            expect(completionItems[1].label).to.be.equal(requirement2.reqId);
        });

        test("cursor far after '=', return no items", () => {
            const position = new Position(0, 7);

            const completionItems = completionProvider.provideCompletionItems(doc, position);

            expect(completionItems).to.be.empty;
        });
    });

});

function createTextDocument(...lines: string[]): TextDocument {
    class TestTextLine implements TextLine {

        constructor(line: string) {
            this.text = line;
        }

        lineNumber: number = 0;
        text: string = "";
        range: Range = new Range(0, 0, 0, 0);
        rangeIncludingLineBreak: Range = this.range;
        firstNonWhitespaceCharacterIndex: number = 0;
        isEmptyOrWhitespace: boolean = false;
    }

    const textDocument = sinon.stubInterface<TextDocument>();

    lines.forEach((line, index) => {
        /**
         * Unfortunately, sinon is unable to stub the 'text' property of TextLine.
         * Therefore, a class needs to be created, which implements this interface, and
         * which sets the 'text' property to the current line.
         */
        const textLine = new TestTextLine(line);

        /**
         * Unfortunately, ts-sinon has a problem with stubbing overloaded methods, see
         * https://github.com/DefinitelyTyped/DefinitelyTyped/issues/36436. Therefore, 
         * we disable TypeScript checks here. After compilation to JavaScript, the right method
         * is selected anyway.
         */
        // @ts-ignore
        textDocument.lineAt.withArgs(index).returns(textLine);
    });

    return textDocument;
}

