import { jsPDF } from 'jspdf';
import _ from 'lodash';
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
    const keys = key.split('.');
    let current = obj; // Do not create a new object yet
    let temp = current;
    
    for (let i = 0; i < keys.length - 1; i++) {
        if (!temp[keys[i]]) return obj; // If key doesn't exist, return original object

        temp = temp[keys[i]]; // Navigate without modifying
    }

    if (temp[keys[keys.length - 1]] === value) {
        return obj; // No change, return same object reference
    }

    // If value actually changed, create a copy
    let newObj = { ...obj };
    temp = newObj;
    
    for (let i = 0; i < keys.length - 1; i++) {
        temp[keys[i]] = { ...temp[keys[i]] };
        temp = temp[keys[i]];
    }

    temp[keys[keys.length - 1]] = value;

    return newObj;
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


export const getVerticesOnJSOn = (data, type) => {
    var vertices = [];
    const lineItems = [];
    const vats = [];
    
    if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            let keyValue = data[i];
            // FOR INVOICE
            if (keyValue.pageAnchor) {
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
            } else if (keyValue.formFields) {
    
                let page = keyValue.pageNumber;
    
                vertices = [...keyValue.formFields.map((item, index) => ({
                    id: index,
                    page: page - 1,
                    key: labelToCapitalized(item.fieldName.textAnchor.content),
                    vertices: item.fieldValue.boundingPoly.normalizedVertices,
                }))];
                
                break;
            }
        }
    } else {
        if (type === "OCR") {
            const verticesWithId = data.pages.map(e => {
                return e.blocks.map(b => ({
                    page: e.pageNumber - 1,
                    vertices: b.layout.boundingPoly.normalizedVertices,
                }))
            }).flat().map((v, idx) => ({...v, key: idx}));
            vertices = [...vertices, verticesWithId].flat();
        } else if (type === "AccidentReport") {
            function toPascalCase(str) {
                return str
                  .toLowerCase()
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join('');
            }
            const verticesWithId = data.pages.map(e => {
                return e.blocks.map(b => ({
                    page: e.pageNumber - 1,
                    vertices: b.layout.boundingPoly.normalizedVertices,
                    key: toPascalCase(b.field.replace(/\n/g, '').replace('Id', 'ID'))
                }))
            }).flat().map((v, idx) => ({...v}));
            vertices = [...vertices, verticesWithId].flat();
        }
    }
    
    vertices.push({ key: "LineItemsDetails", data: lineItems });
    // vertices.push({ key: "VatDetails", data: vats });
    if (vats.length) {
        const VATs = vats.map((d, vatIndex) => d.properties.map(d => ({
            ...d,
            key: (vats.length === 1 ? "": vatIndex) + convertToPascalCase(d.type)
        }))).flat();
        vertices = [...vertices, ...VATs];
    }
    return vertices;
}

export function convertToPascalCase(str) {
    return str
      .split(/\/|-|_/) // Split by slash or dash
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
      .join(''); // Join the words together
}

