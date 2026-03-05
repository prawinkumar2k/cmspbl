import React from "react";

const BreadcrumbHeader = ({ pageName }) => {
  const breadcrumbs = [
    { label: "Dashboard", icon: "solar:home-smile-angle-outline" },
    { label: "Examination" },
    { label: "Data Submission" },
    { label: pageName }
  ];

  return (
    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
      <h6 className="fw-semibold mb-0">{pageName}</h6>
      <ul className="d-flex align-items-center gap-2 list-unstyled mb-0">
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={index}>
            <li className="fw-medium">
              {breadcrumb.icon ? (
                <a href="/" className="d-flex align-items-center gap-1 hover-text-primary">
                  <iconify-icon icon={breadcrumb.icon} className="icon text-lg"></iconify-icon>
                  {breadcrumb.label}
                </a>
              ) : (
                breadcrumb.label
              )}
            </li>
            {index < breadcrumbs.length - 1 && <li>-</li>}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default BreadcrumbHeader;
