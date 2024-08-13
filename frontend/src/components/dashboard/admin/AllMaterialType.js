import React, { useState, useEffect, useMemo,useRef, } from 'react';
import axios from 'axios';
import { useTable, usePagination, useFilters } from 'react-table';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';


function AllMaterialType() {
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
    const [statusFilter, setStatusFilter] = useState("");

    const [PerPage, setPerPage] = useState(10);

    const filterStyle = {
        zIndex: 107,
        position: 'fixed',
        inset: '0px 0px auto auto',
        margin: 0,
        transform: 'translate3d(-210px, 199.8px, 0px)'
      };

  
  
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:4000/product/materialtypes`, { params: { page: currentPage, limit: PerPage, search: searchInput, status: statusFilter}, withCredentials: true });
                setData(response.data.materialtypes);
                setTotalPages(response.data.totalPages);
                setCurrentPage(response.data.currentPage);
            } catch (error) {
                console.error('Error fetching materialtypes:', error);
            }
            setLoading(false);
        };
  
    useEffect(() => {
        fetchData();
      }, [currentPage, searchInput,PerPage]);

      const columns = useMemo(
        () => [
          {
            Header: 'Avatar',
            accessor: 'avatarMaterialType',
            Cell: ({ value, row }) => (
                <td className="d-flex align-items-center">
                <div className="symbol rounded-0 symbol-50px overflow-hidden me-3">
                  <a href="#">
                    <div className="symbol-label">
                      <img src={`http://localhost:4000/product/image/materialtype/${row.original.avatarMaterialType}` || '/assets/images/Default-profile.jpg'} alt={row.original.materialType_name} className="w-100" />
                    </div>
                  </a>
                </div>
              </td>
            )
          },
          {
            Header: 'Name',
            accessor: 'materialType_name',
          },
          {
            Header: 'Material',
            accessor: 'material',
          },

          {
            Header: 'Actions',
            Cell: ({ row }) => (
              <div className="text-end">

              <a href={`/admin/updateMaterialType/${row.original._id}`} className="btn btn-icon btn-warning rounded-0 me-2">
                <i className="ki-duotone ki-pencil fs-1"> <span className="path1"></span> <span className="path2"></span> </i>
              </a>

                <button className="btn btn-icon btn-danger rounded-0 me-2" onClick={() => handleDelete(row.original._id)}>
                  <i className="ki-duotone ki-trash fs-1"> <span className="path1"></span> <span className="path2"></span> <span className="path3"></span> <span className="path4"></span> <span className="path5"></span> </i>
                </button>
              </div>
            )
          }
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
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, cancel!',
        });
    
        if (result.isConfirmed) {
          try {
            await axios.delete(`http://localhost:4000/product/deletematerialtype/${userId}`, { withCredentials: true });
            Swal.fire('Deleted!', 'Material Type has been deleted.', 'success');
            fetchData(); // Refresh the data
          } catch (error) {
            console.error('Error deleting material Type:', error);
            Swal.fire('Error!', 'There was an error deleting the material Type.', 'error');
          }
        }
      };




    return (
        <>
        <div className="card">

        <div className="card-header border-0 pt-6">
            
            <div className="card-title">
                
            <div className="d-flex align-items-center position-relative my-1">
            <i className="ki-duotone ki-magnifier fs-3 position-absolute ms-5"><span className="path1"></span><span className="path2"></span></i>
            <input type="text" data-kt-user-table-filter="search" className="form-control form-control-solid w-250px ps-13" placeholder="Search material Type" value={searchInput} onChange={e => setSearchInput(e.target.value)} />
        </div>
      
            </div>
            

            
            <div className="card-toolbar">
            
                <div className="d-flex justify-content-end" data-kt-user-table-toolbar="base">
 
                    <button type="button"
                    className={`btn btn-light-primary me-3 ${isFilterVisible ? 'show menu-dropdown' : ''}`}
                        data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end"
                        onClick={toggleFilter}
                        >
                        <i className="ki-duotone ki-filter fs-2"><span className="path1"></span><span
                                className="path2"></span></i> Filter
                    </button>
    
                    <div
                    className={`menu menu-sub menu-sub-dropdown w-300px w-md-325px ${isFilterVisible ? 'show' : ''}`}
                    data-kt-menu="true" style={isFilterVisible ? filterStyle : {}} >
    
                        <div className="px-7 py-5">
                            <div className="fs-5 text-gray-900 fw-bold">Filter Options</div>
                        </div>
                        

                        
                        <div className="separator border-gray-200"></div>

                        <div className="px-7 py-5" data-kt-user-table-filter="form">
                            
                            <div className="mb-10">
                                <label className="form-label fs-6 fw-semibold">Role:</label>
                                <select className="form-select form-select-solid fw-bold"
                                    data-kt-select2="true" data-placeholder="Select option"
                                    data-allow-clear="true" data-kt-user-table-filter="role"
                                    data-hide-search="true" onChange={e => setStatusFilter(e.target.value)}>
                                    <option value="">All Roles</option>
                                    <option value="available">Available</option>
                                    <option value="not_available">Not Available</option>
                                </select>
                            </div>
                            
              
                            <div className="d-flex justify-content-end">
                                <button type="reset"
                                    className="btn btn-light btn-active-light-primary fw-semibold me-2 px-6"
                                    data-kt-menu-dismiss="true"
                                    data-kt-user-table-filter="reset"
                                    onClick={e => {toggleFilter();}}
                                        >Close</button>
                                <button type="submit" className="btn btn-primary fw-semibold px-6"
                                    data-kt-menu-dismiss="true"
                                    data-kt-user-table-filter="filter"
                                    onClick={e=> {fetchData();toggleFilter();}}
                                    >Apply</button>
                            </div>
              
                        </div>
 
                    </div>
                </div>
  
              
            </div>
          
        </div>
       

      
        <div className="card-body py-4">

            
            <table className="table align-middle table-row-dashed fs-6 gy-5" id="kt_table_users" {...getTableProps()}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr className="text-start text-muted fw-bold fs-7 text-uppercase gs-0" {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                    </tr>
                  ))}
                </thead>

                <tbody className="text-gray-600 fw-semibold" {...getTableBodyProps()}>
                {loading ? (
                    <tr>
                      <td colSpan="6">Loading...</td>
                    </tr>
                  ) : (
                    page.map(row => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()}>
                          {row.cells.map(cell => (
                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                          ))}


                        </tr>

                      );
                    })
                  )}



              </tbody>
            </table>
            <div  className="row">
                <div  className="col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start dt-toolbar">
                    <div>
                        <label className="form-label fs-6 fw-semibold">Show: </label>
                        <select className="form-select form-select-solid fw-bold" value={PerPage} onChange={e => { setPerPage(parseInt(e.target.value, 10)); setCurrentPage(1); }}>
                            {[5,10, 25, 50, 100].map(size => (
                                <option key={size} value={size}>
                                        {size}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div  className="col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end">
                    <div className="dt-paging paging_simple_numbers">
                        <ul className="pagination">
            
                            <li className={`dt-paging-button page-item ${ 1 === currentPage ? 'disabled' : ''}`}>
                                <a className="page-link previous"  tabIndex="-1" onClick={() => handlePageChange(currentPage - 1)}><i className="previous"></i></a>
                            </li>
                        {Array.from({ length: totalPages }, (_, index) => (
            
                            <li key={index + 1} className={`dt-paging-button page-item ${index + 1 === currentPage ? 'active' : ''}`}>
                                <a  onClick={() => handlePageChange(index + 1)}  className="page-link" tabIndex="0"> {index + 1}</a>
                            </li>
                        ))}
                            <li className={`dt-paging-button page-item ${totalPages ===  currentPage ? 'disabled' : ''}`}>
                                <a  className="page-link next"  tabIndex="0"><i className="next" onClick={() => handlePageChange(currentPage + 1)}></i>
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

export default AllMaterialType;