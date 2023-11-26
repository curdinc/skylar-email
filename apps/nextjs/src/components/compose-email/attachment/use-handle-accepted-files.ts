import { useMutation } from "@tanstack/react-query";

import { setAttachments } from "@skylar/logic";

import { useToast } from "~/components/ui/use-toast";

export const useHandleAcceptedFiles = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ acceptedFiles }: { acceptedFiles: File[] }) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onabort = () =>
          toast({
            title: "Unable to add attachment",
            description: "The file reading process was aborted",
          });
        reader.onerror = () =>
          toast({
            title: "Unable to add attachment",
            description: "The file reading process failed",
          });
        reader.onload = () => {
          // Do whatever you want with the file contents
          const binaryStr = reader.result;
          if (typeof binaryStr !== "string") {
            toast({
              title: "Unable to add attachment",
              description: "The file reading process failed",
            });
            return;
          }
s          setAttachments((prevAttachments) => [
            ...prevAttachments,
            {
              file,
              data: binaryStr,
              preview: file.type.startsWith("image/")
                ? URL.createObjectURL(file)
                : undefined,
            },
          ]);
        };
        reader.readAsBinaryString(file);
      });
      await Promise.resolve();
    },
  });
};
