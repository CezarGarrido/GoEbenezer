import React, { useEffect } from 'react';
import { useState } from "react";

import PdfViewer from './MyPdf';
import Calendar from './Calendar';

const pdfData =
  'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
  'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
  'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
  'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
  'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+' +
  'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u' +
  'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq' +
  'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
  'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu' +
  'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g' +
  'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw' +
  'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v' +
  'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G';


const MicroComponent = ({ content }) => {
  const base64PDF = `data:application/pdf;base64,${pdfData}`;
  return <PdfViewer src={base64PDF} />
};

const Search = () => {
  const [query, setQuery] = useState("");
  return (
    <div>
      <h2>Componente de Busca</h2>
      <div className="field border">
      <input
        type="text"
        placeholder="Digite algo..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      </div>
      <p>Busca: {query}</p>
    </div>
  );
};

const List = () => {
  const [items] = useState(["Item 1", "Item 2", "Item 3"]);
  return (
    <div>
      <h2>Componente de Lista</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

function App() {
  const [currentRoute, setCurrentRoute] = useState(null);
  const [content, setContent] = useState(null);

  const routes = {
    "/search": Search,
    "/list": List,
    "/pdf": MicroComponent,
    "/calendar": Calendar
  };

  // Função global para alterar rotas
  window.setRouterView = (routeName, content) => {
    if (routes[routeName]) {
      setCurrentRoute(routeName);
      setContent(content);
    } else {
      console.error(`Rota "${routeName}" não encontrada.`);
    }
  };

  const DynamicComponent = currentRoute ? routes[currentRoute] : null;

  const changeRoute = (name) => {
    console.log(name)
    window.routeTo(name)
  }

  return (
    <div>
      <nav className="left drawer l">
        <header>
          <nav>
            <img src="https://www.beercss.com/favicon.png" className="circle" />
            <h6>Cheers</h6>
          </nav>
        </header>
        <a>
          <i>home</i>
          <div>Home</div>
        </a>
        <a onClick={() => changeRoute('/search')}>
          <i>search</i>
          <div>Search</div>
        </a>
        <a onClick={() => changeRoute('/pdf')}>
          <i>share</i>
          <div>Share</div>
        </a>
        <a onClick={() => changeRoute('/calendar')}>
          <i>more_vert</i>
          <div>More</div>
        </a>
        <div className="divider"></div>
        <label>Label</label>
        <a>
          <i>widgets</i>
          <div>Widgets</div>
        </a>
        <a>
          <i>chat</i>
          <div>Chat</div>
        </a>
        <a>
          <i>help</i>
          <div>Help</div>
        </a>
      </nav>

      <nav className="left m">
        <header>
          <img src="https://www.beercss.com/favicon.png" className="circle" />
        </header>
        <a>
          <i>home</i>
          <div>Home</div>
        </a>
        <a onClick={() => changeRoute('/search')}>
          <i>search</i>
          <div>Search</div>
        </a>
        <a onClick={() => changeRoute('/pdf')}>
          <i>share</i>
          <div>Share</div>
        </a>
        <a onClick={() => changeRoute('/calendar')}>
          <i>more_vert</i>
          <div>More</div>
        </a>
      </nav>

      <nav className="bottom s">
        <a>
          <i>home</i>
        </a>
        <a>
          <i>search</i>
        </a>
        <a>
          <i>share</i>
        </a>
        <a onClick={() => changeRoute('/calendar')}>
          <i>more_vert</i>
        </a>
      </nav>
      <main className="responsive">
        <h3>Welcome</h3>
        <h5>The beer is ready!</h5>
        <div className="small-height scroll surface">
          <table className="border">
            <thead className="fixed">
              <tr>
                <th>Header</th>
                <th>Header</th>
                <th>Header</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
              </tr>
              <tr>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
              </tr>
              <tr>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
              </tr>
              <tr>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
              </tr>
              <tr>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
              </tr>
              <tr>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
              </tr>
            </tbody>
            <tfoot className="fixed">
              <tr>
                <th>Footer</th>
                <th>Footer</th>
                <th>Footer</th>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="router-container">
          {DynamicComponent ? (
            <DynamicComponent content={content} />
          ) : (
            <p>Nenhuma rota selecionada.</p>
          )}
        </div>
      </main>

    </div>

  );
}

export default App;