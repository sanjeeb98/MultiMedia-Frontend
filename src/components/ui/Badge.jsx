import { IconImage, IconVideo, IconAudio, IconPdf } from './Icons';

const TYPE_ICONS = {
  image: <IconImage size={12} />,
  video: <IconVideo size={12} />,
  audio: <IconAudio size={12} />,
  pdf: <IconPdf size={12} />,
};

function Badge({ children, variant = 'default', showIcon = false, className = '' }) {
  const icon = showIcon ? TYPE_ICONS[variant] : null;

  return (
    <span className={`badge badge--${variant} ${className}`.trim()}>
      {icon}
      {children}
    </span>
  );
}

export default Badge;
