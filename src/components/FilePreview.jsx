function FilePreview({ file }) {
  if (!file) return null;

  switch (file.fileType) {
    case 'image':
      return <img src={file.url} alt={file.originalName} />;
    case 'video':
      return <video src={file.url} controls />;
    case 'audio':
      return <audio src={file.url} controls />;
    case 'pdf':
      return <iframe src={file.url} title={file.originalName} />;
    default:
      return (
        <a href={file.url} target="_blank" rel="noreferrer" className="btn btn--primary">
          Open file
        </a>
      );
  }
}

export default FilePreview;
