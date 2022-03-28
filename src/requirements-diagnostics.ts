import MarkdownIt = require("markdown-it");
import * as vscode from "vscode";
import { DiagnosticCollection, ExtensionContext } from "vscode";
import { requirementsPlugin, RequirementTokenMetaData, REQUIREMENT_TOKEN } from "./requirements-parser";
import { RequirementsService } from "./requirements/requirements-service";

const requirementsParser = new MarkdownIt().use(requirementsPlugin);

export class RequirementsValidator {

    constructor(
        private requirementsService: RequirementsService
    ) { }

    validateRequirements(document: vscode.TextDocument, diagnostics: DiagnosticCollection) {
        const errors: vscode.Diagnostic[] = [];

        const tokens = requirementsParser.parse(document.getText(), {});

        tokens.filter(token => token.type === REQUIREMENT_TOKEN).forEach(async token => {
            const metaData = token.meta as RequirementTokenMetaData;
            const reqId = metaData.reqId;

            if (!reqId || !reqId.trim()) {
                const range = new vscode.Range(metaData.lineNo, 0, metaData.lineNo, metaData.lineLength);
                const diagnostic = new vscode.Diagnostic(range, "A requirement ID must be specified.", vscode.DiagnosticSeverity.Error);
                errors.push(diagnostic);
            }
            else if (!this.requirementsService.requirementExists(reqId)) {
                const range = new vscode.Range(metaData.lineNo, 0, metaData.lineNo, metaData.lineLength);
                const diagnostic = new vscode.Diagnostic(range, `Requirement ${reqId} does not exist.`, vscode.DiagnosticSeverity.Error);
                errors.push(diagnostic);
            }
        });

        diagnostics.set(document.uri, errors);
    }


    subscribeToDocumentChanges(context: ExtensionContext, diagnostics: DiagnosticCollection) {

        if (vscode.window.activeTextEditor) {
            this.validateRequirements(vscode.window.activeTextEditor.document, diagnostics);
        }

        context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) {
                this.validateRequirements(editor.document, diagnostics);
            }
        }));

        context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(editor =>
            this.validateRequirements(editor.document, diagnostics)
        ));

        context.subscriptions.push(vscode.workspace.onDidCloseTextDocument(document =>
            diagnostics.delete(document.uri)
        ));
    }
}
