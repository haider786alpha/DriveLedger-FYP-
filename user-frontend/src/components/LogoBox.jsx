import { Link } from 'react-router-dom';
import logoSm from '@/assets/images/logo-sm.png';

const LogoBox = ({ containerClassName, squareLogo, textLogo }) => {
  return (
    <div className={containerClassName ?? ''}>
      <Link
        to="/"
        className="logo-dark"
        style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
      >
        <img
          src={logoSm}
          className={squareLogo?.className}
          height={squareLogo?.height ?? 30}
          width={squareLogo?.width ?? 19}
          alt="logo sm"
        />
        <span
          className={textLogo?.className}
          style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1f2937',
            letterSpacing: '0.3px',
          }}
        >
          DriveLedger
        </span>
      </Link>

      <Link
        to="/"
        className="logo-light"
        style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
      >
        <img
          src={logoSm}
          className={squareLogo?.className}
          height={squareLogo?.height ?? 30}
          width={squareLogo?.width ?? 19}
          alt="logo sm"
        />
        <span
          className={textLogo?.className}
          style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#ffffff',
            letterSpacing: '0.3px',
          }}
        >
          DriveLedger
        </span>
      </Link>
    </div>
  );
};

export default LogoBox;