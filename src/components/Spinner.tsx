import { Loader } from "@mantine/core";

const Spinner = () => {
  return (
    <div className="flex justify-center h-[100%] items-center">
      <Loader size={50} />
    </div>
  );
};

export default Spinner;
