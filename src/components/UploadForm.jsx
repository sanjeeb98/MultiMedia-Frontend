import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { uploadFile } from '../store/filesSlice';
import { showToast } from '../store/uiSlice';
import { validateFile, getFileTypeLabel } from '../utils/fileValidation';
import { formatFileSize } from '../utils/formatters';
import Button from './ui/Button';
import Badge from './ui/Badge';
import {
  IconUpload,
  IconClose,
  IconImage,
  IconVideo,
  IconAudio,
  IconPdf,
  IconCheck,
  IconWarning,
} from './ui/Icons';

const SUGGESTED_TAGS = ['presentation', 'nature', 'music', 'document', 'design', 'archive'];

function UploadForm({ onUploadSuccess = null }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uploading, uploadError } = useSelector((state) => state.files);

  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [uploadedSuccess, setUploadedSuccess] = useState(false);

  const handleFileSelection = (file) => {
    setValidationError(null);
    setUploadedSuccess(false);

    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setValidationError(error);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setSelectedFile(file);

    // Create object URL for client preview
    if (file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setValidationError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddTag = (tagToAdd) => {
    const clean = tagToAdd.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput('');
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput);
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setValidationError('Please select a file to upload.');
      return;
    }

    const tagsString = tags.join(',');
    const result = await dispatch(uploadFile({ file: selectedFile, tags: tagsString }));

    if (uploadFile.fulfilled.match(result)) {
      setUploadedSuccess(true);
      dispatch(showToast({ message: 'File uploaded successfully!', type: 'success' }));
      handleRemoveFile();
      setTags([]);

      if (onUploadSuccess) {
        onUploadSuccess(result.payload);
      }
    } else {
      dispatch(showToast({ message: result.payload || 'Upload failed', type: 'error' }));
    }
  };

  const getPreviewIcon = () => {
    if (!selectedFile) return '📁';
    if (selectedFile.type.startsWith('image/')) return <IconImage size={32} />;
    if (selectedFile.type.startsWith('video/')) return <IconVideo size={32} />;
    if (selectedFile.type.startsWith('audio/')) return <IconAudio size={32} />;
    if (selectedFile.type.includes('pdf')) return <IconPdf size={32} />;
    return '📁';
  };

  return (
    <div className="upload-page__card">
      {uploadedSuccess && (
        <div className="alert alert--success">
          <IconCheck size={18} />
          <div>
            <strong>Upload Successful!</strong> Your file has been processed and saved to your media library.
          </div>
        </div>
      )}

      {(validationError || uploadError) && (
        <div className="alert alert--error">
          <IconWarning size={18} />
          <div>{validationError || uploadError}</div>
        </div>
      )}

      {/* Drag & Drop Zone */}
      {!selectedFile ? (
        <div
          className={`upload-page__dropzone ${dragActive ? 'upload-page__dropzone--active' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,audio/*,.pdf"
            onChange={(e) => handleFileSelection(e.target.files?.[0])}
          />

          <div className="upload-icon-pulse">
            <IconUpload size={32} />
          </div>

          <div className="dropzone-prompt">
            <h3>Choose a file or drag & drop it here</h3>
            <p>JPEG, PNG, WebP, MP4, WebM, MP3, WAV, PDF up to 50MB</p>
          </div>

          <div className="supported-formats">
            <Badge variant="image" showIcon>Images</Badge>
            <Badge variant="video" showIcon>Videos</Badge>
            <Badge variant="audio" showIcon>Audio</Badge>
            <Badge variant="pdf" showIcon>PDF Docs</Badge>
          </div>

          <Button
            variant="outline"
            size="sm"
            style={{ marginTop: '0.5rem' }}
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            Browse Files
          </Button>
        </div>
      ) : (
        /* Staged File Preview Card */
        <div className="upload-page__staged-file">
          <div className="staged-preview">
            {previewUrl && selectedFile.type.startsWith('image/') ? (
              <img src={previewUrl} alt="Preview" />
            ) : (
              <div className="preview-type-icon">{getPreviewIcon()}</div>
            )}
          </div>

          <div className="staged-details">
            <div className="staged-name">{selectedFile.name}</div>
            <div className="staged-meta">
              <span>{formatFileSize(selectedFile.size)}</span>
              <span>•</span>
              <span>{selectedFile.type || 'Unknown MIME'}</span>
            </div>
          </div>

          <div className="staged-remove">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemoveFile}
              title="Remove selected file"
              aria-label="Remove selected file"
              disabled={uploading}
            >
              <IconClose size={18} />
            </Button>
          </div>
        </div>
      )}

      {/* Tags Input */}
      <div className="upload-page__tag-editor">
        <label htmlFor="tag-input-field" style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#94a3b8' }}>
          Tags (Optional - helps with keyword search)
        </label>

        <div className="tags-input-box">
          {tags.map((tag) => (
            <span key={tag} className="tag-item">
              #{tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                aria-label={`Remove tag ${tag}`}
                disabled={uploading}
              >
                ×
              </button>
            </span>
          ))}

          <input
            id="tag-input-field"
            type="text"
            placeholder={tags.length === 0 ? 'Type tag and press Enter or comma...' : 'Add another tag...'}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={() => {
              if (tagInput.trim()) handleAddTag(tagInput);
            }}
            disabled={uploading}
          />
        </div>

        <div className="tag-suggestions">
          <span>Suggestions:</span>
          {SUGGESTED_TAGS.map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => handleAddTag(sug)}
              disabled={tags.includes(sug) || uploading}
            >
              +{sug}
            </button>
          ))}
        </div>
      </div>

      {/* Upload Progress Bar (when uploading) */}
      {uploading && (
        <div className="upload-page__progress-wrapper">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '85%' }} />
          </div>
          <span className="progress-label">Uploading to Cloudinary & indexing metadata...</span>
        </div>
      )}

      {/* Footer Actions */}
      <div className="upload-page__footer-actions">
        {selectedFile && (
          <Button
            variant="outline"
            size="md"
            onClick={handleRemoveFile}
            disabled={uploading}
          >
            Cancel
          </Button>
        )}

        <Button
          variant="primary"
          size="md"
          loading={uploading}
          icon={<IconUpload size={16} />}
          disabled={!selectedFile || uploading}
          onClick={handleSubmit}
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </Button>
      </div>
    </div>
  );
}

export default UploadForm;
