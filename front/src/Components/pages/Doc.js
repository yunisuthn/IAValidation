import { useCallback, useEffect, useState } from "react";
import Input from "../others/Input";
import MyDocument from "../others/MyDocument";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { changeObjectValue, SERVER_URL } from '../../utils/utils';
import service from '../services/fileService'
import ValidationSteps from "../others/ValidationSteps";
import { io } from 'socket.io-client';
import { Alert, Button, IconButton, Skeleton, Snackbar } from '@mui/material'
import { SwipeLeftAlt, PublishedWithChanges, Save, Cancel, ArrowLeft, ArrowLeftSharp } from '@mui/icons-material'
import Header from "../others/Header";
import { useTranslation } from "react-i18next";
import fileService from "../services/fileService";
import useSocket from "../../hooks/useSocket";
import LoadingModal from "../others/LoadingModal";

const defaultSnackAlert = {
  open: false,
  type: 'success',
  message: ''
};

const defaultLoadingState = {
  open: false,
  message: ''
}

const Doc = () => {

  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  // if of the document
  const { id, validation } = useParams();
  const { socket } = useSocket();

  const [doc, setDoc] = useState(null);
  const [validationStage, setValidationStage] = useState(validation || 'v1');
  const [validationState, setValidationState] = useState('');
  const [invoiceData, setInvoiceData] = useState({});
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackAlert, setSnackAlert] = useState(defaultSnackAlert);
  const [loadingState, setLoadingState] = useState(defaultLoadingState);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };


  const v = ['v1', 'v2'].includes(validation);


  useEffect(() => {

    if (!v) return;

    // check validation
    service.getDocumentValidation(id, validation)
    .then(async res => {

      const docData = await res;

      if (!docData) return;

      if (docData.validation?.v1 && validation !== 'v2') {
        await service.unlockFile(id);
        return navigate('/prevalidation');
      }

      // if validation is v2, get data from v1
      let validationSelection = validation === 'v2' ? 'v1' : validation;
      const record = docData.versions.find(v => v.versionNumber === validationSelection);

      if (record) {
        setInvoiceData(record.dataJson)
      } else {
        const jsonData = JSON.parse(String.raw`${docData.dataXml}`);
        setInvoiceData(jsonData);
      }

      setDoc(docData);
      setLoading(false);

    });
  }, [id, validation, validationStage, v, navigate]);

  useEffect(() => {
    if (!socket) return;

    return () => {
      socket.emit('unlock-file', id);
    };
    // Déverrouiller l'élément lorsque l'utilisateur quitte la page
  }, [id, socket]);
  
  const handleBeforeUnload = useCallback(() => {
    fileService.unlockFile(id);
  }, [id]);

  useEffect(() => {

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleBeforeUnload]);

  // BUTTONS EVENTS
  const handleBackButton = () => {
    // unlock file
    handleBeforeUnload();
    // navigate to back url
    navigate(-1)
  }

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
  async function handleSave() {
    service.saveValidation(id, {
      json_data: invoiceData,
      versionNumber: validationStage
    }).then(async res => {

      const { ok } = await res;
      
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
  
    // show loading
    setLoadingState({
      open: true,
      message: t('validating-document')
    });

    // send to server
    service.validateDocument(id, {
      json_data: invoiceData,
      versionNumber: validationStage
    }).then(async res => {

      const { data, ok } = await res;

      if (ok) {
        if (validationStage === 'v2') {
          // download xml
          const response = await fileService.downloadXML(invoiceData);

          if (res.ok) {
            // Get the filename from the Content-Disposition header
            const contentDisposition = response.headers.get('Content-Disposition');
            const fileName = contentDisposition
                ? contentDisposition.split('filename=')[1]
                : 'data.xml';
  
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
        }

        // close loding
        setLoadingState(defaultLoadingState);

        setSnackAlert({
          open: true,
          type: 'success',
          message: 'Validation success!'
        });

        // go back
        navigate(-1);
      }

    }).catch(err => {

      console.log(err);

    });
  }

  // method to handle return document
  async function handleReturnDocument() {
    // show loading
    setLoadingState({
      open: true,
      message: t('returning-document')
    });

    fileService.returnDocument(id)
      .then(async res => {
        const { data, ok } = await res.json();

        // close loading
        setLoadingState(defaultLoadingState);

        if (ok) {
          // return to previous url
          navigate(-1);
        }

      })
  }

  // method to update the json by a key
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
                  <Button type="button" size="small" startIcon={<ArrowLeftSharp className="text-gray-800" />} onClick={handleBackButton}>
                    <span className="!text-gray-800">Retour</span>
                  </Button>
                </div>
                <div>
                  <Button type="button" size="small" startIcon={<Cancel className="text-yellow-600" />}>
                    <span className="!text-yellow-600">Cancel document</span>
                  </Button>
                </div>
                {
                  doc?.validation.v1 &&
                  <div>
                    <Button type="button" size="small" startIcon={<SwipeLeftAlt className="" />}
                      onClick={handleReturnDocument}
                    >
                      <span className="!text-gray-800">Return document</span>
                    </Button>
                  </div>
                }
                <div>
                  <Button type="button" size="small" startIcon={<Save className="text-sky-600" />}
                    onClick={handleSave}
                  >
                    <span className="!text-sky-600">Save change</span>
                  </Button>
                </div>
                <div>
                  <Button type="button" size="small" startIcon={<PublishedWithChanges className="text-emerald-600" />}
                    onClick={handleValidateDocument}
                  >
                    <span className="!text-emerald-600">Validate</span>
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
            <form onSubmit={(e) => e.preventDefault()}>
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
            <MyDocument fileUrl={doc ? `${SERVER_URL}/${doc.name}` : null} searchText={searchText} />
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
        <LoadingModal open={loadingState.open} message={loadingState.message} />
      </div>
      
      <div className="h-10 bg-gray-200 border-t border-t-300"></div>
    </main>
  )
};

export default Doc;