import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import PageMetaData from '@/components/PageTitle';
import LoginForm from './LoginForm';
import signInImg from '@/assets/images/sign-in.svg';

const SignIn = () => {
  return (
    <>
      <PageMetaData title="Driver Sign In" />

      <Card className="auth-card">
        <CardBody className="p-0">
          <Row className="align-items-center g-0">
            <Col lg={6} className="d-none d-lg-inline-block border-end">
              <div className="auth-page-sidebar">
                <img
                  src={signInImg}
                  width={521}
                  height={521}
                  alt="auth"
                  className="img-fluid"
                />
              </div>
            </Col>

            <Col lg={6}>
              <div className="p-4">
                <div className="text-center mb-4">
                  <Link to="/" className="driver-login-brand">
                    <span className="driver-login-brand-mark">
                      <IconifyIcon icon="mdi:routes" />
                    </span>

                    <span>
                      <strong>DriveEase</strong>
                      <small>Powered by DriveLedger</small>
                    </span>
                  </Link>
                </div>

                <div className="text-center mb-4">
                  <Link to="/" className="driver-login-back-link">
                    <IconifyIcon icon="mdi:arrow-left" />
                    Back to DriveEase Home
                  </Link>
                </div>

                <h2 className="fw-bold text-center fs-18">Driver Sign In</h2>

                <p className="text-muted text-center mt-1 mb-4">
                  Enter your username and password to access your driver panel.
                </p>

                <Row className="justify-content-center">
                  <Col xs={12} md={8}>
                    <LoginForm />
                  </Col>
                </Row>

                <p className="text-muted text-center mt-4 mb-0">
                  Driver account access is managed by the admin panel.
                </p>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <style>
        {`
          .driver-login-brand {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            padding: 12px 15px;
            border-radius: 20px;
            background:
              radial-gradient(circle at 96% 8%, rgba(37, 99, 235, 0.08), transparent 28%),
              linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
            border: 1px solid #dbeafe;
            box-shadow: 0 16px 34px rgba(15, 23, 42, 0.08);
            transition: all 0.18s ease;
          }

          .driver-login-brand:hover {
            transform: translateY(-1px);
          }

          .driver-login-brand-mark {
            width: 44px;
            height: 44px;
            min-width: 44px;
            border-radius: 16px;
            background:
              radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.82), transparent 30%),
              linear-gradient(135deg, #2563eb 0%, #4338ca 100%);
            color: #ffffff;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 23px;
            box-shadow: 0 14px 26px rgba(37, 99, 235, 0.22);
          }

          .driver-login-brand-mark svg,
          .driver-login-back-link svg {
            width: 1em;
            height: 1em;
            display: block;
          }

          .driver-login-brand strong {
            display: block;
            color: #0f172a;
            font-size: 20px;
            font-weight: 950;
            line-height: 1;
            letter-spacing: -0.045em;
          }

          .driver-login-brand small {
            display: block;
            margin-top: 5px;
            color: #64748b;
            font-size: 11.5px;
            font-weight: 800;
          }

          .driver-login-back-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            padding: 9px 13px;
            border-radius: 999px;
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            color: #1d4ed8;
            font-size: 12px;
            font-weight: 900;
            text-decoration: none;
            transition: all 0.18s ease;
          }

          .driver-login-back-link:hover {
            color: #1d4ed8;
            background: #dbeafe;
            transform: translateY(-1px);
          }

          @media (max-width: 576px) {
            .driver-login-brand {
              padding: 11px 13px;
              border-radius: 18px;
            }

            .driver-login-brand-mark {
              width: 40px;
              height: 40px;
              min-width: 40px;
              border-radius: 14px;
              font-size: 21px;
            }

            .driver-login-brand strong {
              font-size: 18px;
            }

            .driver-login-brand small {
              font-size: 10.5px;
            }
          }
        `}
      </style>
    </>
  );
};

export default SignIn;