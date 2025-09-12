/**
 * Mouse Dictionary (https://github.com/wtetsu/mouse-dictionary/)
 * Copyright 2018-present wtetsu
 * Licensed under MIT
 */

import ace from "ace-builds/src-noconflict/ace";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import swal from "sweetalert";
import rule from "../main/core/rule";
import { res } from "./logic";
import { Main } from "./page/Main";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-solarized_light";
ace.config.set("basePath", "/options");

res.setLang(res.decideInitialLanguage([...navigator.languages]));

window.onerror = (msg) => {
  swal({
    text: msg.toString(),
    icon: "error",
  });
};

const sendMessage = async (message: any) => {
  return new Promise((done) => {
    chrome.runtime.sendMessage(message, (response) => {
      done(response);
    });
  });
};

const App = () => {
  const [mode, setMode] = useState<"loading" | "options" | "pdf">("loading");

  const showPdfViewer = (id: string) => {
    setMode("pdf");
    location.href = `pdf/web/viewer.html?id=${id}`;
  };

  useEffect(() => {
    const init = async (): Promise<void> => {
      const id = (await sendMessage({ type: "shift_pdf_id" })) as string;
      if (id) {
        showPdfViewer(id);
      } else {
        setMode("options");
      }
    };
    init();

    chrome.runtime.onMessage.addListener(async (request) => {
      switch (request?.type) {
        case "prepare_pdf": {
          const id = (await sendMessage({ type: "shift_pdf_id" })) as string;
          if (id) {
            showPdfViewer(id);
          }
          break;
        }
      }
    });
  }, []);

  switch (mode) {
    case "loading":
      return <div />;
    case "options":
      return <Main />;
    case "pdf":
      return <div />;
  }
};

const root = createRoot(document.getElementById("app") as HTMLElement);

root.render(<App />);

// Lazy load
rule.load();
