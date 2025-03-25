import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getBaseUrl } from "../helpers/helper";

export default function NewsDetailPage() {
  const { id } = useParams();
  const [news, setNews] = useState({});
  useEffect(() => {
    async function getNews() {
      const response = await axios.get(`${getBaseUrl()}/news/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setNews(response.data);
    }
    getNews();
  }, []);
  return (
    <>
      <div className="w-50 m-auto mt-5">
        <h1 className="mb-3">{news.title}</h1>
        <p>{news.body}</p>
        <div className="mb-3">
          <button className="btn btn-primary">Read it for me</button>
        </div>
        <div>
          <button className="btn btn-primary">Get the gist</button>
        </div>
      </div>
    </>
  );
}
