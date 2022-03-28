import MarkdownIt = require("markdown-it");
import * as vscode from "vscode";
import { requirementsPlugin, RequirementTokenMetaData, REQUIREMENT_TOKEN } from "./requirements-parser";

/**
 * This class checks if the cursor is currently positioned over a requirement ID and highlights all occurrences of this requirement ID.
 */
export class RequirementsDocumentHighlightProvider implements vscode.DocumentHighlightProvider {

    private requirementsParser = new MarkdownIt().use(requirementsPlugin);

    provideDocumentHighlights(document: vscode.TextDocument, position: vscode.Position): vscode.ProviderResult<vscode.DocumentHighlight[]> {
        const requirementTokens = this.requirementsParser.parse(document.getText(), {}).filter(token => token.type === REQUIREMENT_TOKEN);
        const selectedToken = requirementTokens.filter(token => (token.meta as RequirementTokenMetaData).lineNo === position.line);

        if (selectedToken.length === 0) {
            return [];
        }

        const selectedReqId = (selectedToken[0].meta as RequirementTokenMetaData).reqId;

        return requirementTokens.filter(token => (token.meta as RequirementTokenMetaData).reqId === selectedReqId).map(token => {
            const metaData = token.meta as RequirementTokenMetaData;
            return new vscode.DocumentHighlight(new vscode.Range(metaData.lineNo, 0, metaData.lineNo, metaData.lineLength));
        });
    }
}
