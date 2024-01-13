import React, { useRef } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";

const GenerateZip = ({ refFact, fileUrl }) => {
  const zip = useRef(new JSZip());
  const [processingZip, setProcessingZip] = useState(false);

  const generateZip = async () => {
    try {
      setProcessingZip(true);

      // Charger le document PDF
      const existingPdfBytes = await fetch(fileUrl).then((res) =>
        res.arrayBuffer()
      );
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      console.log("PDF");
      console.log(pdfDoc);

      // Parcourir chaque élément de refFact
      for (const { numFacture, pages } of refFact) {
        // Créer un objet JSZip pour stocker les pages de la facture
        const factureZip = zip.current.folder(`Facture_${numFacture}`);

        // Parcourir les pages de la facture
        for (let pageNum = 1; pageNum <= pages; pageNum++) {
          // Copier chaque page dans un nouveau document PDF
          const newPdfDoc = await PDFDocument.create();
          const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNum - 1]);
          newPdfDoc.addPage(copiedPage);

          // Convertir le nouveau document PDF en blob
          const newPdfBytes = await newPdfDoc.save();

          // Ajouter la page au fichier ZIP
          factureZip.file(`Page_${pageNum}.pdf`, newPdfBytes);
        }
      }

      // Générer le fichier ZIP
      const content = await zip.current.generateAsync({ type: "blob" });

      // Télécharger le fichier ZIP
      saveAs(content, "factures.zip");
    } catch (error) {
      console.error("Erreur lors de la génération du fichier ZIP :", error);
    } finally {
      setProcessingZip(false);
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
