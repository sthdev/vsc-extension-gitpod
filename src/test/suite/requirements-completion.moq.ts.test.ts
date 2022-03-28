import { expect } from "chai";
import { Position, TextDocument, TextLine } from "vscode";
import { RequirementsCompletionProvider } from "../../requirements-completions";
import { Requirement, RequirementsService } from "../../requirements/requirements-service";

import { Mock } from "moq.ts";

/**
 * This test suite demonstrates using moq.ts for creating mocks.
 */
suite("requirements-completion (moq.ts)", () => {
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

    const requirementsServiceMock = new Mock<RequirementsService>()
        .setup(obj => obj.getRequirements())
        .returns([requirement1, requirement2])
        .setup(obj => obj.requirementExists(requirement1.reqId))
        .returns(true)
        .setup(obj => obj.requirementExists(requirement2.reqId))
        .returns(true);
    const requirementsService = requirementsServiceMock.object();

    const completionProvider = new RequirementsCompletionProvider(requirementsService);

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
    const textDocumentMock = new Mock<TextDocument>();

    lines.forEach((line, index) => {
        const textLineMock = new Mock<TextLine>().setup(obj => obj.text).returns(line);
        const textLine = textLineMock.object();

        textDocumentMock.setup(obj => obj.lineAt(index)).returns(textLine);
    });

    return textDocumentMock.object();
}