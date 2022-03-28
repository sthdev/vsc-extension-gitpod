import { Requirement, RequirementsService } from "./requirements-service";

const requirements = [
    { name: "Req 1", reqId: "SRS-129-012.MSS-6501", description: "This is a simple requirement." },
    { name: "Req 2", reqId: "SRS-129-012.MSS-6497", description: "This is a more complex requirement." }
];

/**
 * The StaticRequirementsServiceImpl returns hard-coded requirements.
 */
export class StaticRequirementsServiceImpl implements RequirementsService {

    getRequirements(): Requirement[] {
        return requirements;
    }

    requirementExists(reqId: string): boolean {
        return requirements.some(req => req.reqId === reqId);
    }
}