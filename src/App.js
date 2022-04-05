import "./App.css";
import { useRef, useState } from "react";
import QRCode from "qrcode";
import RadioTabGroup from "./RadioTabGroup";

function App() {
  const [content, setContent] = useState("");
  const [recovery, setRecovery] = useState("L");
  const qrEl = useRef(null);

  if (qrEl.current) {
    QRCode.toCanvas(
      qrEl.current,
      content,
      { errorCorrectionLevel: recovery },
      function (error) {
        if (error) console.error(error);
        console.log("success!");
      }
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>A QR Code Generator. No extra BS.</h1>
        <p>Download and use this QR code freely, forever.</p>

        <div className="inputs">
          <input
            type="text"
            autocorrect="off"
            autocapitalize="none"
            placeholder="https://qrnobs.com"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <RadioTabGroup
            title={
              "Error Correction Level.\n\n" +
              "Level L - 7% of data can be restored.\n" +
              "Level M - 15% of data can be restored.\n" +
              "Level Q - 25% of data can be restored.\n" +
              "Level H - 30% of data can be restored.\n"
            }
            options={["L", "M", "Q", "H"]}
            value={recovery}
            onChange={(e) => setRecovery(e.target.value)}
          />
        </div>

        <canvas ref={qrEl} />
      </header>
      <footer>
        Made with ♥ by <a href="https://kubesail.com">KubeSail</a>
      </footer>
    </div>
  );
}

export default App;
