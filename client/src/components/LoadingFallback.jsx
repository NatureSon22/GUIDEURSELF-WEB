import SpinnerEllipse from "./SpinnerEllipse";

const LoadingFallback = () => {
  return (
    <div className="grid min-h-screen place-items-center">
      <SpinnerEllipse />
    </div>
  );
};

export default LoadingFallback;
