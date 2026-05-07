import React from "react"
import { Container, Row, Col } from "reactstrap"

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid ={true}>
          <Row>
            <Col sm={6}>{new Date().getFullYear()} © Upzet.</Col>
            <Col sm={6}>
              <div className="text-sm-end d-none d-sm-block">
                Crafted with <i className="mdi mdi-heart text-danger"></i> by
                Themesdesign
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>

  );
}

export default Footer;

// import React from "react";
// import { Container, Row, Col } from "reactstrap";

// const Footer = () => {
//   return (
//     <React.Fragment>
//       <footer className="footer">
//         <Container fluid={true}>
//           <Row>
//             <Col sm={12} className="text-center">
//               {new Date().getFullYear()} © DriveLedger. All rights reserved.
//             </Col>
//           </Row>
//         </Container>
//       </footer>
//     </React.Fragment>
//   );
// };

// export default Footer;