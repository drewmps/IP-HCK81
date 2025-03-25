import axios from "axios";
import { Link, useNavigate } from "react-router";
import { getBaseUrl } from "../helpers/helper";

export default function CardNews({ title, to }) {
  // const navigate = useNavigate();
  // async function handleJoin() {
  //   try {
  //     await axios.post(getBaseUrl() + `/myclubs/${clubId}`, null, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //       },
  //     });
  //     navigate("/my-clubs");
  //   } catch (error) {
  //     console.log("🚀 ~ handleJoin ~ error:", error);
  //   }
  // }
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
