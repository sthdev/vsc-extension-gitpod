export interface Requirement {
    name: string;
    reqId: string;
    description: string;
}

/**
 * The RequirementsService returns Requirements. The source of these requirements depends on the actual implementation.
 */
export interface RequirementsService {
    /**
     * Returns all available Requirements.
     */
    getRequirements(): Requirement[];

    /**
     * Returns true if a requirement with the specified reqId exists.
     */
    requirementExists(reqId: string): boolean;
}
