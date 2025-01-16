import type { IAgentRuntime, Memory, State } from "@elizaos/core";
import { composeContext, elizaLogger, generateObject, ModelClass } from "@elizaos/core";

export const GMX_SUPPORTED_TOKENS = ["ETH", "USDC", "WBTC"];

export const swapAction = {
    name: "SWAP_MARKET_GMX",
    similes: ["TOKEN_SWAP_GMX", "EXCHANGE_TOKENS_GMX", "SELL_TOKENS_GMX"],
    description: "Swap tokens on GMX using market orders",
    handler: async (
        runtime: IAgentRuntime,
        _message: Memory,
        state: State,
        _options: any,
        _callback?: any
    ) => {
        // 1. Extract the swap parameters from the conversation
        const extractTemplate = `
You are required to extract the swap parameters for GMX, a decentralized exchange in an EVM-compatible blockchain.
Pay attention to latest messages in the conversation where you confirmed a swap request.

Conversation:
{{recentMessages}}

For example:
- "Swap 1 ETH for USDC" -> { "from": "ETH", "to": "USDC", "amount": 1 }

TASK:
Extract the swap parameters from the conversation.
- Use the token symbols (ETH, USDC, etc.)
- Use the exact quantity mentioned, which should be a number
- Should check if the user confirmed the swap

Output in JSON format wrapped in triple backticks:
\`\`\`json
{
    "from": "<token symbol>",
    "to": "<token symbol>",
    "amount": "<quantity to swap>",
    "confirm": "<true if confirmed, false if not>"
}
\`\`\`
`;
        const extractContext = composeContext({
            state,
            template: extractTemplate,
        });

        const extractContent = await generateObject({
            runtime,
            context: extractContext,
            modelClass: ModelClass.SMALL
        })

        elizaLogger.info("Extracted swap parameters:", extractContent);
        return;

        // 2. Validate the swap parameters

        // 3. Generate the swap transaction and return it

    },
    validate: async (_runtime: IAgentRuntime) => {
        // Implement validation logic
        return true;
    },
    examples: [
        [
            {
                user: "user",
                content: {
                    text: "Swap 1 ETH for USDC on Base",
                    action: "TOKEN_SWAP",
                },
            },
        ],
    ],
};
