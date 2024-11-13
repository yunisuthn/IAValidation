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
import json from './../../vertices.json'
import { fetchVerticesOnJSOn } from '../../utils/utils';

GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

export const PDFViewer = ({ fileUrl }) => {
    const [pdf, setPdf] = useState(null);
    const [scale, setScale] = useState(1.5);
    const [rotation, setRotation] = useState(0);
    const [numPages, setNumPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [canvasPages, setCanvasPages] = useState([]);
    const containerRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const verticesGroups = fetchVerticesOnJSOn(json);

    useEffect(() => {
        const loadPDF = async () => {
            const loadingTask = getDocument(fileUrl);
            const pdfDocument = await loadingTask.promise;
            setPdf(pdfDocument);
            setNumPages(pdfDocument.numPages);
        };
        // loading page
        setLoading(true);
        // load pdf
        loadPDF()
            .finally(() => setTimeout(() => setLoading(false), 5000)); // stop loading
        
        
    }, [fileUrl]);

    useEffect(() => {
        if (pdf) {
            renderPage(currentPage, scale, rotation);
        }
    }, [pdf, scale, rotation, currentPage]);


    useEffect(() => {
        const fetchCanvasArray = async () => {
        if (pdf) {
            const pages = await generateCanvasArray(pdf, scale, rotation);
            setCanvasPages(pages);
        }
        };

        fetchCanvasArray();
    }, [pdf, scale, rotation]);

    const renderPage = async (currentPage, scale, rotation) => {

        const container = containerRef.current;
        container.innerHTML = ''; // Clear previous content

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

        const page = await pdf.getPage(currentPage);
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

        console.log(rotation)
        drawVertices(context, viewport, canvas, containerRef, rotation)
    }


    const generateCanvasArray = async (pdf, scale, rotation) => {
        const pages = [];

        for (let num = 1; num <= pdf.numPages; num++) {
            const canvas = document.createElement('canvas');
            const page = await pdf.getPage(num);
            const viewport = page.getViewport({ scale });

            canvas.height = 200;
            canvas.width = 140;

            const context = canvas.getContext('2d');

            // Render PDF page on canvas
            await page.render({
                canvasContext: context,
                viewport,
            }).promise;

            // Push the canvas to the array
            pages.push(canvas);
        }

        return pages;
    };
    
    const drawVertices = (context, viewport, canvas, containerRef, rotationAngle = 0) => {
        verticesGroups.forEach((vertice, groupIndex) => {
            if (vertice.page === '0') {
                context.strokeStyle = `blue`;
                context.lineWidth = 1;
    
                // Save the current context state
                context.save();
    
                // Calculate the center of the canvas for rotation
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
    
                // Normalize the rotation angle to 0, 90, 180, or 270 degrees
                const normalizedAngle = (rotationAngle % 360 + 360) % 360;

                // Translate to the center for rotation
                context.translate(centerX, centerY);
                context.rotate((normalizedAngle * Math.PI) / 180);
                context.translate(-centerX, -centerY);
    
                context.beginPath();
                vertice.vertices.forEach((vertex, index) => {
                    const { x, y } = vertex;
                    const adjustedX = x * viewport.width;
                    const adjustedY = y * viewport.height;
    
                    if (index === 0) {
                        context.moveTo(adjustedX, adjustedY);
                    } else {
                        context.lineTo(adjustedX, adjustedY);
                    }
                });
                context.closePath();
                context.stroke();
    
                // Restore the context to its original state
                context.restore();
            }
        });
    };

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
            <div className='panel'>
                <div className="viewer">
                    <div className="pdf-content" style={{ display: loading ? 'none' : 'flex' }}>
                        <div ref={containerRef} className="pdf-container" />
                    </div>
                    {
                        loading &&
                        <div className="loading-image">
                            <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="160px" height="20px" viewBox="0 0 128 16">
                                <rect x="0" y="0" width="100%" height="100%" fill="none" />
                                <path fill="#bdd7e9" d="M6.4,4.8A3.2,3.2,0,1,1,3.2,8,3.2,3.2,0,0,1,6.4,4.8Zm12.8,0A3.2,3.2,0,1,1,16,8,3.2,3.2,0,0,1,19.2,4.8ZM32,4.8A3.2,3.2,0,1,1,28.8,8,3.2,3.2,0,0,1,32,4.8Zm12.8,0A3.2,3.2,0,1,1,41.6,8,3.2,3.2,0,0,1,44.8,4.8Zm12.8,0A3.2,3.2,0,1,1,54.4,8,3.2,3.2,0,0,1,57.6,4.8Zm12.8,0A3.2,3.2,0,1,1,67.2,8,3.2,3.2,0,0,1,70.4,4.8Zm12.8,0A3.2,3.2,0,1,1,80,8,3.2,3.2,0,0,1,83.2,4.8ZM96,4.8A3.2,3.2,0,1,1,92.8,8,3.2,3.2,0,0,1,96,4.8Zm12.8,0A3.2,3.2,0,1,1,105.6,8,3.2,3.2,0,0,1,108.8,4.8Zm12.8,0A3.2,3.2,0,1,1,118.4,8,3.2,3.2,0,0,1,121.6,4.8Z"/>
                                <g><path fill="#619fcb" d="M-42.7,3.84A4.16,4.16,0,0,1-38.54,8a4.16,4.16,0,0,1-4.16,4.16A4.16,4.16,0,0,1-46.86,8,4.16,4.16,0,0,1-42.7,3.84Zm12.8-.64A4.8,4.8,0,0,1-25.1,8a4.8,4.8,0,0,1-4.8,4.8A4.8,4.8,0,0,1-34.7,8,4.8,4.8,0,0,1-29.9,3.2Zm12.8-.64A5.44,5.44,0,0,1-11.66,8a5.44,5.44,0,0,1-5.44,5.44A5.44,5.44,0,0,1-22.54,8,5.44,5.44,0,0,1-17.1,2.56Z"/>
                                <animateTransform attributeName="transform" type="translate" values="23 0;36 0;49 0;62 0;74.5 0;87.5 0;100 0;113 0;125.5 0;138.5 0;151.5 0;164.5 0;178 0" calcMode="discrete" dur="1170ms" repeatCount="indefinite"/></g>
                            </svg>
                        </div>
                    }
                </div>
                <div className="pagination">
                    <div className="pages">
                        {
                            Array.from({ length: numPages}, (_, i) => i + 1).map((num) => (
                                <PageItem
                                    pdf={pdf}
                                    pageNum={num}
                                    key={num}
                                    className={`${num === currentPage ? 'active' : ''}`}
                                    onClick={() => setCurrentPage(num)}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

function PageItem({ pdf, pageNum=1, className="", onClick }) {
    
    const ref = useRef(null);
    
    useEffect(() => {
        
        if (pdf) {
            const renderPage = async () => {
                const container = ref.current;
                container.innerHTML = ''; // Clear previous content
        
                const canvas = document.createElement('canvas');
                container.appendChild(canvas);
        
                const page = await pdf.getPage(pageNum);
                const viewport = page.getViewport({ scale: 0.17 });
        
                canvas.height = 120;
                canvas.width = 100;
        
                const context = canvas.getContext('2d');
        
                // Render PDF page on canvas
                await page.render({
                    canvasContext: context,
                    viewport,
                }).promise;
            }
            renderPage();
        }
        
    }, [pdf, pageNum]);


    return (
        <div className={`page-item ${className}`} onClick={() => onClick && onClick()}>
            <div ref={ref} className='canvas-container'/>
            <span className='pageNumber'>{pageNum}</span>
        </div>
    )
        

}

export default PDFViewer;
