import { Link } from "react-router";

export default function CardNews({ title, to }) {
  return (
    <div className="card" style={{ width: "40rem" }}>
      <div className="card-body">
        <h6 className="card-title" style={{ height: "3rem" }}>
          {title}
        </h6>

        <Link to={to} className="btn btn-primary">
          Read More
        </Link>
      </div>
    </div>
  );
}
