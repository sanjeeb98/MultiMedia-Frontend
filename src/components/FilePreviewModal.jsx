import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearSelectedFile, deleteFile } from '../store/filesSlice';
import { showToast } from '../store/uiSlice';
import Modal from './ui/Modal';
import Badge from './ui/Badge';
import Button from './ui/Button';
import {
  IconTrash,
  IconDownload,
  IconCopy,
  IconExternalLink,
  IconImage,
  IconVideo,
  IconAudio,
  IconPdf,
  IconEye,
  IconCheck,
} from './ui/Icons';
import { formatFileSize, formatDateTime, getFileTypeLabel } from '../utils/formatters';

function FilePreviewModal() {
  const dispatch = useDispatch();
  const file = useSelector((state) => state.files.selectedFile);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!file) return null;

  const handleClose = () => {
    dispatch(clearSelectedFile());
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(file.url);
      setCopied(true);
      dispatch(showToast({ message: 'File link copied to clipboard!', type: 'success' }));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      dispatch(showToast({ message: 'Failed to copy link', type: 'error' }));
    }
  };

  const handleDownload = () => {
    // Open in new tab or trigger direct download
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.originalName || 'download';
    link.target = '_blank';
    link.rel = 'noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${file.originalName}"? This action cannot be undone.`)) {
      return;
    }
    setDeleting(true);
    const result = await dispatch(deleteFile(file._id));
    setDeleting(false);
    if (deleteFile.fulfilled.match(result)) {
      dispatch(showToast({ message: 'File deleted successfully', type: 'success' }));
      handleClose();
    } else {
      dispatch(showToast({ message: result.payload || 'Failed to delete file', type: 'error' }));
    }
  };

  const renderMedia = () => {
    switch (file.fileType) {
      case 'image':
        return <img src={file.url} alt={file.originalName} loading="lazy" />;
      case 'video':
        return (
          <video src={file.url} controls autoPlay playsInline>
            Your browser does not support the video tag.
          </video>
        );
      case 'audio':
        return (
          <div className="audio-player-wrapper">
            <div className="audio-disc">🎵</div>
            <audio src={file.url} controls autoPlay>
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      case 'pdf':
        return (
          <div className="pdf-viewer-wrapper">
            <iframe src={file.url} title={file.originalName} />
          </div>
        );
      default:
        return (
          <div className="empty-state">
            <p>Preview not available for this file type.</p>
            <Button
              variant="primary"
              size="sm"
              icon={<IconExternalLink size={14} />}
              onClick={() => window.open(file.url, '_blank')}
            >
              Open original file
            </Button>
          </div>
        );
    }
  };

  return (
    <Modal
      isOpen={!!file}
      onClose={handleClose}
      title={file.originalName}
      size="xl"
    >
      <div className="file-preview-layout">
        <div className="file-preview-layout__stage">{renderMedia()}</div>

        <div className="file-preview-layout__details">
          <div>
            <Badge variant={file.fileType} showIcon>
              {getFileTypeLabel(file.fileType)}
            </Badge>
          </div>

          <dl className="meta-list">
            <div className="meta-item">
              <dt>File Name</dt>
              <dd title={file.originalName}>{file.originalName}</dd>
            </div>
            <div className="meta-item">
              <dt>File Size</dt>
              <dd>{formatFileSize(file.size)}</dd>
            </div>
            <div className="meta-item">
              <dt>MIME Type</dt>
              <dd>{file.mimeType || '—'}</dd>
            </div>
            <div className="meta-item">
              <dt>Views</dt>
              <dd style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <IconEye size={14} /> {file.viewCount || 0}
              </dd>
            </div>
            <div className="meta-item">
              <dt>Uploaded</dt>
              <dd>{formatDateTime(file.createdAt)}</dd>
            </div>
            {file.relevanceScore != null && (
              <div className="meta-item">
                <dt>Relevance</dt>
                <dd>
                  <span className="badge badge--score">{file.relevanceScore}</span>
                </dd>
              </div>
            )}
          </dl>

          {file.tags && file.tags.length > 0 && (
            <div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                Tags
              </span>
              <div className="tag-container">
                {file.tags.map((tag) => (
                  <span key={tag} className="tag-chip">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="action-stack">
            <Button
              variant="outline"
              size="md"
              fullWidth
              icon={copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
              onClick={handleCopyLink}
            >
              {copied ? 'Link Copied!' : 'Copy File Link'}
            </Button>

            <Button
              variant="secondary"
              size="md"
              fullWidth
              icon={<IconDownload size={16} />}
              onClick={handleDownload}
            >
              Download
            </Button>

            <Button
              variant="danger-ghost"
              size="md"
              fullWidth
              loading={deleting}
              icon={<IconTrash size={16} />}
              onClick={handleDelete}
            >
              Delete File
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default FilePreviewModal;
