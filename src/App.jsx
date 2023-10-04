import { useState } from 'react';
import './App.css'
import { Button, Input, IconButton } from '@material-tailwind/react'

function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const generateRandomString = (length = 6) => Math.random().toString(20).substring(2, length)
  const generatePubmedFile = () => {
    setLoading(true);
    setError(false);
    const urlBase = "https://wrybmteixi.execute-api.eu-west-3.amazonaws.com/pubmed";
    const options = {
      method: "POST",
      // body: JSON.stringify({ url: "https://pubmed.ncbi.nlm.nih.gov/?term=(glucose)+and+(continuous)+and+(monitoring+or+measurement)+and+(diabetes)&filter=pubt.guideline&filter=pubt.meta-analysis&filter=pubt.systematicreview&filter=datesearch.y_10&filter=hum_ani.humans&filter=lang.english&filter=lang.french&timeline=expanded&format=pubmed&size=10&page=1"})
      body: JSON.stringify({ url })
    };
    fetch(urlBase, options)
      .then((response) => {
        if (response.ok)
          return response.json()
            .then((data) => {
              try {
                fetch(data)
                .then((response) => response.blob())
                .then((blob) => {
                    let a = document.createElement('a');
                    a.href = window.URL.createObjectURL(blob);
                    let random_name = generateRandomString(15);
                    a.download = random_name.toUpperCase() + ".csv";
                    document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                    a.click();    
                    a.remove();  //afterwards we remove the element again
                  })
              } catch(e) {
                console.log(e);
                setError(true);
              }
            })
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div className="card">
        <div className="w-96 flex flex-col space-y-4">
          <Input label='PubMed URL' color='teal' error={error} value={url} onChange={(event) => setUrl(event.target.value)}/>
          <button className="border-none p-3 disabled:bg-teal-100 bg-teal-500 hover:bg-teal-600 disabled:hover:shadow-md shadow-md hover:shadow-lg text-xs text-white font-semibold uppercase" disabled={!url || loading} onClick={() => generatePubmedFile()}>Générer le fichier</button>

        </div>
      </div>
    </>
  )
}

export default App
