import { useEffect, useState } from "react";

let recognition = null;
if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.lang = "en-US";
}
const useSpeechRecognition = () => {
  const [search, setSearch] = useState("");
  const [isListening, setIsListening] = useState(false);
  useEffect(() => {
    if (!recognition) {
      return;
    }
    recognition.onresult = (event) => {
      setSearch(event.results[0][0].transcript);
      recognition.stop();
      setIsListening(false);
    };
  }, []);

  const startListening = () => {
    setSearch("");
    setIsListening(true);
    recognition.start();
  };
  const stopListening = () => {
    setIsListening(false);
    recognition.stop();
  };
  return {
    search,
    setSearch,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport: !!recognition,
  };
};
export default useSpeechRecognition;
