import { useEffect, useState } from "react";
import Input from "../others/Input";
import MyDocument from "../others/MyDocument"; 
import { useParams } from "react-router-dom";
import axios from 'axios';
import { changeObjectValue, SERVER_URL } from '../../utils/utils';
import service from '../services/fileService'
import ValidationSteps from "../others/ValidationSteps";

const Doc = () => {

    // if of the document
    const { id, validation } = useParams();

    const [document, setDocument] = useState(null);
    const [validationStage, setValidationStage] = useState(validation || 'v1');
    const [validationState, setValidationState] = useState('');
    const [invoiceData, setInvoiceData] = useState({});
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const v = ['v1', 'v2'].includes(validation);


    useEffect(() => {

      if (!v) return;

      const fetchData = async () => {
          setLoading(true);
          try {
              const response = await axios.get(`${SERVER_URL}/document/${id}`);
              const { data } = response;
              setDocument(data);
              // set invoice data
              setInvoiceData(data.xmlJSON)
              setLoading(false); // Set loading to false once data is fetched
              // register new v1
              service.saveValidation(id, {
                json_data: data.xmlJSON,
                num: validationStage
              }).then(async res => {

                const { data, ok } = await res;
                if (ok) {

                }

              }).catch(err => {

                console.log(err)
                
              });
          } catch (err) {
              setError(err.message); // Handle error
              setLoading(false);
          }
      };

      // check validation
      service.getDocumentValidation(id, validation)
        .then(async res => {

        const validation = await res;

        if (!validation) return fetchData();

        const jsonData = JSON.parse(String.raw`${validation.json_data}`);

        // check state of the validation
        if (validation.state === 'validated') {
          // setValidationStage('v2'); // forced to validation v2
        } else {
        }
        setValidationState(validation.state)
        setValidationStage(validation.num)
        setDocument(validation.document);
        setInvoiceData(jsonData)

        
      })
    }, [id, validation]);

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
              onFocus={setSearchText}
              onBlur={setSearchText}
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
      service.saveValidation(id, {
        json_data: invoiceData,
        num: validationStage
      }).then(async res => {

        const { data, ok } = await res;
        console.log(data, ok)

      }).catch(err => {

        console.log(err)
        
      });
    }

    // method to handle validate
    async function handleValidateDocument() {
      // send to server
      service.validateDocument(id, {
        json_data: invoiceData,
        num: validationStage
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

    if (!v) {
      return <>Not allowed version</>;
    }
    return (
      <main className="document__page">
        <div className="nav border-b">
          <div className="our__logo font-bold">
            {/* <span className="text-slate-800">SMART</span><span className="text-blue-500">Verifica</span> */}
            <img src="/smartverifica.png" alt="logo" className="w-52" />
          </div>
        </div>
        <div className="doc__container splited">
          <div className="left_pane">
            <div className="">{searchText}</div>
            <div className="validation__form">
              <div className="validation__title">
                {/* <h3>Validation stage: {validationStage}</h3> */}
                <ValidationSteps stage={validationStage} />
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
                  {
                    validationState !== 'validated' ?
                    <>
                      <button type="submit" className="custom__secondary_btn">Update</button>
                      <button type="button" className="custom__primary_btn" onClick={handleValidateDocument}>Validate</button>
                    </>
                    :
                    <p className="text-gray-700 bg-gray-300 text-sm text-center w-full p-2 border border-gray-400">Validation 1 is done!</p>
                  }
                </div>
              </form>
              {/* End form */}
            </div>
          </div>
          <div className="right_pane">
            <div className="document">
              <MyDocument fileUrl={document ? `${SERVER_URL}/${document.filename}` : null} searchText={searchText}/>
            </div>
            <div className="h-10"></div>
          </div>
        </div>
      </main>
    )
  };
  
  export default Doc;