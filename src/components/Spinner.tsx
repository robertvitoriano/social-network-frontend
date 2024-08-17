type Props = {
  size?: number;
};

export const Spinner = ({ size = 12 }: Props) => (
  <div className="fixed inset-0 flex items-center justify-center bg-transparent z-20 fit-w fit-h">
    <div
      className={`spinner-border animate-spin inline-block w-${size} h-${size} border-4 border-white border-t-transparent rounded-full`}
    ></div>
  </div>
);
