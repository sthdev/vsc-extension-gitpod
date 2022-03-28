import { TreeDataProvider, TreeItem, TreeItemCollapsibleState } from "vscode";
import { Requirement, RequirementsService } from "./requirements/requirements-service";

export class RequirementsTreeDataProvider implements TreeDataProvider<RequirementNode> {

    constructor(
        private requirementsService: RequirementsService
    ) { }

    getTreeItem(element: RequirementNode): TreeItem {
        return element;
    }

    getChildren(): RequirementNode[] {
        return this.requirementsService.getRequirements().map((req) => new RequirementNode(req));
    }
}

class RequirementNode extends TreeItem {

    constructor(
        requirement: Requirement
    ) {
        super(`${requirement.name} (${requirement.reqId})`, TreeItemCollapsibleState.None);
        this.tooltip = requirement.description;
    }
}