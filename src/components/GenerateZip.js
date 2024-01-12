import React from "react";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";

const GenerateZip = ({ refFactData, extractedData }) => {
  const generateZip = async () => {
    console.log("GenerateZip");
    // Créer une instance JSZip
    const zip = new JSZip();

    // Parcourir le tableau refFactData
    for (const { numFacture, pages } of refFactData) {
      // Extraire les pages nécessaires pour chaque facture
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(
        extractedData,
        Array.from({ length: pages }, (_, i) => i + 1)
      );
      copiedPages.forEach((page) => newPdf.addPage(page));

      // Convertir le PDF en tableau de bytes
      const pdfBytes = await newPdf.save();

      // Ajouter le fichier PDF à l'archive ZIP
      zip.file(`Facture N°FA${numFacture}.pdf`, pdfBytes);
    }

    // Générer le fichier ZIP
    const zipBlob = await zip.generateAsync({ type: "blob" });

    // Télécharger le fichier ZIP
    saveAs(zipBlob, "factures.zip");
  };

  return (
    <div>
      <button onClick={generateZip}>Générer ZIP</button>
    </div>
  );
};

export default GenerateZip;
