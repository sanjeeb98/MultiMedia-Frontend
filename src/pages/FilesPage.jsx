import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyFiles } from '../store/filesSlice';
import FileCard from '../components/FileCard';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import {
  IconSearch,
  IconGrid,
  IconList,
  IconUpload,
  IconImage,
  IconVideo,
  IconAudio,
  IconPdf,
  IconFiles,
} from '../components/ui/Icons';

const FILTER_TYPES = [
  { id: 'all', label: 'All Files', icon: <IconFiles size={14} /> },
  { id: 'image', label: 'Images', icon: <IconImage size={14} /> },
  { id: 'video', label: 'Videos', icon: <IconVideo size={14} /> },
  { id: 'audio', label: 'Audio', icon: <IconAudio size={14} /> },
  { id: 'pdf', label: 'PDFs', icon: <IconPdf size={14} /> },
];

function FilesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myFiles, loading, error } = useSelector((state) => state.files);

  const [activeType, setActiveType] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    dispatch(fetchMyFiles());
  }, [dispatch]);

  // Client-side filtering and sorting of user's loaded library
  const processedFiles = useMemo(() => {
    let result = [...myFiles];

    // Filter by type
    if (activeType !== 'all') {
      result = result.filter((f) => f.fileType === activeType);
    }

    // Filter by search query (name or tags)
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim();
      result = result.filter(
        (f) =>
          f.originalName?.toLowerCase().includes(q) ||
          f.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'views':
          return (b.viewCount || 0) - (a.viewCount || 0);
        case 'name_asc':
          return (a.originalName || '').localeCompare(b.originalName || '');
        case 'name_desc':
          return (b.originalName || '').localeCompare(a.originalName || '');
        case 'size_desc':
          return (b.size || 0) - (a.size || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [myFiles, activeType, searchFilter, sortBy]);

  return (
    <div className="files-page">
      {/* Page Header */}
      <div className="files-page__header">
        <div className="header-info">
          <h1>My Media Files</h1>
          <p>
            Browse, filter, preview, download, and organize all your uploaded multimedia.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<IconUpload size={16} />}
          onClick={() => navigate('/upload')}
        >
          Upload New File
        </Button>
      </div>

      {/* Toolbar */}
      <div className="files-page__toolbar">
        {/* Search within files */}
        <div className="files-page__search">
          <IconSearch size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Filter files by name or tag..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>

        {/* Category Filter Pills */}
        <div className="files-page__filters">
          {FILTER_TYPES.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`files-page__filter-pill ${
                activeType === filter.id ? 'files-page__filter-pill--active' : ''
              }`}
              onClick={() => setActiveType(filter.id)}
            >
              {filter.icon}
              {filter.label}
            </button>
          ))}
        </div>

        {/* Sort and View Mode */}
        <div className="files-page__actions">
          <select
            className="files-page__sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort files by"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="views">Sort: Most Viewed</option>
            <option value="name_asc">Sort: Name (A to Z)</option>
            <option value="name_desc">Sort: Name (Z to A)</option>
            <option value="size_desc">Sort: Largest Size</option>
          </select>

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
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="alert alert--error">
          <span>Unable to load files: {error}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(fetchMyFiles())}
            style={{ marginLeft: 'auto' }}
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Content Area */}
      {loading && myFiles.length === 0 ? (
        <LoadingSkeleton count={viewMode === 'grid' ? 8 : 6} variant={viewMode === 'grid' ? 'card' : 'table'} />
      ) : processedFiles.length === 0 ? (
        <EmptyState
          icon={<IconFiles size={32} />}
          title={searchFilter || activeType !== 'all' ? 'No matching files found' : 'No files in your library'}
          message={
            searchFilter || activeType !== 'all'
              ? 'Try changing your search term, clearing filters, or uploading a new file.'
              : 'You have not uploaded any files yet. Get started by uploading images, videos, audio, or PDFs.'
          }
          action={
            searchFilter || activeType !== 'all' ? (
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setSearchFilter('');
                  setActiveType('all');
                }}
              >
                Clear Filters
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                icon={<IconUpload size={16} />}
                onClick={() => navigate('/upload')}
              >
                Upload File
              </Button>
            )
          }
        />
      ) : (
        <>
          <div style={{ fontSize: '0.8125rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              Showing <strong>{processedFiles.length}</strong> of <strong>{myFiles.length}</strong> files
            </span>
          </div>

          {viewMode === 'grid' ? (
            <div className="file-grid">
              {processedFiles.map((file) => (
                <FileCard key={file._id} file={file} viewMode="grid" />
              ))}
            </div>
          ) : (
            <div className="file-list">
              {processedFiles.map((file) => (
                <FileCard key={file._id} file={file} viewMode="list" />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FilesPage;
