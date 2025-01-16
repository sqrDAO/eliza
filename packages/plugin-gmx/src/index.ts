import { Plugin } from "@elizaos/core";
import { swapAction } from "./actions/swap";

export const gmxPlugin: Plugin = {
    name: "GMX",
    description: "GMX Plugin for Eliza",
    actions: [
        swapAction
    ],
    evaluators: [],
    providers: [],
};

export default gmxPlugin;
