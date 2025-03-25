import { Link, useNavigate } from "react-router";

export default function Navbar() {
  const navigate = useNavigate();
  function handleLogout() {
    localStorage.removeItem("access_token");
    navigate("/login");
  }
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary ">
      <div className="container-fluid mx-5">
        <div className="navbar-brand"></div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="navbar-brand">
                News
              </Link>
            </li>
          </ul>
          <div className="d-flex gap-3">
            <button className="nav-link" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
