import { useEffect, useState } from "react";
import Input from "../others/Input";
import MyDocument from "../others/MyDocument"; 
import { useParams } from "react-router-dom";
import axios from 'axios';
import { changeObjectValue, SERVER_URL } from '../../utils/utils';
import service from '../services/fileService'

const Doc = () => {

    const initialData = { };

    const [document, setDocument] = useState(null);
    const [invoiceData, setInvoiceData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // if of the document
    const { id } = useParams();


    useEffect(() => {

      const fetchData = async () => {
          setLoading(true);
          try {
              const response = await axios.get(`${SERVER_URL}/document/${id}`);
              const { data } = response;
              setDocument(data);
              // set invoice data
              setInvoiceData(data.xmlJSON)
              setLoading(false); // Set loading to false once data is fetched
          } catch (err) {
              setError(err.message); // Handle error
              setLoading(false);
          }
      };

      // check validation
      service.getDocumentValidation(id)
      .then(async res => {

        const validation = await res;

        if (!validation) return fetchData();

        const jsonData = JSON.parse(String.raw`${validation.json_data}`);
        console.log(jsonData)
        setDocument(validation.document);
        setInvoiceData(jsonData)

        
      })
    }, [id]);

    // Utility function to render form fields for nested objects
    const renderFields = (parentKey = '', data) => {
      return Object.keys(data).map((key) => {

        // Create the full key path by combining parent and current key
        const fullKey = parentKey ? `${parentKey}.${key}` : key;

        if (typeof data[key] === 'object') {
          // If the value is an object, render another fieldset for nested objects
          return (
            <fieldset key={fullKey}>
              <legend>{key}</legend>
              {renderFields(fullKey, data[key])}
            </fieldset>
          );
        } else {
          // Otherwise, render a regular input field
          return (
            <Input
              key={fullKey}
              label={key}
              value={data[key]}
              id={fullKey}
              onInput={handleUpdateJSON}
            />
          );
        }
      });
    };

    // Utility function to render form sections dynamically with fieldsets and legends
    const renderSections = (formData) => {
      return Object.keys(formData).map((sectionKey) => (
        <fieldset key={sectionKey}>
          <legend>{sectionKey}</legend>
          {renderFields(sectionKey, formData[sectionKey])}
        </fieldset>
      ));
    };
    

    // Submit form (do validation)
    async function handleSubmit(e) {
      e.preventDefault();
      // send to server
      service.sendValidation(id, {
        json_data: invoiceData
      }).then(async res => {

        const { data, ok } = await res;
        console.log(data, ok)

      }).catch(err => {

        console.log(err)
        
      });
    }

    function handleUpdateJSON(key, value) {
      const updated = changeObjectValue(invoiceData, key, value);
      setInvoiceData(updated)
    }

    return (
      <main className="document__page">
        <div className="nav">
          <h2 className="our__logo">SmartVerifica</h2>
        </div>
        <div className="doc__container splited">
          <div className="left_pane">
            <div className=""></div>
            <div className="validation__form">
              <div className="validation__title">
                <h3>Validation form</h3>
              </div>
              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="inputs scrollable_content custom__scroll">
                  <div className="content">
                    {renderSections(invoiceData)}
                    {/* Add some padding at bottom */}
                    <div className="h-10"></div> 
                  </div>
                </div>
                <div className="validation__buttons">
                  <button type="submit" className="custom__primary_btn">Validate</button>
                </div>
              </form>
              {/* End form */}
            </div>
          </div>
          <div className="right_pane">
            <div className="document">
              <MyDocument fileUrl={document ? `${SERVER_URL}/${document.filename}` : null}/>
            </div>
            <div className="h-10"></div>
          </div>
        </div>
      </main>
    )
  };
  
  export default Doc;