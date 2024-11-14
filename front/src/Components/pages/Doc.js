import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Input from "../others/Input";
// import PDFViewer from "../others/PDFViewer";
import { useNavigate, useParams } from "react-router-dom";
import { changeObjectValue, GenerateXMLFromResponse } from '../../utils/utils';
import service from '../services/fileService'
import ValidationSteps from "../others/ValidationSteps";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Skeleton, Snackbar, Typography } from '@mui/material'
import { SwipeLeftAlt, PublishedWithChanges, Save, Cancel, ArrowLeftSharp, RemoveCircle, PictureAsPdf } from '@mui/icons-material'
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Header from "../others/Header";
import { useTranslation } from "react-i18next";
import fileService from "../services/fileService";
import LoadingModal from "../others/LoadingModal";
import CommentBox from "../others/CommentBox";
import RejectModal from "../others/RejectModal";
import ComboBox from "../others/ComboBox";
import LineItemTable from "../others/LineItemTable";
const PDFViewer = React.lazy(() => import('../others/WorkerPDFViewer'));

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

  const [doc, setDoc] = useState(null);
  const [validationStage, setValidationStage] = useState(validation || 'v1');
  const [invoiceData, setInvoiceData] = useState({});
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [openPopup, setOpenPopup] = useState(false);
  const [snackAlert, setSnackAlert] = useState(defaultSnackAlert);
  const [dialogComment, setDialogComment] = useState(defaultSnackAlert);
  const [loadingState, setLoadingState] = useState(defaultLoadingState);
  const [rejectState, setRejectState] = useState(defaultLoadingState);
  const [pdfUrl, setPdfUrl] = useState('');
  // get active user infos from localstorage
  const _User = JSON.parse(localStorage.getItem('user'));

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  
  // Navigate to url according to the document status
  const redirect = useCallback(() => {
    if (doc.status === 'returned')
      return navigate('/returned')
    else if (validation === 'v1')
      return navigate('/prevalidation');
    else if (validation === 'v2')
      return navigate('/validation')
  }, [doc, validation, navigate]);

  // method that is used to take next document according to validation stage (v1, v2)
  const goToNextDocument = useCallback(async () => {
    // instead of going back, go to next document
    const nextDoc = await fileService.goToNextDocument(validation);
    if (nextDoc) { // nextdoc found
      // open the new document
      navigate(`/document/${validation}/${nextDoc._id}`);
    } else {
      // go to list according to the validation state
      redirect();
    }
  }, [navigate, redirect, validation]);

  useEffect(() => {

    if (!['v1', 'v2'].includes(validation)) navigate('/');


    // check validation
    service.getDocumentValidation(id, validation)
    .then(async res => {

      const docData = await res;

      if (!docData) {
        // IF DOCUMENT IS NOT FOUND GO BACK
        setSnackAlert({
          open: true,
          type: 'warning',
          message: t('document-not-found')
        });
        setTimeout(() => {
          navigate('/');
        }, 5000);
        return;
      };
      // handle if is locked
      if (docData.isLocked && docData.lockedBy?._id !== _User._id) {
        return navigate(-1)
      }
      
      if (["validated", "rejected"].includes(docData.status)) {
        await service.unlockFile(id);
        return redirect();
      }
      
      // lock document
      await fileService.lockFile(id);

      if (docData.validation?.v1 && validation !== 'v2') {
        await service.unlockFile(id);
        return navigate('/prevalidation');
      }

      /*
      // if validation is v2, get data from v1
      let validationSelection = validation === 'v2' ? 'v1' : validation;
      const record = docData.versions.find(v => v.versionNumber === validationSelection);

      if (record) {
        setInvoiceData(record.dataJson)
      } else {
        const jsonData = JSON.parse(String.raw`${docData.dataXml}`);
        setInvoiceData(jsonData);
      }

      */
      
      const jsonData = JSON.parse(String.raw`${docData.dataXml}`);
      setInvoiceData(jsonData);

      setDoc(docData);
      setLoading(false);
      setPdfUrl(docData.pdfLink);

      // open popup if document has been rejected temporarily
      if (docData.status === 'temporarily-rejected') {
        setOpenPopup(true);
      }

    });
    
    // unlock document
    return async () => {
      await fileService.unlockFile(id);
    }

  }, [id, validation, navigate, t]);
  
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
  const handleBackButton = async () => {
    // unlock file
    await fileService.unlockFile(id);
    // navigate to back url
    redirect();
  }

  // method to update the json by a key
  const handleUpdateJSON = useCallback((key, value) => {
    const updated = changeObjectValue(invoiceData, key, value);
    setInvoiceData(updated)
  }, [invoiceData]);

  // Utility function to render form fields for nested objects
  const renderFields = useCallback((parentKey = '', data) => {
      return Object.keys(data).map((key) => {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;

        if (typeof data[key] === 'object') {

          // render line item
          if (key === 'LineItem') {
            return (<LineItemTable
              data={data[key].length ? data[key] : [data[key]]}
              id={fullKey}
              onRowsUpdate={handleUpdateJSON}
            />)
          }

          return (
            <fieldset key={fullKey}>
              <legend>{key}</legend>
              {renderFields(fullKey, data[key])}
            </fieldset>
          );
        } else {
          if (/invoicetype/i.test(key))
            return (
              <ComboBox
                key={fullKey}
                label={key}
                value={data[key]}
                id={fullKey}
                onInput={handleUpdateJSON}
                onFocus={setSearchText}
                onBlur={setSearchText}
                options={[
                  { label: t('invoice-val'), value: 'Invoice' },
                  { label: t('credit-note-val'), value: 'Credit Note' },
                ]}
              />
            );

          if (/currency/i.test(key))
            return (
              <ComboBox
                key={fullKey}
                label={key}
                value={data[key]}
                id={fullKey}
                onInput={handleUpdateJSON}
                onFocus={setSearchText}
                onBlur={setSearchText}
                options={['GBP', 'EUR', 'USD']}
              />
            );

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
    }, [handleUpdateJSON, t]);

  const renderSections = 
    (formData) => {
      return Object.keys(formData).map((sectionKey) => (
        <fieldset key={sectionKey}>
          <legend>{sectionKey}</legend>
          {renderFields(sectionKey, formData[sectionKey])}
        </fieldset>
      ));
    }
    


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
          message: t('data-registered')
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

      const {  ok } = await res;

      if (ok) {
        if (validationStage === 'v2') {
          // download xml
          const response = await fileService.downloadXML(invoiceData);

          if (res.ok) {
            GenerateXMLFromResponse(response);
          }
        }


        setSnackAlert({
          open: true,
          type: 'success',
          message: 'Validation success!'
        });

        setLoadingState({
          open: true,
          message: t('selecting-next-document')
        });

        // instead of going back, go to next document
        await goToNextDocument();
        
        setLoadingState(defaultLoadingState);
      }

    }).catch(err => {

      console.log(err);

    } )
    .finally (()=>{ 
      // close loading
      setLoadingState(defaultLoadingState)
  });
  }

  // open dialog to write comment on return document
  function openDialogForReturningDocument() {
    setDialogComment({
      open: true,
      message: ''
    })
  }

  // method to handle return document
  async function handleReturnDocument(comment) {
    // close dialog
    setDialogComment(defaultSnackAlert);
    // show loading
    setLoadingState({
      open: true,
      message: t('returning-document')
    });

    fileService.returnDocument(id, { comment })
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

  // handleCancel document
  async function handleCancelDocument() {
    setLoadingState({
      open: true,
      message: t('cancelling-document')
    });
    
    // unlock file
    await fileService.unlockFile(id);
    
    setLoadingState(defaultLoadingState);
    // navigate to back url
    redirect();
  }

  function handleOpenRejectDocument() {
    // open dialog to set reason of rejecting
    setRejectState({
      open: true
    });
  }

  // method to reject document
  async function handleRejectDocument(reason) {
    // close modal
    setRejectState(defaultLoadingState);
    // set loading state
    setLoadingState({
      open: true,
      message: t('rejecting-document')
    });

    // do logic
    const res = await fileService.rejectDocument(id, { reason, validation });
    if (res.ok) {
      // instead of going back, go to next document
      await goToNextDocument();
      
    } else {
      setSnackAlert({
        open: true,
        type: 'error',
        message: t('error')
      })
      // reopen
      setRejectState({
        open: true
      });
    }
    setLoadingState(defaultLoadingState);
  }


  // method to close alert
  function closeSnackAlert() {
    setSnackAlert(defaultSnackAlert)
  }

  return (
    <main className="document__page">
      <Header changeLanguage={changeLanguage} />
      <div className="operations">
        <div className="validation__buttons">
          {
              <>
                <div>
                  <Button type="button" size="small" startIcon={<ArrowLeftSharp className="text-gray-800" />}
                    onClick={handleBackButton}
                  >
                    <span className="!text-gray-800">{t('go-back')}</span>
                  </Button>
                </div>
                <div hidden>
                  <Button type="button" size="small" startIcon={<Cancel className="text-yellow-600" />}
                    onClick={handleCancelDocument}
                    disabled={Object.entries(invoiceData).length === 0}
                  >
                    <span className="!text-yellow-600">{t('cancel-document')}</span>
                  </Button>
                </div>
                <div>
                  <Button type="button" size="small" startIcon={<RemoveCircle className="text-rose-600" />}
                    onClick={handleOpenRejectDocument}
                    disabled={Object.entries(invoiceData).length === 0}
                  >
                    <span className="!text-slate-600">{t('reject-document')}</span>
                  </Button>
                </div>
                {
                  doc?.validation.v1 &&
                  <div hidden>
                    <Button type="button" size="small" startIcon={<SwipeLeftAlt className="" />}
                      onClick={openDialogForReturningDocument}
                      disabled={Object.entries(invoiceData).length === 0}
                    >
                      <span className="!text-slate-800">{t('return-document')}</span>
                    </Button>
                  </div>
                }
                <div>
                  <Button type="button" size="small" startIcon={<Save className="text-sky-600" />}
                    onClick={handleSave}
                    disabled={Object.entries(invoiceData).length === 0}
                  >
                    <span className="!text-slate-600">{t('save-document')}</span>
                  </Button>
                </div>
                <div>
                  <Button type="button" size="small" startIcon={<PublishedWithChanges className="text-emerald-600" />}
                    onClick={handleValidateDocument}
                    disabled={Object.entries(invoiceData).length === 0}
                  >
                    <span className="!text-slate-600">{t('validate-document')}</span>
                  </Button>
                </div>
                
                <div hidden>
                  <Button type="button" size="small" startIcon={<PublishedWithChanges className="text-emerald-600" />}
                    onClick={() => {
                      if (id === '672dc298482dc4a73cf9c958')
                        navigate(`/document/v2/672dc297482dc4a73cf9c955`)
                      else 
                        navigate(`/document/v2/672dc298482dc4a73cf9c958`)
                    }}
                    disabled={Object.entries(invoiceData).length === 0}
                  >
                    <span className="!text-slate-600">SWITCH</span>
                  </Button>
                </div>
                {
                  doc && 
                  <div className="ml-auto flex items-center gap-2 text-sm">
                    <PictureAsPdf className="text-red-400" fontSize='medium' />
                    <span className="text-slate-700">{doc.pdfName}</span>
                  </div>
                }
              </>
          }
        </div>
      </div>

      <PanelGroup autoSaveId='doc_panel' direction="horizontal" className="doc__container splited">
        <Panel className="left_pane" defaultSize={480}>
          <div className="validation__form">
            <div className="validation__title">
              {/* <h3>Validation stage: {validationStage}</h3> */}
              <ValidationSteps stage={validationStage} status={doc?.status} onOpenInfos={setOpenPopup} />
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
        </Panel >
        <PanelResizeHandle />
        <Panel className="right_pane">
          <div className="document">
            <Suspense fallback={<>...</>}>
              <PDFViewer fileUrl={pdfUrl} searchText={searchText} />
            </Suspense>
          </div>
        </Panel>
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
        
        <CommentBox open={dialogComment.open} onClose={() => setDialogComment(defaultSnackAlert)} onSubmit={handleReturnDocument} />

        <LoadingModal open={loadingState.open} message={loadingState.message} />

        <RejectModal open={rejectState.open} onSubmit={handleRejectDocument} onClose={() => setRejectState(defaultLoadingState)} />

        {/* POPUP to show if the document status is temporarily-rejected */}

        <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
          <DialogTitle>
            <Alert severity="warning">{t('rejected-dialog-title')}</Alert>
          </DialogTitle>

          <DialogContent>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {t('rejected-dialog-content')}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              <span className="font-semibold">{t('reject-reason')}</span> : { doc?.temporarilyReason }
            </Typography>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenPopup(false)} color="error">
              {t('rejected-dialog-dismiss')}
            </Button>
          </DialogActions>
        </Dialog>

      </PanelGroup>
      
      <div className="h-10 bg-gray-200 border-t border-t-300"></div>
    </main>
  )
};

export default Doc;