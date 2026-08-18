import { useDispatch } from 'react-redux';
import { setSelectedFile, deleteFile } from '../store/filesSlice';
import { showToast } from '../store/uiSlice';
import Badge from './ui/Badge';
import Button from './ui/Button';
import {
  IconEye,
  IconDownload,
  IconTrash,
  IconImage,
  IconVideo,
  IconAudio,
  IconPdf,
} from './ui/Icons';
import { formatFileSize, formatDate, getFileTypeLabel } from '../utils/formatters';

const TYPE_ICONS = {
  image: <IconImage size={28} />,
  video: <IconVideo size={28} />,
  audio: <IconAudio size={28} />,
  pdf: <IconPdf size={28} />,
};

function FileCard({ file, viewMode = 'grid' }) {
  const dispatch = useDispatch();

  const handlePreview = (e) => {
    e.stopPropagation();
    dispatch(setSelectedFile(file));
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.originalName || 'download';
    link.target = '_blank';
    link.rel = 'noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${file.originalName}"?`)) return;
    const res = await dispatch(deleteFile(file._id));
    if (deleteFile.fulfilled.match(res)) {
      dispatch(showToast({ message: 'File deleted successfully', type: 'success' }));
    } else {
      dispatch(showToast({ message: res.payload || 'Failed to delete file', type: 'error' }));
    }
  };

  if (viewMode === 'list') {
    return (
      <article className="file-card-list" onClick={handlePreview}>
        <div className="file-card-list__thumb">
          {file.fileType === 'image' ? (
            <img src={file.url} alt={file.originalName} loading="lazy" />
          ) : (
            <span className="file-type-icon">{TYPE_ICONS[file.fileType] || '📁'}</span>
          )}
        </div>

        <div className="file-card-list__main">
          <div className="file-name" title={file.originalName}>
            {file.originalName}
          </div>
          {file.tags && file.tags.length > 0 && (
            <div className="file-tags">
              {file.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="tag-chip">
                  #{tag}
                </span>
              ))}
              {file.tags.length > 3 && (
                <span className="tag-chip">+{file.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>

        <div className="file-card-list__type">
          <Badge variant={file.fileType} showIcon>
            {getFileTypeLabel(file.fileType)}
          </Badge>
        </div>

        <div className="file-card-list__size">{formatFileSize(file.size)}</div>

        <div className="file-card-list__views" title="Total views">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <IconEye size={13} /> {file.viewCount || 0}
          </span>
        </div>

        <div className="file-card-list__date">{formatDate(file.createdAt)}</div>

        {file.relevanceScore != null && (
          <div className="file-card-list__score">
            <span className="badge badge--score" title="Relevance match score">
              {file.relevanceScore} pts
            </span>
          </div>
        )}

        <div className="file-card-list__actions">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePreview}
            title="Preview file"
            aria-label="Preview file"
          >
            <IconEye size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            title="Download file"
            aria-label="Download file"
          >
            <IconDownload size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            title="Delete file"
            aria-label="Delete file"
            style={{ color: '#ef4444' }}
          >
            <IconTrash size={16} />
          </Button>
        </div>
      </article>
    );
  }

  return (
    <article className="file-card-grid" onClick={handlePreview}>
      <div className="file-card-grid__thumb">
        <div className="file-card-grid__badge-pos">
          <Badge variant={file.fileType} showIcon>
            {getFileTypeLabel(file.fileType)}
          </Badge>
        </div>

        {file.fileType === 'image' ? (
          <img src={file.url} alt={file.originalName} loading="lazy" />
        ) : (
          <span className="file-type-icon">{TYPE_ICONS[file.fileType] || '📁'}</span>
        )}

        <div className="file-card-grid__overlay">
          <Button
            variant="secondary"
            size="sm"
            icon={<IconEye size={14} />}
            onClick={handlePreview}
          >
            Preview
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<IconDownload size={14} />}
            onClick={handleDownload}
          >
            Download
          </Button>
        </div>
      </div>

      <div className="file-card-grid__body">
        <div className="file-card-grid__name" title={file.originalName}>
          {file.originalName}
        </div>

        <div className="file-card-grid__meta">
          <span>{formatFileSize(file.size)}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <IconEye size={12} /> {file.viewCount || 0} views
          </span>
        </div>

        {file.tags && file.tags.length > 0 && (
          <div className="file-card-grid__tags">
            {file.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag-chip">
                #{tag}
              </span>
            ))}
            {file.tags.length > 3 && (
              <span className="tag-chip">+{file.tags.length - 3}</span>
            )}
          </div>
        )}

        {file.relevanceScore != null && (
          <div className="file-card-grid__score-row">
            <span>Relevance Match:</span>
            <span className="badge badge--score">{file.relevanceScore} pts</span>
          </div>
        )}
      </div>
    </article>
  );
}

export default FileCard;
