import { ProcessingIcon } from "../utils/icons";

interface PrimaryButtonProps {
  name: string;
  submitting?: boolean;
}

const PrimaryButton = ({ name, submitting }: PrimaryButtonProps) => {
  return (
    <button
      className="text-white flex justify-center items-center gap-2 min-w-[120px] md:min-w-[160px] bg-[#00A36C] rounded-[10px] text-sm md:text-base h-fit md:px-10 px-8 py-1.5 md:py-2 hover:bg-opacity-80 duration-300 transition-all cursor-pointer"
      type="submit"
      disabled={submitting}
    >
      {submitting && <ProcessingIcon />}
      {name}
    </button>
  );
};

export default PrimaryButton;
