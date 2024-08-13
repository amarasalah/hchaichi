import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { useTable, usePagination, useFilters } from "react-table";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

function Userlist() {
  const [isFilterVisible, setFilterVisible] = useState(false);
  const toggleFilter = () => {
    setFilterVisible(!isFilterVisible);
  };
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [PerPage, setPerPage] = useState(5);

  const filterStyle = {
    zIndex: 107,
    position: "fixed",
    inset: "0px 0px auto auto",
    margin: 0,
    transform: "translate3d(-210px, 199.8px, 0px)",
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://hchaichi-bmqq.vercel.app/api/staffs`,
        {
          params: {
            page: currentPage,
            limit: PerPage,
            search: searchInput,
            role: roleFilter,
          },
          withCredentials: true,
        }
      );
      setData(response.data.users);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchInput, PerPage]);

  const columns = useMemo(
    () => [
      {
        Header: "Avatar",
        accessor: "imageUrl",
        Cell: ({ value, row }) => (
          <div className="d-flex align-items-center">
            <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
              <a href={"/admin/viewuser/" + row.original._id}>
                <div className="symbol-label">
                  <img
                    src={
                      row.original.image ||
                      row.original.imageUrl ||
                      "/assets/images/Default-profile.jpg"
                    }
                    alt={row.original.firstName}
                    className="w-100"
                  />
                </div>
              </a>
            </div>
            <div className="d-flex flex-column">
              <a
                href={"/admin/viewuser/" + row.original._id}
                className="text-gray-800 text-hover-primary mb-1"
              >
                {row.original.firstName}{" "}
                {row.original.lastName !== "its$fromgoogle"
                  ? row.original.lastName
                  : ""}
              </a>
              <span>{row.original.email}</span>
            </div>
          </div>
        ),
      },
      {
        Header: "Role",
        accessor: "role",
      },
      {
        Header: "Verification",
        Cell: ({ row }) =>
          row.original.verification ? (
            <div className="badge badge-light-success fw-bold">Verified</div>
          ) : (
            <div className="badge badge-light-danger fw-bold">Not Verified</div>
          ),
      },
      {
        Header: "Joined Date",
        accessor: "joinedDate",
        Cell: ({ value }) => new Date(value).toLocaleString(),
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="text-end">
            <button
              className="btn btn-icon btn-danger rounded-0 me-2"
              onClick={() => handleDelete(row.original._id)}
            >
              <i className="ki-duotone ki-trash fs-1">
                {" "}
                <span className="path1"></span> <span className="path2"></span>{" "}
                <span className="path3"></span> <span className="path4"></span>{" "}
                <span className="path5"></span>{" "}
              </i>
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: PerPage },
      manualPagination: true,
      pageCount: totalPages,
    },
    useFilters,
    usePagination
  );

  const handleDelete = async (userId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `https://hchaichi-bmqq.vercel.app/api/deletestaff/${userId}`,
          { withCredentials: true }
        );
        Swal.fire("Deleted!", "User has been deleted.", "success");
        fetchData(); // Refresh the data
      } catch (error) {
        console.error("Error deleting user:", error);
        Swal.fire("Error!", "There was an error deleting the user.", "error");
      }
    }
  };

  const btnRef1 = useRef(null);
  const btnRef2 = useRef(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();
  const password = watch("password");
  const [imagePreview, setImagePreview] = useState(
    "/assets/media/svg/files/blank-image.svg"
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkPasswordStrength = (password) => {
    let nbverif = 0;
    if (password.length >= 8) nbverif += 1;
    if (/[a-zA-Z]/.test(password)) nbverif += 1;
    if (/\d/.test(password)) nbverif += 1;
    if (/[@!%*?&]/.test(password)) nbverif += 1;
    setPasswordStrength(nbverif);
  };

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

  const onSubmit = async (data) => {
    try {
      btnRef1.current.style.display = "none";
      btnRef2.current.style.display = "block";

      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);
      formData.append("role", data.user_role);
      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }

      const response = await axios.post(
        "https://hchaichi-bmqq.vercel.app/api/adduser",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.result) {
        Swal.fire({
          title: "Success",
          text: "User added successfully!",
          icon: "success",
        });
        // Reset the form
        reset();
        checkPasswordStrength("");
        handleImageRemove();
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.message,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("There was an error!", error);
      Swal.fire({
        title: "Error",
        text: "There was an error!: " + error,
        icon: "error",
      });
    }
    btnRef2.current.style.display = "none";
    btnRef1.current.style.display = "block";
  };

  return (
    <>
      <div className="card">
        <div className="card-header border-0 pt-6">
          <div className="card-title">
            <div className="d-flex align-items-center position-relative my-1">
              <i className="ki-duotone ki-magnifier fs-3 position-absolute ms-5">
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
              <input
                type="text"
                data-kt-user-table-filter="search"
                className="form-control  w-250px ps-13"
                placeholder="Search user"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>

          <div className="card-toolbar">
            <div
              className="d-flex justify-content-end"
              data-kt-user-table-toolbar="base"
            >
              <button
                type="button"
                className={`btn btn-light-primary me-3 ${
                  isFilterVisible ? "show menu-dropdown" : ""
                }`}
                data-kt-menu-trigger="click"
                data-kt-menu-placement="bottom-end"
                onClick={toggleFilter}
              >
                <i className="ki-duotone ki-filter fs-2">
                  <span className="path1"></span>
                  <span className="path2"></span>
                </i>{" "}
                Filter
              </button>

              <div
                className={`menu menu-sub menu-sub-dropdown w-300px w-md-325px ${
                  isFilterVisible ? "show" : ""
                }`}
                data-kt-menu="true"
                style={isFilterVisible ? filterStyle : {}}
              >
                <div className="px-7 py-5">
                  <div className="fs-5 text-gray-900 fw-bold">
                    Filter Options
                  </div>
                </div>

                <div className="separator border-gray-200"></div>

                <div className="px-7 py-5" data-kt-user-table-filter="form">
                  <div className="mb-10">
                    <label className="form-label fs-6 fw-semibold">Role:</label>
                    <select
                      className="form-select form-select-solid fw-bold"
                      data-kt-select2="true"
                      data-placeholder="Select option"
                      data-allow-clear="true"
                      data-kt-user-table-filter="role"
                      data-hide-search="true"
                      onChange={(e) => setRoleFilter(e.target.value)}
                    >
                      <option value="">All Roles</option>
                      <option value="admin">Admin</option>
                      <option value="client">Client</option>
                      <option value="assistant">Assistant</option>
                      <option value="technician">Technician</option>
                    </select>
                  </div>

                  <div className="d-flex justify-content-end">
                    <button
                      type="reset"
                      className="btn btn-light btn-active-light-primary fw-semibold me-2 px-6"
                      data-kt-menu-dismiss="true"
                      data-kt-user-table-filter="reset"
                      onClick={(e) => {
                        toggleFilter();
                      }}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary fw-semibold px-6"
                      data-kt-menu-dismiss="true"
                      data-kt-user-table-filter="filter"
                      onClick={(e) => {
                        fetchData();
                        toggleFilter();
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#kt_modal_add_user"
              >
                <i className="ki-duotone ki-plus fs-2"></i> Add User
              </button>
            </div>

            <div
              className="modal fade"
              id="kt_modal_add_user"
              tabIndex="-1"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered mw-650px">
                <div className="modal-content">
                  <div className="modal-header" id="kt_modal_add_user_header">
                    <h2 className="fw-bold">Add User</h2>

                    <button
                      type="button"
                      className="btn btn-icon btn-sm btn-active-icon-primary"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      <i className="ki-duotone ki-cross fs-1">
                        <span className="path1"></span>
                        <span className="path2"></span>
                      </i>
                    </button>
                  </div>

                  <div className="modal-body px-5 my-7">
                    <form
                      id="kt_modal_add_user_form"
                      className="form"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <div
                        className="d-flex flex-column scroll-y px-5 px-lg-10"
                        id="kt_modal_add_user_scroll"
                        data-kt-scroll="true"
                        data-kt-scroll-activate="true"
                        data-kt-scroll-max-height="auto"
                        data-kt-scroll-dependencies="#kt_modal_add_user_header"
                        data-kt-scroll-wrappers="#kt_modal_add_user_scroll"
                        data-kt-scroll-offset="300px"
                      >
                        <div className="fv-row mb-7">
                          <label className="d-block fw-semibold fs-6 mb-5">
                            Avatar
                          </label>
                          <div
                            className="image-input image-input-outline image-input-placeholder"
                            data-kt-image-input="true"
                          >
                            <div
                              className="image-input-wrapper w-125px h-125px"
                              style={{
                                backgroundImage: `url(${imagePreview})`,
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
                                name="avatar"
                                accept=".png, .jpg, .jpeg"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                              />
                              <input type="hidden" name="avatar_remove" />
                            </label>
                            <span
                              className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                              data-kt-image-input-action="cancel"
                              data-bs-toggle="tooltip"
                              title="Cancel avatar"
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
                              title="Remove avatar"
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

                        <div className="fv-row mb-7">
                          <label className="required fw-semibold fs-6 mb-2">
                            First Name
                          </label>
                          <input
                            className="form-control  mb-3 mb-lg-0"
                            type="text"
                            placeholder=""
                            {...register("firstName", {
                              required: "First name is required",
                            })}
                          />
                          {errors.firstName && (
                            <p>{errors.firstName.message}</p>
                          )}
                        </div>

                        <div className="fv-row mb-7">
                          <label className="required fw-semibold fs-6 mb-2">
                            Last Name
                          </label>
                          <input
                            className="form-control  mb-3 mb-lg-0"
                            type="text"
                            placeholder=""
                            {...register("lastName", {
                              required: "Last name is required",
                            })}
                          />
                          {errors.lastName && <p>{errors.lastName.message}</p>}
                        </div>
                        <div className="fv-row mb-7">
                          <label className="required fw-semibold fs-6 mb-2">
                            Email
                          </label>
                          <input
                            className="form-control  mb-3 mb-lg-0"
                            type="email"
                            placeholder="example@domain.com"
                            {...register("email", {
                              required: "Email is required",
                              pattern: {
                                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                                message: "Email is not valid",
                              },
                            })}
                            autoComplete="off"
                          />
                          {errors.email && <p>{errors.email.message}</p>}
                        </div>

                        <div className="fv-row mb-7">
                          <label className="required fw-semibold fs-6 mb-2">
                            Password
                          </label>
                          <div className="position-relative mb-3">
                            <input
                              className="form-control  mb-3 mb-lg-0"
                              type="password"
                              placeholder=""
                              {...register("password", {
                                required: "Password is required",
                                pattern: {
                                  value:
                                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*?&])[A-Za-z\d@!%*?&]{8,}$/,
                                  message:
                                    "Use 8 or more characters with a mix of letters, numbers & symbols except $",
                                },
                              })}
                              onChange={(e) =>
                                checkPasswordStrength(e.target.value)
                              }
                              autoComplete="off"
                            />
                            {errors.password && (
                              <p>{errors.password.message}</p>
                            )}
                          </div>
                          <div className="d-flex align-items-center mb-3">
                            <div
                              className={`flex-grow-1 rounded h-5px me-2 bg-secondary bg-active-success  ${
                                passwordStrength > 0 ? "active" : ""
                              }`}
                            ></div>
                            <div
                              className={`flex-grow-1 rounded h-5px me-2 bg-secondary bg-active-success  ${
                                passwordStrength > 1 ? " active" : ""
                              }`}
                            ></div>
                            <div
                              className={`flex-grow-1 rounded h-5px me-2 bg-secondary bg-active-success  ${
                                passwordStrength > 2 ? "active" : ""
                              }`}
                            ></div>
                            <div
                              className={`flex-grow-1 rounded h-5px bg-secondary bg-active-success  ${
                                passwordStrength > 3 ? "active" : ""
                              }`}
                            ></div>
                          </div>
                        </div>

                        <div className="fv-row mb-7">
                          <label className="required fw-semibold fs-6 mb-2">
                            Confirm Password
                          </label>
                          <input
                            className="form-control  mb-3 mb-lg-0"
                            type="password"
                            placeholder=""
                            {...register("confirmPassword", {
                              required: "Confirm password is required",
                              validate: (value) =>
                                value === password || "Passwords do not match",
                            })}
                          />
                          {errors.confirmPassword && (
                            <p>{errors.confirmPassword.message}</p>
                          )}
                        </div>

                        <div className="mb-5">
                          <label className="required fw-semibold fs-6 mb-5">
                            Role
                          </label>
                          <div className="d-flex fv-row">
                            <div className="form-check form-check-custom form-check-solid">
                              <input
                                className="form-check-input me-3"
                                name="user_role"
                                type="radio"
                                value="admin"
                                id="kt_modal_update_role_option_0"
                                {...register("user_role", {
                                  required: "Role is required",
                                })}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="kt_modal_update_role_option_0"
                              >
                                <div className="fw-bold text-gray-800">
                                  Administrator
                                </div>
                                <div className="text-gray-600">
                                  Can control everything in website.
                                </div>
                              </label>
                            </div>
                          </div>

                          <div className="separator separator-dashed my-5"></div>
                          <div className="d-flex fv-row">
                            <div className="form-check form-check-custom form-check-solid">
                              <input
                                className="form-check-input me-3"
                                name="user_role"
                                type="radio"
                                value="technician"
                                id="kt_modal_update_role_option_1"
                                {...register("user_role", {
                                  required: "Role is required",
                                })}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="kt_modal_update_role_option_1"
                              >
                                <div className="fw-bold text-gray-800">
                                  Technician
                                </div>
                                <div className="text-gray-600">
                                  Can only manage products.
                                </div>
                              </label>
                            </div>
                          </div>

                          <div className="separator separator-dashed my-5"></div>
                          <div className="d-flex fv-row">
                            <div className="form-check form-check-custom form-check-solid">
                              <input
                                className="form-check-input me-3"
                                name="user_role"
                                type="radio"
                                value="assistance"
                                id="kt_modal_update_role_option_2"
                                {...register("user_role", {
                                  required: "Role is required",
                                })}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="kt_modal_update_role_option_2"
                              >
                                <div className="fw-bold text-gray-800">
                                  Assistant
                                </div>
                                <div className="text-gray-600">
                                  Can only manage client discussion.
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-center pt-10">
                        <button
                          type="reset"
                          onClick={() => {
                            reset();
                            checkPasswordStrength("");
                            handleImageRemove();
                          }}
                          className="btn btn-light me-3"
                        >
                          Discard
                        </button>
                        <button type="submit" className="btn btn-primary">
                          <span ref={btnRef1} className="indicator-label">
                            Submit
                          </span>
                          <span ref={btnRef2} className="indicator-progress">
                            Please wait...{" "}
                            <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                          </span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body py-4">
          <table
            className="table align-middle table-row-dashed fs-6 gy-5"
            id="kt_table_users"
            {...getTableProps()}
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr
                  className="text-start text-muted fw-bold fs-7 text-uppercase gs-0"
                  {...headerGroup.getHeaderGroupProps()}
                >
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody
              className="text-gray-600 fw-semibold"
              {...getTableBodyProps()}
            >
              {loading ? (
                <tr>
                  <td colSpan="6">Loading...</td>
                </tr>
              ) : (
                page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          <div className="row">
            <div className="col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start dt-toolbar">
              <div>
                <label className="form-label fs-6 fw-semibold">Show: </label>
                <select
                  className="form-select form-select-solid fw-bold"
                  value={PerPage}
                  onChange={(e) => {
                    setPerPage(parseInt(e.target.value, 10));
                    setCurrentPage(1);
                  }}
                >
                  {[5, 10, 25, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end">
              <div className="dt-paging paging_simple_numbers">
                <ul className="pagination">
                  <li
                    className={`dt-paging-button page-item ${
                      1 === currentPage ? "disabled" : ""
                    }`}
                  >
                    <a
                      className="page-link previous"
                      tabIndex="-1"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <i className="previous"></i>
                    </a>
                  </li>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <li
                      key={index + 1}
                      className={`dt-paging-button page-item ${
                        index + 1 === currentPage ? "active" : ""
                      }`}
                    >
                      <a
                        onClick={() => handlePageChange(index + 1)}
                        className="page-link"
                        tabIndex="0"
                      >
                        {" "}
                        {index + 1}
                      </a>
                    </li>
                  ))}
                  <li
                    className={`dt-paging-button page-item ${
                      totalPages === currentPage ? "disabled" : ""
                    }`}
                  >
                    <a className="page-link next" tabIndex="0">
                      <i
                        className="next"
                        onClick={() => handlePageChange(currentPage + 1)}
                      ></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Userlist;
