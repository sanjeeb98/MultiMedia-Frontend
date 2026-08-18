import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyFiles } from '../store/filesSlice';
import StatCard from '../components/ui/StatCard';
import FileCard from '../components/FileCard';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import {
  IconFiles,
  IconImage,
  IconVideo,
  IconAudio,
  IconPdf,
  IconEye,
  IconUpload,
  IconSearch,
  IconGrid,
  IconList,
  IconArrowRight,
} from '../components/ui/Icons';

function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { myFiles, loading, error } = useSelector((state) => state.files);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    dispatch(fetchMyFiles());
  }, [dispatch]);

  // Compute stats dynamically from myFiles
  const totalFiles = myFiles.length;
  const imageCount = myFiles.filter((f) => f.fileType === 'image').length;
  const videoCount = myFiles.filter((f) => f.fileType === 'video').length;
  const audioCount = myFiles.filter((f) => f.fileType === 'audio').length;
  const pdfCount = myFiles.filter((f) => f.fileType === 'pdf').length;
  const totalViews = myFiles.reduce((acc, f) => acc + (f.viewCount || 0), 0);

  const recentFiles = myFiles.slice(0, 8);

  return (
    <div className="dashboard-page">
      {/* Welcome Banner */}
      <section className="dashboard-page__welcome">
        <div className="welcome-content">
          <h1>
            Welcome back, <span>{user?.username || 'Creator'}</span> 👋
          </h1>
          <p>
            Manage, index, preview, and search your multimedia assets with relevance ranking.
          </p>
        </div>

        <div className="welcome-actions">
          <Button
            variant="outline"
            size="md"
            icon={<IconSearch size={16} />}
            onClick={() => navigate('/search')}
          >
            Search Library
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={<IconUpload size={16} />}
            onClick={() => navigate('/upload')}
          >
            Upload Media
          </Button>
        </div>
      </section>

      {/* Error state */}
      {error && (
        <div className="alert alert--error">
          <span>Unable to load your media stats: {error}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(fetchMyFiles())}
            style={{ marginLeft: 'auto' }}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Statistics Cards */}
      {loading && myFiles.length === 0 ? (
        <LoadingSkeleton count={6} variant="stat" />
      ) : (
        <section className="dashboard-page__stats-grid">
          <StatCard
            label="Total Files"
            value={totalFiles}
            icon={<IconFiles size={22} />}
            accent="primary"
            subtext="Indexed Assets"
          />
          <StatCard
            label="Images"
            value={imageCount}
            icon={<IconImage size={22} />}
            accent="image"
            subtext="Photos & Graphics"
          />
          <StatCard
            label="Videos"
            value={videoCount}
            icon={<IconVideo size={22} />}
            accent="video"
            subtext="Video Clips"
          />
          <StatCard
            label="Audio"
            value={audioCount}
            icon={<IconAudio size={22} />}
            accent="audio"
            subtext="Tracks & Sounds"
          />
          <StatCard
            label="PDF Documents"
            value={pdfCount}
            icon={<IconPdf size={22} />}
            accent="pdf"
            subtext="PDF Files"
          />
          <StatCard
            label="Total Views"
            value={totalViews}
            icon={<IconEye size={22} />}
            accent="accent"
            subtext="Media Impressions"
          />
        </section>
      )}

      {/* Quick Action Navigation Cards */}
      <section className="dashboard-page__quick-actions">
        <Link to="/upload" className="dashboard-page__quick-card">
          <div className="quick-card-icon quick-card-icon--upload">
            <IconUpload size={22} />
          </div>
          <div className="quick-card-info">
            <h4>Upload Media</h4>
            <p>Add new images, videos, audio, or PDFs</p>
          </div>
          <IconArrowRight size={18} className="quick-card-arrow" />
        </Link>

        <Link to="/search" className="dashboard-page__quick-card">
          <div className="quick-card-icon quick-card-icon--search">
            <IconSearch size={22} />
          </div>
          <div className="quick-card-info">
            <h4>Search & Relevance</h4>
            <p>Query keywords with algorithmic ranking</p>
          </div>
          <IconArrowRight size={18} className="quick-card-arrow" />
        </Link>

        <Link to="/files" className="dashboard-page__quick-card">
          <div className="quick-card-icon quick-card-icon--files">
            <IconFiles size={22} />
          </div>
          <div className="quick-card-info">
            <h4>Manage Files</h4>
            <p>Filter, sort, and organize all your uploads</p>
          </div>
          <IconArrowRight size={18} className="quick-card-arrow" />
        </Link>
      </section>

      {/* Recent Uploads Section */}
      <section className="dashboard-page__section">
        <div className="dashboard-page__section-header">
          <h3>
            <IconFiles size={18} /> Recent Uploads
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {myFiles.length > 0 && (
              <div className="files-page__view-toggle">
                <button
                  type="button"
                  className={viewMode === 'grid' ? 'active' : ''}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <IconGrid size={16} />
                </button>
                <button
                  type="button"
                  className={viewMode === 'list' ? 'active' : ''}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <IconList size={16} />
                </button>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              icon={<IconArrowRight size={14} />}
              onClick={() => navigate('/files')}
            >
              View All Files
            </Button>
          </div>
        </div>

        {loading && myFiles.length === 0 ? (
          <LoadingSkeleton count={viewMode === 'grid' ? 4 : 5} variant={viewMode === 'grid' ? 'card' : 'table'} />
        ) : recentFiles.length === 0 ? (
          <EmptyState
            icon={<IconUpload size={28} />}
            title="No media files uploaded yet"
            message="Your library is currently empty. Upload your first image, video, audio file, or PDF document to start managing your assets."
            action={
              <Button
                variant="primary"
                size="md"
                icon={<IconUpload size={16} />}
                onClick={() => navigate('/upload')}
              >
                Upload First File
              </Button>
            }
          />
        ) : viewMode === 'grid' ? (
          <div className="file-grid">
            {recentFiles.map((file) => (
              <FileCard key={file._id} file={file} viewMode="grid" />
            ))}
          </div>
        ) : (
          <div className="file-list">
            {recentFiles.map((file) => (
              <FileCard key={file._id} file={file} viewMode="list" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default DashboardPage;
