import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyFiles } from '../../store/filesSlice';
import Sidebar from './Sidebar';
import Header from './Header';
import ToastContainer from '../ui/ToastContainer';
import FilePreviewModal from '../FilePreviewModal';

function AppLayout({ children }) {
  const dispatch = useDispatch();
  const { sidebarCollapsed } = useSelector((state) => state.ui);

  useEffect(() => {
    dispatch(fetchMyFiles());
  }, [dispatch]);

  return (
    <div className="app-shell">
      <Sidebar />

      <div
        className={`app-main-wrapper ${
          sidebarCollapsed ? 'app-main-wrapper--collapsed' : ''
        }`}
      >
        <Header />
        <main className="app-content">{children}</main>
      </div>

      <FilePreviewModal />
      <ToastContainer />
    </div>
  );
}

export default AppLayout;
