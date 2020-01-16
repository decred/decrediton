import "style/GetStarted.less";

const DaemonLoadingBody = ({ PageComponent, ...props }) => (
  <>
    { PageComponent && (React.isValidElement(PageComponent) ? PageComponent : <PageComponent />)}
  </>
);

export default DaemonLoadingBody;