export function labelToCapitalized(label) {
    if (!label) return "";
    return label
        .replace(/[\n:]+/g, '') // Remove \n and trailing colons
        .replace(/:$/, '') // Remove the trailing colon if it exists
        .trim() // Remove leading and trailing whitespace
        .split(' ') // Split into words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
        .join('')
        .replace(/'/g, ''); // Join them back together
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
export const convertImageToPdf = async (imageUrl) => {
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
    return 'dd-MM-yyyy';
}

// Function to add prefix to keys
export function addPrefixToKeys(obj, prefix) {
    const transformed = {};
    for (const [key, value] of Object.entries(obj)) {
        const newKey = `${prefix}${key.charAt(0).toUpperCase()}${key.slice(1)}`;
        transformed[newKey] = value;
    }
    return transformed;
}

export function isPointInPolygon(point, vertices) {
    let { x, y } = point;
    let inside = false;

    // Loop through each edge of the polygon
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
        const xi = vertices[i].x, yi = vertices[i].y;
        const xj = vertices[j].x, yj = vertices[j].y;

        // Check if the point is on an edge
        const onEdge =
            ((yi > y) !== (yj > y)) &&
            (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);

        if (onEdge) {
            inside = !inside;
        }
    }

    return inside;
}


// Desired key order
export const invoiceOrder = [
    "InvoiceId",
    "InvoiceDate",
    "DueDate",
    "DeliveryDate",
    "InvoiceType",
    "PurchaseOrder",
    "Currency",
    "PaymentTerms",
    "TotalAmount",
    "NetAmount",
    "TotalTaxAmount",
    "Vat",
    "SupplierName",
    "SupplierAddress",
    "SupplierTaxId",
    "SupplierRegistration",
    "SupplierIban",
    "SupplierPhone",
    "SupplierWebsite",
    "SupplierEmail",
    "ReceiverName",
    "ReceiverAddress",
    "ReceiverTaxId",
    "ShipToName",
    "ShipToAddress",
    "RemitToAddress",
    "LineItem",
];

export const formParserOrder = [
    "Name",
    "Gender",
    "DateOfBirth",
    "CountryOfBirth",
    "TownCityOfBirth",
    "FathersFullName",
    "MothersFullName",
    "PassportNumber",
    "IssueDate",
    "ExpiryDate",
    "IssuingAuthority",
    "PlaceOfIssue",
    "TypeOfTravelDocument",
    "CurrentCitizenship",
    "MaritalStatus",
    "PresentOccupation",
    "Address",
    "TelephoneNumber",
    "EmailAddress0",
    "EmailAddress1",
    "DateOfDeparture",
    "DateOfEntry",
    "PurposeOfTravel",
    "MeansOfTransport",
    "DurationOfStay",
    "NumberOfEntriesRequested",
    "ReferenceNumber",
    "OfVisaTourist",
    "ValidUntil",
    "Country",
    "City"
];


export function reorderKeys(obj, order = invoiceOrder) {
    const reordered = {};
    const additionalKeys = Object.keys(obj).filter((key) => !order.includes(key));
    const lineItemKey = "LineItem";

    // Add keys in desired order if they exist, except LineItem
    for (const key of order) {
        if (key !== lineItemKey && key in obj) {
            reordered[key] = obj[key];
        }
    }

    // Add any additional keys not in the desired order above LineItem
    for (const key of additionalKeys) {
        reordered[key] = obj[key];
    }

    // Add LineItem at the end if it exists
    if (lineItemKey in obj) {
        reordered[lineItemKey] = obj[lineItemKey];
    }

    return reordered;
}

// Method to convert value (number) to currency (EUR, GBP, USD)
export function formatCurrency(value, currency) {
    // Define locales for the currency
    const localeMap = {
        EUR: 'de-DE', // Common for Euro in Germany
        GBP: 'en-GB', // British Pound in the UK
        USD: 'en-US', // US Dollar
        // Add more locales here for other currencies if needed
    };

    // Set the default locale to 'de-DE' if the currency is not in the map
    const locale = localeMap[currency] || 'de-DE';

    // Use Intl.NumberFormat to format the number
    const formatter = new Intl.NumberFormat(locale, {
        style: 'decimal',  // Remove currency style to just format the number
        maximumFractionDigits: 2, // Optional: control decimal precision
    });

    // Return the formatted number without the currency symbol
    return formatter.format(value);
}

export const CURRENCY_LIST = ['GBP', 'EUR', 'USD'];

export const fetchAndConvertToBase64 = async (url) => {
    try {
        // Étape 1 : Télécharger l'image en tant que Blob
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur lors du téléchargement : ${response.statusText}`);
        const mimeType = response.headers.get('Content-Type');
        const blob = await response.blob();

        // Étape 2 : Convertir le Blob en Base64
        const base64 = await convertObjectUrlToBase64(blob);
        return [base64,mimeType];
    } catch (error) {
        console.error("Erreur lors de la conversion en Base64 :", error);
    }
};

export const convertImageToPDF =  (imageSrc, mimeType) => {
    const pdf = new jsPDF();
    let format = "JPEG"; // Format par défaut
    if (mimeType.includes("png")) {
        format = "PNG";
    } else if (mimeType.includes("gif")) {
        format = "GIF";
    }

    pdf.addImage(imageSrc, format, 0, 0, 210, 297); // Taille A4 (210 x 297 mm)

    const pdfData = pdf.output('blob');

    return URL.createObjectURL(pdfData);
};

const convertObjectUrlToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
    
        reader.onloadend = () => {
          resolve(reader.result); // Cette valeur est l'URL Base64 du fichier
        };
    
        reader.onerror = (error) => {
          reject(error); // En cas d'erreur, on rejette la promesse
        };
    
        reader.readAsDataURL(file); // Lire le fichier en tant qu'URL Base64
    });
};

export const updateArray = (array1, array2) => {
    // Create a map from array1 for efficient lookup
    const map = new Map(array1.map(item => [item.name, item.value]));

    // Iterate over array2 and update the value if the name exists in array1
    return array2.map(item => {
        if (map.has(item.name)) {
            return { ...item, value: map.get(item.name) }; // Update value
        }
        return item; // Keep unchanged if no match
    });
};



export const getFormData = (formRef) => {
    const form = formRef.current;
    const fieldsets = form.querySelectorAll('fieldset');
    const jsonObject = {};

    fieldsets.forEach((fieldset) => {
        const legend = fieldset.querySelector('legend')?.textContent || 'unnamed';
        const inputs = fieldset.querySelectorAll('input, select, textarea');
        const fieldsetData = {};

        inputs.forEach((input) => {
            const name = input.name;
            const value = input.type === 'checkbox' ? input.checked : input.value;
            fieldsetData[name] = value;
        });

        jsonObject[legend] = fieldsetData;
    });

    console.log(JSON.stringify(jsonObject, null, 2));
    return jsonObject;
};


export const isObjEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);
export function deepMergeArray(arr1, arr2) {
    return arr1.map(obj1 => {
        // Find matching object in arr2 by "name"
        const obj2 = arr2.find(obj2 => obj2.name === obj1.name);
        
        if (obj2) {
            return deepMerge(obj1, obj2);
        }
        return obj1;
    });
}

export function deepMerge(obj1, obj2) {
    for (const key in obj2) {
        if (!obj2.hasOwnProperty(key)) continue;

        if (key === "elements" && Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
            // If both objects have an "elements" array, merge them recursively
            obj1[key] = deepMergeArray(obj1[key], obj2[key]);
        } else if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object' && obj1[key] !== null) {
            // If both are objects, merge recursively
            obj1[key] = deepMerge(obj1[key], obj2[key]);
        } else {
            // Otherwise, replace value
            obj1[key] = obj2[key];
        }
    }
    return obj1;
}

// Recursive function to find item by name using Lodash
export function findItemByName(arr, name) {
    return arr.reduce((result, item) => {
        // Check if the item matches
        if (item.name === name) {
            return item;
        }
        
        // Recursively search inside elements
        if (item.elements) {
            const found = findItemByName(item.elements, name);
            if (found) {
                return found;  // Return the found item
            }
        }
        return result;  // Continue searching
    }, null);
}

// function to reset field
export function deepReset(obj) {
    
    if (Array.isArray(obj)) {
        // If the argument is an array, reset each item in the array
        return obj.map(item => deepReset(item));
    } else if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            if (!obj.hasOwnProperty(key)) continue;

            if (key === "elements" && Array.isArray(obj[key])) {
                // If the key is "elements" and it's an array, reset each item inside the array
                obj[key] = obj[key].map(item => deepReset(item)); // Reset elements recursively
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                // If the value is an object, reset it recursively
                obj[key] = deepReset(obj[key]);
            } else {
                // Otherwise, reset the value to empty (or delete it if you prefer)
                if ("value" in obj) {
                    if (obj.type === 'text') {
                        obj.value = [];
                    } else {
                        obj.value = '';
                    }
                }
            }
        }
    }
    return obj;
}

export function deepCloneArray(arr) {
    if (Array.isArray(arr)) {
        return arr.map(item => deepClone(item)); // Use deepClone for each item
    } else {
        return arr; // If it's not an array, return it as is
    }
}

export function deepClone(obj) {
    if (Array.isArray(obj)) {
        // If the obj is an array, apply deepCloneArray recursively
        return deepCloneArray(obj);
    } else if (typeof obj === 'object' && obj !== null) {
        // If it's an object, create a new object and deep clone its properties
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]); // Recursively clone each key
            }
        }
        return clonedObj;
    } else {
        // Primitive value (string, number, etc.), just return it as is
        return obj;
    }
}


export function updateObjectByName(obj, targetName, newValue) {
    return obj.map(item => {
        if (item.name === targetName) {
            return { ...item, value: newValue }; // Return updated item
        }
        if (item.type === "group" && Array.isArray(item.elements)) {
            return { 
                ...item, 
                elements: updateObjectByName(item.elements, targetName, newValue) 
            }; // Recursively update nested groups
        }
        return item; // Return unchanged item
    });
}

export function replaceObjectFoundByName(obj, targetName, newValue) {
    return obj.map(item => {
        if (item.name === targetName) {
            return { ...item, ...newValue }; // Return updated item
        }
        if (item.type === "group" && Array.isArray(item.elements)) {
            return { 
                ...item, 
                elements: replaceObjectFoundByName(item.elements, targetName, newValue) 
            }; // Recursively update nested groups
        }
        return item; // Return unchanged item
    });
}

export function deleteObjectFoundByName(obj, targetName) {
    return obj
        .filter(item => item.name !== targetName) // Remove the item if its name matches
        .map(item => {
            if (item.type === "group" && Array.isArray(item.elements)) {
                return { 
                    ...item, 
                    elements: deleteObjectFoundByName(item.elements, targetName) 
                }; // Recursively delete from nested groups
            }
            return item; // Return unchanged item
        });
}

// method to remove duplicated items on array by targeting with key
export function removeDuplicatedData(array, keys) {
    const seen = new Set();
    return array.filter(item => {
        const key = keys.map(k => item[k]).join('|'); // Create a unique identifier based on keys
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

export function escapeRegExp(string) {
    return string.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&');
}

export function toCamelCase1(str) {
    return str
        .replace(/[^a-zA-Z0-9 ]/g, '') // Remove special characters
        .split(' ')
        .map((word, index) => 
            index === 0 
                ? word.charAt(0).toLowerCase() + word.slice(1) 
                : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join('');
}
export function updateNamesToHaveGroupName(obj, parentName = '') {
    if (typeof obj !== 'object' || obj === null) return;

    if (obj.name !== obj.label) {
        obj.name = toCamelCase1(parentName + obj.label);
    }

    if (obj.elements && Array.isArray(obj.elements)) {
        obj.elements.forEach((child, index) => updateNamesToHaveGroupName(child, obj.name + (index + 1)));
    }
    return obj;
}