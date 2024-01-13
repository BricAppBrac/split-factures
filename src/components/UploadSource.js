import React, { useEffect, useRef, useState } from "react";
import ReadSource from "./ReadSource";
import GenerateZip from "./GenerateZip";

const UploadSource = () => {
  const [sourceName, setSourceName] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [processing, setProcessing] = useState(false);
  const refFactData = useRef([]);
  const [refFact, setRefFact] = useState([]);

  // Stocke le fichier sélectionné url et name
  const handleFileChange = (event) => {
    console.log("handleFileChange");
    const file = event.target.files[0];
    console.log("file.name");
    console.log(file.name);
    setSourceName(file.name);

    setFileUrl(URL.createObjectURL(file));
    console.log("fileUrl");
    console.log(fileUrl);
  };

  // Fonction pour traiter les données lues du fichier Pdf
  const handleDataRead = (numFactData) => {
    console.log("handleDataRead");
    console.log("numFactData");
    console.log(numFactData);

    // Réinitialiser le tableau refFactData
    refFactData.current = [];

    // Parcourir chaque numéro de facture dans numFactData
    numFactData.forEach((numFacture) => {
      // Vérifier si le numéro de facture existe déjà dans refFactData
      const existingIndex = refFactData.current.findIndex(
        (item) => item.numFacture === numFacture
      );

      if (existingIndex !== -1) {
        // Numéro de facture existant, mettre à jour le nombre de pages
        refFactData.current[existingIndex].pages += 1; // Incrémenter le nombre de pages
      } else {
        // Numéro de facture non existant, ajouter une nouvelle entrée
        refFactData.current.push({ numFacture, pages: 1 }); // Initialiser le nombre de pages à 1
      }
    });

    // Mettre à jour refFactData.current avec le nouveau tableau
    // refFactData.current = factDataArray;
    console.log("factures triées");
    console.log(refFactData.current);
    // Créer un tableau de paires numéro de facture et nombre de pages
    const pairArray = refFactData.current.map(({ numFacture, pages }) => [
      numFacture,
      pages,
    ]);

    console.log("pairArray");
    console.log(pairArray);

    setRefFact(pairArray);

    setProcessing(false);
  };

  useEffect(() => {
    console.log("refFact.length dans useEffect", refFact.length);
  }, [refFact]);

  return (
    <div className="upload-content">
      <div className="upload-head">
        <div className="upload-title">
          <h3>*****************************</h3>
          <h3>FICHIER SOURCE A TRAITER :</h3>
          <h3>*****************************</h3>
        </div>

        <div className="source-name">
          <h3>*****************************</h3>
          <h3>
            {sourceName ? (
              <div>{sourceName}</div>
            ) : (
              <div className="upload-file">
                <input type="file" accept=".pdf" onChange={handleFileChange} />
              </div>
            )}
          </h3>
        </div>
      </div>
      {processing && <div className="trtencours">Traitement en cours...</div>}
      <div className="liste-content">
        {sourceName && (
          <ReadSource
            fileUrl={fileUrl}
            handleDataRead={handleDataRead}
            setProcessing={setProcessing}
          />
        )}
      </div>
      <div className="generate-zip">
        {refFact.length > 0 && (
          <GenerateZip refFact={refFact} fileUrl={fileUrl} />
        )}
      </div>
    </div>
  );
};

export default UploadSource;
