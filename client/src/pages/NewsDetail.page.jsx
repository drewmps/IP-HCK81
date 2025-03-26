import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getBaseUrl } from "../helpers/helper";

export default function NewsDetailPage() {
  const { id } = useParams();
  const [news, setNews] = useState({});
  const [tldr, setTldr] = useState("");
  const [audioSrc, setAudioSrc] = useState(null);

  async function handleSynthesize() {
    try {
      const response = await axios.post(
        getBaseUrl() + "/news/synthesize",
        {
          text: news.body,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      const audioSrc = `data:audio/mp3;base64,${response.data.audioContent}`;
      setAudioSrc(audioSrc);
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response.data.message,
      });
    }
  }
  async function handleSummarize() {
    try {
      const { data } = await axios.post(
        `${getBaseUrl()}/news/summarize`,
        { text: news.body },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setTldr(data.text);
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response.data.message,
      });
    }
  }
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
        <div className="d-flex gap-3 mb-3">
          <div>
            <button className="btn btn-primary" onClick={handleSynthesize}>
              Read it for me
            </button>
          </div>
          <div>
            <button className="btn btn-primary" onClick={handleSummarize}>
              Generate TLDR
            </button>
          </div>
        </div>

        {audioSrc && (
          <div>
            <audio controls src={audioSrc} />
          </div>
        )}
        {tldr && (
          <div className="mb-3">
            <h3>TLDR</h3>
            <p>{tldr}</p>
          </div>
        )}
        <p style={{ whiteSpace: "pre-line" }}>{news.body}</p>
      </div>
    </>
  );
}
