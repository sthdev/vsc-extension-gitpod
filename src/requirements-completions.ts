import { CompletionItem, CompletionItemProvider, Position, TextDocument } from "vscode";
import { RequirementsService } from "./requirements/requirements-service";

/**
 * This completion provider checks if the cursor is positioned after '#@Req='. If so,
 * it shows a list of all available requirement IDs aquired from the RequirementService.
 */
export class RequirementsCompletionProvider implements CompletionItemProvider {

    constructor(
        private requirementsService: RequirementsService
    ) { }

    provideCompletionItems(document: TextDocument, position: Position): CompletionItem[] {
        const line = document.lineAt(position.line);
        const matches = line.text.match(/#@Req=/);

        if (matches) {
            if (position.character === "#@Req=".length) {
                return (this.requirementsService.getRequirements()).map(req => {
                    const item = new CompletionItem(req.reqId);

                    return item;
                });
            }
        }

        return [];
    }
}