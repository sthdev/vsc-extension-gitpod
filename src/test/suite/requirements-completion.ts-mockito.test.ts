import { expect } from "chai";
import { instance, mock, when } from "ts-mockito";
import { Position, TextDocument, TextLine } from "vscode";
import { RequirementsCompletionProvider } from "../../requirements-completions";
import { Requirement, RequirementsService } from "../../requirements/requirements-service";

/**
 * This test suite demonstrates using ts-mockito for creating mocks.
 */
suite("requirements-completion (ts-mockito)", () => {
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

    const requirementsServiceMock = mock<RequirementsService>();
    when(requirementsServiceMock.requirementExists(requirement1.reqId)).thenReturn(true);
    when(requirementsServiceMock.requirementExists(requirement2.reqId)).thenReturn(true);
    when(requirementsServiceMock.getRequirements()).thenReturn([requirement1, requirement2]);
    const requirementsService = instance(requirementsServiceMock);

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
    const textDocumentMock = mock<TextDocument>();

    lines.forEach((line, index) => {
        const textLineMock = mock<TextLine>();
        when(textLineMock.text).thenReturn(line);
        const textLine = instance(textLineMock);

        when(textDocumentMock.lineAt(index)).thenReturn(textLine);
    });

    return instance(textDocumentMock);
}