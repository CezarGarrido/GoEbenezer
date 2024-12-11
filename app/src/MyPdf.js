import * as PDFJS from "pdfjs-dist"
import React, { useCallback, useRef, useState, useEffect } from "react";


export default function PdfViewer(props) {
  // PDFJS.GlobalWorkerOptions.workerSrc =
  // `pdf.worker.min.mjs`
  const worker = new Worker('pdf.worker.min.mjs')
  PDFJS.GlobalWorkerOptions.workerPort = worker


  const { src } = props
  const canvasRef = useRef(null)

  const [pdfDoc, setPdfDoc] = useState()
  const [currentPage, setCurrentPage] = useState(1)
  let renderTask;

  const renderPage = useCallback(
    (pageNum, pdf = pdfDoc) => {
      const canvas = canvasRef.current
      if (!canvas || !pdf) return
      canvas.height = 0
      canvas.width = 0
      // canvas.hidden = true;
      pdf
        .getPage(pageNum)
        .then(page => {
          const viewport = page.getViewport({ scale: 1.5 })
          canvas.height = viewport.height
          canvas.width = viewport.width
          const renderContext = {
            canvasContext: canvas.getContext("2d"),
            viewport: viewport
          }
          try {
            if (renderTask) {
              renderTask.cancel()
            }
            renderTask = page.render(renderContext)
            return renderTask.promise
          } catch (error) { }
        })
        .catch(error => console.log(error))
    },
    [pdfDoc]
  )

  useEffect(() => {
    renderPage(currentPage, pdfDoc)
  }, [pdfDoc, currentPage, renderPage])

  useEffect(() => {
    const loadingTask = PDFJS.getDocument(src)
    loadingTask.promise.then(
      loadedDoc => {
        setPdfDoc(loadedDoc)
      },
      error => {
        console.error(error)
      }
    )
  }, [src])

  const nextPage = () =>
    pdfDoc && currentPage < pdfDoc.numPages && setCurrentPage(currentPage + 1)

  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1)

  return (
    <div>
      <header>
        <nav>
          <h5 className="max">Title</h5>
          <button onClick={prevPage} disabled={currentPage <= 1}>
            Previous
          </button>
          <button
            onClick={nextPage}
            disabled={currentPage >= (pdfDoc?.numPages ?? -1)}
          >
            Next
          </button>
        </nav>
      </header>
      <canvas ref={canvasRef}></canvas>
    </div>
  )
}
