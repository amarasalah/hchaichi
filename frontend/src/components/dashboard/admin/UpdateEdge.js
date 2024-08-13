import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';


function UpdateEdge() {
    const { EdgeId } = useParams();
    const btnRef1 = useRef(null);
    const btnRef2 = useRef(null);
    const [selectedOption, setSelectedOption] = useState(''); // Default to 'No Discount'
    const [formData, setFormData] = useState({
        edge_name: '',
        edgedescription: '',
        price: '',
        discount_option: '1',
        discounted_percentage: 0,
        discounted_price: 0,
        vat_amount: 0,
        status: 'available',
        avatarEdge: null,
    });
    const [imagePreviews, setImagePreviews] = useState({});
    useEffect(() => {
        const fetchEdge = async () => {
          try {
            const response = await axios.get(`http://localhost:4000/product/edge/${EdgeId}`, {withCredentials: true});
            const pivot = {
                edge_name: response.data.edge.Edge_name,
                edgedescription: response.data.edge.Edgedescription,
                price: response.data.edge.price,
                discount_option: '' +  response.data.edge.discount_option,
                discounted_percentage: response.data.edge.discounted_percentage,
                discounted_price: response.data.edge.discounted_price,
                vat_amount: response.data.edge.vat_amount,
                status: response.data.edge.status,
                avatarEdge: null,
            }
            setFormData(pivot);
            setSelectedOption( '' +  response.data.edge.discount_option);
            if(response.data.edge.avatarEdge){
                setImagePreviews({avatarEdge:  'http://localhost:4000/product/image/edge/' + response.data.edge.avatarEdge})
            }else{
                setImagePreviews({avatarEdge: '/assets/media/svg/files/blank-image.svg',})
            }
          } catch (err) {
            console.log("There was an error fetching the edge!");
          }
        };
    
        fetchEdge();
      }, [EdgeId]);



    useEffect(() => {
        // Set initial previews
        setImagePreviews(prev => ({
            ...prev,
            avatarEdge: formData.avatarEdge ? URL.createObjectURL(formData.avatarEdge) : prev.avatarEdge,
        }));
    }, [formData.avatarEdge]);
    const handleStatusChange = (e) => {
        setFormData({
            ...formData,
            status: e.target.value
        });
        //console.log(formData);
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
        if ((name === 'discounted_percentage') && (value < 0 || value > 100)) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: `${name.replace(/_/g, ' ')} must be between 0 and 100.`,
            });
            newValue = 1
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
            if (key.startsWith('avatar') && formData[key]) {
                newImagePreviews[key] = URL.createObjectURL(formData[key]);
            }
        }
        setImagePreviews(newImagePreviews);
    }, [formData]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        btnRef1.current.style.display = 'none';
        btnRef2.current.style.display = 'block';

        // Check required fields
        const requiredFields = ['edge_name', 'price','vat_amount'];
        for (const field of requiredFields) {
            if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '') ) {
                Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required.`,
                });
                btnRef2.current.style.display = 'none';
                btnRef1.current.style.display = 'block';
                return;
            }
            if(formData['price'] < 0){
                Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: `Price is required.`,
                });
                btnRef2.current.style.display = 'none';
                btnRef1.current.style.display = 'block';
                return;
            }
        }
            // Additional validation based on Discount Type
    if (selectedOption === '2') {
        if (!formData.discounted_percentage || formData.discounted_percentage <= 0 || formData.discounted_percentage > 100) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Discount Percentage must be between 1 and 100.',
            });
            btnRef2.current.style.display = 'none';
            btnRef1.current.style.display = 'block';
            return;
        }
    }

    if (selectedOption === '3') {
        if (!formData.discounted_price || formData.discounted_price <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Fixed Discounted Price must be greater than 0 when selected.',
            });
            btnRef2.current.style.display = 'none';
            btnRef1.current.style.display = 'block';
            return;
        }
    }

            

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        //console.log(data);

        try {
            const response = await axios.put(`http://localhost:4000/product/edge/${EdgeId}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            console.log(response.data);

            Swal.fire({
                icon: 'success',
                title: 'Edge Updating Successfully',
                text: response.data.message || response.data,
            });
        } catch (error) {
            console.error('There was an error!', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'There was an error updating the Edge!',
            });
        }
        btnRef2.current.style.display = 'none';
        btnRef1.current.style.display = 'block';
    };


    return (
        <>
            <form id="kt_ecommerce_add_product_form" className="form d-flex flex-column flex-lg-row" data-kt-redirect="/" onSubmit={handleSubmit}>

                <div className="d-flex flex-column gap-7 gap-lg-10 w-100 w-lg-300px mb-7 me-lg-10">

                    <div className="card card-flush py-4">

                        <div className="card-header">

                            <div className="card-title">
                                <h2>Edge Thumbnail</h2>
                            </div>

                        </div>

                        <div className="card-body text-center pt-0">



                            <div className="image-input image-input-empty image-input-outline image-input-placeholder mb-3"
                                data-kt-image-input="true">

                                <div className="image-input-wrapper w-150px h-150px" style={{ backgroundImage: `url(${imagePreviews.avatarEdge})` }}></div>

                                <label
                                    className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                                    data-kt-image-input-action="change" data-bs-toggle="tooltip"
                                    title="Change avatar">
                                    <i className="ki-duotone ki-pencil fs-7"><span className="path1"></span><span
                                        className="path2"></span></i>

                                    <input type="file" name="avatarEdge" accept=".png, .jpg, .jpeg, .svg" onChange={handleFileChange} />
                                    <input type="hidden" name="avatar_remove" />

                                </label>

                                <span
                                    className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                                    data-kt-image-input-action="cancel" data-bs-toggle="tooltip"
                                    title="Cancel avatar">
                                    <i className="ki-duotone ki-cross fs-2"><span className="path1"></span><span
                                        className="path2"></span></i> </span>



                                <span
                                    className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                                    data-kt-image-input-action="remove" data-bs-toggle="tooltip"
                                    title="Remove avatar">
                                    <i className="ki-duotone ki-cross fs-2"><span className="path1"></span><span
                                        className="path2"></span></i> </span>

                            </div>



                            <div className="text-muted fs-7">Set the edge thumbnail image. Only *.png, *.jpg, *.svg
                                and *.jpeg image files are accepted
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
                                <option value="available" selected={   formData.status === "available"}>Available</option>
                                <option value="not_available" selected={   formData.status === "not_available"}>Not Available</option>
                            </select>

                            <div className="text-muted fs-7">Set the product status.</div>
                        </div>

                    </div>

                </div>

                <div className="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">

                    <ul
                        className="nav nav-custom nav-tabs nav-line-tabs nav-line-tabs-2x border-0 fs-4 fw-semibold mb-n2">

                        <li className="nav-item">
                            <a className="nav-link text-active-primary pb-4 active" data-bs-toggle="tab"
                                href="#kt_ecommerce_add_product_general">General</a>
                        </li>
                    </ul>

                    <div className="tab-content">

                        <div className="tab-pane fade show active" id="kt_ecommerce_add_product_general"
                            role="tab-panel">
                            <div className="d-flex flex-column gap-7 gap-lg-10">


                                <div className="card card-flush py-4">

                                    <div className="card-header">
                                        <div className="card-title">
                                            <h2>General</h2>
                                        </div>
                                    </div>



                                    <div className="card-body pt-0">

                                        <div className="mb-2 fv-row">

                                            <label className="required form-label">Edge Name</label>



                                            <input type="text" name="edge_name" className="form-control mb-2"
                                                placeholder="Edge name" defaultValue={formData.edge_name} onChange={handleInputChange} required/>



                                            <div className="text-muted fs-7">A edge name is required and
                                                recommended to be unique.</div>

                                        </div>


                                        <div className='mb-2 fv-row'>

                                            <label className="form-label" htmlFor="floatingTextarea2">Description</label>



                                            <div className="mb-2">
                                                <textarea className="form-control" defaultValue={formData.edgedescription} placeholder="Description" name="edgedescription" id="floatingTextarea2" style={{ height: "100px", borderRadius: "15px" }} onChange={handleInputChange} ></textarea>
                                            </div>



                                            <div className="text-muted fs-7">Set a description to the product
                                                for better visibility.</div>

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

                                            <label className="required form-label">Base Price</label>



                                            <input type="text" name="price" className="form-control mb-2"
                                                placeholder="Product price" defaultValue={formData.price} onChange={handleInputChange}  required/>



                                            <div className="text-muted fs-7">Set the product price.</div>

                                        </div>



                                        <div className="fv-row mb-10">

                                            <label className="fs-6 fw-semibold mb-2">
                                                Discount Type


                                                <span className="ms-1" data-bs-toggle="tooltip"
                                                    title="Select a discount type that will be applied to this product">
                                                    <i
                                                        className="ki-duotone ki-information-5 text-gray-500 fs-6"><span
                                                            className="path1"></span><span
                                                                className="path2"></span><span
                                                                    className="path3"></span></i></span> </label>



                                            <div className="row row-cols-1 row-cols-md-3 row-cols-lg-1 row-cols-xl-3 g-9"
                                                data-kt-buttons="true"
                                                data-kt-buttons-target="[data-kt-button='true']">

                                                <div className="col">

                                                    <label
                                                        className="btn btn-outline btn-outline-dashed btn-active-light-primary ${selectedOption === '1' ? 'active' : ''} d-flex text-start p-6"
                                                        data-kt-button="true">

                                                        <span
                                                            className="form-check form-check-custom form-check-solid form-check-sm align-items-start mt-1">
                                                            <input className="form-check-input" type="radio"
                                                                name="discount_option" defaultValue="1" checked={selectedOption === '1'} onChange={handleOptionChange}
                                                            />
                                                        </span>



                                                        <span className="ms-5">
                                                            <span
                                                                className="fs-4 fw-bold text-gray-800 d-block">No
                                                                Discount</span>
                                                        </span>

                                                    </label>

                                                </div>



                                                <div className="col">

                                                    <label
                                                        className="btn btn-outline btn-outline-dashed btn-active-light-primary ${selectedOption === '2' ? 'active' : ''} d-flex text-start p-6"
                                                        data-kt-button="true">

                                                        <span
                                                            className="form-check form-check-custom form-check-solid form-check-sm align-items-start mt-1">
                                                            <input className="form-check-input" type="radio" checked={selectedOption === '2'} onChange={handleOptionChange}
                                                                name="discount_option" defaultValue="2" />
                                                        </span>



                                                        <span className="ms-5">
                                                            <span
                                                                className="fs-4 fw-bold text-gray-800 d-block">Percentage
                                                                %</span>
                                                        </span>

                                                    </label>

                                                </div>



                                                <div className="col">

                                                    <label
                                                        className="btn btn-outline btn-outline-dashed btn-active-light-primary ${selectedOption === '3' ? 'active' : ''} d-flex text-start p-6"
                                                        data-kt-button="true">

                                                        <span
                                                            className="form-check form-check-custom form-check-solid form-check-sm align-items-start mt-1">
                                                            <input className="form-check-input" type="radio" checked={selectedOption === '3'} onChange={handleOptionChange}
                                                                name="discount_option" defaultValue="3" />
                                                        </span>



                                                        <span className="ms-5">
                                                            <span
                                                                className="fs-4 fw-bold text-gray-800 d-block">Fixed
                                                                Price</span>
                                                        </span>

                                                    </label>

                                                </div>

                                            </div>

                                        </div>



                                        <div className={`mb-10 fv-row ${selectedOption === '2' ? '' : 'd-none'}`}
                                            id="kt_ecommerce_add_product_discount_percentage">

                                            <label className="form-label">Set Discount Percentage (%)</label>

                                            <input type="number" min={0} max={100} name="discounted_percentage"
                                                className="form-control mb-2" placeholder="Discounted percentage" value={formData.discounted_percentage} onChange={handleInputChange} />


                                            <div className="text-muted fs-7">Set a percentage discount to be
                                                applied on this product.</div>

                                        </div>



                                        <div className={`mb-10 fv-row ${selectedOption === '3' ? '' : 'd-none'}`}
                                            id="kt_ecommerce_add_product_discount_fixed">

                                            <label className="form-label">Fixed Discounted Price (DT)</label>



                                            <input type="number" min={0} max={100} name="discounted_price"
                                                className="form-control mb-2" placeholder="Discounted price" value={formData.discounted_price} onChange={handleInputChange} />



                                            <div className="text-muted fs-7">Set the discounted product price.
                                                The product will be reduced at the determined fixed price
                                            </div>

                                        </div>



                                        <div className="d-flex flex-wrap gap-5">

                                            <div className="fv-row w-100 flex-md-root">

                                                <label className="form-label">VAT Amount (%)</label>



                                                <input type="number" min={0} className="form-control mb-2" name='vat_amount' value={formData.vat_amount} onChange={handleInputChange} />



                                                <div className="text-muted fs-7">Set the product VAT about.
                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>
                            </div>

                        </div>
                        <br />


                        <div className="d-flex justify-content-end">


                            <button type="submit" id="kt_ecommerce_add_product_submit" className="btn btn-primary">
                                <span ref={btnRef1} className="indicator-label">
                                    Update
                                </span>
                                <span ref={btnRef2} className="indicator-progress">
                                    Please wait... <span
                                        className="spinner-border spinner-border-sm align-middle ms-2"></span>
                                </span>
                            </button>

                        </div>
                    </div>
                </div>
            </form>

        </>

    );
}


export default UpdateEdge;