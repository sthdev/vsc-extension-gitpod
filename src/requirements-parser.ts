import MarkdownIt = require("markdown-it");
import { RuleBlock } from "markdown-it/lib/parser_block";

export const REQUIREMENT_TOKEN = "requirement_token";


/**
 * This is a parser rule for MarkdownIt. If the current line contains #@Req=XYZ, this rule creates a requirement_token and attaches
 * the requirement ID as metadata to that token.
 */
const requirementRule: RuleBlock = (state, startLine) => {
    const pos = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    const currentLine = state.src.substring(pos, max);

    if (currentLine) {
        /**
         * Check if the current line has the schema '#@Req=XYZ'. If so create tokens for the '#@Req=' keyword and the requirement ID.
         */
        const matches = currentLine.match(/(#@Req=)([\w-.]*)/);

        if (matches) {
            const token = state.push(REQUIREMENT_TOKEN, "", 0);
            token.map = [startLine, startLine];
            token.content = currentLine;
            token.meta = {
                reqId: matches[2],
                lineNo: startLine,
                lineLength: currentLine.length
            } as RequirementTokenMetaData;

            state.line = startLine + 1;

            return true;
        }

    }

    return false;
};

/**
 * This is a plugin for MarkdownIt. Use it with Markdown it like this: const requirementsParser = new MarkdownIt().use(requirementsPlugin)
 */
export const requirementsPlugin = (md: MarkdownIt) => {

    /**
     * Add this rule before the paragraph rule, which would normally consume lines of the format '#@Req=XYZ'.
     */
    md.block.ruler.before("paragraph", "requirement", requirementRule);
};

export interface RequirementTokenMetaData {
    reqId: string;
    lineNo: number;
    lineLength: number;
}