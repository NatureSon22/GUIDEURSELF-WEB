import PropTypes from "prop-types";

const PageLayout = ({ children }) => {
  return (
    <div className="box-border grid flex-1 overflow-y-auto bg-secondary-200/5 px-7 py-5">
      {children}
    </div>
  );
};

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PageLayout;
