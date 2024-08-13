import React, { useContext, useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useTable, usePagination, useFilters } from "react-table";
import Swal from "sweetalert2";
import { AuthContext } from "./../../../AuthContext";

function Orderhistory() {
  var { userID } = useContext(AuthContext);
  console.log(userID);
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
  const [statusFilter, setStatusFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [PerPage, setPerPage] = useState(10);

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
        `https://hchaichi-bmqq.vercel.app/product/orders`,
        {
          params: {
            userId: userID,
            page: currentPage,
            limit: PerPage,
            search: searchInput,
            status: statusFilter,
          },
          withCredentials: true,
        }
      );
      setData(response.data.orders);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchInput, PerPage]);

  const columns = useMemo(
    () => [
      {
        Header: "See",
        Cell: ({ row }) => (
          <a
            href={`/user/orderView/${row.original._id}`}
            className="btn btn-link btn-color-dark btn-active-color-primary me-5 mb-2"
          >
            <i className="ki-duotone ki-eye fs-1">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
            </i>
          </a>
        ),
      },
      {
        Header: "NUM",
        accessor: "FactureNum",
        Cell: ({ value }) => "#" + value,
      },
      {
        Header: "Project Name",
        accessor: "projectName",
      },
      {
        Header: "Quantity",
        accessor: "quantity",
      },
      {
        Header: "Status",
        Cell: ({ row }) => {
          const status = row.original.status;
          let badgeClass = "";
          let badgeText = "";

          switch (status) {
            case "approved":
              badgeClass = "badge badge-light-success fw-bold";
              badgeText = "Approved";
              break;
            case "denied":
              badgeClass = "badge badge-light-danger fw-bold";
              badgeText = "Denied";
              break;
            case "pending":
              badgeClass = "badge badge-light-warning fw-bold";
              badgeText = "Pending";
              break;
            case "canceled":
              badgeClass = "badge badge-light-secondary fw-bold";
              badgeText = "Canceled";
              break;
            default:
              badgeClass = "badge badge-light-warning fw-bold";
              badgeText = "Pending";
          }

          return <div className={badgeClass}>{badgeText}</div>;
        },
      },

      {
        Header: "Date Added",
        accessor: "createdAt",
        Cell: ({ value }) => new Date(value).toLocaleString(),
      },
      {
        Header: "Total",
        Cell: ({ row }) => {
          const {
            quantity,
            OriginalShapeCost,
            OriginalMaterialCost,
            angles,
            edges,
            VatShape,
            VatMaterial,
            DiscountShapeDT,
            DiscountMaterialDT,
          } = row.original;

          const totalAnglesCost = angles.reduce(
            (total, angle) => total + angle.OriginalAngleCost,
            0
          );
          const totalEdgesCost = edges.reduce(
            (total, edge) => total + edge.OriginalEdgeCost,
            0
          );
          const totalVatShape = VatShape * 0.01 * OriginalShapeCost;
          const totalVatMaterial = VatMaterial * 0.01 * OriginalMaterialCost;
          const totalVatAngles = angles.reduce(
            (total, angle) =>
              total + angle.OriginalAngleCost * 0.01 * angle.VatAngle,
            0
          );
          const totalVatEdges = edges.reduce(
            (total, edge) =>
              total + edge.OriginalEdgeCost * 0.01 * edge.VatEdge,
            0
          );
          const totalDiscount =
            DiscountShapeDT +
            DiscountMaterialDT +
            angles.reduce((total, angle) => total + angle.DiscountAngleDT, 0) +
            edges.reduce((total, edge) => total + edge.DiscountEdgeDT, 0);

          const total =
            quantity *
            (OriginalShapeCost +
              OriginalMaterialCost +
              totalAnglesCost +
              totalEdgesCost +
              totalVatShape +
              totalVatMaterial +
              totalVatAngles +
              totalVatEdges -
              totalDiscount);

          return <div>{total} DT</div>;
        },
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="text-end">
            {row.original.status === "pending" ? (
              <>
                <button
                  className="btn btn-link btn-color-warning btn-active-color-primary me-5 mb-2"
                  onClick={() => handleCancel(row.original._id)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-link btn-color-danger btn-active-color-primary me-5 mb-2"
                  onClick={() => handleDelete(row.original._id)}
                >
                  DELETE
                </button>
                <a
                  href={`/user/editorder/${row.original._id}/`}
                  className="btn btn-icon btn-info rounded-0 me-2"
                >
                  <i class="ki-duotone ki-pencil fs-1">
                    {" "}
                    <span class="path1"></span> <span class="path2"></span>{" "}
                  </i>
                </a>
              </>
            ) : (
              "No Action"
            )}
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

  const handleCancel = async (orderId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      try {
        await axios.post(
          `https://hchaichi-bmqq.vercel.app/product/cancelorder/${orderId}`,
          { withCredentials: true }
        );
        Swal.fire("Canceled!", "Order has been canceled.", "success");
        fetchData(); // Refresh the data
      } catch (error) {
        console.error("Error canceling order:", error);
        Swal.fire("Error!", "There was an error canceling the order.", "error");
      }
    }
  };

  const handleDelete = async (orderId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "danger",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `https://hchaichi-bmqq.vercel.app/product/deleteorder/${orderId}`,
          { withCredentials: true }
        );
        Swal.fire("Deleted!", "Order has been deleted.", "success");
        fetchData(); // Refresh the data
      } catch (error) {
        console.error("Error deleting order:", error);
        Swal.fire("Error!", "There was an error deleting the order.", "error");
      }
    }
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
                className="form-control form-control-solid w-250px ps-13"
                placeholder="Search project name"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>
          <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
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
                    <label className="form-label fs-6 fw-semibold">
                      Status:
                    </label>
                    <select
                      className="form-select form-select-solid fw-bold"
                      data-kt-select2="true"
                      data-placeholder="Select option"
                      data-allow-clear="true"
                      data-kt-user-table-filter="role"
                      data-hide-search="true"
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">All</option>
                      <option value="approved">Approved</option>
                      <option value="denied">Denied</option>
                      <option value="pending">Pending</option>
                      <option value="canceled">Canceled</option>
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
            </div>

            <a href="/user/addorder" className="btn btn-primary">
              Create Order
            </a>
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
              ) : data.length === 0 ? (
                <tr className="text-center">
                  <td colSpan="8">No orders found</td>
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

export default Orderhistory;
