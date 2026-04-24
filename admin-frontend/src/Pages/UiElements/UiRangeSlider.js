import React, { useState } from "react";
import { Row, Col, Card, CardBody, CardTitle, Container } from "reactstrap";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";


const UiRangeSlider = () => {
    document.title = "Range Slider | Upzet - React Admin & Dashboard Template";

    const [value, setValue] = useState(50);

  const handleSliderChange = (newValue) => {
    setValue(newValue);
  };

  const [range, setRange] = useState([30, 90]);

  const handleSliderChange1 = (value) => {
    // Ensure the value is an array (range slider case)
    if (Array.isArray(value)) {
      const [start, end] = value;
      // Clamp the values within the range [30, 90]
      setRange([Math.max(start, 30), Math.min(end, 90)]);
    }
  };

    return (
        <React.Fragment>

            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="UI Elements" breadcrumbItem="Range Slider" />

                    <Row>
                        <Col className="col-12">
                            <Card>
                                <CardBody>
                                    <CardTitle>React Rangeslider</CardTitle>
                                    <Row>
                                        <Col md={6}>
                                            <div className="p-3">
                                                <h5 className="font-size-14 mb-3 mt-0">Default</h5>
                                                <span className="float-left mt-4">0 -</span>{" "}
                                                <span className="float-right  mt-4">100</span>
                                                <Slider
                          min={0}
                          max={100}
                          value={value}
                          onChange={handleSliderChange}
                          trackStyle={{ backgroundColor: "#0576b9", height: 5 }}
                          handleStyle={{
                            borderColor: "#0576b9",
                            height: 20,
                            width: 20,
                            marginTop: -8,
                            backgroundColor: "#0576b9",
                          }}
                          railStyle={{ backgroundColor: "#d7dada", height: 5 }}
                        />
                                            </div>
                                        </Col>

                                        <Col md={6}>
                                            <div className="p-3">
                                                <h5 className="font-size-14 mb-3 mt-0">Min-Max</h5>
                                                <span className="float-left mt-4">30 -</span>{" "}
                                                <span className="float-right  mt-4">90</span>
                                                <Slider
                          // range={range}
                          min={100}
                          max={200}
                          value={range}
                          onChange={handleSliderChange1}
                          trackStyle={[
                            { backgroundColor: "#0576b9", height: 5 },
                          ]}
                          handleStyle={[
                            {
                              borderColor: "#0576b9",
                              height: 20,
                              width: 20,
                              marginTop: -8,
                              backgroundColor: "#0576b9",
                            },
                            {
                              borderColor: "#0576b9",
                              height: 20,
                              width: 20,
                              marginTop: -8,
                              backgroundColor: "#0576b9",
                            },
                          ]}
                          railStyle={{ backgroundColor: "#d7dada", height: 5 }}
                        />
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <div className="p-3">
                                                <h5 className="font-size-14 mb-3 mt-0">Prefix</h5>
                                                <span className="float-left mt-4">0 -</span>{" "}
                                                <span className="float-right  mt-4">100</span>
                                                <Slider
                          min={0}
                          max={100}
                          value={[30, 70]}
                          range={true}
                          onChange={handleSliderChange}
                          trackStyle={{ backgroundColor: "#0576b9", height: 5 }}
                          handleStyle={{
                            borderColor: "#0576b9",
                            height: 20,
                            width: 20,
                            marginTop: -8,
                            backgroundColor: "#0576b9",
                          }}
                          railStyle={{ backgroundColor: "#d7dada", height: 5 }}
                        />
                                            </div>
                                        </Col>

                                        <Col md={6}>
                                            <div className="p-3">
                                                <h5 className="font-size-14 mb-3 mt-0">Postfixes</h5>
                                                <span className="float-left mt-4">0 -</span>{" "}
                                                <span className="float-right  mt-4">100</span>
                                                <Slider
                          min={0}
                          max={100}
                          value={[20, 60]}
                          range={true}
                          onChange={handleSliderChange}
                          trackStyle={{ backgroundColor: "#0576b9", height: 5 }}
                          handleStyle={{
                            borderColor: "#0576b9",
                            height: 20,
                            width: 20,
                            marginTop: -8,
                            backgroundColor: "#0576b9",
                          }}
                          railStyle={{ backgroundColor: "#d7dada", height: 5 }}
                        />
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <div className="p-3">
                                                <h5 className="font-size-14 mb-3 mt-0">Step</h5>
                                                <span className="float-left mt-4">0 -</span>{" "}
                                                <span className="float-right mt-4">100</span>
                                                <Slider
                          min={0}
                          max={100}
                          value={10}
                          onChange={handleSliderChange}
                          trackStyle={{ backgroundColor: "#0576b9", height: 5 }}
                          handleStyle={{
                            borderColor: "#0576b9",
                            height: 20,
                            width: 20,
                            marginTop: -8,
                            backgroundColor: "#0576b9",
                          }}
                          railStyle={{ backgroundColor: "#d7dada", height: 5 }}
                        />
                                            </div>
                                        </Col>

                                        <Col md={6}>
                                            <div className="p-3">
                                                <h5 className="font-size-14 mb-3 mt-0">
                                                    Custom Values
                                                </h5>
                                                <Slider
                          min={0}
                          max={100}
                          marks={{
                            10: 10,
                            20: 20,
                            30: 30,
                            40: 40,
                            50: 50,
                            60: 60,
                            70: 70,
                            80: 80,
                            90: 90,
                            100: 100,
                          }}
                          reverse={true}
                          value={[20, 60]}
                          range={true}
                          onChange={handleSliderChange}
                          trackStyle={{ backgroundColor: "#0576b9", height: 5 }}
                          handleStyle={{
                            borderColor: "#0576b9",
                            height: 20,
                            width: 20,
                            marginTop: -8,
                            backgroundColor: "#0576b9",
                          }}
                          railStyle={{ backgroundColor: "#d7dada", height: 5 }}
                        />
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <div className="p-3">
                                                <h5 className="font-size-14 mb-3 mt-0">Reverse</h5>
                                                <Slider
                            min={0}
                            max={100}
                            marks={{
                              10: 10,
                              20: 20,
                              30: 30,
                              40: 40,
                              50: 50,
                              60: 60,
                              70: 70,
                              80: 80,
                              90: 90,
                              100: 100,
                            }}
                            reverse={true}
                            value={[20, 60]}
                            range={true}
                            onChange={handleSliderChange}
                            trackStyle={{ backgroundColor: "#0576b9", height: 5 }}
                            handleStyle={{
                              borderColor: "#0576b9",
                              height: 20,
                              width: 20,
                              marginTop: -8,
                              backgroundColor: "#0576b9",
                            }}
                            railStyle={{ backgroundColor: "#d7dada", height: 5 }}
                          />
                                            </div>
                                        </Col>

                                        <Col md={6}>
                                            <div className="p-3">
                                                <h5 className="font-size-14 mb-3 mt-0">
                                                    Extra Example
                                                </h5>
                                                <Slider
                          min={0}
                          max={100}
                          marks={{
                            10: "10%",
                            20: "20%",
                            30: "30%",
                            40: "40%",
                            50: "50%",
                            60: "60%",
                            70: "70%",
                            80: "80%",
                            90: "90%",
                            100: "100%",
                          }}
                          value={[20, 60]}
                          range={true}
                          onChange={handleSliderChange}
                          trackStyle={{ backgroundColor: "#0576b9", height: 5 }}
                          handleStyle={{
                            borderColor: "#0576b9",
                            height: 20,
                            width: 20,
                            marginTop: -8,
                            backgroundColor: "#0576b9",
                          }}
                          railStyle={{ backgroundColor: "#d7dada", height: 5 }}
                        />
                                            </div>
                                        </Col>
                                    </Row>

                                    
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default UiRangeSlider;
