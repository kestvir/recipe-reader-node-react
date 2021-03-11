import React from "react";

interface FooterProps {}

const Footer: React.FC<FooterProps> = ({}) => {
  return (
    <footer className="footer">
      <div className="content has-text-centered">
        <p>© {new Date().getFullYear()} Copyright: Kęstutis Virbickas</p>
      </div>
    </footer>
  );
};

export default Footer;
