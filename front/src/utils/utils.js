import { jsPDF } from 'jspdf';
import fileService from "../Components/services/fileService";

export const SERVER_URL = fileService.API_BASE_URL

// Function to convert XML to JSON
export function xmlToJson(xml) {
    // Create the result object
    let obj = {};

    // If the node is an element
    if (xml.nodeType === 1) {
        // If element has attributes, add them to the object
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (let j = 0; j < xml.attributes.length; j++) {
                const attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    }

    // If the node is text, add its value
    else if (xml.nodeType === 3) {
        obj = xml.nodeValue;
    }

    // Process child nodes recursively
    if (xml.hasChildNodes()) {
        for (let i = 0; i < xml.childNodes.length; i++) {
            const item = xml.childNodes.item(i);
            const nodeName = item.nodeName;
            if (typeof (obj[nodeName]) === "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof (obj[nodeName].push) === "undefined") {
                    const old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
}


// Function to convert keys into human-readable text
export const makeReadable = (key) => {
    return key
        .replace(/([a-z])([A-Z])/g, '$1 $2')  // Insert space before capital letters
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // Handle acronyms like VAT
        .replace(/([0-9]+)/g, ' $1')  // Handle numbers
        .replace(/_/g, ' ')  // Replace underscores with spaces
        .replace(/^\w/, (c) => c.toUpperCase());  // Capitalize the first letter
};

// Function to change the value of a specified key in the object
export const changeObjectValue = (obj, key, value) => {
    const keys = key.split('.'); // Split the key for nested objects
    let current = { ...obj }; // Create a shallow copy of the root object
    let temp = current; // Use a temp variable to navigate through the object

    // Traverse the object to find the correct location
    for (let i = 0; i < keys.length - 1; i++) {
        if (temp[keys[i]] === undefined) {
            // If the key does not exist, create an empty object
            temp[keys[i]] = {};
        }

        // Create a new object at this level to avoid direct mutation
        temp[keys[i]] = { ...temp[keys[i]] };
        temp = temp[keys[i]]; // Move deeper into the object
    }

    // Update the value at the specified key
    temp[keys[keys.length - 1]] = value;

    return current; // Return the modified root object
};


// method to download result from server
export const GenerateXMLFromResponse = async (response, name = 'data.xml') => {

    // Get the filename from the Content-Disposition header
    const contentDisposition = response.headers.get('Content-Disposition');
    const fileName = contentDisposition
        ? contentDisposition.split('filename=')[1]
        : name;

    // Get the response as a blob (binary large object)
    const blob = await response.blob();

    // Create a link element to trigger the download
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;

    // Programmatically click the link to trigger the download
    link.click();

    // Clean up the object URL after download
    window.URL.revokeObjectURL(link.href);
}


// Method to show workflow status
export const showWorkflowStatus = (document) => {
    // worked
    // draft
    // pending
    // finished
    // canceled
}


export const getVerticesOnJSOn = (data) => {
    const vertices = [];
    const lineItems = [];
    const vats = [];
    data.forEach(keyValue => {
        var vert = keyValue.pageAnchor.pageRefs[0].boundingPoly;
        if (vert) {
            vertices.push({
                id: keyValue.id,
                key: toCamelCase(keyValue.type),
                page: keyValue.pageAnchor.pageRefs[0].page || 0,
                vertices: vert.normalizedVertices
            })
            // get line items
            const lineItem = extractLineItemDetails("line_item", keyValue)
            if (lineItem) lineItems.push(lineItem);
            
            // get vat
            const vatItem = extractLineItemDetails("vat", keyValue)
            if (vatItem) vats.push(vatItem);
        }
    });

    vertices.push({ key: "LineItemsDetails", data: lineItems});
    vertices.push({ key: "VatDetails", data: vats});
    return vertices;
}

const extractLineItemDetails = (key, data) => {
    if (data.type !== key) {
        return null;
    }

    const lineItem = {
        id: data.id,
        mentionText: data.mentionText,
        vertices: data.pageAnchor.pageRefs[0]?.boundingPoly?.normalizedVertices || [],
        page: data.pageAnchor.pageRefs[0]?.page || 0, // Default to page 1 if not specified
        properties: [],
    };

    data.properties.forEach((property) => {
        const propDetails = {
            id: property.id,
            type: property.type,
            mentionText: property.mentionText,
            vertices: property.pageAnchor.pageRefs[0]?.boundingPoly?.normalizedVertices || [],
            page: property.pageAnchor.pageRefs[0]?.page || lineItem.page, // Default to page 1 if not specified
        };
        lineItem.properties.push(propDetails);
    });

    return lineItem;
};

export const toCamelCase = (str = '') => str
    .toLowerCase() // Convert the entire string to lowercase
    .split('_') // Split the string by underscores
    .map((word, index) =>
        index === 0
            ? word.charAt(0).toUpperCase() + word.slice(1) // Capitalize the first letter of the first word
            : word.charAt(0).toUpperCase() + word.slice(1) // Capitalize the first letter of other words
    )
    .join(''); // Join the words back together


// Function to determine if a file URL is an image
const isImageFile = (url) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
};

// Convert an image to a PDF Blob
const convertImageToPdf = async (imageUrl) => {
    const pdf = new jsPDF();

    const image = await loadImage(imageUrl);
    const imgWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (image.height * imgWidth) / image.width; // Maintain aspect ratio

    pdf.addImage(image, 'JPEG', 0, 0, imgWidth, imgHeight);

    // Convert to Blob
    return pdf.output('blob');
};

// Load image as an HTML Image object
const loadImage = (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
};

// Main function to handle both PDF and image files
export const getPdfBlob = async (fileUrl) => {
    if (isImageFile(fileUrl)) {
        // Convert image to PDF
        return await convertImageToPdf(fileUrl);
    } else {
        // Fetch and return the PDF as Blob
        const response = await fetch(fileUrl);
        return await response.blob();
    }
};

export function detectDateFormat(dateString) {
    const formats = [
        { regex: /^\d{2}-\d{2}-\d{4}$/, format: 'dd-MM-yyyy' },
        { regex: /^\d{4}-\d{2}-\d{2}$/, format: 'yyyy-MM-dd' },
        { regex: /^\d{2}\/\d{2}\/\d{4}$/, format: 'dd/MM/yyyy' },
        { regex: /^\d{4}\/\d{2}\/\d{2}$/, format: 'yyyy/MM/dd' },
        { regex: /^\d{2}\.\d{2}\.\d{4}$/, format: 'dd.MM.yyyy' },
        { regex: /^\d{4}\.\d{2}\.\d{2}$/, format: 'yyyy.MM.dd' },
        { regex: /^\d{2} \d{2} \d{4}$/, format: 'dd MM yyyy' },
        { regex: /^\d{4} \d{2} \d{2}$/, format: 'yyyy MM dd' },
        { regex: /^(\d{2})\s([a-zéèàêô]+)\s(\d{4})$/i, format: 'dd MMMM yyyy' },
    ];

    // Loop through each format and test the date string
    for (const { regex, format } of formats) {
        if (regex.test(dateString)) {
            return format;
        }
    }
    return 'Unknown Format';
}