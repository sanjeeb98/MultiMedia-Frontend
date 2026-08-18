import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchFiles, fetchMyFiles, setSelectedFile, deleteFile } from '../store/filesSlice';
import FileCard from './FileCard';
import FilePreview from './FilePreview';

function SearchPanel() {
  const dispatch = useDispatch();
  const { files, loading, total, selectedFile } = useSelector((state) => state.files);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [fileType, setFileType] = useState('');

  useEffect(() => {
    dispatch(fetchMyFiles());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(searchFiles({ query, sortBy, fileType: fileType || undefined }));
  };

  const handleSelect = (file) => {
    dispatch(setSelectedFile(file));
  };

  const handleDelete = async () => {
    if (!selectedFile || !window.confirm('Delete this file?')) return;
    await dispatch(deleteFile(selectedFile._id));
  };

  return (
    <div className="panel">
      <h2>Search & Browse</h2>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name or tags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="relevance">Relevance</option>
          <option value="views">Most viewed</option>
          <option value="date">Newest</option>
        </select>
        <select value={fileType} onChange={(e) => setFileType(e.target.value)}>
          <option value="">All types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="audio">Audio</option>
          <option value="pdf">PDFs</option>
        </select>
        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {total > 0 && (
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
          {total} result{total !== 1 ? 's' : ''}
        </p>
      )}

      {loading ? (
        <div className="empty-state">Loading...</div>
      ) : files.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: '2.5rem' }}>📂</div>
          <p>No files yet. Upload something to get started.</p>
        </div>
      ) : (
        <div className="file-grid">
          {files.map((file) => (
            <FileCard key={file._id} file={file} onClick={handleSelect} />
          ))}
        </div>
      )}

      {selectedFile && (
        <div className="preview-modal" onClick={() => dispatch(setSelectedFile(null))}>
          <div className="preview-modal__content" onClick={(e) => e.stopPropagation()}>
            <div className="preview-modal__header">
              <h3>{selectedFile.originalName}</h3>
              <button type="button" className="btn btn--ghost" onClick={() => dispatch(setSelectedFile(null))}>
                ✕
              </button>
            </div>
            <div className="preview-modal__media">
              <FilePreview file={selectedFile} />
            </div>
            <div className="preview-modal__stats">
              <span>Type: {selectedFile.fileType}</span>
              <span>Views: {selectedFile.viewCount}</span>
              <span>Size: {(selectedFile.size / 1024).toFixed(1)} KB</span>
            </div>
            {selectedFile.tags?.length > 0 && (
              <div className="file-card__tags" style={{ marginBottom: '1rem' }}>
                {selectedFile.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            )}
            <button type="button" className="btn btn--danger" onClick={handleDelete}>
              Delete file
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchPanel;
