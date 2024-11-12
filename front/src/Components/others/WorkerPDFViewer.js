import React, { useRef, useState, useEffect } from 'react';
import { GlobalWorkerOptions, getDocument, renderTextLayer } from 'pdfjs-dist';
import {
    BackHandOutlined,
    ZoomInOutlined,
    ZoomOutOutlined,
    RotateLeftOutlined,
    RotateRightOutlined,
} from '@mui/icons-material';
import './WorkerPDFViewer.css';

GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

const PDFViewer = ({ fileUrl }) => {
    const [pdf, setPdf] = useState(null);
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [numPages, setNumPages] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        const loadPDF = async () => {
            const loadingTask = getDocument(fileUrl);
            const pdfDocument = await loadingTask.promise;
            setPdf(pdfDocument);
            setNumPages(pdfDocument.numPages);
        };

        loadPDF();
    }, [fileUrl]);

    useEffect(() => {
        if (pdf) {
            renderAllPages(scale, rotation);
        }
    }, [pdf, scale, rotation]);

    const renderAllPages = async (scale, rotation) => {
        const container = containerRef.current;
        container.innerHTML = ''; // Clear previous content

        for (let num = 1; num <= numPages; num++) {
            const canvas = document.createElement('canvas');
            const textLayerDiv = document.createElement('div');
            textLayerDiv.className = 'textLayer';
            textLayerDiv.style.position = 'absolute';
            textLayerDiv.style.top = 0;
            textLayerDiv.style.left = 0;
            textLayerDiv.style.pointerEvents = 'stroke';
            textLayerDiv.style.zIndex = 1;
            textLayerDiv.style.setProperty('--scale-factor', scale);

            const pageDiv = document.createElement('div');
            pageDiv.style.position = 'relative';
            pageDiv.appendChild(canvas);
            pageDiv.appendChild(textLayerDiv);

            container.appendChild(pageDiv);

            const page = await pdf.getPage(num);
            const viewport = page.getViewport({ scale, rotation });
            
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            const context = canvas.getContext('2d');
            
            // Render PDF page on canvas
            await page.render({
                canvasContext: context,
                viewport,
            }).promise;

            // Render text layer for text selection
            const textContent = await page.getTextContent();
            renderTextLayer({
                textContentSource: textContent,
                container: textLayerDiv,
                viewport,
                textDir: 'ltr',
            });
        }
    };

    const zoomIn = () => {
        setScale((prevScale) => prevScale * 1.2);
    };

    const zoomOut = () => {
        setScale((prevScale) => prevScale / 1.2);
    };

    const rotateLeft = () => {
        setRotation((prevRotation) => (prevRotation - 90) % 360);
    };

    const rotateRight = () => {
        setRotation((prevRotation) => (prevRotation + 90) % 360);
    };

    return (
        <div className="flex flex-col bg-slate-200 h-screen">
            <div className="top-bar flex justify-between items-center p-2 bg-white shadow-lg z-50 relative">
                <div className="controls">
                    <button>
                        <BackHandOutlined />
                    </button>
                    <button onClick={zoomIn}>
                        <ZoomInOutlined />
                    </button>
                    <button onClick={zoomOut}>
                        <ZoomOutOutlined />
                    </button>
                    <button onClick={rotateLeft}>
                        <RotateLeftOutlined />
                    </button>
                    <button onClick={rotateRight}>
                        <RotateRightOutlined />
                    </button>
                </div>
            </div>
            <div className="pdf-content">
                <div ref={containerRef} className="pdf-container" />
                <div className='h-10' />
            </div>
        </div>
    );
};

export default PDFViewer;
