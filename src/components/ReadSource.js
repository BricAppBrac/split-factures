import { useEffect, useRef } from "react";
import { getDocument } from "pdfjs-dist/legacy/build/pdf";

const ReadSource = ({ fileUrl, handleDataRead, setProcessing }) => {
  const numFactDataRef = useRef([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchData = async () => {
      if (!fileUrl) {
        return;
      }
      setProcessing(true);
      try {
        // Lecture du PDF
        const loadingTask = getDocument({ url: fileUrl });

        const pdf = await loadingTask.promise;

        console.log("pdf");
        console.log(pdf);
        console.log("Nombre de pages");
        console.log(pdf.numPages);
        // Réinitialiser le tableau à chaque chargement
        numFactDataRef.current = [];

        // Parcourir les pages du PDF
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();

          console.log("Page : " + pageNum);
          console.log(textContent);

          const text = textContent.items.map((item) => item.str).join(" ");
          console.log("texte en ligne");
          console.log(text);

          // Trouver les numéros de facture
          const regex = /FACTURE N° (FA\d{5})/g;
          let match;
          while ((match = regex.exec(text)) !== null) {
            console.log("Match Fact");
            console.log(match[0]);
            console.log(match[1]);

            numFactDataRef.current.push(match[1]);
          }
        }

        // Appeler la fonction de gestion des données
        handleDataRead(numFactDataRef.current);
      } catch (error) {
        console.error("Erreur lors de la lecture du PDF :", error);
      } finally {
        setProcessing(false); // Mettre à jour l'état de traitement après la lecture
      }
    };

    if (fileUrl) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileUrl]);

  return null; // Ou affichez quelque chose d'autre si nécessaire
};

export default ReadSource;
