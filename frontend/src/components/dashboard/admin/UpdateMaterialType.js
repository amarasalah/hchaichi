import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

function UpdateMaterialType({ match }) {
  const { materialTypeId } = useParams();
  const btnRef1 = useRef(null);
  const btnRef2 = useRef(null);
  const [formData, setFormData] = useState({
    materialType_name: "",
    materialTypedescription: "",
    avatarMaterialType: null,
    material: "",
  });
  const [imagePreviews, setImagePreviews] = useState({});
  const [MotherMaterialList, setMotherMaterialList] = useState([]);

  useEffect(() => {
    const fetchMaterialType = async () => {
      try {
        const response = await axios.get(
          `https://hchaichi-bmqq.vercel.app/product/materialtype/${materialTypeId}`,
          { withCredentials: true }
        );
        const pivot = {
          materialType_name: response.data.material.materialType_name || "",
          materialTypedescription:
            response.data.material.materialTypedescription || "",
          avatarMaterialType: null,
          material: response.data.material.material || "",
        };
        setFormData(pivot);
        if (response.data.material.avatarMaterialType) {
          setImagePreviews({
            avatarMaterialType:
              "https://hchaichi-bmqq.vercel.app/product/image/materialtype/" +
              response.data.material.avatarMaterialType,
          });
        } else {
          setImagePreviews({
            avatarMaterialType: "/assets/media/svg/files/blank-image.svg",
          });
        }
      } catch (err) {
        console.log("There was an error fetching the material type!");
      }
    };

    fetchMaterialType();
  }, [materialTypeId]);

  // Fetch the existing materials from the database when the component mounts
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get(
          "https://hchaichi-bmqq.vercel.app/settings/mother-material",
          { withCredentials: true }
        );
        const materials = response.data.map((material) => ({
          MotherMaterial: material.mother_material_name,
        }));
        setMotherMaterialList(materials);
      } catch (error) {
        console.error("Failed to fetch materials:", error);
      }
    };
    fetchMaterials();
  }, []);
  useEffect(() => {
    // Set initial previews
    setImagePreviews((prev) => ({
      ...prev,
      avatarMaterialType: formData.avatarMaterialType
        ? URL.createObjectURL(formData.avatarMaterialType)
        : prev.avatarMaterialType,
    }));
  }, [formData.avatarMaterialType]);
  const handleMTChange = (e) => {
    setFormData({
      ...formData,
      material: e.target.value,
    });
    //console.log(formData);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
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

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    //console.log(data);

    try {
      const response = await axios.put(
        `https://hchaichi-bmqq.vercel.app/product/materialtype/${materialTypeId}`,
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
        title: "Material Type Updating Successfully",
        text: response.data.message || response.data,
      });
      // navigate("/admin/allmaterial", { replace: true });
    } catch (error) {
      console.error("There was an error!", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an error updating the material type!",
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
                <h2>Material Type Thumbnail</h2>
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
                    backgroundImage: `url(${imagePreviews.avatarMaterialType})`,
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
                    name="avatarMaterialType"
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
                Set the material type thumbnail image. Only *.png, *.jpg, *.svg
                and *.jpeg image files are accepted
              </div>
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
                      <label className="required form-label">
                        Material Type Name
                      </label>

                      <input
                        type="text"
                        name="materialType_name"
                        className="form-control mb-2"
                        placeholder="Material Type name"
                        defaultValue={formData.materialType_name}
                        onChange={handleInputChange}
                      />

                      <div className="text-muted fs-7">
                        A material type name is required and recommended to be
                        unique.
                      </div>
                    </div>

                    <div className="mb-2 fv-row">
                      <label className="form-label" htmlFor="floatingTextarea2">
                        Description
                      </label>

                      <div className="mb-2">
                        <textarea
                          className="form-control"
                          defaultValue={formData.materialTypedescription}
                          placeholder="Description"
                          name="materialTypedescription"
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
                      <label
                        htmlFor="kt_ecommerce_add_product_store_template"
                        className="form-label"
                      >
                        Select Material Type
                      </label>

                      <select
                        className="form-select mb-2"
                        data-placeholder="Select an option"
                        id="kt_ecommerce_add_product_store_template"
                        name="material"
                        value={formData.material}
                        onChange={handleMTChange}
                      >
                        {MotherMaterialList.map(
                          (singleMotherMaterial, index) => (
                            <option
                              key={index}
                              value={singleMotherMaterial.MotherMaterial}
                              selected={
                                singleMotherMaterial.MotherMaterial ===
                                formData.material
                              }
                            >
                              {singleMotherMaterial.MotherMaterial}
                            </option>
                          )
                        )}
                      </select>

                      <div className="text-muted fs-7">
                        Assign a material from your material type.
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

export default UpdateMaterialType;
