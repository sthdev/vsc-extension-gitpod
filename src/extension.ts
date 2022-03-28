// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { RequirementsTreeDataProvider } from "./requirements-tree-data-provider";
import { RequirementsDocumentHighlightProvider } from "./requirements-highlight-provider";

import { StaticRequirementsServiceImpl } from "./requirements/static-requirements-service";
import { RequirementsService } from "./requirements/requirements-service";
import { RequirementsValidator } from "./requirements-diagnostics";
import { RequirementsCompletionProvider } from "./requirements-completions";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const requirementsService: RequirementsService =
    new StaticRequirementsServiceImpl();

  context.subscriptions.push(
    vscode.window.registerTreeDataProvider(
      "requirements",
      new RequirementsTreeDataProvider(requirementsService)
    ),
    vscode.languages.registerDocumentHighlightProvider(
      "markdown",
      new RequirementsDocumentHighlightProvider()
    )
  );

  const diagnostics =
    vscode.languages.createDiagnosticCollection("requirements");
  context.subscriptions.push(diagnostics);

  const validator = new RequirementsValidator(requirementsService);
  validator.subscribeToDocumentChanges(context, diagnostics);

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      "markdown",
      new RequirementsCompletionProvider(requirementsService)
    )
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
