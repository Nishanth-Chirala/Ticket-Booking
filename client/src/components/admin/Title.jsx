const Title = ({ text1, text2 }) => {
  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
        Admin
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
        {text1} <span className="text-primary">{text2}</span>
      </h1>
    </div>
  );
};

export default Title;
