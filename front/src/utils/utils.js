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
    // Handle specific cases like VATnumber
    const specialCases = {
        VATnumber: 'VAT Number',
        IRNnumber: 'IRN Number'
    };

    // Check if the key matches any special cases
    if (specialCases[key]) {
        return specialCases[key];
    }
    return key
        .replace(/([a-z])([A-Z])/g, '$1 $2')  // Insert space before capital letters
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // Handle acronyms like VAT
        .replace(/([0-9]+)/g, ' $1')  // Handle numbers
        .replace(/_/g, ' ')  // Replace underscores with spaces
        .replace(/^\w/, (c) => c.toUpperCase());  // Capitalize the first letter
};