import { useEffect, useState } from "react";
import Input from "../others/Input";
import MyDocument from "../others/MyDocument";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { changeObjectValue, SERVER_URL } from '../../utils/utils';
import service from '../services/fileService'
import ValidationSteps from "../others/ValidationSteps";
import { io } from 'socket.io-client';
import { Alert, Button, IconButton, Skeleton, Snackbar } from '@mui/material'
import { SwipeLeftAlt, PublishedWithChanges, Save, Cancel, ArrowLeft } from '@mui/icons-material'
import Header from "../others/Header";
import { useTranslation } from "react-i18next";

const socket = io('http://localhost:5000');

const defaultSnackAlert = {
  open: false,
  type: 'success',
  message: ''
};

const Doc = () => {

  const { i18n } = useTranslation();
  // if of the document
  const { id, validation } = useParams();

  const [document, setDocument] = useState(null);
  const [validationStage, setValidationStage] = useState(validation || 'v1');
  const [validationState, setValidationState] = useState('');
  const [invoiceData, setInvoiceData] = useState({});
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackAlert, setSnackAlert] = useState(defaultSnackAlert);
  const [file, setFile] = useState(null);


  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };


  const v = ['v1', 'v2'].includes(validation);


  useEffect(() => {

    if (!['v1', 'v2'].includes(validation)) return;

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
        setLoading(false)

      })
  }, [id, validation, validationStage]);

  useEffect(() => {
    // Fetch specific item info
    axios.get(`${SERVER_URL}/document/${id}`)
      .then(response => { setFile(response.data) })
      .catch(error => console.error('Error fetching item info:', error));

    // Déverrouiller l'élément lorsque l'utilisateur quitte la page
    return () => {
      socket.emit('unlock-file', id);
    };
  }, [id]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      fetch(`http://localhost:5000/unlockFile/${id}`, { method: 'POST' });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
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
      console.log(data)
      if (ok) {
        setSnackAlert({
          open: true,
          type: 'success',
          message: 'Data registered!'
        });
      }

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
      if (ok) {
        setSnackAlert({
          open: true,
          type: 'success',
          message: 'Validation success!'
        });
      }

    }).catch(err => {

      console.log(err)

    });
  }

  function handleUpdateJSON(key, value) {
    const updated = changeObjectValue(invoiceData, key, value);
    setInvoiceData(updated)
  }

  // method to close alert
  function closeSnackAlert() {
    setSnackAlert(defaultSnackAlert)
  }

  if (!v) {
    return <>Not allowed version</>;
  }
  return (
    <main className="document__page">
      <Header changeLanguage={changeLanguage} />
      <div className="operations">
        <div className="validation__buttons">
          {
            Object.entries(invoiceData).length > 0 && validationState !== 'validated' ?
              <>
                <div>
                  <Button type="button" size="small" startIcon={<ArrowLeft />}>
                    <span className="!text-gray-800">Retour</span>
                  </Button>
                </div>
                <div>
                  <Button type="button" size="small" startIcon={<Cancel />}>
                    <span className="!text-gray-800">Cancel document</span>
                  </Button>
                </div>
                <div>
                  <Button type="button" size="small" startIcon={<SwipeLeftAlt />}>
                    <span className="!text-gray-800">Return document</span>
                  </Button>
                </div>
                <div>
                  <Button type="submit" size="small" startIcon={<Save />}>
                    <span className="!text-gray-800">Save change</span>
                  </Button>
                </div>
                <div>
                  <Button type="button" size="small" startIcon={<PublishedWithChanges />}
                    onClick={handleValidateDocument}
                  >
                    <span className="!text-gray-800">Validate</span>
                  </Button>
                </div>
              </>
              :
              <p className="text-gray-700 bg-gray-300 text-sm text-center w-full p-2 border border-gray-400"></p>
          }
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
                  {
                    loading ?
                      <>
                        <Skeleton height={30} width={100} />
                        <div className="flex gap-2">
                          <Skeleton width={100} />
                          <Skeleton height={40} className="w-full" />
                        </div>
                        <div className="flex gap-2">
                          <Skeleton width={100} />
                          <Skeleton height={40} className="w-full" />
                        </div>
                        <div className="flex gap-2">
                          <Skeleton width={100} />
                          <Skeleton height={40} className="w-full" />
                        </div>
                        <Skeleton height={30} width={100} />
                        <div className="flex gap-2">
                          <Skeleton width={100} />
                          <Skeleton height={40} className="w-full" />
                        </div>
                        <div className="flex gap-2">
                          <Skeleton width={100} />
                          <Skeleton height={40} className="w-full" />
                        </div>
                        <div className="flex gap-2">
                          <Skeleton width={100} />
                          <Skeleton height={40} className="w-full" />
                        </div>
                      </>
                      :
                      Object.entries(invoiceData).length > 0 ? renderSections(invoiceData) : <span className="text-gray-400 text-center mx-auto">No data to display.</span>
                  }
                  {/* Add some padding at bottom */}
                  <div className="h-10"></div>
                </div>
              </div>
            </form>
            {/* End form */}
          </div>
        </div>
        <div className="right_pane">
          <div className="document">
            <MyDocument fileUrl={document ? `${SERVER_URL}/${document.name}` : null} searchText={searchText} />
          </div>
        </div>
        {/* Snack bar */}

        <Snackbar open={snackAlert.open} autoHideDuration={6000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          onClose={closeSnackAlert}
        >
          <Alert
            onClose={closeSnackAlert}
            severity={snackAlert.type}
            variant="filled"
            sx={{ width: '100%', padding: '0.2rem 0.6rem' }}
          >
            {snackAlert.message}
          </Alert>
        </Snackbar>
      </div>
      
      <div className="h-10 bg-gray-200 border-t border-t-300"></div>
    </main>
  )
};

export default Doc;