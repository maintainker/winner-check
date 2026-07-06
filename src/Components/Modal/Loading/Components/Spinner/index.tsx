import "./index.css";

interface SpinnerProps {
  size?: number;
}

const Spinner = ({ size = 48 }: SpinnerProps) => {
  return (
    <div
      className="spinner"
      style={{
        width: size,
        height: size,
      }}
    />
  );
};

export default Spinner;
