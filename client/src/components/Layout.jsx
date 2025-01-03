import PropTypes from "prop-types";
import { BiEdit } from "react-icons/bi";

const Layout = ({ title, subtitle, setEdit, children }) => {
  return (
    <div className="box-shadow-100 space-y-4 rounded-lg bg-white p-4">
      <div className="flex justify-between">
        <div>
          <p className="text-[0.95rem] font-semibold">{title}</p>
          <p className="text-[0.85rem] text-secondary-100/60">{subtitle}</p>
        </div>

        <BiEdit
          className="cursor-pointer text-[1.4rem] text-secondary-100/50"
          onClick={() => setEdit((prev) => !prev)}
        />
      </div>

      {children}
    </div>
  );
};

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  setEdit: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export default Layout;
