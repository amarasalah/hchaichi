"use strict";
var KTCreateAccount = (function() {
  var e,
    t,
    i,
    o,
    a,
    r,
    p,
    s = [];
  return {
    init: function() {
      (e = document.querySelector("#kt_modal_create_account")) &&
        new bootstrap.Modal(e), (t = document.querySelector(
        "#kt_create_account_stepper"
      )) &&
        (
          (i = t.querySelector("#kt_create_account_form")),
          (o = t.querySelector('[data-kt-stepper-action="submit"]')),
          (p = t.querySelector('[data-kt-stepper-action="previous"]')),
          (a = t.querySelector('[data-kt-stepper-action="next"]')),
          (r = new KTStepper(t)).on("kt.stepper.changed", function(e) {
            7 === r.getCurrentStepIndex()
              ? (
                  o.classList.remove("d-none"),
                  o.classList.add("d-inline-block"),
                  a.classList.add("d-none")
                )
              : 8 === r.getCurrentStepIndex()
                ? (o.classList.add("d-none"), a.classList.add("d-none"),p.classList.add("d-none"))
                : (
                    o.classList.remove("d-inline-block"),
                    o.classList.remove("d-none"),
                    a.classList.remove("d-none"),
                    p.classList.remove("d-none")
                  );
          }),
          r.on("kt.stepper.next", function(e) {
            console.log("stepper.next");
            var t = s[e.getCurrentStepIndex() - 1];
            t
              ? t.validate().then(function(t) {
                  console.log("validated!"), "Valid" == t
                    ? (e.goNext(), KTUtil.scrollTop())
                    : Swal.fire({
                        text:
                          "Sorry, looks like there are some errors detected, please try again.",
                        icon: "error",
                        buttonsStyling: !1,
                        confirmButtonText: "Ok, got it!",
                        customClass: { confirmButton: "btn btn-light" }
                      }).then(function() {
                        KTUtil.scrollTop();
                      });
                })
              : (e.goNext(), KTUtil.scrollTop());
          }),
          r.on("kt.stepper.previous", function(e) {
            console.log("stepper.previous"), e.goPrevious(), KTUtil.scrollTop();
          }),
          s.push(
            FormValidation.formValidation(i, {
              fields: {
                project_name: {
                  validators: {
                    notEmpty: { message: "Project name is required" }
                  }
                }
              },
              plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap: new FormValidation.plugins.Bootstrap5({
                  rowSelector: ".fv-row",
                  eleInvalidClass: "",
                  eleValidClass: ""
                })
              }
            })
          ),
          s.push(
            FormValidation.formValidation(i, {
              fields: {
                A_value: {
                  validators: {
                    notEmpty: { message: "A is required" },
                    greaterThan: {
                      message: "A must be greater than 0",
                      min: -1
                    }
                  }
                },
                B_value: {
                  validators: {
                    notEmpty: { message: "B is required" },
                    greaterThan: {
                      message: "B must be greater than 0",
                      min: -1
                    }
                  }
                },
                C_value: {
                  validators: {
                    notEmpty: { message: "C is required" },
                    greaterThan: {
                      message: "C must be greater than 0",
                      min: -1
                    }
                  }
                }
              },
              plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap: new FormValidation.plugins.Bootstrap5({
                  rowSelector: ".fv-row",
                  eleInvalidClass: "",
                  eleValidClass: ""
                })
              }
            })
          ),
          s.push(
            FormValidation.formValidation(i, {
              fields: {
                material_type: {
                  validators: {
                    notEmpty: { message: "Material Type is required" }
                  }
                },
                material_thickness: {
                  validators: {
                    notEmpty: { message: "Material Thickness is required" }
                  }
                },

              },
              plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap: new FormValidation.plugins.Bootstrap5({
                  rowSelector: ".fv-row",
                  eleInvalidClass: "",
                  eleValidClass: ""
                })
              }
            })
          ),
          o.addEventListener("click", function(e) {
            s[2].validate().then(function(t) {
              console.log("validated!"), "Valid" == t
                ? (
                    e.preventDefault(),
                    (o.disabled = !0),
                    o.setAttribute("data-kt-indicator", "on"),
                    setTimeout(function() {
                      o.removeAttribute(
                        "data-kt-indicator"
                      ), (o.disabled = !1), r.goNext();
                    }, 2e3)
                  )
                : Swal.fire({
                    text:
                      "Sorry, looks like there are some errors detected, please try again.",
                    icon: "error",
                    buttonsStyling: !1,
                    confirmButtonText: "Ok, got it!",
                    customClass: { confirmButton: "btn btn-light" }
                  }).then(function() {
                    KTUtil.scrollTop();
                  });
            });
          })
        );
    }
  };
})();
KTUtil.onDOMContentLoaded(function() {
  KTCreateAccount.init();
});
