const Progressbar = () => {
  return (
    <div style={{ minHeight: "calc(100vh - 88px - 56px)" }}>
      <progress
        className="progress is-small is-primary has-text-centered"
        max="100"
        style={{ width: "100%" }}
      />
    </div>
  );
};

export default Progressbar;
