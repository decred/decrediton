import StandalonePageBody from "./StandalonePageBody";

export default ({ header, children }) =>
  <div className="standalone-page">
    {header}

    <StandalonePageBody>
      {children}
    </StandalonePageBody>
  </div>;
