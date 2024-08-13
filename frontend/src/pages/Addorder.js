import React, { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "./../AuthContext";
import { useNavigate } from "react-router-dom";

import DropFileInput from "./../customs/react-drop-file-input/DropFileInput";

function Addorder() {
  const btnRef1 = useRef(null);
  const btnRef2 = useRef(null);

  const navigate = useNavigate();
  const { userID } = useContext(AuthContext);
  let userId = userID;

  const [selectedFiles, setSelectedFiles] = useState([]);

  const [emptyAttributes, setEmptyAttributes] = useState([]);

  useEffect(() => {
    const verifuserexistance = () => {
      if (userId) {
        axios
          .get(`https://hchaichi-bmqq.vercel.app/product/userexists/${userId}`)
          .then((response) => {
            if (response.data.success) {
              if (userId) {
                axios
                  .get(
                    `https://hchaichi-bmqq.vercel.app/product/userorderverif/${userId}`
                  )
                  .then((response) => {
                    if (response.data.success) {
                      const emptyKeys = response.data.emptyAttributes;
                      setEmptyAttributes(emptyKeys);
                      /* 
                            if(emptyKeys.length == 0){
                                setCurrentStep(currentStep + 1); 
                            } */
                    }
                    /*             else{
                            setCurrentStep(currentStep + 1);
                        } */
                  })
                  .catch((error) => {
                    console.error(
                      "There was an error fetching your data!",
                      error
                    );
                  });
              }
              if (userID && !response.data.userExists) {
                navigate(`/`, { replace: true });
              } else if (!userID) {
                navigate(`/`, { replace: true });
              }
            } else {
              console.error("Failed to verify user existence.");
              navigate(`/`, { replace: true });
            }
          })
          .catch((error) => {
            console.error("There was an error fetching your data!", error);
          });
      }
    };

    verifuserexistance();
  }, []);

  const [quantity, setQuantity] = useState(1);
  const [orderData, setorderData] = useState(null);
  const [VatShape, setVatShape] = useState("");
  const [VatMaterial, setVatMaterial] = useState("");
  const [thicknessinvoice, setthicknessinvoice] = useState("");
  const [A_valueinvoice, setA_valueinvoice] = useState("");
  const [B_valueinvoice, setB_valueinvoice] = useState("");
  const [C_valueinvoice, setC_valueinvoice] = useState("");
  const [projectNameinvoice, setprojectNameinvoice] = useState("");
  const [shapeNameinvoice, setShapeNameinvoice] = useState("");
  const [OriginalShapeCostinvoice, setOriginalShapeCostinvoice] = useState("");
  const [DiscountedShapeCostinvoice, setDiscountedShapeCostinvoice] =
    useState("");
  const [DiscountShapeinvoice, setDiscountShapeinvoice] = useState("");
  const [DiscountShapeDTinvoice, setDiscountShapeDTinvoice] = useState("");
  const [materialNameinvoice, setmaterialNameinvoice] = useState("");
  const [OriginalMaterialCostinvoice, setOriginalMaterialCostinvoice] =
    useState("");
  const [materialinvoice, setmaterialinvoice] = useState("");
  const [materialTypeinvoice, setmaterialTypeinvoice] = useState("");
  const [DiscountedMaterialCostinvoice, setDiscountedMaterialCostinvoice] =
    useState("");
  const [DiscountMaterialinvoice, setDiscountMaterialinvoice] = useState("");
  const [DiscountMaterialDTinvoice, setDiscountMaterialDTinvoice] =
    useState("");
  const [NBAngleCutted, setNBAngleCuttedinvoice] = useState("");
  const [NBEdgeCuttedinvoice, setNBEdgeCuttedinvoice] = useState("");
  const [anglesList, setAnglesList] = useState([]);
  const [edgesList, setEdgesList] = useState([]);

  const alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  const [currentStep, setCurrentStep] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [shapes, setShapes] = useState([]);
  const [selectedShape, setSelectedShape] = useState({
    id: "",
    name: "",
    description: "",
    image: "",
    angleIMG: "",
    edgeIMG: "",
    minA: null,
    maxA: null,
    minB: null,
    maxB: null,
    minC: null,
    maxC: null,
    NB_Angle: 0,
  });
  const [formErrors, setFormErrors] = useState({
    A: "",
    B: "",
    C: "",
  });

  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState({
    id: "",
    name: "",
    description: "",
    image: "",
    material: "",
    thickness: null,
  });
  const [selectedThickness, setSelectedThickness] = useState("");
  const [thicknessOptions, setThicknessOptions] = useState([]);

  const [angles, setAngles] = useState([]);
  const [selectedAngleDescription, setSelectedDescription] = useState({
    description: "",
  });
  const [selectedValues, setSelectedValues] = useState([]);
  const handleAngleClick = (angle) => {
    setSelectedDescription({
      description: angle.Angledescription,
    });
  };
  const [angleDescription, setangleDescription] = useState([]);

  const [edges, setEdges] = useState([]);
  const [selectedEdgeDescription, setSelectedEdgeDescription] = useState({
    description: "",
  });
  const [selectedEdgeValues, setSelectedEdgeValues] = useState([]);
  const handleEdgeClick = (edge) => {
    setSelectedEdgeDescription({
      description: edge.Edgedescription,
    });
  };
  const [edgeDescription, setedgeDescription] = useState([]);

  const steps = [
    "Create Project",
    "Shape",
    "Material",
    "Angle",
    "Edge",
    "Estimate",
    "Missing of information",
    "Completed",
  ];
  useEffect(() => {
    if (currentStep === 2) {
      axios
        .get("https://hchaichi-bmqq.vercel.app/product/order/shapes")
        .then((response) => {
          setShapes(response.data.shapes);
          /*                     Swal.fire({
                                            icon: 'success',
                                            title: 'shapes imported',
                                        }); */
        })
        .catch((error) => {
          console.error("There was an error fetching the shapes!", error);
        });
    }
    if (currentStep === 3) {
      axios
        .get("https://hchaichi-bmqq.vercel.app/product/order/materials")
        .then((response) => {
          setMaterials(response.data.materials);
          /*                                          Swal.fire({
                                            icon: 'success',
                                            title: 'Materials imported',
                                        }); */
        })
        .catch((error) => {
          console.error("There was an error fetching the materials!", error);
        });
    }
    if (currentStep === 4) {
      axios
        .get("https://hchaichi-bmqq.vercel.app/product/order/angles")
        .then((response) => {
          setAngles(response.data.angles);
          /*                     if (response.data.angles.length > 0) {
                        // Initialize selectedValues with the first angle and its first border radius
                        const initialValues = Array(selectedShape.NB_Angle).fill({
                            angleId: "none", //response.data.angles[0]._id,
                            borderRadius:  "none" //response.data.angles[0].border_radius[0]
                        });
                        setSelectedValues(initialValues);
                    } */
        })
        .catch((error) => {
          console.error("There was an error fetching the angles!", error);
        });
    }
    if (currentStep === 5) {
      axios
        .get("https://hchaichi-bmqq.vercel.app/product/order/edges")
        .then((response) => {
          setEdges(response.data.edges);
        })
        .catch((error) => {
          console.error("There was an error fetching the edges!", error);
        });
    }
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 2 && window.jQuery && window.jQuery.fn.imgCheckbox) {
      window.jQuery("#checkbox_container img").imgCheckbox({
        checkMarkSize: "25px",
        fixedImageSize: "120px auto",
        styles: {
          "span.imgCheckbox": {
            cursor: "pointer",
            border: "1px solid rgb(204, 204, 204)",
            "border-radius": "10%",
            height: "100%",
            display: "flex",
            "align-item": "center",
            "justify-content": "center",
          },
          "span.imgCheckbox.imgChked": {
            border: "3px solid #1B84FF",
          },
          "span.imgCheckbox img": {
            padding: "10px",
          },
        },
        radio: true,
        addToForm: true,
        preselect: [0],
        onload: function () {
          if (shapes.length > 0) {
            // Set the first shape as the initial selection
            const firstShape = shapes[0];
            setSelectedShape({
              id: firstShape._id,
              name: firstShape.shapeName,
              description: firstShape.shapedescription,
              image: `https://hchaichi-bmqq.vercel.app/product/image/shape/${firstShape.avatarDimensionsImg}`,
              angleIMG: `https://hchaichi-bmqq.vercel.app/product/image/shape/${firstShape.avatarAnglesImg}`,
              edgeIMG: `https://hchaichi-bmqq.vercel.app/product/image/shape/${firstShape.avatarEdgeImg}`,
              minA: firstShape.minA,
              maxA: firstShape.maxA,
              minB: firstShape.minB,
              maxB: firstShape.maxB,
              minC: firstShape.minC,
              maxC: firstShape.maxC,
              NB_Angle: firstShape.NB_Angle,
            });
          }
        },
        onclick: function (el) {
          setErrorMessage("");
          setFormErrors({});
          const aValue = document.querySelector('input[name="A_value"]');
          const bValue = document.querySelector('input[name="B_value"]');
          const cValue = document.querySelector('input[name="C_value"]');
          if (aValue) {
            aValue.value = "";
          }
          if (bValue) {
            bValue.value = "";
          }
          if (cValue) {
            cValue.value = "";
          }
        },
      });
    }

    if (currentStep === 3 && window.jQuery && window.jQuery.fn.imgCheckbox) {
      window.jQuery("#checkbox_container_MT img").imgCheckbox({
        checkMarkSize: "25px",
        fixedImageSize: "160px auto",
        styles: {
          "span.imgCheckbox.imgChked": {
            border: "3px solid #1B84FF",
          },
          "span.imgCheckbox": {
            cursor: "pointer",
            border: "1px solid rgb(204, 204, 204)",
            "border-radius": "10%",
            width: "100%",
            height: "auto",
            display: "flex",
            "align-item": "center",
            "justify-content": "center",
          },
          "span.imgCheckbox img": {
            padding: "10px",
            width: "100%",
            height: "auto",
          },
        },
        radio: true,
        addToForm: true,
        preselect: [0],
        onload: function () {
          if (materials.length > 0) {
            // Set the first Material as the initial selection
            const fistmaterial = materials[0];
            setSelectedMaterial({
              id: fistmaterial._id,
              name: fistmaterial.material_name,
              description: fistmaterial.materialdescription,
              image: `https://hchaichi-bmqq.vercel.app/product/image/material/${fistmaterial.avatarMaterial}`,
              material: fistmaterial.material,
              thickness: fistmaterial.thickness,
            });
            setThicknessOptions(fistmaterial.thickness);
            setSelectedThickness(fistmaterial.thickness[0]);
          }
        },
        onclick: function (el) {
          /*                     setErrorMessage('');
                    setFormErrors({});
                    const aValue = document.querySelector('input[name="A_value"]');
                    const bValue = document.querySelector('input[name="B_value"]');
                    const cValue = document.querySelector('input[name="C_value"]');
                    if(aValue){
                        aValue.value=""
                    }
                    if(bValue){
                        bValue.value=""
                    }
                    if(cValue){
                        cValue.value=""
                    } */
        },
      });
    }
  }, [shapes, currentStep, materials]);

  const handlePrevious = () => {
    if (currentStep > 1) {
      if (currentStep == 5) {
        if (selectedShape.NB_Angle > 0) {
          setCurrentStep(currentStep - 1);
        } else {
          setCurrentStep(currentStep - 2);
        }
      } else if (
        currentStep == 6 &&
        selectedShape.id == "66afd9352c3b263fd9f3dc30"
      ) {
        setCurrentStep(currentStep - 3);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };
  const handleShapeClick = (shape) => {
    setSelectedShape({
      id: shape._id,
      name: shape.shapeName,
      description: shape.shapedescription,
      image: `https://hchaichi-bmqq.vercel.app/product/image/shape/${shape.avatarDimensionsImg}`,
      angleIMG: `https://hchaichi-bmqq.vercel.app/product/image/shape/${shape.avatarAnglesImg}`,
      edgeIMG: `https://hchaichi-bmqq.vercel.app/product/image/shape/${shape.avatarEdgeImg}`,
      minA: shape.minA,
      maxA: shape.maxA,
      minB: shape.minB,
      maxB: shape.maxB,
      minC: shape.minC,
      maxC: shape.maxC,
      NB_Angle: shape.NB_Angle,
    });
  };

  const handleMaterialClick = (material) => {
    setSelectedMaterial({
      id: material._id,
      name: material.material_name,
      description: material.materialdescription,
      image: `https://hchaichi-bmqq.vercel.app/product/image/material/${material.avatarMaterial}`,
      material: material.material,
      thickness: material.thickness,
    });
    setThicknessOptions(material.thickness);
    setSelectedThickness(material.thickness[0]);
  };

  const validateInputsStep2 = () => {
    const errors = {};

    const aValue = document.querySelector('input[name="A_value"]');
    const bValue = document.querySelector('input[name="B_value"]');
    const cValue = document.querySelector('input[name="C_value"]');

    if (aValue && (aValue.value === "" || aValue.value < selectedShape.minA)) {
      errors.A = `Value for A should be more than ${selectedShape.minA}.`;
    }
    if (aValue && selectedShape.maxA && aValue.value > selectedShape.maxA) {
      errors.A = `Value for A should be less than ${selectedShape.maxA}.`;
    }

    if (bValue && (bValue.value === "" || bValue.value < selectedShape.minB)) {
      errors.B = `Value for B should be more than ${selectedShape.minB}.`;
    }
    if (bValue && selectedShape.maxB && bValue.value > selectedShape.maxB) {
      errors.B = `Value for B should be less than ${selectedShape.maxB}.`;
    }

    if (cValue && (cValue.value === "" || cValue.value < selectedShape.minC)) {
      errors.C = `Value for C should be more than ${selectedShape.minC}.`;
    }
    if (cValue && selectedShape.maxC && cValue.value > selectedShape.maxC) {
      errors.C = `Value for C should be less than ${selectedShape.maxC}.`;
    }

    return errors;
  };

  const handleSelectChangeangle = (index, angleId, borderRadius) => {
    const updatedValues = [...selectedValues];
    updatedValues[index] = { angleId, borderRadius };
    setSelectedValues(updatedValues);
  };

  const handleSelectChangeedge = (index, edgeId) => {
    const updatedValues = [...selectedEdgeValues];
    updatedValues[index] = { edgeId };
    setSelectedEdgeValues(updatedValues);
  };

  const handleNext = () => {
    if (currentStep === 1 && !projectName.trim()) {
      setErrorMessage("Project name cannot be empty.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter the name of your cutting project.",
      });
    } else if (currentStep === 2) {
      const errors = validateInputsStep2();
      setErrorMessage("");
      setFormErrors({});
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      } else {
        setErrorMessage("");
        setFormErrors({});
        if (currentStep < 8) {
          setCurrentStep(currentStep + 1);
        }
      }
    } else if (currentStep === 5) {
      handleFormCostOrderSubmit();
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 6) {
      if (emptyAttributes.length > 0) {
        setCurrentStep(currentStep + 1);
      } else if (emptyAttributes.length == 0) {
        handleFormSubmit();
        setCurrentStep(currentStep + 2);
      }
    } else {
      setErrorMessage("");
      if (currentStep < 8) {
        if (currentStep == 3) {
          if (selectedShape.NB_Angle > 0) {
            setCurrentStep(currentStep + 1);
          } else {
            if (selectedShape.id == "66afd9352c3b263fd9f3dc30") {
              setCurrentStep(currentStep + 3);
              handleFormCostOrderSubmit();
            } else {
              setCurrentStep(currentStep + 2);
            }
          }
        } else {
          setCurrentStep(currentStep + 1);
        }
      }
    }
    /* else if (currentStep === 4) { handleFormCostOrderSubmit();setCurrentStep(currentStep + 1);} */
  };

  const handleFormCostOrderSubmit = async () => {
    const aValue = document.querySelector('input[name="A_value"]')?.value;
    const bValue = document.querySelector('input[name="B_value"]')?.value;
    const cValue = document.querySelector('input[name="C_value"]')?.value;

    const data = {
      projectName,
      shapeId: selectedShape.id,
      A_value: aValue,
      B_value: bValue,
      C_value: cValue,
      material: selectedMaterial.id,
      thickness: selectedThickness,
      angles: selectedValues,
      edges: selectedEdgeValues,
      /* edgeDescription:edgeDescription,
               angledescription:angleDescription, */
    };
    console.log(data);

    await axios
      .post("https://hchaichi-bmqq.vercel.app/product/orderprice", data, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        setorderData(response.data);
        setA_valueinvoice(response.data.A_value);
        setB_valueinvoice(response.data.B_value);
        setC_valueinvoice(response.data.C_value);
        setprojectNameinvoice(response.data.projectName);
        setShapeNameinvoice(response.data.shapeName);
        setOriginalShapeCostinvoice(response.data.OriginalShapeCost);
        setDiscountedShapeCostinvoice(response.data.DiscountedShapeCost);
        setDiscountShapeinvoice(response.data.DiscountShape);
        setDiscountShapeDTinvoice(response.data.DiscountShapeDT);
        setmaterialNameinvoice(response.data.materialName);
        setOriginalMaterialCostinvoice(response.data.OriginalMaterialCost);
        setmaterialinvoice(response.data.material);
        setmaterialTypeinvoice(response.data.materialType);
        setDiscountedMaterialCostinvoice(response.data.DiscountedMaterialCost);
        setDiscountMaterialinvoice(response.data.DiscountMaterial);
        setDiscountMaterialDTinvoice(response.data.DiscountMaterialDT);
        setNBAngleCuttedinvoice(response.data.NBAngleCutted);
        setNBEdgeCuttedinvoice(response.data.NBEdgeCutted);
        setAnglesList(response.data.angles);
        setEdgesList(response.data.edges);
        setthicknessinvoice(response.data.thickness);
        setVatShape(response.data.VatShape);
        setVatMaterial(response.data.VatMaterial);

        /*                 Swal.fire({
                    icon: 'success',
                    title: 'Order submitted successfully!',
                }); */
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "There was an error submitting your order. : " + error,
        });
        //console.error('There was an error submitting the order!', error);
      });
  };
  const handleChangeQuantity = (e) => {
    setQuantity(e.target.value);
  };

  const handleFormSubmit = () => {
    const middle = {
      ...orderData,
      quantity,
      edgeDescription,
      angleDescription,
      userId,
    };

    const formData = new FormData();
    formData.append("orderData", JSON.stringify(middle));

    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    axios
      .post(
        `https://hchaichi-bmqq.vercel.app/product/saveorderdata/${userId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      )
      .then((response) => {
        console.log(response.data);
        Swal.fire("Success", "Order saved successfully", "success");
      })
      .catch((error) => {
        console.error(error);
        Swal.fire("Error", "Failed to save order", "error");
      });
  };

  const onFileChange = (files) => {
    console.log(files);
    setSelectedFiles(files);
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <div
            className="stepper stepper-links d-flex flex-column pt-15"
            id="kt_stepper"
          >
            <div className="stepper-nav mb-5">
              {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isCurrent = currentStep === stepNumber;
                const isHidden =
                  index + 1 === 7 && emptyAttributes.length === 0;

                let displayText = `${stepNumber}. ${step}`;

                if (stepNumber === 7) {
                  displayText = `(${step})`;
                } else if (stepNumber === 8) {
                  displayText = `7. ${step}`;
                }

                return (
                  <div
                    key={index}
                    className={`stepper-item ${isCurrent ? "current" : ""} ${
                      isHidden ? "d-none" : ""
                    }`}
                    data-kt-stepper-element="nav"
                  >
                    <h3 className="stepper-title">{displayText}</h3>
                  </div>
                );
              })}
            </div>

            <form
              className="mx-auto mw-700px w-100 pt-15 pb-10"
              noValidate="novalidate"
              id="kt_form"
            >
              <div
                key="0"
                data-kt-stepper-element="content"
                className={`stepper-item ${currentStep === 1 ? "current" : ""}`}
              >
                <div className="w-100">
                  <div className="pb-8 pb-lg-15">
                    <h2 className="fw-bold d-flex align-items-center text-gray-900">
                      Name of your cutting project :
                    </h2>

                    <div className="text-muted fw-semibold fs-6">
                      Cutting materials:
                      <a href="/faq" className="link-primary fw-bold">
                        {" "}
                        how does it work?
                      </a>
                      .
                    </div>
                  </div>

                  <div className="mb-10 fv-row">
                    <label className="form-label mb-3">
                      Name of your cutting project
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg form-control-solid"
                      name="project_name"
                      placeholder="Project Name"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                    {errorMessage && (
                      <div className="text-danger mt-2">{errorMessage}</div>
                    )}
                  </div>
                </div>
              </div>

              <div
                key="1"
                data-kt-stepper-element="content"
                className={`stepper-item ${currentStep === 2 ? "current" : ""}`}
              >
                <div className="w-100">
                  <div className="pb-2 pb-lg-7">
                    <h2 className="fw-bold text-gray-900">Select your shape</h2>
                  </div>

                  <div className="row pb-10 pb-lg-15">
                    <div className="col-12 col-sm-6 pb-4">
                      <img
                        id="image_preview"
                        src={selectedShape.image}
                        alt="Selected Shape Preview"
                      />
                    </div>
                    <div id="descriptionshape" className="col-12 col-sm-6">
                      <h3>{selectedShape.name}</h3>
                      <p>{selectedShape.description}</p>
                    </div>
                  </div>

                  <div className="row pb-10 pb-lg-15">
                    <div className="col-12">
                      <div
                        id="checkbox_container"
                        className="checkbox_container row"
                      >
                        {shapes.map((shape) => (
                          <div className="col-6 col-sm-3 mb-9" key={shape._id}>
                            <img
                              className="image-checkbox"
                              src={`https://hchaichi-bmqq.vercel.app/product/image/shape/${shape.avatarShapeImg}`}
                              data-input="A"
                              alt={shape.shapeName}
                              data-shape-id={shape._id}
                              onClick={() => handleShapeClick(shape)}
                            />
                            <div
                              style={{
                                textAlign: "center",
                                marginBottom: "5px",
                                fontWeight: "bold",
                              }}
                            >
                              {shape.shapeName}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {selectedShape.id == "66afd9352c3b263fd9f3dc30" && (
                    <div className="row pb-10 pb-lg-15">
                      Warning: the uploading of file in estimate step
                    </div>
                  )}

                  <div className="pb-2 pb-lg-7">
                    <h2 className="fw-bold text-gray-900 required">
                      Dimensions:{" "}
                    </h2>
                  </div>

                  <div id="shapedimensions">
                    {selectedShape.minA || selectedShape.maxA ? (
                      <div className="fv-row  mb-5">
                        <div className="input-group group-A">
                          <input
                            type="number"
                            className="form-control form-control-lg form-control-solid"
                            placeholder="A"
                            aria-label="A"
                            aria-describedby="basic-addon1"
                            name="A_value"
                            min={selectedShape.minA || 1}
                            max={selectedShape.maxA || 10000000000000000}
                          />
                          <span className="input-group-text" id="basic-addon1">
                            cm
                          </span>
                        </div>
                      </div>
                    ) : null}

                    {selectedShape.minB || selectedShape.maxB ? (
                      <div className="fv-row mb-5">
                        <div className="input-group group-B">
                          <input
                            type="number"
                            className="form-control form-control-lg form-control-solid"
                            placeholder="B"
                            aria-label="B"
                            aria-describedby="basic-addon2"
                            name="B_value"
                            min={selectedShape.minB || 1}
                            max={selectedShape.maxB || 10000000000000000}
                          />
                          <span className="input-group-text" id="basic-addon2">
                            cm
                          </span>
                        </div>
                      </div>
                    ) : null}

                    {selectedShape.minC || selectedShape.maxC ? (
                      <div className="fv-row mb-5">
                        <div className="input-group group-C mb-5">
                          <input
                            type="number"
                            className="form-control form-control-lg form-control-solid"
                            placeholder="C"
                            aria-label="C"
                            aria-describedby="basic-addon3"
                            name="C_value"
                            min={selectedShape.minC || 1}
                            max={selectedShape.maxC || 10000000000000000}
                            defaultValue={5}
                          />
                          <span className="input-group-text" id="basic-addon3">
                            cm
                          </span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div
                key="2"
                data-kt-stepper-element="content"
                className={`stepper-item ${currentStep === 3 ? "current" : ""}`}
              >
                <div className="w-100">
                  <div className="pb-2 pb-lg-7">
                    <h2 className="fw-bold text-gray-900">
                      Select your material
                    </h2>
                  </div>

                  <div className="row pb-10 pb-lg-15">
                    <div className="col-12 col-sm-6 pb-4">
                      <img
                        id="image_preview"
                        src={selectedMaterial.image}
                        alt="Selected Shape Preview"
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                    <div id="descriptionmaterial" className="col-12 col-sm-6">
                      <h3>
                        {selectedMaterial.name +
                          " (" +
                          selectedMaterial.material +
                          ")"}
                      </h3>
                      <p>{selectedMaterial.description}</p>
                    </div>
                  </div>

                  <div className="row pb-10 pb-lg-15">
                    <div className="col-12">
                      <div
                        id="checkbox_container_MT"
                        className="checkbox_container row"
                      >
                        {materials.map((material) => (
                          <div
                            className="col-6 col-sm-3 mb-9"
                            key={material._id}
                          >
                            <img
                              className="image-checkbox"
                              src={`https://hchaichi-bmqq.vercel.app/product/image/material/${material.avatarMaterial}`}
                              alt={material.material_name}
                              onClick={() => handleMaterialClick(material)}
                            />
                            <div
                              style={{
                                textAlign: "center",
                                marginBottom: "5px",
                                fontWeight: "bold",
                              }}
                            >
                              {material.material_name}
                            </div>
                            <div
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                color: "#696969",
                                fontSize: "12px",
                              }}
                            >
                              {"( " + material.materialType + " )"}
                            </div>
                            <div
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                color: "#696969",
                              }}
                            >
                              {"( " + material.material + " )"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="fv-row mb-10">
                    <label className="form-label required">Thickness</label>
                    <select
                      name="material_thickness"
                      className="form-select form-select-lg form-select-solid"
                      data-placeholder="Select..."
                      onChange={(e) => setSelectedThickness(e.target.value)}
                    >
                      {thicknessOptions.map((thickness, index) => (
                        <option key={index} value={thickness}>
                          {thickness}mm
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div
                key="3"
                data-kt-stepper-element="content"
                className={`stepper-item ${currentStep === 4 ? "current" : ""}`}
              >
                <div className="w-100">
                  <div className="pb-10 pb-lg-15">
                    <h2 className="fw-bold text-gray-900">
                      Adjust your angles
                    </h2>
                    <div className="text-muted fw-semibold fs-6">
                      Angles :
                      <a href="#" className="text-primary fw-bold">
                        how to choose the right cut?
                      </a>
                      .
                    </div>
                  </div>

                  <div className="row pb-10 pb-lg-15">
                    <div className="col-6 mx-auto">
                      <img
                        id="image_preview"
                        src={selectedShape.angleIMG}
                        alt="Selected Shape Angles Preview"
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                  </div>

                  <div className="pb-2 pb-lg-7">
                    <h2 className="fw-bold text-gray-900">
                      List of type of cut:
                    </h2>
                  </div>

                  <div className="row pb-10 pb-lg-15">
                    <div
                      id="checkbox_container_A"
                      className="checkbox_container row"
                    >
                      {angles.map((angle) => (
                        <div className="col-6 col-sm-3 mb-9" key={angle._id}>
                          <img
                            className="image-checkbox"
                            src={`https://hchaichi-bmqq.vercel.app/product/image/angle/${angle.avatarAngle}`}
                            alt={angle.Angle_name}
                            onClick={() => handleAngleClick(angle)}
                          />
                          <div
                            style={{
                              textAlign: "center",
                              marginBottom: "5px",
                              fontWeight: "bold",
                            }}
                          >
                            {angle.Angle_name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pb-2 pb-lg-7">
                    <p
                      className="fw-bold text-gray-900"
                      style={{ fontSize: "16px" }}
                    >
                      {selectedAngleDescription.description}
                    </p>
                  </div>

                  <div className="pb-2 pb-lg-7">
                    <h2 className="fw-bold text-gray-900">
                      Specify a type of cut for each angle:
                    </h2>
                  </div>
                  {angles && Array.isArray(angles) && (
                    <div className="row">
                      {[...Array(selectedShape.NB_Angle)].map((_, index) => (
                        <div
                          className="col-6 input-group-container"
                          key={index}
                        >
                          <div className="fv-row mb-10">
                            <label className="form-label">
                              {alphabet[index]}
                            </label>
                            <select
                              name={`angle_${alphabet[index]}`}
                              className="form-select form-select-lg form-select-solid"
                              data-placeholder="Select..."
                              onChange={(e) => {
                                const selectedOption =
                                  e.target.options[e.target.selectedIndex];
                                handleSelectChangeangle(
                                  index,
                                  selectedOption.getAttribute("data-angle-id"),
                                  selectedOption.getAttribute(
                                    "data-border-radius"
                                  )
                                );
                              }}
                            >
                              <option
                                key={`${0}-${0}`}
                                data-angle-id={"none"}
                                data-border-radius={"none"}
                                value={"none"}
                              >
                                None
                              </option>
                              {angles.map((option, i) =>
                                option.border_radius.map((borderRadius, j) => (
                                  <option
                                    key={`${i + 1}-${j + 1}`}
                                    data-angle-id={option._id}
                                    data-border-radius={borderRadius}
                                    value={borderRadius}
                                  >
                                    {option.Angle_name}-{borderRadius} mm
                                  </option>
                                ))
                              )}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mb-2 fv-row">
                    <label className="form-label" htmlFor="floatingTextarea2">
                      Description
                    </label>

                    <div className="mb-2">
                      <textarea
                        className="form-control"
                        placeholder="Description"
                        name="angledescription"
                        id="floatingTextarea2"
                        style={{ height: "100px", borderRadius: "15px" }}
                        onChange={(e) => setangleDescription(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="text-muted fs-7">
                      Set a description to the angles for better visibility.
                    </div>
                  </div>
                </div>
              </div>

              <div
                key="4"
                data-kt-stepper-element="content"
                className={`stepper-item ${currentStep === 5 ? "current" : ""}`}
              >
                <div className="w-100">
                  <div className="pb-10 pb-lg-15">
                    <h2 className="fw-bold text-gray-900">Adjust your Edges</h2>
                    <div className="text-muted fw-semibold fs-6">
                      Edges :
                      <a href="#" className="text-primary fw-bold">
                        Specify a type of machining for each edge.
                      </a>
                      .
                    </div>
                  </div>

                  <div className="row pb-10 pb-lg-15">
                    <div className="col-6 mx-auto">
                      <img
                        id="image_preview"
                        src={selectedShape.edgeIMG}
                        alt="Selected Shape Edges Preview"
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                  </div>

                  <div className="pb-2 pb-lg-7">
                    <h2 className="fw-bold text-gray-900">
                      List of type of cut:
                    </h2>
                  </div>

                  <div className="row pb-10 pb-lg-15">
                    <div
                      id="checkbox_container_A"
                      className="checkbox_container row"
                    >
                      {edges.map((edge) => (
                        <div className="col-6 col-sm-3 mb-9" key={edge._id}>
                          <img
                            className="image-checkbox"
                            src={`https://hchaichi-bmqq.vercel.app/product/image/edge/${edge.avatarEdge}`}
                            alt={edge.Edge_name}
                            onClick={() => handleEdgeClick(edge)}
                          />
                          <div
                            style={{
                              textAlign: "center",
                              marginBottom: "5px",
                              fontWeight: "bold",
                            }}
                          >
                            {edge.Edge_name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pb-2 pb-lg-7">
                    <p
                      className="fw-bold text-gray-900"
                      style={{ fontSize: "16px" }}
                    >
                      {selectedEdgeDescription.description}
                    </p>
                  </div>

                  <div className="pb-2 pb-lg-7">
                    <h2 className="fw-bold text-gray-900">
                      Specify a type of cut for each angle:
                    </h2>
                  </div>
                  {edges && Array.isArray(edges) && (
                    <div className="row">
                      {[...Array(selectedShape.NB_Angle)].map((_, index) => (
                        <div
                          className="col-6 input-group-container"
                          key={index}
                        >
                          <div className="fv-row mb-10">
                            <label className="form-label">
                              {alphabet[index]}
                            </label>
                            <select
                              name={`edge_${alphabet[index]}`}
                              className="form-select form-select-lg form-select-solid"
                              data-placeholder="Select..."
                              onChange={(e) => {
                                const selectedOption =
                                  e.target.options[e.target.selectedIndex];
                                handleSelectChangeedge(
                                  index,
                                  selectedOption.getAttribute("data-edge-id")
                                );
                              }}
                            >
                              <option
                                key={`${0}`}
                                data-edge-id={"none"}
                                value={"none"}
                              >
                                None
                              </option>
                              {edges.map((option, i) => (
                                <option
                                  key={`${i + 1}`}
                                  data-edge-id={option._id}
                                  value={option._id}
                                >
                                  {option.Edge_name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mb-2 fv-row">
                    <label className="form-label" htmlFor="floatingTextarea2">
                      Description
                    </label>

                    <div className="mb-2">
                      <textarea
                        className="form-control"
                        placeholder="Description"
                        name="edgedescription"
                        id="floatingTextarea2"
                        style={{ height: "100px", borderRadius: "15px" }}
                        onChange={(e) => setedgeDescription(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="text-muted fs-7">
                      Set a description to the angles for better visibility.
                    </div>
                  </div>
                </div>
              </div>

              <div
                key="5"
                data-kt-stepper-element="content"
                className={`stepper-item ${currentStep === 6 ? "current" : ""}`}
              >
                <div className="w-100">
                  <div className="pb-8 pb-lg-10">
                    <h2 className="fw-bold text-gray-900">Total estimate</h2>
                  </div>
                  <div className="row pb-8 pb-lg-10">
                    <div className="col-6">
                      <label htmlFor="quantity">Quantity</label>
                      <input
                        type="number"
                        name="quantity"
                        min="1"
                        className="form-control form-control-sm form-control-solid"
                        value={quantity}
                        onChange={handleChangeQuantity}
                      />
                    </div>
                  </div>

                  <div className="pb-8 pb-lg-10">
                    <div className="flex-grow-1">
                      <div className="table-responsive border-bottom mb-9">
                        <table className="table mb-3">
                          <thead>
                            <tr className="border-bottom fs-6 fw-bold text-muted">
                              <th className="min-w-100px pb-2">Description</th>
                              <th className="min-w-145px pb-2">Choice</th>
                              <th className="min-w-100px text-end pb-2">
                                Amount
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            <tr className="fw-bold text-gray-700 fs-5 border-bottom">
                              <td className="d-flex align-items-center">
                                <i className="fa fa-genderless text-primary fs-2 me-2"></i>
                                Shape
                              </td>

                              <td>
                                {shapeNameinvoice} ( {A_valueinvoice}{" "}
                                {B_valueinvoice > 0
                                  ? " | " + B_valueinvoice
                                  : ""}{" "}
                                {C_valueinvoice > 0
                                  ? " | " + C_valueinvoice
                                  : ""}{" "}
                                )
                              </td>
                              <td className="fs-5 text-gray-900 fw-bolder text-end">
                                {OriginalShapeCostinvoice} DT{" "}
                              </td>
                            </tr>

                            <tr className="fw-bold text-gray-700 fs-5 border-bottom">
                              <td className="d-flex align-items-center">
                                <i className="fa fa-genderless text-primary fs-2 me-2"></i>
                                Material
                              </td>

                              <td>
                                <ul>
                                  <li>{materialNameinvoice}</li>
                                  <li>{materialTypeinvoice}</li>
                                  <li>{materialinvoice}</li>
                                  <li>Thickness: {thicknessinvoice}mm</li>
                                </ul>
                              </td>
                              <td className="fs-5 text-gray-900 fw-bolder text-end">
                                {OriginalMaterialCostinvoice} DT
                              </td>
                            </tr>

                            <tr className="fw-bold text-gray-700 fs-5 border-bottom">
                              <td className="d-flex align-items-center">
                                <i className="fa fa-genderless text-primary fs-2 me-2"></i>
                                Angles ({NBAngleCutted})
                              </td>

                              <td>
                                {anglesList.map((angle, index) => (
                                  <li>{angle.Angle_name}</li>
                                ))}
                              </td>

                              <td className="fs-5 text-gray-900 fw-bolder text-end">
                                {anglesList.reduce(
                                  (total, angle) =>
                                    total + angle.OriginalAngleCost,
                                  0
                                )}{" "}
                                DT
                              </td>
                            </tr>

                            <tr className="fw-bold text-gray-700 fs-5 border-bottom">
                              <td className="d-flex align-items-center">
                                <i className="fa fa-genderless text-primary fs-2 me-2"></i>
                                Edges ({NBEdgeCuttedinvoice})
                              </td>

                              <td>
                                {edgesList.map((edge, index) => (
                                  <li>{edge.Edge_name}</li>
                                ))}
                              </td>
                              <td className="fs-5 text-gray-900 fw-bolder text-end">
                                {edgesList.reduce(
                                  (total, edge) =>
                                    total + edge.OriginalEdgeCost,
                                  0
                                )}{" "}
                                DT
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="d-flex justify-content-end">
                        <div className="mw-600px">
                          <div className="d-flex flex-stack mb-3">
                            <div className="fw-semibold pe-10 text-gray-600 fs-7">
                              Quantity:
                            </div>
                            <div className="text-end fw-bold fs-6 text-gray-800">
                              {quantity}
                            </div>
                          </div>

                          <div className="d-flex flex-stack mb-3">
                            <div className="fw-semibold pe-10 text-gray-600 fs-7">
                              Subtotal:
                            </div>
                            <div className="text-end fw-bold fs-6 text-gray-800">
                              $
                              {quantity *
                                (OriginalShapeCostinvoice +
                                  OriginalMaterialCostinvoice +
                                  anglesList.reduce(
                                    (total, angle) =>
                                      total + angle.OriginalAngleCost,
                                    0
                                  ) +
                                  edgesList.reduce(
                                    (total, edge) =>
                                      total + edge.OriginalEdgeCost,
                                    0
                                  ))}{" "}
                              DT
                            </div>
                          </div>

                          <div className="d-flex flex-stack mb-3">
                            <div className="fw-semibold pe-10 text-gray-600 fs-7">
                              Discount
                            </div>
                            <div className="text-end fw-bold fs-6 text-gray-800">
                              $
                              {quantity *
                                (DiscountShapeDTinvoice +
                                  DiscountMaterialDTinvoice +
                                  anglesList.reduce(
                                    (total, angle) =>
                                      total + angle.DiscountAngleDT,
                                    0
                                  ) +
                                  edgesList.reduce(
                                    (total, edge) =>
                                      total + edge.DiscountEdgeDT,
                                    0
                                  ))}{" "}
                              DT
                            </div>
                          </div>

                          <div className="d-flex flex-stack mb-3">
                            <div className="fw-semibold pe-10 text-gray-600 fs-7">
                              VAT
                            </div>
                            <div className="text-end fw-bold fs-6 text-gray-800">
                              $
                              {quantity *
                                (VatShape * 0.01 * OriginalShapeCostinvoice +
                                  VatMaterial *
                                    0.01 *
                                    OriginalMaterialCostinvoice +
                                  anglesList.reduce(
                                    (total, angle) =>
                                      total +
                                      angle.OriginalAngleCost *
                                        0.01 *
                                        angle.VatAngle,
                                    0
                                  ) +
                                  edgesList.reduce(
                                    (total, edge) =>
                                      total +
                                      edge.OriginalEdgeCost *
                                        0.01 *
                                        edge.VatEdge,
                                    0
                                  ))}{" "}
                              DT
                            </div>
                          </div>

                          <div className="d-flex flex-stack mb-3">
                            <div className="fw-semibold pe-10 text-gray-600 fs-7">
                              Subtotal + VAT
                            </div>
                            <div className="text-end fw-bold fs-6 text-gray-800">
                              $
                              {quantity *
                                (OriginalShapeCostinvoice +
                                  OriginalMaterialCostinvoice +
                                  anglesList.reduce(
                                    (total, angle) =>
                                      total + angle.OriginalAngleCost,
                                    0
                                  ) +
                                  edgesList.reduce(
                                    (total, edge) =>
                                      total + edge.OriginalEdgeCost,
                                    0
                                  ) +
                                  VatShape * 0.01 * OriginalShapeCostinvoice +
                                  VatMaterial *
                                    0.01 *
                                    OriginalMaterialCostinvoice +
                                  anglesList.reduce(
                                    (total, angle) =>
                                      total +
                                      angle.OriginalAngleCost *
                                        0.01 *
                                        angle.VatAngle,
                                    0
                                  ) +
                                  edgesList.reduce(
                                    (total, edge) =>
                                      total +
                                      edge.OriginalEdgeCost *
                                        0.01 *
                                        edge.VatEdge,
                                    0
                                  ))}{" "}
                              DT
                            </div>
                          </div>
                          <div className="d-flex flex-stack">
                            <div className="fw-semibold pe-10 text-gray-600 fs-7">
                              Total
                            </div>
                            <div className="text-end fw-bold fs-6 text-gray-800">
                              $
                              {quantity *
                                (OriginalShapeCostinvoice +
                                  OriginalMaterialCostinvoice +
                                  anglesList.reduce(
                                    (total, angle) =>
                                      total + angle.OriginalAngleCost,
                                    0
                                  ) +
                                  edgesList.reduce(
                                    (total, edge) =>
                                      total + edge.OriginalEdgeCost,
                                    0
                                  ) +
                                  VatShape * 0.01 * OriginalShapeCostinvoice +
                                  VatMaterial *
                                    0.01 *
                                    OriginalMaterialCostinvoice +
                                  anglesList.reduce(
                                    (total, angle) =>
                                      total +
                                      angle.OriginalAngleCost *
                                        0.01 *
                                        angle.VatAngle,
                                    0
                                  ) +
                                  edgesList.reduce(
                                    (total, edge) =>
                                      total +
                                      edge.OriginalEdgeCost *
                                        0.01 *
                                        edge.VatEdge,
                                    0
                                  ) -
                                  (DiscountShapeDTinvoice +
                                    DiscountMaterialDTinvoice +
                                    anglesList.reduce(
                                      (total, angle) =>
                                        total + angle.DiscountAngleDT,
                                      0
                                    ) +
                                    edgesList.reduce(
                                      (total, edge) =>
                                        total + edge.DiscountEdgeDT,
                                      0
                                    )))}{" "}
                              DT
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedShape.id == "66afd9352c3b263fd9f3dc30" && (
                    <>
                      <div className="pb-2 pb-lg-7">
                        <h2 className="fw-bold text-gray-900 required">
                          Import file:{" "}
                        </h2>
                      </div>

                      <div className="w-100">
                        <DropFileInput
                          onFileChange={(files) => onFileChange(files)}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div
                key="6"
                data-kt-stepper-element="content"
                className={`stepper-item ${
                  currentStep === 7 ? "current" : ""
                } ${emptyAttributes.length == 0 ? "d-none" : ""}`}
              >
                <div className="w-100">
                  <div className="pb-8 pb-lg-10">
                    <h2 className="fw-bold text-gray-900">Almost Done!</h2>

                    <div className="text-muted fw-semibold fs-6">
                      If you need more info, please
                      <a href="#" className="link-primary fw-bold">
                        Contact Us
                      </a>
                      .
                    </div>
                  </div>

                  <div className="mb-0">
                    {emptyAttributes.length > 0 ? (
                      <div className="mb-0">
                        <div className="notice d-flex bg-light-warning rounded border-warning border border-dashed p-6">
                          <i className="ki-duotone ki-information fs-2tx text-warning me-4">
                            <span className="path1"></span>
                            <span className="path2"></span>
                            <span className="path3"></span>
                          </i>

                          <div className="d-flex flex-stack flex-grow-1">
                            <div className="fw-semibold">
                              <h4 className="text-gray-900 fw-bold">
                                Please complete missing information :
                              </h4>

                              <div className="fs-6 text-gray-700">
                                <ul>
                                  {emptyAttributes.map((attr, index) => {
                                    return (
                                      <li key={index}>
                                        {attr === "firstName"
                                          ? "First Name"
                                          : ""}
                                        {attr === "lastName" ? "Last Name" : ""}
                                        {attr === "sp"
                                          ? "State / Province"
                                          : ""}
                                        {attr === "email" ? "Email" : ""}
                                        {attr === "phone" ? "Phone" : ""}
                                        {attr === "addr1" ? "Address 1" : ""}
                                        {attr === "addr2" ? "Address 2" : ""}
                                        {attr === "town" ? "Town" : ""}
                                        {attr === "postCode" ? "Post Code" : ""}
                                        {attr === "country" ? "Country" : ""}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    {!userID ? (
                      <div className="notice d-flex bg-light-warning rounded border-warning border border-dashed p-6">
                        <i className="ki-duotone ki-information fs-2tx text-warning me-4">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                        </i>

                        <div className="d-flex flex-stack flex-grow-1">
                          <div className="fw-semibold">
                            <h4 className="text-gray-900 fw-bold">
                              You need to login or sign in
                            </h4>
                            <div className="text-muted fw-semibold fs-6">
                              <a
                                href="/auth/signup"
                                className="link-primary fw-bold"
                              >
                                login
                              </a>
                              <span> or </span>
                              <a
                                href="/auth/signin"
                                className="link-primary fw-bold"
                              >
                                sign in
                              </a>
                              .
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    <br />
                  </div>

                  <br />
                </div>
              </div>

              <div
                key="7"
                data-kt-stepper-element="content"
                className={`stepper-item ${currentStep === 8 ? "current" : ""}`}
              >
                <div className="w-100">
                  <div className="pb-8 pb-lg-10">
                    <h2 className="fw-bold text-gray-900">Your Are Done!</h2>
                    <div className="text-muted fw-semibold fs-6">
                      If you need more info, please
                      <a href="#" className="link-primary fw-bold">
                        {" "}
                        Contact Us
                      </a>
                      .
                    </div>
                  </div>
                  <div className="mb-0">
                    <div className="fs-6 text-gray-600 mb-5">
                      Your order has been successfully submitted.
                    </div>
                    <div className="notice d-flex bg-light-warning rounded border-warning border border-dashed  p-6">
                      <i className="ki-duotone ki-information fs-2tx text-warning me-4">
                        <span className="path1" />
                        <span className="path2" />
                        <span className="path3" />
                      </i>

                      <div className="d-flex flex-stack flex-grow-1 ">
                        <div className=" fw-semibold">
                          <h4 className="text-gray-900 fw-bold">
                            We need your attention!
                          </h4>

                          <div className="fs-6 text-gray-700 ">
                            An admin will review your order and provide a
                            decision. You will receive an email notification
                            shortly.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {Object.keys(formErrors).length > 0 && (
                <div className="text-danger">
                  {Object.values(formErrors).map((message, index) => (
                    <div key={index}>{message}</div>
                  ))}
                </div>
              )}

              <div className="d-flex flex-stack pt-15">
                {currentStep < 8 && (
                  <div className="mr-2">
                    <button
                      type="button"
                      className="btn btn-lg btn-light-primary me-3"
                      onClick={handlePrevious}
                    >
                      <i className="ki-duotone ki-arrow-left fs-4 me-1">
                        <span className="path1"></span>
                        <span className="path2"></span>
                      </i>{" "}
                      Back
                    </button>
                  </div>
                )}

                <div>
                  {currentStep < 6 && (
                    <button
                      type="button"
                      className="btn btn-lg btn-primary me-3"
                      onClick={handleNext}
                    >
                      <span className="indicator-label">
                        Continue
                        <i className="ki-duotone ki-arrow-right fs-3 ms-2 me-0">
                          <span className="path1"></span>
                          <span className="path2"></span>
                        </i>
                      </span>

                      <span className="indicator-progress">
                        Please wait...{" "}
                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                      </span>
                    </button>
                  )}

                  {currentStep == 6 && (
                    <button
                      type="button"
                      className="btn btn-lg btn-primary me-3"
                      onClick={handleNext}
                    >
                      <span ref={btnRef1} className="indicator-label">
                        Send Order
                        <i className="ki-duotone ki-arrow-right fs-3 ms-2 me-0">
                          <span className="path1"></span>
                          <span className="path2"></span>
                        </i>
                      </span>

                      <span ref={btnRef2} className="indicator-progress">
                        Please wait...{" "}
                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Addorder;
