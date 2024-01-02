import { useLogger as useAxiomLogger } from "next-axiom";

export const useLogger = (args?: Parameters<typeof useAxiomLogger>[0]) => {
  return useAxiomLogger(args);
};
