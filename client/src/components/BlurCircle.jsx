const BlurCircle = ({
  top = 'auto',
  left = 'auto',
  right = 'auto',
  bottom = 'auto',
}) => {
  return (
    <div
      className="pointer-events-none absolute -z-10 size-64 rounded-full bg-primary/20 blur-3xl"
      style={{ top, left, right, bottom }}
    />
  );
};

export default BlurCircle;
