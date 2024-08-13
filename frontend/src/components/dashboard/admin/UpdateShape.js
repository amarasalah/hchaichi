import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

function UpdateShape() {
  const { ShapeId } = useParams();
  const btnRef1 = useRef(null);
  const btnRef2 = useRef(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [formData, setFormData] = useState({
    shape_name: "",
    shapedescription: "",
    min_A: "",
    max_A: "",
    min_B: "",
    max_B: "",
    min_C: "",
    max_C: "",
    price: "",
    discount_option: "1",
    discounted_percentage: 0,
    discounted_price: 0,
    vat_amount: 0,
    status: "available",
    avatarShape: null,
    avatarEdge: null,
    avatarAngles: null,
    avatarDimensions: null,
    NB_Angle: 0,
  });

  const [imagePreviews, setImagePreviews] = useState({});
  useEffect(() => {
    const fetchShape = async () => {
      try {
        const response = await axios.get(
          `https://hchaichi-bmqq.vercel.app/product/shape/${ShapeId}`,
          { withCredentials: true }
        );
        const pivot = {
          shape_name: response.data.shape.shapeName,
          shapedescription: response.data.shape.shapedescription,
          min_A: response.data.shape.minA,
          max_A: response.data.shape.maxA,
          min_B: response.data.shape.minB,
          max_B: response.data.shape.maxB,
          min_C: response.data.shape.minC,
          max_C: response.data.shape.maxC,
          price: response.data.shape.price,
          discount_option: "" + response.data.shape.discountOption,
          discounted_percentage: response.data.shape.pourcentageDiscount,
          discounted_price: response.data.shape.fixedDiscount,
          vat_amount: response.data.shape.vatAmount,
          status: response.data.shape.status,
          avatarShape: null,
          avatarEdge: null,
          avatarAngles: null,
          avatarDimensions: null,
          NB_Angle: response.data.shape.NB_Angle,
        };
        setFormData(pivot);
        setSelectedOption("" + response.data.shape.discountOption);
        if (
          response.data.shape.avatarShapeImg &&
          response.data.shape.avatarEdgeImg &&
          response.data.shape.avatarAnglesImg &&
          response.data.shape.avatarDimensionsImg
        ) {
          setImagePreviews({
            avatarShape:
              "https://hchaichi-bmqq.vercel.app/product/image/shape/" +
              response.data.shape.avatarShapeImg,
            avatarEdge:
              "https://hchaichi-bmqq.vercel.app/product/image/shape/" +
              response.data.shape.avatarEdgeImg,
            avatarAngles:
              "https://hchaichi-bmqq.vercel.app/product/image/shape/" +
              response.data.shape.avatarAnglesImg,
            avatarDimensions:
              "https://hchaichi-bmqq.vercel.app/product/image/shape/" +
              response.data.shape.avatarDimensionsImg,
          });
        } else {
          setImagePreviews({
            avatarShape: "/assets/media/svg/files/blank-image.svg",
            avatarEdge: "/assets/media/svg/files/blank-image.svg",
            avatarAngles: "/assets/media/svg/files/blank-image.svg",
            avatarDimensions: "/assets/media/svg/files/blank-image.svg",
          });
        }
      } catch (err) {
        console.log("There was an error fetching the shape!");
      }
    };

    fetchShape();
  }, [ShapeId]);

  useEffect(() => {
    // Set initial previews
    setImagePreviews((prev) => ({
      ...prev,
      avatarShape: formData.avatarShape
        ? URL.createObjectURL(formData.avatarShape)
        : prev.avatarShape,
      avatarEdge: formData.avatarEdge
        ? URL.createObjectURL(formData.avatarEdge)
        : prev.avatarEdge,
      avatarAngles: formData.avatarAngles
        ? URL.createObjectURL(formData.avatarAngles)
        : prev.avatarAngles,
      avatarDimensions: formData.avatarDimensions
        ? URL.createObjectURL(formData.avatarDimensions)
        : prev.avatarDimensions,
    }));
  }, [
    formData.avatarShape,
    formData.avatarEdge,
    formData.avatarAngles,
    formData.avatarDimensions,
  ]);

  const handleStatusChange = (e) => {
    //console.log("gggg");
    setFormData({
      ...formData,
      status: e.target.value,
    });
    console.log(formData);
  };

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setSelectedOption(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    // Add validation for discounted_percentage
    if (name === "discounted_percentage" && (value < 0 || value > 100)) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: `${name.replace(/_/g, " ")} must be between 0 and 100.`,
      });
      newValue = 0;
      return;
    }
    setFormData({ ...formData, [name]: newValue });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setFormData({ ...formData, [name]: files[0] });
    }
  };
  useEffect(() => {
    const newImagePreviews = { ...imagePreviews };
    for (const key in formData) {
      if (key.startsWith("avatar") && formData[key]) {
        newImagePreviews[key] = URL.createObjectURL(formData[key]);
      }
    }
    setImagePreviews(newImagePreviews);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    btnRef1.current.style.display = "none";
    btnRef2.current.style.display = "block";

    // Check required fields
    const requiredFields = ["shape_name", "price", "NB_Angle"];
    for (const field of requiredFields) {
      if (
        !formData[field] ||
        (typeof formData[field] === "string" && formData[field].trim() === "")
      ) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: `${field
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())} is required.`,
        });
        btnRef2.current.style.display = "none";
        btnRef1.current.style.display = "block";
        return;
      }
    }

    // Check at least one min value is provided
    if (!formData.min_A && !formData.min_B && !formData.min_C) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "At least one of Min A, Min B, or Min C must be provided.",
      });
      btnRef2.current.style.display = "none";
      btnRef1.current.style.display = "block";
      return;
    }

    // Check min < max for A, B, C
    const checkMinMax = (min, max, label) => {
      if (min !== "" && max !== "" && parseFloat(min) > parseFloat(max)) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: `${label} Min value should be less than Max value.`,
        });
        btnRef2.current.style.display = "none";
        btnRef1.current.style.display = "block";
        return false;
      }
      return true;
    };

    if (
      !checkMinMax(formData.min_A, formData.max_A, "A") ||
      !checkMinMax(formData.min_B, formData.max_B, "B") ||
      !checkMinMax(formData.min_C, formData.max_C, "C")
    ) {
      return;
    }

    // Validate discounted_percentage
    const validateRange = (value, label) => {
      if (value < 0 || value > 100) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: `${label.replace(/_/g, " ")} must be between 0 and 100.`,
        });
        return false;
      }
      return true;
    };

    if (
      !validateRange(formData.discounted_percentage, "Discounted percentage")
    ) {
      btnRef2.current.style.display = "none";
      btnRef1.current.style.display = "block";
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    console.log(data);

    try {
      const response = await axios.put(
        `https://hchaichi-bmqq.vercel.app/product/shape/${ShapeId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log(response.data);

      Swal.fire({
        icon: "success",
        title: "Shape Added Successfully",
        text: response.data.message || response.data,
      });
    } catch (error) {
      console.error("There was an error!", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an error adding the shape!",
      });
    }
    btnRef2.current.style.display = "none";
    btnRef1.current.style.display = "block";
  };

  return (
    <>
      <form
        id="kt_ecommerce_add_product_form"
        className="form d-flex flex-column flex-lg-row"
        data-kt-redirect="/"
        onSubmit={handleSubmit}
      >
        <div className="d-flex flex-column gap-7 gap-lg-10 w-100 w-lg-300px mb-7 me-lg-10">
          <div className="card card-flush py-4">
            <div className="card-header">
              <div className="card-title">
                <h2>Shape Thumbnail</h2>
              </div>
            </div>

            <div className="card-body text-center pt-0">
              <div
                className="image-input image-input-empty image-input-outline image-input-placeholder mb-3"
                data-kt-image-input="true"
              >
                <div
                  className="image-input-wrapper w-150px h-150px"
                  style={{
                    backgroundImage: `url(${imagePreviews.avatarShape})`,
                  }}
                ></div>

                <label
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="change"
                  data-bs-toggle="tooltip"
                  title="Change avatar"
                >
                  <i className="ki-duotone ki-pencil fs-7">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>

                  <input
                    type="file"
                    name="avatarShape"
                    accept=".png, .jpg, .jpeg, .svg"
                    onChange={handleFileChange}
                  />
                  <input type="hidden" name="avatar_remove" />
                </label>

                <span
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="cancel"
                  data-bs-toggle="tooltip"
                  title="Cancel avatar"
                >
                  <i className="ki-duotone ki-cross fs-2">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>{" "}
                </span>

                <span
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="remove"
                  data-bs-toggle="tooltip"
                  title="Remove avatar"
                >
                  <i className="ki-duotone ki-cross fs-2">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>{" "}
                </span>
              </div>

              <div className="text-muted fs-7">
                Set the shape thumbnail image. Only *.png, *.jpg, *.svg and
                *.jpeg image files are accepted
              </div>
            </div>
          </div>

          <div className="card card-flush py-4">
            <div className="card-header">
              <div className="card-title">
                <h2>Dimensions Image</h2>
              </div>
            </div>

            <div className="card-body text-center pt-0">
              <div
                className="image-input image-input-empty image-input-outline image-input-placeholder mb-3"
                data-kt-image-input="true"
              >
                <div
                  className="image-input-wrapper w-150px h-150px"
                  style={{
                    backgroundImage: `url(${imagePreviews.avatarDimensions})`,
                  }}
                ></div>

                <label
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="change"
                  data-bs-toggle="tooltip"
                  title="Change avatar"
                >
                  <i className="ki-duotone ki-pencil fs-7">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>

                  <input
                    type="file"
                    name="avatarDimensions"
                    accept=".png, .jpg, .jpeg, .svg"
                    onChange={handleFileChange}
                  />
                  <input type="hidden" name="avatar_remove" />
                </label>

                <span
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="cancel"
                  data-bs-toggle="tooltip"
                  title="Cancel avatar"
                >
                  <i className="ki-duotone ki-cross fs-2">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>{" "}
                </span>

                <span
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="remove"
                  data-bs-toggle="tooltip"
                  title="Remove avatar"
                >
                  <i className="ki-duotone ki-cross fs-2">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>{" "}
                </span>
              </div>

              <div className="text-muted fs-7">
                Set the shape dimensions image. Only *.png, *.jpg, *.svg and
                *.jpeg image files are accepted
              </div>
            </div>
          </div>

          <div className="card card-flush py-4">
            <div className="card-header">
              <div className="card-title">
                <h2>Their Angles</h2>
              </div>
            </div>

            <div className="card-body text-center pt-0">
              <div
                className="image-input image-input-empty image-input-outline image-input-placeholder mb-3"
                data-kt-image-input="true"
              >
                <div
                  className="image-input-wrapper w-150px h-150px"
                  style={{
                    backgroundImage: `url(${imagePreviews.avatarAngles})`,
                  }}
                ></div>

                <label
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="change"
                  data-bs-toggle="tooltip"
                  title="Change avatar"
                >
                  <i className="ki-duotone ki-pencil fs-7">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>

                  <input
                    type="file"
                    name="avatarAngles"
                    accept=".png, .jpg, .jpeg, .svg"
                    onChange={handleFileChange}
                  />
                  <input type="hidden" name="avatar_remove" />
                </label>

                <span
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="cancel"
                  data-bs-toggle="tooltip"
                  title="Cancel avatar"
                >
                  <i className="ki-duotone ki-cross fs-2">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>{" "}
                </span>

                <span
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="remove"
                  data-bs-toggle="tooltip"
                  title="Remove avatar"
                >
                  <i className="ki-duotone ki-cross fs-2">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>{" "}
                </span>
              </div>

              <div className="text-muted fs-7">
                Set the angles image. Only *.png, *.jpg, *.svg and *.jpeg image
                files are accepted
              </div>
            </div>
          </div>

          <div className="card card-flush py-4">
            <div className="card-header">
              <div className="card-title">
                <h2>Their Edge</h2>
              </div>
            </div>

            <div className="card-body text-center pt-0">
              <div
                className="image-input image-input-empty image-input-outline image-input-placeholder mb-3"
                data-kt-image-input="true"
              >
                <div
                  className="image-input-wrapper w-150px h-150px"
                  style={{
                    backgroundImage: `url(${imagePreviews.avatarEdge})`,
                  }}
                ></div>

                <label
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="change"
                  data-bs-toggle="tooltip"
                  title="Change avatar"
                >
                  <i className="ki-duotone ki-pencil fs-7">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>

                  <input
                    type="file"
                    name="avatarEdge"
                    accept=".png, .jpg, .jpeg, .svg"
                    onChange={handleFileChange}
                  />
                  <input type="hidden" name="avatar_remove" />
                </label>

                <span
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="cancel"
                  data-bs-toggle="tooltip"
                  title="Cancel avatar"
                >
                  <i className="ki-duotone ki-cross fs-2">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>{" "}
                </span>

                <span
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="remove"
                  data-bs-toggle="tooltip"
                  title="Remove avatar"
                >
                  <i className="ki-duotone ki-cross fs-2">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>{" "}
                </span>
              </div>

              <div className="text-muted fs-7">
                Set the shape edge thumbnail image. Only *.png, *.jpg, *.svg and
                *.jpeg image files are accepted
              </div>
            </div>
          </div>

          <div className="card card-flush py-4">
            <div className="card-header">
              <div className="card-title">
                <h2>Status</h2>
              </div>
            </div>

            <div className="card-body pt-0">
              <select
                className="form-select mb-2"
                data-placeholder="Select an option"
                id="kt_ecommerce_add_product_status_select"
                name="status"
                value={formData.status}
                onChange={handleStatusChange}
              >
                <option value="available">Available</option>
                <option value="not_available">Not Available</option>
              </select>

              <div className="text-muted fs-7">Set the product status.</div>
            </div>
          </div>
        </div>

        <div className="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
          <ul className="nav nav-custom nav-tabs nav-line-tabs nav-line-tabs-2x border-0 fs-4 fw-semibold mb-n2">
            <li className="nav-item">
              <a
                className="nav-link text-active-primary pb-4 active"
                data-bs-toggle="tab"
                href="#kt_ecommerce_add_product_general"
              >
                General
              </a>
            </li>
          </ul>

          <div className="tab-content">
            <div
              className="tab-pane fade show active"
              id="kt_ecommerce_add_product_general"
              role="tab-panel"
            >
              <div className="d-flex flex-column gap-7 gap-lg-10">
                <div className="card card-flush py-4">
                  <div className="card-header">
                    <div className="card-title">
                      <h2>General</h2>
                    </div>
                  </div>

                  <div className="card-body pt-0">
                    <div className="mb-2 fv-row">
                      <label className="required form-label">Shape Name</label>

                      <input
                        type="text"
                        name="shape_name"
                        className="form-control mb-2"
                        placeholder="Shape name"
                        defaultValue={formData.shape_name}
                        onChange={handleInputChange}
                        required
                      />

                      <div className="text-muted fs-7">
                        A shape name is required and recommended to be unique.
                      </div>
                    </div>

                    <div className="mb-2 fv-row">
                      <label className="form-label" htmlFor="floatingTextarea2">
                        Description
                      </label>

                      <div className="mb-2">
                        <textarea
                          className="form-control"
                          defaultValue={formData.shapedescription}
                          placeholder="Description"
                          name="shapedescription"
                          id="floatingTextarea2"
                          style={{ height: "100px", borderRadius: "15px" }}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>

                      <div className="text-muted fs-7">
                        Set a description to the product for better visibility.
                      </div>
                    </div>

                    <div className="mb-2 fv-row">
                      <label className="required form-label">
                        Number of angles
                      </label>

                      <input
                        type="number"
                        min={0}
                        name="NB_Angle"
                        className="form-control mb-2"
                        placeholder="Number of angles"
                        defaultValue={formData.NB_Angle}
                        onChange={handleInputChange}
                        required
                      />

                      <div className="text-muted fs-7">
                        Number of angles is required. <br /> Warning: The
                        "Circle" shape has no angle{" "}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card card-flush py-4">
                  <div className="card-header">
                    <div className="card-title">
                      <h2>Dimensions</h2>
                    </div>
                  </div>

                  <div className="card-body pt-0">
                    <div className="mb-2 container">
                      <div className="row mb-4">
                        {" "}
                        <div className="col-12 text-muted fs-4">
                          <strong>Warning:</strong> To add dimension input in
                          [A, B, or C], you must fill in either the minimum
                          (minimum value must be 1 or greater) or the maximum.
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-xl-6 col-sm-12 col-12">
                          <label className="form-label">A(min)</label>

                          <input
                            type="number"
                            name="min_A"
                            min="0"
                            className="form-control mb-2"
                            placeholder="Min A (cm)"
                            defaultValue={formData.min_A}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="col-xl-6 col-sm-12 col-12">
                          <label className="form-label">A(max)</label>

                          <input
                            type="number"
                            name="max_A"
                            min="0"
                            className="form-control mb-2"
                            placeholder="Max A (cm)"
                            defaultValue={formData.max_A}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-xl-6 col-sm-12 col-12">
                          <label className="form-label">B(min)</label>
                          <input
                            type="number"
                            name="min_B"
                            min="0"
                            className="form-control mb-2"
                            placeholder="Min B (cm)"
                            defaultValue={formData.min_B}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-xl-6 col-sm-12 col-12">
                          <label className="form-label">B(max)</label>

                          <input
                            type="number"
                            name="max_B"
                            min="0"
                            className="form-control mb-2"
                            placeholder="Max B (cm)"
                            defaultValue={formData.max_B}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-xl-6 col-sm-12 col-12">
                          <label className="form-label">C(min)</label>
                          <input
                            type="number"
                            name="min_C"
                            min="0"
                            className="form-control mb-2"
                            placeholder="Min C (cm)"
                            defaultValue={formData.min_C}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="col-xl-6 col-sm-12 col-12">
                          <label className="form-label">C(max)</label>

                          <input
                            type="number"
                            name="max_C"
                            min="0"
                            className="form-control mb-2"
                            placeholder="Max C (cm)"
                            defaultValue={formData.max_C}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card card-flush py-4">
                    <div className="card-header">
                      <div className="card-title">
                        <h2>Pricing</h2>
                      </div>
                    </div>

                    <div className="card-body pt-0">
                      <div className="mb-10 fv-row">
                        <label className="required form-label">
                          Base Price (DT/Cm){" "}
                        </label>

                        <input
                          type="text"
                          name="price"
                          className="form-control mb-2"
                          placeholder="Product price"
                          value={formData.price}
                          onChange={handleInputChange}
                        />

                        <div className="text-muted fs-7">
                          Set the product price.
                        </div>
                      </div>

                      <div className="fv-row mb-10">
                        <label className="fs-6 fw-semibold mb-2">
                          Discount Type
                          <span
                            className="ms-1"
                            data-bs-toggle="tooltip"
                            title="Select a discount type that will be applied to this product"
                          >
                            <i className="ki-duotone ki-information-5 text-gray-500 fs-6">
                              <span className="path1"></span>
                              <span className="path2"></span>
                              <span className="path3"></span>
                            </i>
                          </span>{" "}
                        </label>

                        <div
                          className="row row-cols-1 row-cols-md-3 row-cols-lg-1 row-cols-xl-3 g-9"
                          data-kt-buttons="true"
                          data-kt-buttons-target="[data-kt-button='true']"
                        >
                          <div className="col">
                            <label
                              className="btn btn-outline btn-outline-dashed btn-active-light-primary ${selectedOption === '1' ? 'active' : ''} d-flex text-start p-6"
                              data-kt-button="true"
                            >
                              <span className="form-check form-check-custom form-check-solid form-check-sm align-items-start mt-1">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="discount_option"
                                  defaultValue="1"
                                  checked={selectedOption === "1"}
                                  onChange={handleOptionChange}
                                />
                              </span>

                              <span className="ms-5">
                                <span className="fs-4 fw-bold text-gray-800 d-block">
                                  No Discount
                                </span>
                              </span>
                            </label>
                          </div>

                          <div className="col">
                            <label
                              className="btn btn-outline btn-outline-dashed btn-active-light-primary ${selectedOption === '2' ? 'active' : ''} d-flex text-start p-6"
                              data-kt-button="true"
                            >
                              <span className="form-check form-check-custom form-check-solid form-check-sm align-items-start mt-1">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  checked={selectedOption === "2"}
                                  onChange={handleOptionChange}
                                  name="discount_option"
                                  defaultValue="2"
                                />
                              </span>

                              <span className="ms-5">
                                <span className="fs-4 fw-bold text-gray-800 d-block">
                                  Percentage %
                                </span>
                              </span>
                            </label>
                          </div>

                          <div className="col">
                            <label
                              className="btn btn-outline btn-outline-dashed btn-active-light-primary ${selectedOption === '3' ? 'active' : ''} d-flex text-start p-6"
                              data-kt-button="true"
                            >
                              <span className="form-check form-check-custom form-check-solid form-check-sm align-items-start mt-1">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  checked={selectedOption === "3"}
                                  onChange={handleOptionChange}
                                  name="discount_option"
                                  defaultValue="3"
                                />
                              </span>

                              <span className="ms-5">
                                <span className="fs-4 fw-bold text-gray-800 d-block">
                                  Fixed Price
                                </span>
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`mb-10 fv-row ${
                          selectedOption === "2" ? "" : "d-none"
                        }`}
                        id="kt_ecommerce_add_product_discount_percentage"
                      >
                        <label className="form-label">
                          Set Discount Percentage (%)
                        </label>

                        <input
                          type="number"
                          min={0}
                          max={100}
                          name="discounted_percentage"
                          className="form-control mb-2"
                          placeholder="Discounted percentage"
                          value={formData.discounted_percentage}
                          onChange={handleInputChange}
                        />

                        <div className="text-muted fs-7">
                          Set a percentage discount to be applied on this
                          product.
                        </div>
                      </div>

                      <div
                        className={`mb-10 fv-row ${
                          selectedOption === "3" ? "" : "d-none"
                        }`}
                        id="kt_ecommerce_add_product_discount_fixed"
                      >
                        <label className="form-label">
                          Fixed Discounted Price (DT)
                        </label>

                        <input
                          type="number"
                          min={0}
                          max={100}
                          name="discounted_price"
                          className="form-control mb-2"
                          placeholder="Discounted price"
                          value={formData.discounted_price}
                          onChange={handleInputChange}
                        />

                        <div className="text-muted fs-7">
                          Set the discounted product price. The product will be
                          reduced at the determined fixed price
                        </div>
                      </div>

                      <div className="d-flex flex-wrap gap-5">
                        <div className="fv-row w-100 flex-md-root">
                          <label className="form-label">VAT Amount (%)</label>

                          <input
                            type="number"
                            min={0}
                            max={100}
                            className="form-control mb-2"
                            name="vat_amount"
                            value={formData.vat_amount}
                            onChange={handleInputChange}
                          />

                          <div className="text-muted fs-7">
                            Set the product VAT about.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />

            <div className="d-flex justify-content-end">
              <button
                type="submit"
                id="kt_ecommerce_add_product_submit"
                className="btn btn-primary"
              >
                <span ref={btnRef1} className="indicator-label">
                  Update
                </span>
                <span ref={btnRef2} className="indicator-progress">
                  Please wait...{" "}
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default UpdateShape;
