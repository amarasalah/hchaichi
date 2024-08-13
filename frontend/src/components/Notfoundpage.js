
function Notfoundpage() {
    return (
        <>
        <div id="kt_body" className="auth-bg" >

            <div className="d-flex flex-column flex-root" style={{ height: "100vh" }}>

                <div className="d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed"
                    style={{ backgroundImage: "url(/assets/media/illustrations/dozzy-1/14.png)" }}>


                    <div className="d-flex flex-column flex-column-fluid text-center p-10 py-lg-20">

                        <a href="/" className="mb-10 pt-lg-20">
                            <img alt="Logo" src="/assets/media/logos/logo-default.svg" className="h-60px mb-5" />
                        </a>

                        <div className="pt-lg-10">


                        <div className="pt-lg-10">

                    
                        <h1 className="fw-bold fs-4x text-gray-700 mb-10">Page Not Found</h1>
               
    
          
                        <div className="fw-semibold fs-3 text-gray-500 mb-15">
                            The page you looked not found! <br /> Plan your blog post by choosing a topic
                        </div>
           
                    
                        <div className="text-center">
                            <a href="/" className="btn btn-lg btn-primary fw-bold">Go to homepage</a>
                        </div>
            
    
                    </div>


                        </div>

                    </div>

                    <div className="d-flex flex-center flex-column-auto p-10">

                        <div className="d-flex align-items-center fw-semibold fs-6">
                            <a href="/" className="text-muted text-hover-primary px-2">Home</a>
                        </div>

                    </div>

                </div>

            </div>


        </div>


    </>

    );
};

export default Notfoundpage;