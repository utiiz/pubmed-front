import { useState } from 'react';
import './App.css'
import { Button, Input } from '@material-tailwind/react'

function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState("");
  const generatePubmedFile = () => {
    setLoading(true);
    console.log(url);
    const urlBase = "https://wrybmteixi.execute-api.eu-west-3.amazonaws.com/pubmed";
    const options = {
      method: "POST",
      // body: JSON.stringify({ url: "https://pubmed.ncbi.nlm.nih.gov/?term=(glucose)+and+(continuous)+and+(monitoring+or+measurement)+and+(diabetes)&filter=pubt.guideline&filter=pubt.meta-analysis&filter=pubt.systematicreview&filter=datesearch.y_10&filter=hum_ani.humans&filter=lang.english&filter=lang.french&timeline=expanded&format=pubmed&size=10&page=1"})
      body: JSON.stringify({ url })
    };
    fetch(urlBase, options)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let rows = [["Titre", "Auteur", "Date", "Type", "Link"]];
        data.forEach(el => {
          const link = "https://pubmed.ncbi.nlm.nih.gov/" + el["PMID"]
          rows.push([
            el["TI"],
            el["AU"] || el["CN"],
            el["DP"],
            el["PT"],
            link
          ]);
        });
        const csvContent = "data:text/csv;charset=utf-8," 
          + rows.map(e => e.join(";")).join("\n");
        const encodedUri = encodeURI(csvContent);
        window.open(encodedUri);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div className="card">
        <div className="w-96 flex flex-col space-y-4">
          <Input label='URL' color='indigo' value={url} onChange={(event) => setUrl(event.target.value)}/>
          <Button color='indigo' disabled={loading} fullWidth ripple={false} onClick={() => generatePubmedFile()}>Générer le fichier</Button>
        </div>
      </div>
    </>
  )
}

export default App
