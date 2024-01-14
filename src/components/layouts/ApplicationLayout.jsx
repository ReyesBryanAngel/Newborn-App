import Header from '../Header.';
import Sidebar from '../Sidebar';

const ApplicationLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <div>
        <Sidebar />
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ApplicationLayout;