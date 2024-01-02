import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "@skylar/api";

export const api = createTRPCReact<AppRouter>();

export { type RouterInputs, type RouterOutputs } from "@skylar/api";
