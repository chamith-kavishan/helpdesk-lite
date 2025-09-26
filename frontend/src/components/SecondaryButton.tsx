interface SecondaryButtonProps {
  name: string;
  onClick: () => void;
  className?: string;
}

const SecondaryButton = ({
  name,
  onClick,
  className,
}: SecondaryButtonProps) => {
  return (
    <div className={`w-full flex justify-end ${className}`}>
      <button
        type="button"
        className="border border-green rounded-[10px] text-green px-8 md:px-10 py-1.5 md:py-2 font-semibold text-sm md:text-base cursor-pointer"
        onClick={onClick}
      >
        {name}
      </button>
    </div>
  );
};

export default SecondaryButton;
