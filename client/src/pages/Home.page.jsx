import axios from "axios";
import CardNews from "../components/CardNews";
import { getBaseUrl } from "../helpers/helper";
import { useEffect, useState } from "react";
import useSpeechRecognition from "../hooks/useSpeechRecognitionHook";

export default function HomePage() {
  let [newsList, setNewsList] = useState([]);

  const {
    text,
    setText,
    startListening,
    stopListening,
    isListening,
    hasRecognitionSupport,
  } = useSpeechRecognition();

  async function fetchNewsList() {
    try {
      const url = new URL(getBaseUrl() + "/news");
      if (text) {
        url.searchParams.append("q", text);
      }

      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setNewsList(data.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response.data.message,
      });
    }
  }
  useEffect(() => {
    fetchNewsList();
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    await fetchNewsList();
  }

  let voiceSearch = (
    <button className="btn btn-primary w-auto" onClick={startListening}>
      Voice
    </button>
  );
  if (hasRecognitionSupport) {
    if (!isListening) {
      voiceSearch = (
        <button className="btn btn-primary w-auto" onClick={startListening}>
          Voice
        </button>
      );
    } else {
      voiceSearch = (
        <button className="btn btn-primary w-auto" onClick={stopListening}>
          Stop
        </button>
      );
    }
  } else {
    voiceSearch = (
      <button
        className="btn btn-secondary w-auto"
        disabled
        style={{ cursor: "not-allowed" }}
      >
        Voice
      </button>
    );
  }

  return (
    <>
      <div className="col-12 d-flex justify-content-center mt-5 mb-5">
        <form
          className="d-flex gap-2 w-50"
          role="search"
          onSubmit={handleSearch}
        >
          <input
            className="form-control"
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
          <div>{voiceSearch}</div>
          <div>
            <button className="btn btn-primary w-auto" type="submit">
              Search
            </button>
          </div>
        </form>
      </div>
      <div className="container-xl mt-5 d-flex flex-wrap gap-3">
        {newsList.map((news) => {
          return (
            <CardNews
              key={news.id}
              title={news.title}
              to={`/news/${news.id}`}
            />
          );
        })}
      </div>
    </>
  );
}
