import { z } from 'zod';

export const swapOrderSchema = z.object({
    from: z.string(),
    to: z.string(),
    amount: z.string(),
    confirm: z.boolean(),
});

export type SwapOrder = z.infer<typeof swapOrderSchema>;
