import { useNavigate } from 'react-router-dom';
import UploadForm from '../components/UploadForm';

function UploadPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Optional: user can stay to upload more or navigate
  };

  return (
    <div className="upload-page">
      <div className="upload-page__header">
        <h1>Upload Multimedia</h1>
        <p>
          Securely upload and index images, videos, audio clips, and PDF documents.
        </p>
      </div>

      <UploadForm onUploadSuccess={handleSuccess} />
    </div>
  );
}

export default UploadPage;
