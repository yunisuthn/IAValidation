import React, { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/pdfjs-express-viewer';

const MyDocument = ({ fileUrl }) => {
    const viewer = useRef(null);
    const webViewerInstance = useRef(null);  // Ref to store the WebViewer instance

    // if using a class, equivalent of componentDidMount
    useEffect(() => {
        
        if (!webViewerInstance.current) {

            WebViewer(
                {
                    path: '/webviewer/lib',
                    initialDoc: '/pdf/demo.pdf',
                    licenseKey: 'VMeLR5MsW5lX3X9YfqQF',
                },
                viewer.current,
            ).then((instance) => {

                webViewerInstance.current = instance;

                // now you can access APIs through the WebViewer instance
                const { Core, UI } = instance;

                // adding an event listener for when a document is loaded
                Core.documentViewer.addEventListener('documentLoaded', () => {
                    console.log('document loaded');
                    
                });

                // adding an event listener for when the page number has changed
                Core.documentViewer.addEventListener('pageNumberUpdated', (pageNumber) => {
                    console.log(`Page number is: ${pageNumber}`);
                });

                // disable printing, downloading
                instance.UI.disableFeatures([UI.Feature.Print, UI.Feature.Download])

                // Set dark mode as the default theme
                // UI.setTheme('dark');

                // adds a button to the header that on click sets the page to the next page
                UI.setHeaderItems(header => {

                    // Add custom buttons for rotating
                    header.push({
                        type: 'actionButton',
                        img:  "icon-header-page-manipulation-page-rotation-counterclockwise-line",  // You can provide a custom icon
                        title: 'Rotate Left',
                        onClick: () => {
                            UI.rotateCounterClockwise();
                        },
                    });

                    header.push({
                        type: 'actionButton',
                        img:  "icon-header-page-manipulation-page-rotation-clockwise-line",  // You can provide a custom icon
                        title: 'Rotate Right',
                        onClick: () => {
                            UI.rotateClockwise();;  // Rotate clockwise
                        },
                    });

                });
            }).catch((err) => console.log("Error:", err));
        }

        return () => {
            if (webViewerInstance.current) {
                webViewerInstance.current.dispose();  // Clean up the WebViewer instance
                webViewerInstance.current = null;
            }
        };

    }, []);

    // change url
    useEffect(() => {
        if (fileUrl && webViewerInstance.current) {
            webViewerInstance.current.UI.loadDocument(fileUrl);
        }

    }, [fileUrl]);

    return (
        <div className="webviewer" ref={viewer}></div>
    );
};

export default MyDocument;
