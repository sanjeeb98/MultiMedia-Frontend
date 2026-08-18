import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchFiles } from '../store/filesSlice';
import { useDebounce } from '../hooks/useDebounce';
import FileCard from '../components/FileCard';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import {
  IconSearch,
  IconClose,
  IconGrid,
  IconList,
  IconSparkles,
  IconUpload,
  IconImage,
  IconVideo,
  IconAudio,
  IconPdf,
} from '../components/ui/Icons';

const QUICK_SUGGESTIONS = ['nature', 'video', 'travel', 'document', 'sound', 'work', 'presentation'];

function SearchPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { searchResults, searchLoading, searchError } = useSelector((state) => state.files);

  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [fileType, setFileType] = useState(searchParams.get('type') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance');
  const [viewMode, setViewMode] = useState('grid');

  const debouncedQuery = useDebounce(query, 350);

  // Perform search
  const executeSearch = useCallback(
    (q, type, sort) => {
      dispatch(
        searchFiles({
          query: q,
          fileType: type || undefined,
          sortBy: sort || 'relevance',
        })
      );
    },
    [dispatch]
  );

  // Trigger search on debounced query, fileType, or sortBy change
  useEffect(() => {
    executeSearch(debouncedQuery, fileType, sortBy);

    // Sync URL query params without reloading
    const params = new URLSearchParams();
    if (debouncedQuery) params.set('q', debouncedQuery);
    if (fileType) params.set('type', fileType);
    if (sortBy && sortBy !== 'relevance') params.set('sort', sortBy);
    setSearchParams(params, { replace: true });
  }, [debouncedQuery, fileType, sortBy, executeSearch, setSearchParams]);

  // Sync if URL query param changes externally (e.g. from global search)
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery != null && urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

  const handleClear = () => {
    setQuery('');
  };

  const handleSuggestionClick = (keyword) => {
    setQuery(keyword);
  };

  return (
    <div className="search-page">
      {/* Hero Search Section */}
      <section className="search-page__hero">
        <div className="hero-heading">
          <h1>
            Multimedia <span>Relevance Search</span>
          </h1>
          <p>
            Find images, videos, audio, and documents indexed by filenames, metadata, and tags.
          </p>
        </div>

        <form
          className="hero-search-box"
          onSubmit={(e) => {
            e.preventDefault();
            executeSearch(query, fileType, sortBy);
          }}
        >
          <IconSearch size={22} className="search-icon-hero" />
          <input
            type="text"
            placeholder="Search files by name, tags, or keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button
              type="button"
              className="clear-btn-hero"
              onClick={handleClear}
              aria-label="Clear search input"
            >
              <IconClose size={18} />
            </button>
          )}
        </form>

        <div className="hero-suggestions">
          <span>Popular keywords:</span>
          {QUICK_SUGGESTIONS.map((word) => (
            <button
              key={word}
              type="button"
              onClick={() => handleSuggestionClick(word)}
            >
              {word}
            </button>
          ))}
        </div>
      </section>

      {/* Filter and Sort Toolbar */}
      <section className="search-page__controls">
        <div className="files-page__filters">
          <button
            type="button"
            className={`files-page__filter-pill ${
              fileType === '' ? 'files-page__filter-pill--active' : ''
            }`}
            onClick={() => setFileType('')}
          >
            All Types
          </button>
          <button
            type="button"
            className={`files-page__filter-pill ${
              fileType === 'image' ? 'files-page__filter-pill--active' : ''
            }`}
            onClick={() => setFileType('image')}
          >
            <IconImage size={14} /> Images
          </button>
          <button
            type="button"
            className={`files-page__filter-pill ${
              fileType === 'video' ? 'files-page__filter-pill--active' : ''
            }`}
            onClick={() => setFileType('video')}
          >
            <IconVideo size={14} /> Videos
          </button>
          <button
            type="button"
            className={`files-page__filter-pill ${
              fileType === 'audio' ? 'files-page__filter-pill--active' : ''
            }`}
            onClick={() => setFileType('audio')}
          >
            <IconAudio size={14} /> Audio
          </button>
          <button
            type="button"
            className={`files-page__filter-pill ${
              fileType === 'pdf' ? 'files-page__filter-pill--active' : ''
            }`}
            onClick={() => setFileType('pdf')}
          >
            <IconPdf size={14} /> PDFs
          </button>
        </div>

        <div className="files-page__actions">
          <select
            className="files-page__sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort search results"
          >
            <option value="relevance">Sort: Highest Relevance</option>
            <option value="views">Sort: Most Viewed</option>
            <option value="date">Sort: Newest First</option>
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
      </section>

      {/* Error state */}
      {searchError && (
        <div className="alert alert--error">
          <span>Search failed: {searchError}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => executeSearch(query, fileType, sortBy)}
            style={{ marginLeft: 'auto' }}
          >
            Retry Search
          </Button>
        </div>
      )}

      {/* Results Header */}
      {!searchLoading && (
        <div className="search-page__results-header">
          <div className="results-count">
            {query.trim() ? (
              <>
                Found <span>{searchResults.length}</span> result
                {searchResults.length !== 1 ? 's' : ''} for "
                <strong>{query}</strong>"
              </>
            ) : (
              <>
                Showing <span>{searchResults.length}</span> indexed asset
                {searchResults.length !== 1 ? 's' : ''}
              </>
            )}
          </div>

          <div className="relevance-hint">
            <IconSparkles size={14} style={{ color: '#818cf8' }} />
            <span>Ranked by keyword & tag relevance score</span>
          </div>
        </div>
      )}

      {/* Search Results List / Grid */}
      {searchLoading ? (
        <LoadingSkeleton
          count={viewMode === 'grid' ? 8 : 6}
          variant={viewMode === 'grid' ? 'card' : 'table'}
        />
      ) : searchResults.length === 0 ? (
        <EmptyState
          icon={<IconSearch size={32} />}
          title="No files matched your query"
          message={
            query.trim()
              ? `We couldn't find any files matching "${query}". Try searching with different keywords, tags, or remove active file type filters.`
              : 'No files found in your library. Upload new media files to start searching.'
          }
          action={
            query.trim() ? (
              <Button variant="outline" size="md" onClick={handleClear}>
                Clear Search Query
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                icon={<IconUpload size={16} />}
                onClick={() => navigate('/upload')}
              >
                Upload Media
              </Button>
            )
          }
        />
      ) : viewMode === 'grid' ? (
        <div className="file-grid">
          {searchResults.map((file) => (
            <FileCard key={file._id} file={file} viewMode="grid" />
          ))}
        </div>
      ) : (
        <div className="file-list">
          {searchResults.map((file) => (
            <FileCard key={file._id} file={file} viewMode="list" />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
