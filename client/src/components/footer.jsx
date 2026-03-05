import React from "react";
// import "./Footer.css"; // optional if you want to style it separately

const Footer = () => {
  return (
    <footer className="d-footer">
      <div className="row align-items-center justify-content-between">
        <div className="col-auto">
          <p className="mb-0">© 2025 ERP. All Rights Reserved.</p>
        </div>
        <div className="col-auto">
          <p className="mb-0">
            Made by <span className="text-primary-600">Search First Technology</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
