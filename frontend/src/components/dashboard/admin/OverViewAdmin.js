import React, { useContext,useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { useNavigate}  from 'react-router-dom';

function OverViewAdmin() {
    const navigate = useNavigate();

    const { orderId,userId } = useParams();

    const [quantity, setQuantity] = useState(1);
    const [orderData, setorderData] = useState('');
    const [VatShape, setVatShape] = useState('');
    const [VatMaterial, setVatMaterial] = useState('');
    const [thicknessinvoice, setthicknessinvoice] = useState('');
    const [A_valueinvoice, setA_valueinvoice] = useState('');
    const [B_valueinvoice, setB_valueinvoice] = useState('');
    const [C_valueinvoice, setC_valueinvoice] = useState('');
    const [shapeNameinvoice, setShapeNameinvoice] = useState('');
    const [OriginalShapeCostinvoice, setOriginalShapeCostinvoice] = useState('');
    const [DiscountShapeDTinvoice, setDiscountShapeDTinvoice] = useState('');
    const [materialNameinvoice, setmaterialNameinvoice] = useState('');
    const [OriginalMaterialCostinvoice, setOriginalMaterialCostinvoice] = useState('');
    const [materialinvoice, setmaterialinvoice] = useState('');
    const [materialTypeinvoice, setmaterialTypeinvoice] = useState('');
    const [DiscountMaterialDTinvoice, setDiscountMaterialDTinvoice] = useState('');
    const [NBAngleCutted, setNBAngleCuttedinvoice] = useState('');
    const [NBEdgeCuttedinvoice, setNBEdgeCuttedinvoice] = useState('');
    const [anglesList, setAnglesList] = useState([]);
    const [edgesList, setEdgesList] = useState([]);
    const [files, setFiles] = useState([]);
    const [receiver, setReceiver] = useState({});
    const [Mdescription, setDescription] = useState({});


    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/product/order/${orderId}/${userId}`, {
                withCredentials: true 
            });

            const order = response.data.order;
            console.log(order)
            setorderData(order);
            setQuantity(order.quantity);
            setA_valueinvoice(order.A_value);
            setB_valueinvoice(order.B_value);
            setC_valueinvoice(order.C_value);
            setShapeNameinvoice(order.shapeName);
            setOriginalShapeCostinvoice(order.OriginalShapeCost);
            setDiscountShapeDTinvoice(order.DiscountShapeDT);
            setmaterialNameinvoice(order.materialName);
            setOriginalMaterialCostinvoice(order.OriginalMaterialCost);
            setmaterialinvoice(order.material);
            setmaterialTypeinvoice(order.materialType);
            setDiscountMaterialDTinvoice(order.DiscountMaterialDT);
            setNBAngleCuttedinvoice(order.NBAngleCutted);
            setNBEdgeCuttedinvoice(order.NBEdgeCutted);
            setAnglesList(order.angles);
            setEdgesList(order.edges);
            setthicknessinvoice(order.thickness);
            setVatShape(order.VatShape);
            setVatMaterial(order.VatMaterial);
            setFiles(order.file);

            setReceiver({
                company_name: order.receiver_company_name,
                logopath : order.receiver_logopath,
                Raddress :order.receiver_address,
                geocode:order.receiver_geocode,
                Remail : order.receiver_email,
                Rphone: order.receiver_phone,
                Rfax :order.receiver_fax,
                ApprovedDate : order.ApprovedDate,
                DeclinedDate : order.DeclinedDate
            });
            setDescription({
                angle: order.angleDescription,
                edge: order.edgeDescription
            })

        } catch (error) {
            console.error('Error fetching order:', error);
            navigate(`/`, { replace: true });
        }
    };

    useEffect(() => {
        fetchData();
    }, [userId]);

    const handlePrint = () => {
        window.print();
      };

/*       const getFileExtension = (fileName) => {
        return fileName.split('.').pop();
    }; */




  return (
    <>
    <div className="card">
   
    <div className="card-body p-lg-20">
        
        <div className="d-flex flex-column flex-xl-row">
            
            <div className="flex-lg-row-fluid me-xl-18 mb-10 mb-xl-0">
                
                <div className="mt-n1">
                    
                    { receiver.logopath && (
                        <div className="d-flex flex-stack pb-10">
                            <a href="#">
                                <img alt="Logo"
                                    src={ "http://localhost:4000/settings/image/" + receiver.logopath} />
                            </a>
                        </div>
                    )}


                    <div className="m-0">
                        
                        <div className="fw-bold fs-3 text-gray-800 mb-8">Invoice #{orderData.FactureNum}
                        {(() => {
                            const status = orderData.status;
                            let badgeClass = "";
                            let badgeText = "";
                        
                            switch (status) {
                              case 'approved':
                                badgeClass = "badge badge-light-success fw-bold me-2 fs-3";
                                badgeText = "(Approved)";
                                break;
                              case 'denied':
                                badgeClass = "badge badge-light-danger fw-bold me-2 fs-3";
                                badgeText = "(Denied)";
                                break;
                              case 'pending':
                                badgeClass = "badge badge-light-warning fw-bold me-2 fs-3";
                                badgeText = "(Pending)";
                                break;
                              case 'canceled':
                                badgeClass = "badge badge-light-secondary fw-bold me-2 fs-3";
                                badgeText = "(Canceled)";
                                break;
                              default:
                                badgeClass = "badge badge-light-warning fw-bold me-2 fs-3";
                                badgeText = "(Pending)";
                            }
                        
                            return <span className={badgeClass}>{badgeText}</span>;
                          })()} </div>
                            <div className="row g-5 mb-11">
                                <div className="col-sm-6">
                                    <div className="fw-semibold fs-7 text-gray-600 mb-1">Issue Date:
                                    </div>
                                    <div className="fw-bold fs-6 text-gray-800">{new Date(orderData.createdAt).toLocaleString()}</div>
                                </div>
                            { receiver.ApprovedDate &&  (
                                <div className="col-sm-6">
                                    <div className="fw-semibold fs-7 text-gray-600 mb-1">Approvement Date:</div>
                                    <div
                                        className="fw-bold fs-6 text-gray-800 d-flex align-items-center flex-wrap">
                                        <span className="pe-2">{new Date(receiver.ApprovedDate).toLocaleString()}</span>
                                    </div>
                                </div>
                            )}
                            { receiver.DeclinedDate &&  (
                                <div className="col-sm-6">
                                    <div className="fw-semibold fs-7 text-gray-600 mb-1">Rejection Date:</div>
                                    <div
                                        className="fw-bold fs-6 text-gray-800 d-flex align-items-center flex-wrap">
                                        <span className="pe-2">{new Date(receiver.DeclinedDate).toLocaleString()}</span>
                                    </div>
                                </div>
                            )}
                                
                            </div>

                            <div className="row g-5 mb-12">
                                
                                <div className="col-sm-6">
                                    
                                    <div className="fw-semibold fs-7 text-gray-600 mb-1">Issue For:
                                    </div>
                                    

                                    
                                    {receiver.company_name && (<div className="fw-bold fs-6 text-gray-800">{receiver.company_name}</div>)}
                                    

                                    
{receiver.Raddress &&(                                    <div className="fw-semibold fs-7 text-gray-600">
                                        {receiver.Raddress} <br />
                                        {receiver.geocode}
                                    </div>)}
                                    
                                </div>
                                

                                
                                <div className="col-sm-6">
                                    
                                    <div className="fw-semibold fs-7 text-gray-600 mb-1">Issued By:
                                    </div>

                                    <div className="fw-bold fs-6 text-gray-800">{orderData.firstName} {orderData.lastName !== "its$fromgoogle" ? orderData.lastName : ""}</div>

                                    <div className="fw-semibold fs-7 text-gray-600">
                                    {orderData.addr1 ? orderData.addr1 : ''}<br />
                                    {orderData.addr2 ? orderData.addr2 : ''}<br />
                                    {orderData.town ? orderData.town : ''}, {orderData.country ? orderData.country : ''}, {orderData.postCode ? orderData.postCode : '' }, {orderData.sp ? orderData.sp : '' }


                                    </div>
                                    
                                </div>
                                
                            </div>

                            <div className="flex-grow-1">
                            <div className="table-responsive border-bottom mb-9">
                                <table className="table mb-3">
                                    <thead>
                                        <tr className="border-bottom fs-6 fw-bold text-muted">
                                            <th className="min-w-100px pb-2">Description</th>
                                            <th className="min-w-145px pb-2">Choice</th>
                                            <th className="min-w-100px text-end pb-2">Amount</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr className="fw-bold text-gray-700 fs-5 border-bottom">
                                            <td className="d-flex align-items-center">
                                                <i
                                                    className="fa fa-genderless text-primary fs-2 me-2"></i>
                                                    Shape 
                                            </td>

                                            <td>{shapeNameinvoice} ( {A_valueinvoice } { B_valueinvoice > 0 ? ' | ' + B_valueinvoice: ''} {C_valueinvoice > 0 ? ' | ' + C_valueinvoice : ''} )</td>
                                            <td className="fs-5 text-gray-900 fw-bolder text-end">{OriginalShapeCostinvoice} DT </td>
                                        </tr>


                                        <tr className="fw-bold text-gray-700 fs-5 border-bottom">
                                            <td className="d-flex align-items-center">
                                                <i
                                                    className="fa fa-genderless text-primary fs-2 me-2"></i>
                                                    Material
                                            </td>

                                            <td><ul>
                                                <li>{materialNameinvoice}</li>
                                                <li>{materialTypeinvoice}</li>
                                                <li>{materialinvoice}</li>
                                                <li>Thickness: {thicknessinvoice}mm</li>
                                            </ul></td>
                                            <td className="fs-5 text-gray-900 fw-bolder text-end">{OriginalMaterialCostinvoice} DT</td>
                                        </tr>



                                        <tr className="fw-bold text-gray-700 fs-5 border-bottom">
                                            <td className="d-flex align-items-center">
                                                <i
                                                    className="fa fa-genderless text-primary fs-2 me-2"></i>
                                                    Angles ({NBAngleCutted})
                                            </td>

                                            <td>
                                            {anglesList.map((angle, index) => (
                                                <li>{angle.Angle_name}</li>
                                             ))}
                                            </td>


                                            <td className="fs-5 text-gray-900 fw-bolder text-end">
                                                {anglesList.reduce((total, angle) => total + angle.OriginalAngleCost, 0)} DT
                                            </td>
                                        </tr>

                                        <tr className="fw-bold text-gray-700 fs-5 border-bottom">
                                            <td className="d-flex align-items-center">
                                                <i
                                                    className="fa fa-genderless text-primary fs-2 me-2"></i>
                                                    Edges ({NBEdgeCuttedinvoice})
                                            </td>

                                            <td>
                                            {edgesList.map((edge, index) => (
                                                <li>{edge.Edge_name}</li>
                                             ))}
                                            </td>
                                            <td className="fs-5 text-gray-900 fw-bolder text-end">
                                                {edgesList.reduce((total, edge) => total + edge.OriginalEdgeCost, 0)} DT
                                            </td>

                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                            <div className="d-flex justify-content-end">
                                <div className="mw-600px">

                                <div className="d-flex flex-stack mb-3">
                                <div className="fw-semibold pe-10 text-gray-600 fs-7">
                                Quantity:</div>
                                <div className="text-end fw-bold fs-6 text-gray-800">
                                    {quantity}</div>
                            </div>


                                    <div className="d-flex flex-stack mb-3">
                                        <div className="fw-semibold pe-10 text-gray-600 fs-7">
                                            Subtotal:</div>
                                        <div className="text-end fw-bold fs-6 text-gray-800">$
                                            {quantity*(OriginalShapeCostinvoice + OriginalMaterialCostinvoice + anglesList.reduce((total, angle) => total + angle.OriginalAngleCost, 0) + edgesList.reduce((total, edge) => total + edge.OriginalEdgeCost, 0)) } DT</div>
                                    </div>


                                    <div className="d-flex flex-stack mb-3">
                                        <div className="fw-semibold pe-10 text-gray-600 fs-7">Discount</div>
                                        <div className="text-end fw-bold fs-6 text-gray-800">${quantity*(DiscountShapeDTinvoice + DiscountMaterialDTinvoice + anglesList.reduce((total, angle) => total + angle.DiscountAngleDT, 0) + edgesList.reduce((total, edge) => total + edge.DiscountEdgeDT, 0))} DT</div>
                                    </div>


                                    <div className="d-flex flex-stack mb-3">
                                        <div className="fw-semibold pe-10 text-gray-600 fs-7">VAT</div>
                                        <div className="text-end fw-bold fs-6 text-gray-800">${quantity*((VatShape*0.01*OriginalShapeCostinvoice) + (VatMaterial*0.01*OriginalMaterialCostinvoice) + (anglesList.reduce((total, angle) => total + (angle.OriginalAngleCost * 0.01* angle.VatAngle), 0)) + (edgesList.reduce((total, edge) => total + (edge.OriginalEdgeCost * 0.01*edge.VatEdge ), 0)))} DT</div>
                                    </div>



                                    <div className="d-flex flex-stack mb-3">
                                        <div className="fw-semibold pe-10 text-gray-600 fs-7">
                                            Subtotal + VAT</div>
                                        <div className="text-end fw-bold fs-6 text-gray-800">$
                                        {quantity*(OriginalShapeCostinvoice + OriginalMaterialCostinvoice + anglesList.reduce((total, angle) => total + angle.OriginalAngleCost, 0) + edgesList.reduce((total, edge) => total + edge.OriginalEdgeCost, 0) + (VatShape*0.01*OriginalShapeCostinvoice) + (VatMaterial*0.01*OriginalMaterialCostinvoice) + (anglesList.reduce((total, angle) => total + (angle.OriginalAngleCost * 0.01* angle.VatAngle), 0)) + (edgesList.reduce((total, edge) => total + (edge.OriginalEdgeCost * 0.01*edge.VatEdge ), 0)))} DT</div>
                                    </div>
                                    <div className="d-flex flex-stack">
                                        <div className="fw-semibold pe-10 text-gray-600 fs-7">Total
                                        </div>
                                        <div className="text-end fw-bold fs-6 text-gray-800">$
                                        {quantity*(OriginalShapeCostinvoice + OriginalMaterialCostinvoice + anglesList.reduce((total, angle) => total + angle.OriginalAngleCost, 0) + edgesList.reduce((total, edge) => total + edge.OriginalEdgeCost, 0) + (VatShape*0.01*OriginalShapeCostinvoice) + (VatMaterial*0.01*OriginalMaterialCostinvoice) + (anglesList.reduce((total, angle) => total + (angle.OriginalAngleCost * 0.01* angle.VatAngle), 0)) + (edgesList.reduce((total, edge) => total + (edge.OriginalEdgeCost * 0.01*edge.VatEdge ), 0))- (DiscountShapeDTinvoice + DiscountMaterialDTinvoice + anglesList.reduce((total, angle) => total + angle.DiscountAngleDT, 0) + edgesList.reduce((total, edge) => total + edge.DiscountEdgeDT, 0)))} DT</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                       
                    </div>
                </div>
                
            </div>

            <div className='d-print-flex'>
                <br></br> <br></br><br></br><br></br><br></br><br></br><br></br>
            </div>
 
            <div className="m-0">
               
                <div
                    className=" border border-dashed border-gray-300 card-rounded h-lg-100 min-w-md-350px p-9 bg-lighten">
                    
                    <h6 className="mb-8 fw-bolder text-gray-600 text-hover-primary">CLIENT DETAILS
                    </h6>
                    

                   
                    <div className="mb-6">
                        <div className="fw-semibold text-gray-600 fs-7">Email:</div>

                        <div className="fw-bold text-gray-800 fs-6">{orderData.email}</div>
                    </div>
                    

                   
                    <div className="mb-6">
                        <div className="fw-semibold text-gray-600 fs-7">Account ID:</div>

                        <div className="fw-bold text-gray-800 fs-6">
                            {orderData.userId} <br />
                            ({orderData.firstName} {orderData.lastName !== "its$fromgoogle" ? orderData.lastName : ""})
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="fw-semibold text-gray-600 fs-7">Phone:</div>

                        <div className="fw-bold text-gray-800 fs-6">
                            {orderData.phone}
                        </div>
                    </div>

                    <h6 className="mb-8 fw-bolder text-gray-600 text-hover-primary">COMPANY DETAILS
                    </h6>

{receiver.Remail && (                    <div className="mb-6">
                        <div className="fw-semibold text-gray-600 fs-7">Email:</div>
                        <div className="fw-bold text-gray-800 fs-6">{receiver.Remail}</div>
                    </div>)}

{receiver.Rphone && (                    <div className="mb-6">
                        <div className="fw-semibold text-gray-600 fs-7">Phone:</div>
                        <div className="fw-bold text-gray-800 fs-6">
                            {receiver.Rphone}
                        </div>
                    </div>)}

                    {receiver.Rfax && (                    <div className="mb-6">
                        <div className="fw-semibold text-gray-600 fs-7">FAX:</div>
                        <div className="fw-bold text-gray-800 fs-6">
                            {receiver.Rfax}
                        </div>
                    </div>)}

                    <h6 className="mb-8 fw-bolder text-gray-600 text-hover-primary">PROJECT OVERVIEW
                    </h6>
                    

                   
                    <div className="mb-6">
                        <div className="fw-semibold text-gray-600 fs-7">Project Name:</div>

                        <div className="fw-bold fs-6 text-gray-800">
                            {orderData.projectName}
                        </div>
                    </div>


                    <div className="mb-6">
                        <div className="fw-semibold text-gray-600 fs-7">ID Invoice:</div>

                        <div className="fw-bold fs-6 text-gray-800">
                            {orderData._id}
                        </div>
                    </div>


                    
                  { (Mdescription.angle || Mdescription.edge) && (  <h6 className="mb-8 fw-bolder text-gray-600 text-hover-primary">DESCRIPTION</h6>)}

{Mdescription.angle && (                    <div className="mb-6">
                        <div className="fw-semibold text-gray-600 fs-7">Angles:</div>
                        <div className="fw-bold text-gray-800 fs-6">{Mdescription.angle}</div>
                    </div>)}

{Mdescription.edge && (                <div className="mb-6">
                    <div className="fw-semibold text-gray-600 fs-7">Edges:</div>
                    <div className="fw-bold text-gray-800 fs-6">{Mdescription.edge}</div>
                </div>)}




                            {files && files.length > 0 && (
                                <> 
                                {/* Files Section */}
                                <div>
                                    <div className="fw-semibold text-gray-600 fs-7">Files :</div>
                                </div>
                                <div className="table-responsive border-bottom mb-9">
                                <table className="table mb-3">
                                    <thead>
                                        <tr className="border-bottom fs-6 fw-bold text-muted">
                                            <th className="min-w-100px pb-2">Name</th>
                                            <th className="min-w-100px pb-2 d-print-none">Download</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {files.map((file, index) => (
                                            <tr className="fw-bold text-gray-700 fs-5 border-bottom" key={index}>
                                                <td>{file.originalname}</td>
                                                <td className='d-print-none'>
                                                    <a href={`http://localhost:4000/product/image/order/${file.path}`} download={file.path}>Download</a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            </>
                        )}





                    <div className="mb-6 d-print-none">
                    <button type="button" className="btn btn-primary" onClick={handlePrint}>Print Invoice</button>
                    </div>

                    
                </div>
               
            </div>
           
        </div>
        
    </div>
    
</div>
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    </>
  )
}

export default OverViewAdmin;