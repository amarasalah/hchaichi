import React, { useState, useEffect, useMemo,useRef, } from 'react';
import axios from 'axios';
import { useTable, usePagination, useFilters } from 'react-table';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';


function Clientlist() {
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
      };
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchInput, setSearchInput] = useState("");

    const [PerPage, setPerPage] = useState(10);
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:4000/api/clients`, { params: { page: currentPage, limit: PerPage, search: searchInput,}, withCredentials: true });
                setData(response.data.users);
                setTotalPages(response.data.totalPages);
                setCurrentPage(response.data.currentPage);
            } catch (error) {
                console.error('Error fetching clients:', error);
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
            accessor: 'imageUrl',
            Cell: ({ value, row }) => (
              <div className="d-flex align-items-center">
                <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
                  <a href={"/admin/viewclient/"+row.original._id}>
                    <div className="symbol-label">
                      <img src={   row.original.image || row.original.imageUrl || '/assets/images/Default-profile.jpg'} alt={row.original.firstName} className="w-100" />
                    </div>
                  </a>
                </div>
                <div className="d-flex flex-column">
                  <a href={"/admin/viewclient/"+row.original._id} className="text-gray-800 text-hover-primary mb-1">
                    {row.original.firstName} {row.original.lastName !== "its$fromgoogle" ? row.original.lastName : ""}
                  </a>
                  <span>{row.original.email}</span>
                </div>
              </div>
            )
          },
          {
            Header: 'Verification',
            Cell: ({ row }) => (
              row.original.verification ? 
                <div className="badge badge-light-success fw-bold">Verified</div> : 
                <div className="badge badge-light-danger fw-bold">Not Verified</div>
            )
          },
          {
            Header: 'Joined Date',
            accessor: 'joinedDate',
            Cell: ({ value }) => new Date(value).toLocaleString()
          },
          {
            Header: 'Actions',
            Cell: ({ row }) => (
              <div className="text-end">
              <button className="btn btn-icon btn-success rounded-0 me-2" onClick={() => handleSendMessage(row.original._id)}>
              <i className="ki-duotone ki-messages fs-1 "> <span className="path1"></span> <span className="path2"></span> <span className="path3"></span> <span className="path4"></span> <span className="path5"></span> </i>
            </button>

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
            await axios.delete(`http://localhost:4000/api/deletestaff/${userId}`, { withCredentials: true });
            Swal.fire('Deleted!', 'User has been deleted.', 'success');
            fetchData(); // Refresh the data
          } catch (error) {
            console.error('Error deleting user:', error);
            Swal.fire('Error!', 'There was an error deleting the user.', 'error');
          }
        }
      };



      const handleSendMessage = async (userId) => {
        const { value: formValues } = await Swal.fire({
          title: 'Send Message',
          input: 'textarea',
          inputLabel: 'Message',
          inputPlaceholder: 'Type your message here...',
          inputAttributes: {
            'aria-label': 'Type your message here'
          },
          showCancelButton: true,
          confirmButtonText: 'Send',
          cancelButtonText: 'Cancel',
          inputValidator: (value) => {
            if (!value) {
              return 'You need to write something!';
            }
          }
        });
    
        if (formValues) {
          try {
            await axios.post('http://localhost:4000/chat/user/post', {
              receiver: userId,
              content: formValues
            }, { withCredentials: true });
    
            Swal.fire('Sent!', 'Your message has been sent.', 'success');
          } catch (error) {
            console.error('Error sending message:', error);
            Swal.fire('Error!', 'There was an error sending the message.', 'error');
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
            <input type="text" data-kt-user-table-filter="search" className="form-control form-control-solid w-250px ps-13" placeholder="Search client" value={searchInput} onChange={e => setSearchInput(e.target.value)} />
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

export default Clientlist;