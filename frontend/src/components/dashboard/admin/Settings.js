import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Settings() {
  const btnRef1 = useRef(null);
  const btnRef2 = useRef(null);
  const btnRef3 = useRef(null);
  const btnRef4 = useRef(null);
  const [formDataInvoice, setFormDataInvoice] = useState({
    company_name: "",
    logo: "",
    owner: "",
    address: "",
    geocode: "",
    email: "",
    phone: "",
    fax: "",
  });
  const [formDataGeneral, setFormDataGeneral] = useState({
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
  });
  // Fetch initial settings data
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(
          "https://hchaichi-bmqq.vercel.app/settings/general",
          { withCredentials: true }
        );
        if (response.data) {
          setFormDataGeneral({
            meta_title: response.data.meta_title || "",
            meta_description: response.data.meta_description || "",
            meta_keywords: response.data.meta_keywords || "",
          });
        }
      } catch (error) {
        console.error("There was an error fetching the settings!", error);
      }
    };

    fetchSettings();
  }, []);
  const handleChangeGeneral = (e) => {
    setFormDataGeneral({
      ...formDataGeneral,
      [e.target.name]: e.target.value,
    });
  };
  const ResetChangeGeneral = () => {
    setFormDataGeneral({
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
    });
  };
  const handleSubmitGeneral = async (e) => {
    e.preventDefault();
    btnRef1.current.style.display = "none";
    btnRef2.current.style.display = "block";
    try {
      const response = await axios.put(
        "https://hchaichi-bmqq.vercel.app/settings/general",
        formDataGeneral,
        { withCredentials: true }
      );
      console.log(response.data.message);
      Swal.fire({
        icon: "success",
        title: response.data.message,
      });
    } catch (error) {
      //console.error('There was an error saving the settings!', error);
      Swal.fire("Error!", "There was an error saving the settings!", error);
    }
    btnRef2.current.style.display = "none";
    btnRef1.current.style.display = "block";
  };
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(
          "https://hchaichi-bmqq.vercel.app/settings/invoice",
          { withCredentials: true }
        );
        if (response.data) {
          const imgpath =
            "https://hchaichi-bmqq.vercel.app/settings/image/" +
            response.data.logopath;
          if (imgpath) {
            setImagePreview(imgpath);
          }

          setFormDataInvoice({
            company_name: response.data.company_name || "",
            logo: imgpath || "",
            owner: response.data.owner || "",
            address: response.data.address || "",
            geocode: response.data.geocode || "",
            email: response.data.email || "",
            phone: response.data.phone || "",
            fax: response.data.fax || "",
          });
        }
      } catch (error) {
        console.error("There was an error fetching the settings!", error);
      }
    };

    fetchSettings();
  }, []);
  const [imagePreview, setImagePreview] = useState(
    "/assets/media/svg/files/blank-image.svg"
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleImageRemove = () => {
    setImagePreview("/assets/media/svg/files/blank-image.svg");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleChangeInvoice = (e) => {
    setFormDataInvoice({
      ...formDataInvoice,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmitInvoice = async (e) => {
    e.preventDefault();
    btnRef3.current.style.display = "none";
    btnRef4.current.style.display = "block";
    try {
      e.preventDefault();
      const formData = new FormData();
      formData.append("company_name", formDataInvoice.company_name);
      formData.append("owner", formDataInvoice.owner);
      formData.append("address", formDataInvoice.address);
      formData.append("geocode", formDataInvoice.geocode);
      formData.append("email", formDataInvoice.email);
      formData.append("phone", formDataInvoice.phone);
      formData.append("fax", formDataInvoice.fax);

      if (selectedFile) {
        formData.append("logo", selectedFile);
      }
      const response = await axios.put(
        "https://hchaichi-bmqq.vercel.app/settings/invoice",
        formData,
        { withCredentials: true }
      );
      Swal.fire({
        icon: "success",
        title: response.data.message,
      });
    } catch (error) {
      Swal.fire("Error!", "There was an error saving the settings!", error);
    }
    btnRef4.current.style.display = "none";
    btnRef3.current.style.display = "block";
  };

  const [MotherMaterialList, setMotherMaterialList] = useState([
    { MotherMaterial: "" },
  ]);
  // Fetch the existing materials from the database when the component mounts
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get(
          "https://hchaichi-bmqq.vercel.app/settings/mother-material",
          { withCredentials: true }
        );
        setMotherMaterialList(
          response.data.map((material) => ({
            MotherMaterial: material.mother_material_name,
            save: true,
            _id: material._id,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch materials:", error);
      }
    };
    fetchMaterials();
  }, []);

  const handleMotherMaterialChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...MotherMaterialList];
    list[index] = { MotherMaterial: value, save: false };
    setMotherMaterialList(list);
  };

  /*       const handleMotherMaterialRemove = (index) => {
        const list = [...MotherMaterialList];
        list.splice(index, 1);
        setMotherMaterialList(list);
      }; */

  const handleMotherMaterialRemove = async (index) => {
    const list = [...MotherMaterialList];
    const materialToRemove = list[index];

    if (materialToRemove._id) {
      try {
        await axios.delete(
          `https://hchaichi-bmqq.vercel.app/settings/mother-material/${materialToRemove._id}`,
          { withCredentials: true }
        );
        Swal.fire("Deleted!", "Material has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete material.", "error");
      }
    }

    list.splice(index, 1);
    setMotherMaterialList(list);
  };

  const handleMotherMaterialAdd = () => {
    setMotherMaterialList([...MotherMaterialList, { MotherMaterial: "" }]);
  };

  /*       const handleMotherMaterialSave = (index) => {
        
      };
 */

  const handleMotherMaterialSave = async (index) => {
    const list = [...MotherMaterialList];
    const materialToSave = list[index];

    try {
      const response = await axios.post(
        "https://hchaichi-bmqq.vercel.app/settings/mother-material",
        {
          mother_material_name: materialToSave.MotherMaterial,
        },
        { withCredentials: true }
      );
      list[index] = { ...materialToSave, save: true, _id: response.data._id };
      setMotherMaterialList(list);
      Swal.fire("Saved!", "Material has been saved.", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to save material.", "error");
    }
  };

  return (
    <>
      <div className="card card-flush">
        <div className="card-body">
          <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2x border-transparent fs-4 fw-semibold mb-15">
            <li className="nav-item">
              <a
                className="nav-link text-active-primary d-flex align-items-center pb-5 active"
                data-bs-toggle="tab"
                href="#kt_ecommerce_settings_general"
              >
                <i className="ki-duotone ki-home fs-2 me-2"></i> General
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link text-active-primary d-flex align-items-center pb-5"
                data-bs-toggle="tab"
                href="#kt_ecommerce_settings_invoice"
              >
                <i className="ki-duotone ki-file fs-2 me-2">
                  {" "}
                  <span className="path1"></span>{" "}
                  <span className="path2"></span>{" "}
                </i>
                Invoice
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link text-active-primary d-flex align-items-center pb-5"
                data-bs-toggle="tab"
                href="#kt_ecommerce_settings_mother_material"
              >
                <i className="ki-duotone ki-cube-2 fs-2 me-2">
                  {" "}
                  <span className="path1"></span>{" "}
                  <span className="path2"></span>{" "}
                  <span className="path3"></span>{" "}
                </i>
                Mother Material
              </a>
            </li>
          </ul>

          <div className="tab-content" id="myTabContent">
            <div
              className="tab-pane fade show active"
              id="kt_ecommerce_settings_general"
              role="tabpanel"
            >
              <form id="kt_ecommerce_settings_general_form" className="form">
                <div className="row mb-7">
                  <div className="col-md-9 offset-md-3">
                    <h2>General Settings</h2>
                  </div>
                </div>

                <div className="row fv-row mb-7">
                  <div className="col-md-3 text-md-end">
                    <label className="fs-6 fw-semibold form-label mt-3">
                      <span className="required">Meta Title</span>
                      <span
                        className="ms-1"
                        data-bs-toggle="tooltip"
                        title="Set the title of the invoice for SEO."
                      >
                        <i className="ki-duotone ki-information-5 text-gray-500 fs-6">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                        </i>
                      </span>{" "}
                    </label>
                  </div>

                  <div className="col-md-9">
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      defaultValue={formDataGeneral.meta_title}
                      onChange={handleChangeGeneral}
                      name="meta_title"
                    />
                  </div>
                </div>

                <div className="row fv-row mb-7">
                  <div className="col-md-3 text-md-end">
                    <label className="fs-6 fw-semibold form-label mt-3">
                      <span>Meta Tag Description</span>
                      <span
                        className="ms-1"
                        data-bs-toggle="tooltip"
                        title="Set the description of the invoice for SEO."
                      >
                        <i className="ki-duotone ki-information-5 text-gray-500 fs-6">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                        </i>
                      </span>{" "}
                    </label>
                  </div>

                  <div className="col-md-9">
                    <textarea
                      className="form-control form-control-solid"
                      name="meta_description"
                      defaultValue={formDataGeneral.meta_description}
                      onChange={handleChangeGeneral}
                    ></textarea>
                  </div>
                </div>

                <div className="row fv-row mb-7">
                  <div className="col-md-3 text-md-end">
                    <label className="fs-6 fw-semibold form-label mt-3">
                      <span>Meta Keywords</span>
                      <span
                        className="ms-1"
                        data-bs-toggle="tooltip"
                        title="Set keywords for the invoice separated by a comma."
                      >
                        <i className="ki-duotone ki-information-5 text-gray-500 fs-6">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                        </i>
                      </span>{" "}
                    </label>
                  </div>

                  <div className="col-md-9">
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      name="meta_keywords"
                      defaultValue={formDataGeneral.meta_keywords}
                      onChange={handleChangeGeneral}
                      data-kt-ecommerce-settings-type="tagify"
                    />
                  </div>
                </div>

                <div className="row py-5">
                  <div className="col-md-9 offset-md-3">
                    <div className="d-flex">
                      <button
                        type="reset"
                        className="btn btn-light me-3"
                        onClick={ResetChangeGeneral}
                      >
                        Reset
                      </button>

                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={handleSubmitGeneral}
                      >
                        <span ref={btnRef1} className="indicator-label">
                          Save
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
            </div>

            <div
              className="tab-pane fade"
              id="kt_ecommerce_settings_invoice"
              role="tabpanel"
            >
              <form id="kt_ecommerce_settings_general_invoice" className="form">
                <div className="row mb-7">
                  <div className="col-md-9 offset-md-3">
                    <h2>Invoice Settings</h2>
                  </div>
                </div>

                <div className="row fv-row mb-7">
                  <div className="col-md-3 text-md-end">
                    <label className="fs-6 fw-semibold form-label mt-3">
                      <span className="required">Company Name</span>
                      <span
                        className="ms-1"
                        data-bs-toggle="tooltip"
                        title="Set the name of the invoice"
                      >
                        <i className="ki-duotone ki-information-5 text-gray-500 fs-6">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                        </i>
                      </span>{" "}
                    </label>
                  </div>

                  <div className="col-md-9">
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      name="company_name"
                      defaultValue={formDataInvoice.company_name}
                      onChange={handleChangeInvoice}
                    />
                  </div>
                </div>

                <div className="row fv-row mb-7 w-100">
                  <div className="d-flex flex-column align-items-center">
                    <label className="fw-semibold fs-6 mb-5">
                      Logo Company
                    </label>

                    <div
                      className="image-input image-input-outline image-input-placeholder"
                      data-kt-image-input="true"
                    >
                      <div
                        className="image-input-wrapper w-125px h-125px"
                        style={{ backgroundImage: `url(${imagePreview})` }}
                      ></div>
                      <label
                        className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                        data-kt-image-input-action="change"
                        data-bs-toggle="tooltip"
                        title="Change logo"
                      >
                        <i className="ki-duotone ki-pencil fs-7">
                          <span className="path1"></span>
                          <span className="path2"></span>
                        </i>
                        <input
                          type="file"
                          name="logo"
                          accept=".png, .jpg, .jpeg"
                          onChange={handleFileChange}
                          ref={fileInputRef}
                        />
                        <input type="hidden" name="logo_remove" />
                      </label>
                      <span
                        className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                        data-kt-image-input-action="cancel"
                        data-bs-toggle="tooltip"
                        title="Cancel logo"
                        onClick={handleImageRemove}
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
                        title="Remove logo"
                        onClick={handleImageRemove}
                      >
                        <i className="ki-duotone ki-cross fs-2">
                          <span className="path1"></span>
                          <span className="path2"></span>
                        </i>{" "}
                      </span>
                    </div>
                    <div className="form-text">
                      Allowed file types: png, jpg, jpeg.
                    </div>
                  </div>
                </div>

                <div className="row fv-row mb-7">
                  <div className="col-md-3 text-md-end">
                    <label className="fs-6 fw-semibold form-label mt-3">
                      <span className="required">Company Owner</span>
                      <span
                        className="ms-1"
                        data-bs-toggle="tooltip"
                        title="Set the invoice owner's name"
                      >
                        <i className="ki-duotone ki-information-5 text-gray-500 fs-6">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                        </i>
                      </span>{" "}
                    </label>
                  </div>

                  <div className="col-md-9">
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      name="owner"
                      defaultValue={formDataInvoice.owner}
                      onChange={handleChangeInvoice}
                    />
                  </div>
                </div>

                <div className="row fv-row mb-7">
                  <div className="col-md-3 text-md-end">
                    <label className="fs-6 fw-semibold form-label mt-3">
                      <span className="required">Address</span>
                      <span
                        className="ms-1"
                        data-bs-toggle="tooltip"
                        title="Set the invoice's full address."
                      >
                        <i className="ki-duotone ki-information-5 text-gray-500 fs-6">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                        </i>
                      </span>{" "}
                    </label>
                  </div>

                  <div className="col-md-9">
                    <textarea
                      className="form-control form-control-solid"
                      name="address"
                      defaultValue={formDataInvoice.address}
                      onChange={handleChangeInvoice}
                    ></textarea>
                  </div>
                </div>

                <div className="row fv-row mb-7">
                  <div className="col-md-3 text-md-end">
                    <label className="fs-6 fw-semibold form-label mt-3">
                      <span>Geocode</span>
                      <span
                        className="ms-1"
                        data-bs-toggle="tooltip"
                        title="Enter the invoice geocode manually (optional)"
                      >
                        <i className="ki-duotone ki-information-5 text-gray-500 fs-6">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                        </i>
                      </span>{" "}
                    </label>
                  </div>

                  <div className="col-md-9">
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      name="geocode"
                      defaultValue={formDataInvoice.geocode}
                      onChange={handleChangeInvoice}
                    />
                  </div>
                </div>

                <div className="row fv-row mb-7">
                  <div className="col-md-3 text-md-end">
                    <label className="fs-6 fw-semibold form-label mt-3">
                      <span className="required">Email</span>
                    </label>
                  </div>

                  <div className="col-md-9">
                    <input
                      type="email"
                      className="form-control form-control-solid"
                      name="email"
                      defaultValue={formDataInvoice.email}
                      onChange={handleChangeInvoice}
                    />
                  </div>
                </div>

                <div className="row fv-row mb-7">
                  <div className="col-md-3 text-md-end">
                    <label className="fs-6 fw-semibold form-label mt-3">
                      <span className="required">Phone</span>
                    </label>
                  </div>

                  <div className="col-md-9">
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      name="phone"
                      defaultValue={formDataInvoice.phone}
                      onChange={handleChangeInvoice}
                    />
                  </div>
                </div>

                <div className="row fv-row mb-7">
                  <div className="col-md-3 text-md-end">
                    <label className="fs-6 fw-semibold form-label mt-3">
                      <span>Fax</span>
                    </label>
                  </div>

                  <div className="col-md-9">
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      name="fax"
                      defaultValue={formDataInvoice.fax}
                      onChange={handleChangeInvoice}
                    />
                  </div>
                </div>

                <div className="row py-5">
                  <div className="col-md-9 offset-md-3">
                    <div className="d-flex">
                      <button
                        type="reset"
                        className="btn btn-light me-3"
                        onClick={() =>
                          setFormDataInvoice({
                            company_name: "",
                            logopath: "",
                            owner: "",
                            address: "",
                            geocode: "",
                            email: "",
                            phone: "",
                            fax: "",
                          })
                        }
                      >
                        Reset
                      </button>

                      <button
                        type="submit"
                        onClick={handleSubmitInvoice}
                        className="btn btn-primary"
                      >
                        <span ref={btnRef3} className="indicator-label">
                          Save
                        </span>
                        <span ref={btnRef4} className="indicator-progress">
                          Please wait...{" "}
                          <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div
              className="tab-pane fade"
              id="kt_ecommerce_settings_mother_material"
              role="tabpanel"
            >
              <form className="form">
                <div className="row py-5">
                  {MotherMaterialList.map((singleMotherMaterial, index) => (
                    <>
                      <div className="row fv-row mb-7">
                        <div className="col-md-8">
                          <input
                            type="text"
                            className="form-control"
                            name="MotherMaterial"
                            id="MotherMaterial"
                            value={singleMotherMaterial.MotherMaterial}
                            onChange={(e) =>
                              handleMotherMaterialChange(e, index)
                            }
                          />
                        </div>
                        {singleMotherMaterial.save == false && (
                          <>
                            <div className="col-md-1">
                              <button
                                type="button"
                                className="btn btn-success remove-btn"
                                onClick={() => handleMotherMaterialSave(index)}
                              >
                                Save
                              </button>
                            </div>
                          </>
                        )}

                        <>
                          <div className="col-md-1">
                            <button
                              type="button"
                              className="btn btn-danger remove-btn"
                              onClick={() => handleMotherMaterialRemove(index)}
                            >
                              Remove
                            </button>
                          </div>
                        </>
                      </div>
                    </>
                  ))}
                  <div className="row fv-row mb-7">
                    <div className="col-md-5">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleMotherMaterialAdd}
                      >
                        <i className="ki-duotone ki-add-item fs-1">
                          {" "}
                          <span className="path1"></span>{" "}
                          <span className="path2"></span>{" "}
                          <span className="path3"></span>{" "}
                        </i>{" "}
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
