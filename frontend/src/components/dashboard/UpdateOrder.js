import React, { useContext, useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "./../../AuthContext";

function UpdateOrder() {
  const { orderId } = useParams();
  const { userRole } = useContext(AuthContext);
  const btnRef3 = useRef(null);
  const btnRef4 = useRef(null);

  const [formDataInvoice, setFormDataInvoice] = useState({
    A_value: "",
    B_value: "",
    C_value: "",
    projectName: "",
    shapeName: "",
    OriginalShapeCost: 0,
    VatShape: 0,
    DiscountedShapeCost: 0,
    DiscountShape: "",
    DiscountShapeDT: 0,
    materialName: "",
    OriginalMaterialCost: 0,
    material: "",
    materialType: "",
    thickness: "",
    VatMaterial: 0,
    DiscountedMaterialCost: 0,
    DiscountMaterial: "",
    DiscountMaterialDT: 0,
    NBAngleCutted: 0,
    angles: [],
    NBEdgeCutted: 0,
    edges: [],
    quantity: 0,
    edgeDescription: "",
    angleDescription: "",
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addr1: "",
    addr2: "",
    town: "",
    sp: "",
    postCode: "",
    country: "",
    file: [],
    status: "",
    receiver_company_name: "",
    receiver_logopath: "",
    receiver_address: "",
    receiver_geocode: "",
    receiver_email: "",
    receiver_phone: "",
    receiver_fax: "",
    ApprovedDate: "",
    DeclinedDate: "",
    FactureNum: "",
  });
  const handleChangeInvoice = (e) => {
    setFormDataInvoice({
      ...formDataInvoice,
      [e.target.name]: e.target.value,
    });
  };
  // Fetch order details and initialize form inputs
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `https://hchaichi-bmqq.vercel.app/product/orderdetails/${orderId}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.order) {
          setFormDataInvoice(response.data.order);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a PUT request to update the order
      const response = await axios.put(
        `https://hchaichi-bmqq.vercel.app/product/order/${orderId}`,
        formDataInvoice,
        {
          withCredentials: true,
        }
      );
      Swal.fire({
        icon: "success",
        title: "Order Updating Successfully",
        text: response.data.message || response.data,
      });
    } catch (error) {
      console.error("Error updating order:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an error updating the Order!",
      });
    }
  };
  const handleEditFileName = async (index) => {
    const { value: newName } = await Swal.fire({
      title: "Edit File Name",
      input: "text",
      inputLabel: "Don't forget add file extension like (.jpg,.png...)",
      inputPlaceholder: "Enter new file name",
      showCancelButton: true,
    });

    if (newName) {
      const updatedFiles = [...formDataInvoice.file];
      updatedFiles[index].originalname = newName;

      setFormDataInvoice({
        ...formDataInvoice,
        file: updatedFiles,
      });

      // Send update to the server
      try {
        await axios.put(
          `https://hchaichi-bmqq.vercel.app/product/order/${orderId}/file/${index}`,
          { originalname: newName },
          {
            withCredentials: true,
          }
        );
        Swal.fire("Success", "File name updated successfully", "success");
      } catch (error) {
        console.error("Error updating file name:", error);
        Swal.fire(
          "Error",
          "There was an error updating the file name!",
          "error"
        );
      }
    }
  };

  const handleDeleteFile = async (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const updatedFiles = formDataInvoice.file.filter((_, i) => i !== index);
        setFormDataInvoice({
          ...formDataInvoice,
          file: updatedFiles,
        });

        // Send delete request to the server
        try {
          await axios.delete(
            `https://hchaichi-bmqq.vercel.app/product/order/${orderId}/file/${index}`,
            {
              withCredentials: true,
            }
          );
          Swal.fire("Deleted!", "The file has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting file:", error);
          Swal.fire("Error", "There was an error deleting the file!", "error");
        }
      }
    });
  };

  return (
    <>
      <div className="card card-flush">
        <div className="card-header">
          <div className="row my-7">
            <div className="col-md-12">
              <h1>Invoice Editing</h1>
            </div>
          </div>
        </div>
        <div className="card-body">
          <form className="form">
            <div className="row mb-7">
              <div className="col-md-9 offset-md-2">
                <h2>Order Details</h2>
              </div>
            </div>

            <div className="row fv-row mb-7">
              <div className="col-md-3 text-md-end">
                <label className="fs-6 fw-semibold form-label mt-3">
                  <span>Quantity</span>
                  <span
                    className="ms-1"
                    data-bs-toggle="tooltip"
                    title="Set quantity of product"
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
                  type="number"
                  className="form-control "
                  min={1}
                  name="quantity"
                  value={formDataInvoice.quantity}
                  onChange={handleChangeInvoice}
                />
              </div>
            </div>
            {userRole && userRole == "admin" && (
              <>
                <div className="row mb-7">
                  <div className="col-md-9 offset-md-2">
                    <h2>Company Details</h2>
                  </div>
                </div>

                <div className="row fv-row mb-7">
                  <div className="col-md-3 text-md-end">
                    <label className="fs-6 fw-semibold form-label mt-3">
                      <span>Company Name</span>
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
                      className="form-control "
                      name="receiver_company_name"
                      defaultValue={formDataInvoice.receiver_company_name}
                      onChange={handleChangeInvoice}
                    />
                  </div>
                </div>

                <div className="row fv-row mb-7">
                  <div className="col-md-3 text-md-end">
                    <label className="fs-6 fw-semibold form-label mt-3">
                      <span>Address</span>
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
                      className="form-control "
                      name="receiver_address"
                      defaultValue={formDataInvoice.receiver_address}
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
                      className="form-control "
                      name="receiver_geocode"
                      defaultValue={formDataInvoice.receiver_geocode}
                      onChange={handleChangeInvoice}
                    />
                  </div>
                </div>

                <div className="row fv-row mb-7">
                  <div className="col-md-3 text-md-end">
                    <label className="fs-6 fw-semibold form-label mt-3">
                      <span>Email</span>
                    </label>
                  </div>

                  <div className="col-md-9">
                    <input
                      type="email"
                      className="form-control "
                      name="receiver_email"
                      defaultValue={formDataInvoice.receiver_email}
                      onChange={handleChangeInvoice}
                    />
                  </div>
                </div>

                <div className="row fv-row mb-7">
                  <div className="col-md-3 text-md-end">
                    <label className="fs-6 fw-semibold form-label mt-3">
                      <span>Phone</span>
                    </label>
                  </div>

                  <div className="col-md-9">
                    <input
                      type="text"
                      className="form-control "
                      name="receiver_phone"
                      defaultValue={formDataInvoice.receiver_phone}
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
                      className="form-control "
                      name="receiver_fax"
                      defaultValue={formDataInvoice.receiver_fax}
                      onChange={handleChangeInvoice}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="row mb-7">
              <div className="col-md-9 offset-md-2">
                <h2>User Details</h2>
              </div>
            </div>

            <div className="row fv-row mb-7">
              <div className="col-md-3 text-md-end">
                <label className="fs-6 fw-semibold form-label mt-3">
                  <span>Phone</span>
                </label>
              </div>
              <div className="col-md-9">
                <input
                  type="number"
                  className="form-control "
                  name="phone"
                  defaultValue={formDataInvoice.phone}
                  onChange={handleChangeInvoice}
                />
              </div>
            </div>

            <div className="row fv-row mb-7">
              <div className="col-md-3 text-md-end">
                <label className="fs-6 fw-semibold form-label mt-3">
                  <span>First Name</span>
                </label>
              </div>
              <div className="col-md-9">
                <input
                  type="text"
                  className="form-control "
                  name="firstName"
                  defaultValue={formDataInvoice.firstName}
                  onChange={handleChangeInvoice}
                />
              </div>
            </div>

            <div className="row fv-row mb-7">
              <div className="col-md-3 text-md-end">
                <label className="fs-6 fw-semibold form-label mt-3">
                  <span>Last Name</span>
                </label>
              </div>
              <div className="col-md-9">
                <input
                  type="text"
                  className="form-control "
                  name="lastName"
                  defaultValue={
                    formDataInvoice.lastName != "its$fromgoogle"
                      ? formDataInvoice.lastName
                      : ""
                  }
                  onChange={handleChangeInvoice}
                />
              </div>
            </div>

            <div className="row fv-row mb-7">
              <div className="col-md-3 text-md-end">
                <label className="fs-6 fw-semibold form-label mt-3">
                  <span>Email</span>
                </label>
              </div>
              <div className="col-md-9">
                <input
                  type="email"
                  className="form-control "
                  name="email"
                  defaultValue={formDataInvoice.email}
                  onChange={handleChangeInvoice}
                />
              </div>
            </div>

            <div className="row fv-row mb-7">
              <div className="col-md-3 text-md-end">
                <label className="fs-6 fw-semibold form-label mt-3">
                  <span>Address 1</span>
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
                  className="form-control "
                  name="addr1"
                  defaultValue={formDataInvoice.addr1}
                  onChange={handleChangeInvoice}
                ></textarea>
              </div>
            </div>

            <div className="row fv-row mb-7">
              <div className="col-md-3 text-md-end">
                <label className="fs-6 fw-semibold form-label mt-3">
                  <span>Address 2</span>
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
                  className="form-control "
                  name="addr2"
                  defaultValue={formDataInvoice.addr2}
                  onChange={handleChangeInvoice}
                ></textarea>
              </div>
            </div>

            <div className="row fv-row mb-7">
              <div className="col-md-3 text-md-end">
                <label className="fs-6 fw-semibold form-label mt-3">
                  <span>Town</span>
                  <span
                    className="ms-1"
                    data-bs-toggle="tooltip"
                    title="Set the invoice's town."
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
                  className="form-control "
                  name="town"
                  defaultValue={formDataInvoice.town}
                  onChange={handleChangeInvoice}
                />
              </div>
            </div>

            <div className="row fv-row mb-7">
              <div className="col-md-3 text-md-end">
                <label className="fs-6 fw-semibold form-label mt-3">
                  <span>State / Province</span>
                  <span
                    className="ms-1"
                    data-bs-toggle="tooltip"
                    title="Set the invoice's State / Province."
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
                  className="form-control "
                  name="sp"
                  defaultValue={formDataInvoice.sp}
                  onChange={handleChangeInvoice}
                />
              </div>
            </div>

            <div className="row fv-row mb-7">
              <div className="col-md-3 text-md-end">
                <label className="fs-6 fw-semibold form-label mt-3">
                  <span>Post Code</span>
                  <span
                    className="ms-1"
                    data-bs-toggle="tooltip"
                    title="Set the invoice's Post Code."
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
                  className="form-control "
                  name="postCode"
                  defaultValue={formDataInvoice.postCode}
                  onChange={handleChangeInvoice}
                />
              </div>
            </div>

            <div className="row fv-row mb-7">
              <div className="col-md-3 text-md-end">
                <label className="fs-6 fw-semibold form-label mt-3">
                  <span>Country</span>
                  <span
                    className="ms-1"
                    data-bs-toggle="tooltip"
                    title="Set the invoice's Country."
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
                  className="form-control "
                  name="country"
                  defaultValue={formDataInvoice.country}
                  onChange={handleChangeInvoice}
                />
              </div>
            </div>

            <div className="row mb-7">
              <div className="col-md-9 offset-md-2">
                <h2>PROJECT OVERVIEW</h2>
              </div>
            </div>

            <div className="row fv-row mb-7">
              <div className="col-md-3 text-md-end">
                <label className="fs-6 fw-semibold form-label mt-3">
                  <span>Project Name</span>
                </label>
              </div>
              <div className="col-md-9">
                <input
                  type="text"
                  className="form-control "
                  name="projectName"
                  defaultValue={formDataInvoice.projectName}
                  onChange={handleChangeInvoice}
                />
              </div>
            </div>

            <div className="row mb-7">
              <div className="col-md-10 offset-md-2">
                <h2>DESCRIPTION</h2>
              </div>
            </div>

            <div className="row fv-row mb-7">
              <div className="col-md-3 text-md-end">
                <label className="fs-6 fw-semibold form-label mt-3">
                  <span>Angles</span>
                  <span
                    className="ms-1"
                    data-bs-toggle="tooltip"
                    title="Set the invoice's angles description."
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
                  className="form-control "
                  name="angleDescription"
                  defaultValue={formDataInvoice.angleDescription}
                  onChange={handleChangeInvoice}
                ></textarea>
              </div>
            </div>

            <div className="row fv-row mb-7">
              <div className="col-md-3 text-md-end">
                <label className="fs-6 fw-semibold form-label mt-3">
                  <span>Edges</span>
                  <span
                    className="ms-1"
                    data-bs-toggle="tooltip"
                    title="Set the invoice's edges description."
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
                  className="form-control "
                  name="edgeDescription"
                  defaultValue={formDataInvoice.edgeDescription}
                  onChange={handleChangeInvoice}
                ></textarea>
              </div>
            </div>
            <div className="row py-5">
              <div className="col-md-9 offset-md-3">
                <div className="text-center">
                  <button
                    type="submit"
                    onClick={handleSubmit}
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
          <br></br> <br></br>
          <br></br>
          {formDataInvoice.file && formDataInvoice.file.length > 0 && (
            <>
              <div className="row mb-7">
                <div className="col-md-9 offset-md-2">
                  <h2>Files :</h2>
                </div>
              </div>

              <div className="row mb-7">
                <div className="col-md-10 offset-md-2">
                  <div className="table-responsive border-bottom mb-9">
                    <table className="table mb-3">
                      <thead>
                        <tr className="border-bottom fs-6 fw-bold text-muted">
                          <th className="min-w-100px pb-2">Name</th>
                          <th className="min-w-100px pb-2 d-print-none">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {formDataInvoice.file.map((file, index) => (
                          <tr
                            className="fw-bold text-gray-700 fs-5 border-bottom"
                            key={index}
                          >
                            <td>{file.originalname}</td>
                            <td className="d-print-none">
                              <button
                                type="button"
                                className="btn btn-secondary me-2"
                                onClick={() => handleEditFileName(index)}
                              >
                                Edit Name
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => handleDeleteFile(index)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default UpdateOrder;
