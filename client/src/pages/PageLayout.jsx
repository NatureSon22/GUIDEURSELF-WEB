import PropTypes from "prop-types";

const PageLayout = ({ children }) => {
  return <div className="box-border flex-1 2 px-7 pt-10 pb-5 bg-secondary-200/5 ">{children}</div>;
};

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PageLayout;
