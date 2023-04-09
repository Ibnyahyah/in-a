import { useEffect, useState } from "react";
import { Text, Image, SimpleGrid } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";
import { IconCloudUpload } from "@tabler/icons-react";

export function Drag(props: { setImgValue: (arg0: FileWithPath[]) => void }) {
  const [files, setFiles] = useState<FileWithPath[]>([]);

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        key={index}
        src={imageUrl}
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
        alt="Profile"
      />
    );
  });

  useEffect(() => {
    props.setImgValue(files);
  });

  return (
    <div className="flex-1">
      <Dropzone accept={IMAGE_MIME_TYPE} onDrop={setFiles}>
        <div className="flex items-center justify-center mb-5">
          <IconCloudUpload color="#228be6" />
        </div>
        <Text align="center">
          <span className="font-bold text-[#228be6]">Click to upload</span> or
          drag and drop
        </Text>

        <Text align="center" mt={6}>
          PNG OR JPG
        </Text>
      </Dropzone>

      <SimpleGrid
        cols={4}
        breakpoints={[{ maxWidth: "sm", cols: 1 }]}
        mt={previews.length > 0 ? "xl" : 0}
      >
        {previews}
      </SimpleGrid>
    </div>
  );
}
