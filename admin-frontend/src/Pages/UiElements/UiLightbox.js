import React, { useState } from "react";

import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Container,
} from "reactstrap";
import { Link } from "react-router-dom";

//Lightbox
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import ModalVideo from "react-modal-video";
import "react-modal-video/scss/modal-video.scss";

// import image
import img1 from "../../assets/images/small/img-1.jpg";
import img2 from "../../assets/images/small/img-2.jpg";
import img3 from "../../assets/images/small/img-3.jpg";
import img4 from "../../assets/images/small/img-4.jpg";
import img5 from "../../assets/images/small/img-5.jpg";
import img6 from "../../assets/images/small/img-6.jpg";
import img7 from "../../assets/images/small/img-7.jpg";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const images = [img1, img2, img3, img4, img5, img6];
const imageZoom = [img3, img7];

const UiLightbox = () => {
  document.title = "Lightbox | Upzet - React Admin & Dashboard Template";

  const [photoIndex, setphotoIndex] = useState(0);
  const [isFits, setisFits] = useState(false);
  const [isEffects, setisEffects] = useState(false);
  const [isGallery, setisGallery] = useState(false);
  const [isGalleryZoom, setisGalleryZoom] = useState(false);
  const [isOpen, setisOpen] = useState(false);
  const [isOpen1, setisOpen1] = useState(false);
  const [modal, setmodal] = useState(false);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="UI Elements" breadcrumbItem="Lightbox" />

          {isFits ? (
            <Lightbox
              open={isFits}
              close={() => setisFits(!isFits)}
              index={photoIndex}
              slides={images.map((image) => ({ src: image }))}
            />
          ) : null}

          {isEffects ? (
            <Lightbox
              open={isEffects}
              close={() => setisEffects(!isEffects)}
              index={photoIndex}
              slides={images.map((image) => ({ src: image }))}
            />
          ) : null}

          {isGallery ? (
            <Lightbox
              open={isGallery}
              close={() => setisGallery(false)}
              index={photoIndex}
              slides={images.map((image) => ({ src: image }))}
            />
          ) : null}

          {isGalleryZoom ? (
            <Lightbox
              open={isGalleryZoom}
              close={() => setisGalleryZoom(false)}
              index={photoIndex}
              slides={imageZoom.map((image) => ({ src: image }))}
            />
          ) : null}

          <Row>
            <Col lg={6}>
              <Card>
                <CardBody>
                  <CardTitle>Single image lightbox</CardTitle>
                  <CardSubtitle className="mb-3">
                    Three simple popups with different scaling settings.
                  </CardSubtitle>
                  <Row>
                    <Col className="col-6">
                      <div>
                        <h5 className="mt-0 font-14 m-b-15">
                          Fits (Horz/Vert)
                        </h5>
                        <img
                          onClick={() => {
                            setisFits(true);
                          }}
                          className="img-fluid"
                          alt="Upzet"
                          src={img2}
                          width="145"
                        />
                      </div>
                    </Col>
                    <Col className="col-6">
                      <div>
                        <h5 className="mt-0 font-size-14">Effects</h5>
                        <img
                          onClick={() => {
                            setisEffects(true);
                          }}
                          className="img-fluid"
                          alt=""
                          src={img3}
                          width="75"
                        />

                        <CardText className="mt-2 mb-0 text-muted">
                          No gaps, zoom animation, close icon in top-right
                          corner.
                        </CardText>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            <Col lg={6}>
              <Card>
                <CardBody>
                  <CardTitle>Lightbox gallery</CardTitle>
                  <CardSubtitle className="mb-3">
                    In this example lazy-loading of images is enabled for the
                    next image based on move direction.{" "}
                  </CardSubtitle>
                  <div className="popup-gallery d-flex flex-wrap">
                    <div className="img-fluid float-left">
                      <img
                        src={img1}
                        onClick={() => {
                          setisGallery(true);
                          setphotoIndex(0);
                        }}
                        alt=""
                        width="120"
                      />
                    </div>
                    <div className="img-fluid float-left">
                      <img
                        src={img2}
                        onClick={() => {
                          setisGallery(true);
                          setphotoIndex(1);
                        }}
                        alt=""
                        width="120"
                      />
                    </div>
                    <div className="img-fluid float-left">
                      <img
                        src={img3}
                        onClick={() => {
                          setisGallery(true);
                          setphotoIndex(2);
                        }}
                        alt=""
                        width="120"
                      />
                    </div>
                    <div className="img-fluid float-left">
                      <img
                        src={img4}
                        onClick={() => {
                          setisGallery(true);
                          setphotoIndex(3);
                        }}
                        alt=""
                        width="120"
                      />
                    </div>
                    <div className="img-fluid float-left">
                      <img
                        src={img5}
                        onClick={() => {
                          setisGallery(true);
                          setphotoIndex(4);
                        }}
                        alt=""
                        width="120"
                      />
                    </div>
                    <div className="img-fluid float-left">
                      <img
                        src={img6}
                        onClick={() => {
                          setisGallery(true);
                          setphotoIndex(5);
                        }}
                        alt=""
                        width="120"
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Card>
                <CardBody>
                  <CardTitle>Zoom Gallery</CardTitle>
                  <CardSubtitle className="mb-3">
                    Zoom effect works only with images.
                  </CardSubtitle>

                  <div className="zoom-gallery">
                    <img
                      src={img3}
                      className="float-left"
                      onClick={() => {
                        setisGalleryZoom(true);
                        setphotoIndex(0);
                      }}
                      alt=""
                      width="275"
                    />
                    <img
                      src={img7}
                      className="float-left"
                      onClick={() => {
                        setisGalleryZoom(true);
                        setphotoIndex(1);
                      }}
                      alt=""
                      width="275"
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col lg={6}>
              <Card>
                <CardBody>
                  <CardTitle>Popup with video or map</CardTitle>
                  <CardSubtitle className="mb-3">
                    In this example lazy-loading of images is enabled for the
                    next image based on move direction.{" "}
                  </CardSubtitle>

                  <Row>
                    <Col>
                      <Button
                        color="light"
                        className="btn"
                        onClick={() => {
                          setisOpen(!isOpen);
                        }}
                      >
                        Open Youtube Video
                      </Button>{" "}
                      <Button
                        color="light"
                        className="btn"
                        onClick={() => {
                          setisOpen1(!isOpen1);
                        }}
                      >
                        Open Vimeo Video
                      </Button>{" "}
                      <Button
                        color="light"
                        className="popup-gmaps btn btn-light"
                        href="https://maps.google.com/maps?q=221B+Baker+Street,+London,+United+Kingdom&amp;hl=en&amp;t=v&amp;hnear=221B+Baker+St,+London+NW1+6XE,+United+Kingdom"
                      >
                        Open Google Map
                      </Button>{" "}
                      <ModalVideo
                        videoId="L61p2uyiMSo"
                        channel="youtube"
                        isOpen={isOpen}
                        onClose={() => {
                          setisOpen(!isOpen);
                        }}
                      />
                      <ModalVideo
                        videoId="L61p2uyiMSo"
                        channel="youtube"
                        isOpen={isOpen1}
                        onClose={() => {
                          setisOpen1(false);
                        }}
                      />
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <CardTitle className="mb-4">Popup with form</CardTitle>
                  <div>
                    <Link
                      onClick={() => {
                        setmodal(!modal);
                      }}
                      to="#"
                      className="popup-form btn btn-primary"
                    >
                      Popup form
                    </Link>
                  </div>

                  <Modal
                    size="lg"
                    isOpen={modal}
                    toggle={() => {
                      setmodal(!modal);
                    }}
                  >
                    <ModalHeader
                      toggle={() => {
                        setmodal(!modal);
                      }}
                    >
                      Form
                    </ModalHeader>
                    <ModalBody>
                      <form>
                        <Row>
                          <Col lg={4}>
                            <div className="mb-3">
                              <label htmlFor="name">Name</label>
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Enter Name"
                              />
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div className="mb-3">
                              <label htmlFor="email">Email</label>
                              <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter Email"
                              />
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div className="mb-3">
                              <label htmlFor="password">Password</label>
                              <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter Password"
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={12}>
                            <div className="mb-3">
                              <label htmlFor="subject">Subject</label>
                              <textarea
                                className="form-control"
                                id="subject"
                                rows="3"
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={12}>
                            <div className="text-end">
                              <button type="submit" className="btn btn-primary">
                                Submit
                              </button>
                            </div>
                          </Col>
                        </Row>
                      </form>
                    </ModalBody>
                  </Modal>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UiLightbox;
