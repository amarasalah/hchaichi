import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function AddAngle() {
    const navigate = useNavigate();
    const btnRef1 = useRef(null);
    const btnRef2 = useRef(null);
    const [selectedOption, setSelectedOption] = useState('1'); // Default to 'No Discount'
    const [formData, setFormData] = useState({
        angle_name: '',
        angledescription: '',
        border_radius: [''], // Initialize with one empty string for the first input field
        price: '',
        discount_option: '1',
        discounted_percentage: '0',
        discounted_price: '0',
        vat_amount: '0',
        status: 'available',
        avatarAngle: null,
    });
    const [imagePreviews, setImagePreviews] = useState({
        avatarAngle: '/assets/media/svg/files/blank-image.svg',
    });

    useEffect(() => {
        // Set initial previews
        setImagePreviews(prev => ({
            ...prev,
            avatarAngle: formData.avatarAngle ? URL.createObjectURL(formData.avatarAngle) : prev.avatarAngle,
        }));
    }, [formData.avatarAngle]);

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
            newValue = 0
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

    const handleVariationChange = (index, value) => {
        if(value>0){
            const newBorderRadius = [...formData.border_radius];
            newBorderRadius[index] = value;
            setFormData({ ...formData, border_radius: newBorderRadius });
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: `Border radius variations must be more than 0.`,
            });
        }



    };

    const addVariation = () => {
        setFormData({ ...formData, border_radius: [...formData.border_radius, ''] });
    };
    const removeVariation = (index) => {
        const newBorderRadius = formData.border_radius.filter((_, i) => i !== index);
        setFormData({ ...formData, border_radius: newBorderRadius });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        btnRef1.current.style.display = 'none';
        btnRef2.current.style.display = 'block';

        // Check required fields
        const requiredFields = ['avatarAngle', 'angle_name', 'price'];
        for (const field of requiredFields) {
            if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
                Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required.`,
                });
                btnRef2.current.style.display = 'none';
                btnRef1.current.style.display = 'block';
                return;
            }
        }

        // Validate discounted_percentage
        const validateRange = (value, label) => {
            if (value < 0 || value > 100) {
                Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: `${label.replace(/_/g, ' ')} must be between 0 and 100.`,
                });
                return false;
            }
            return true;
        };

        if (!validateRange(formData.discounted_percentage, 'Discounted percentage')) {
            btnRef2.current.style.display = 'none';
            btnRef1.current.style.display = 'block';
            return;
        }










        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        console.log(formData);

        try {
            const response = await axios.post('http://localhost:4000/product/addangle', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            console.log(response.data);

            Swal.fire({
                icon: 'success',
                title: 'Angle Added Successfully',
                text: response.data.message || response.data,
            });
           // navigate("/admin/allangletype", { replace: true });
        } catch (error) {
            console.error('There was an error!', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'There was an error adding the angle!',
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
                                <h2>Angle Thumbnail</h2>
                            </div>

                        </div>

                        <div className="card-body text-center pt-0">



                            <div className="image-input image-input-empty image-input-outline image-input-placeholder mb-3"
                                data-kt-image-input="true">

                                <div className="image-input-wrapper w-150px h-150px" style={{ backgroundImage: `url(${imagePreviews.avatarAngle})` }}></div>

                                <label
                                    className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                                    data-kt-image-input-action="change" data-bs-toggle="tooltip"
                                    title="Change avatar">
                                    <i className="ki-duotone ki-pencil fs-7"><span className="path1"></span><span
                                        className="path2"></span></i>

                                    <input type="file" name="avatarAngle" accept=".png, .jpg, .jpeg, .svg" onChange={handleFileChange} />
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



                            <div className="text-muted fs-7">Set the angle thumbnail image. Only *.png, *.jpg, *.svg
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
                                <option value="available">Available</option>
                                <option value="not_available">Not Available</option>
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

                                            <label className="required form-label">Angle Name</label>



                                            <input type="text" name="angle_name" className="form-control mb-2"
                                                placeholder="Angle name" defaultValue={formData.angle_name} onChange={handleInputChange} />



                                            <div className="text-muted fs-7">A angle name is required and
                                                recommended to be unique.</div>

                                        </div>


                                        <div className='mb-2 fv-row'>

                                            <label className="form-label" htmlFor="floatingTextarea2">Description</label>



                                            <div className="mb-2">
                                                <textarea className="form-control" placeholder="Description" name="angledescription" id="floatingTextarea2" style={{ height: "100px", borderRadius: "15px" }} onChange={handleInputChange} ></textarea>
                                            </div>



                                            <div className="text-muted fs-7">Set a description to the product
                                                for better visibility.</div>

                                        </div>

                                    </div>
                                </div>


                                <div className="card card-flush py-4">
                                    <div className="card-header">
                                        <div className="card-title">
                                            <h2>Add Border Radius Variations (mm)</h2>
                                        </div>
                                    </div>
                                    <div className="card-body pt-0">
                                        <div className="" data-kt-ecommerce-catalog-add-product="auto-options">
                                            <div id="kt_ecommerce_add_product_options">
                                                <div className="form-group">
                                                    <div className="d-flex flex-column gap-3">
                                                        {formData.border_radius.map((variation, index) => (
                                                            <div key={index} className="form-group d-flex flex-wrap align-items-center gap-5">
                                                                <input
                                                                    type="text"
                                                                    className="form-control mw-100 w-200px"
                                                                    name={`border_radius_${index}`}
                                                                    placeholder="Variation"
                                                                    value={variation}
                                                                    onChange={(e) => handleVariationChange(index, e.target.value)}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-icon btn-light-danger"
                                                                    onClick={() => removeVariation(index)}
                                                                >
                                                                    <i className="ki-duotone ki-cross fs-1">
                                                                        <span className="path1"></span><span className="path2"></span>
                                                                    </i>
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="form-group mt-5">
                                                    <button type="button" className="btn btn-sm btn-light-primary" onClick={addVariation}>
                                                        <i className="ki-duotone ki-plus fs-2"></i> Add another variation
                                                    </button>
                                                </div>
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

                                            <label className="required form-label">Base Price (DT/mm) </label>



                                            <input type="text" name="price" className="form-control mb-2"
                                                placeholder="Product price" defaultValue={formData.price} onChange={handleInputChange} />



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
                                                className="form-control mb-2" placeholder="Discounted percentage" defaultValue={formData.discounted_percentage} onChange={handleInputChange} />


                                            <div className="text-muted fs-7">Set a percentage discount to be
                                                applied on this product.</div>

                                        </div>



                                        <div className={`mb-10 fv-row ${selectedOption === '3' ? '' : 'd-none'}`}
                                            id="kt_ecommerce_add_product_discount_fixed">

                                            <label className="form-label">Fixed Discounted Price (DT)</label>



                                            <input type="number" min={0} max={100} name="discounted_price"
                                                className="form-control mb-2" placeholder="Discounted price" defaultValue={formData.discounted_price} onChange={handleInputChange} />



                                            <div className="text-muted fs-7">Set the discounted product price.
                                                The product will be reduced at the determined fixed price
                                            </div>

                                        </div>



                                        <div className="d-flex flex-wrap gap-5">

                                            <div className="fv-row w-100 flex-md-root">

                                                <label className="form-label">VAT Amount (%)</label>



                                                <input type="number" min={0} className="form-control mb-2" name='vat_amount' defaultValue={formData.vat_amount} onChange={handleInputChange} />



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
                                    Save Changes
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


export default AddAngle;