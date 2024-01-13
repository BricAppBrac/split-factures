import React, { useState } from "react";
import { getDocument } from "pdfjs-dist/legacy/build/pdf";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { PDFDocument } from "pdf-lib";

const GenerateZip = ({ refFact, fileUrl }) => {
  // const zip = useRef(new JSZip());
  const [processingZip, setProcessingZip] = useState(false);
  let pdf;

  const generateZip = async () => {
    console.log("generateZip");
    setProcessingZip(true);

    try {
      // Lecture du PDF
      const loadingTask = getDocument({ url: fileUrl });
      pdf = await loadingTask.promise;

      const pdf2 = await fetch(fileUrl).then((res) => res.arrayBuffer());

      console.log("pdf dans GenerateZip");
      console.log(pdf);
      console.log("Nombre de pages du PDF");
      console.log(pdf.numPages);
      console.log("refFact");
      console.log(refFact);

      // Créer un objet JSZip pour stocker les pages de la facture
      let numPagePdf = 1;
      const zip = new JSZip();

      // Lire le PDF
      const pdfDoc = await PDFDocument.load(pdf2);

      // Pour chaque ligne de refFact
      for (let i = 0; i < refFact.length; i++) {
        console.log("lecture refFact");
        console.log("i : " + i);
        console.log("Facture n°" + refFact[i][0]);
        console.log("Afficher " + refFact[i][1] + " page(s)");
        const [numFacture, pages] = refFact[i];
        const factureName = `Facture_${numFacture}`;
        // Créer un nouveau document PDF
        const newPdfDoc = await PDFDocument.create();
        // Parcourir les pages du PDF
        for (let j = 1; j <= pages; j++) {
          // const page = await pdf.getPage(pageNum);
          // const textContent = await page.getTextContent();

          console.log("Page du PDF: " + numPagePdf);

          if (j === 1) {
            try {
              // Copier seulement la page spécifique du PDF source
              const [copiedPageRef] = await newPdfDoc.copyPages(pdfDoc, [
                numPagePdf - 1,
              ]);

              newPdfDoc.addPage(copiedPageRef);
            } catch (error) {
              console.error(
                "Erreur lors de la génération de la page PDF :",
                error
              );
            }
          } else {
            try {
              // Copier seulement la page spécifique du PDF source
              const [copiedPageRef] = await newPdfDoc.copyPages(pdfDoc, [
                numPagePdf - 1,
              ]);

              newPdfDoc.addPage(copiedPageRef);
            } catch (error) {
              console.error(
                "Erreur lors de la génération de la page PDF :",
                error
              );
            }
          }
          numPagePdf++;
        }
        // Convertir le nouveau document PDF en blob
        const newPdfBytes = await newPdfDoc.save();

        // Ajouter le fichier PDF au fichier ZIP
        zip.file(`${factureName}.pdf`, newPdfBytes);
      }
      // Générer le fichier ZIP
      const content = await zip.generateAsync({ type: "blob" });

      // Télécharger le fichier ZIP
      saveAs(content, "factures.zip");
    } catch (error) {
      console.error("Erreur lors de la lecture du PDF :", error);
    } finally {
      setProcessingZip(false); // Mettre à jour l'état de traitement après la lecture
    }
  };

  return (
    <div>
      <button onClick={generateZip}>Générer ZIP</button>
      {processingZip && (
        <div className="trtencours">Traitement en cours...</div>
      )}
    </div>
  );
};

export default GenerateZip;
