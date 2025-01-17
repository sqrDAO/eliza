import type { IAgentRuntime, Memory, State } from "@elizaos/core";
import { composeContext, elizaLogger, generateObject, ModelClass } from "@elizaos/core";

import { SwapOrder, swapOrderSchema } from "../types";
import { Action } from "@elizaos/core";

export const GMX_SUPPORTED_TOKENS = ["ETH", "USDC", "BTC"];

export const swapAction: Action = {
    name: "SWAP_MARKET_GMX",
    similes: ["TOKEN_SWAP_GMX", "EXCHANGE_TOKENS_GMX", "SELL_TOKENS_GMX"],
    description: "Swap tokens on GMX using market orders",
    suppressInitialMessage: true,

    handler: async (
        runtime: IAgentRuntime,
        _message: Memory,
        state: State,
        _options: any,
        callback?: any
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

        const extractResponse = await generateObject({
            runtime,
            context: extractContext,
            modelClass: ModelClass.SMALL,
            schema: swapOrderSchema,
        });

        if (extractResponse.finishReason !== "stop") {
            await callback({
                text: "Please provide the swap parameters.",
            });
            return;
        }

        const extractContent = extractResponse.object as SwapOrder;

        elizaLogger.info("Extracted swap parameters:", extractContent);

        if (!GMX_SUPPORTED_TOKENS.includes(extractContent.from)) {
            if (callback) {
                await callback({
                    text: `Sorry, we do not support swapping from ${extractContent.from} at the moment.`,
                })
            }
            return false;
        }

        if (!extractContent.confirm) {
            if (callback) {
                await callback({
                    text: `Please confirm that you want to swap ${extractContent.amount} ${extractContent.from} for ${extractContent.to}.`,
                })
            }
            return false;
        }

        // if GMX_PRIVATE_KEY is set, we will do the swap
        // otherwise, we will generate the swap transaction and return it
        if (callback) {
            await callback({
                text: `Swap ${extractContent.amount} ${extractContent.from} for ${extractContent.to} on GMX.`,
            });
        }

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
