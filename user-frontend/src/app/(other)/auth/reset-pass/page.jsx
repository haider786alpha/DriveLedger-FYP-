// import { Link } from 'react-router-dom';
// import { Card, CardBody, Col, Row } from 'react-bootstrap';
// import LogoBox from '@/components/LogoBox';
// import PageMetaData from '@/components/PageTitle';
// import ResetPassForm from './components/ResetPassForm';
// import signInImg from '@/assets/images/sign-in.svg';
// const ResetPassword = () => {
//   return <>
//       <PageMetaData title="Reset Password" />

//       <Card className="auth-card">
//         <CardBody className="p-0">
//           <Row className="align-items-center g-0">
//             <Col lg={6} className="d-none d-lg-inline-block border-end">
//               <div className="auth-page-sidebar">
//                 <img src={signInImg} width={521} height={521} alt="auth" className="img-fluid" />
//               </div>
//             </Col>
//             <Col lg={6}>
//               <div className="p-4">
//                 <LogoBox textLogo={{
//                 height: 24,
//                 width: 73
//               }} squareLogo={{
//                 className: 'me-1'
//               }} containerClassName="mx-auto mb-4 text-center auth-logo" />
//                 <h2 className="fw-bold text-center fs-18">Reset Password</h2>
//                 <p className="text-muted text-center mt-1 mb-4">
//                   Enter your email address and we&apos;ll send you an email with instructions to reset your password.
//                 </p>
//                 <Row className="justify-content-center">
//                   <Col xs={12} md={8}>
//                     <ResetPassForm />
//                   </Col>
//                 </Row>
//               </div>
//             </Col>
//           </Row>
//         </CardBody>
//       </Card>
//       <p className="text-white mb-0 text-center">
//         Back to
//         <Link to="/auth/sign-in" className="text-white fw-bold ms-1">
//           Sign In
//         </Link>
//       </p>
//     </>;
// };
// export default ResetPassword;

import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Col, Row } from "react-bootstrap";
import LogoBox from "@/components/LogoBox";
import PageMetaData from "@/components/PageTitle";
import { API_URL } from "@/helpers/apiConfig";
import signInImg from "@/assets/images/sign-in.svg";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    message: "",
  });

  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      alert("Please enter your username.");
      return;
    }

    if (!formData.email.trim()) {
      alert("Please enter your registered email.");
      return;
    }

    try {
      setSending(true);

      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        message:
          formData.message.trim() ||
          "I forgot my password. Please reset my account password.",
      };

      const res = await fetch(API_URL("/api/password-reset-requests/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.detail || "Failed to submit password reset request.");
      }

      alert("Password reset request submitted successfully. Please contact admin for your new password.");

      setFormData({
        username: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Reset password request error:", error);
      alert(error.message || "Failed to submit reset request.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <PageMetaData title="Reset Password Request" />

      <Card className="auth-card">
        <CardBody className="p-0">
          <Row className="align-items-center g-0">
            <Col lg={6} className="d-none d-lg-inline-block border-end">
              <div className="auth-page-sidebar">
                <img
                  src={signInImg}
                  width={521}
                  height={521}
                  alt="reset password"
                  className="img-fluid"
                />
              </div>
            </Col>

            <Col lg={6}>
              <div className="p-4">
                <div className="mx-auto mb-4 text-center auth-logo">
                  <LogoBox
                    textLogo={{
                      height: 24,
                      width: 73,
                    }}
                    squareLogo={{
                      className: "me-1",
                    }}
                    containerClassName="mx-auto mb-4 text-center auth-logo"
                  />
                </div>

                <h2 className="fw-bold text-center fs-18">
                  Reset Password Request
                </h2>

                <p className="text-muted text-center mt-1 mb-4">
                  Enter your username and registered email. Admin will review your request and reset your password.
                </p>

                <Row className="justify-content-center">
                  <Col xs={12} md={8}>
                    <form onSubmit={handleSubmit} className="authentication-form">
                      <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                          type="text"
                          name="username"
                          className="form-control"
                          placeholder="Enter your username"
                          value={formData.username}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Registered Email</label>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder="Enter your registered email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Message</label>
                        <textarea
                          name="message"
                          className="form-control"
                          rows="4"
                          placeholder="Example: I forgot my password. Please reset it."
                          value={formData.message}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-1 text-center d-grid">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={sending}
                        >
                          {sending ? "Submitting..." : "Submit Reset Request"}
                        </button>
                      </div>
                    </form>

                    <p className="text-muted text-center mt-4 mb-0">
                      Remember your password?{" "}
                      <Link to="/auth/sign-in" className="fw-semibold">
                        Back to Sign In
                      </Link>
                    </p>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};

export default ResetPassword;