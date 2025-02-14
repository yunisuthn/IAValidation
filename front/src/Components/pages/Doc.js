import React, { memo, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Input from "../others/Input";
// import PDFViewer from "../others/PDFViewer";
import { useNavigate, useParams } from "react-router-dom";
import { addPrefixToKeys, changeObjectValue, CURRENCY_LIST, deepCloneArray, deepReset, formParserOrder, GenerateXMLFromResponse, getFormData, getVerticesOnJSOn, invoiceOrder, reorderKeys } from '../../utils/utils';
import service from '../services/fileService'
import ValidationSteps from "../others/ValidationSteps";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Typography } from '@mui/material'
import { SwipeLeftAlt, PublishedWithChanges, Save, Cancel, ArrowLeftSharp, RemoveCircle, PictureAsPdf, SettingsApplications, RestartAlt } from '@mui/icons-material'
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import NewWindow from 'react-new-window'
import Header from "../others/Header";
import { useTranslation } from "react-i18next";
import fileService from "../services/fileService";
import LoadingModal from "../others/LoadingModal";
import CommentBox from "../others/CommentBox";
import RejectModal from "../others/RejectModal";
import ComboBox from "../others/ComboBox";
import LineItemTable from "../others/LineItemTable";
import DateInput from "../others/DateInput";
import InputLookup from "../others/lookup/InputLookup";
import { useDispatch } from "react-redux";
import { setCurrency } from "../redux/currencyReducer";
import { convertImageToText } from "../services/capture-service";
import { BankStatementTableItem } from "../others/BankStatementTableItem";
import { getCustomerById } from "../services/customer-service";
import OCRForm from "../ocr-template/ocr-template";
import SkeletonLoading from "../ui/skeleton-loading";
import { clearCapturedSketches, setCapturedSketches } from "../redux/sketchReducer";
import ChooseTemplate from "../others/ChooseTemplateModal";
import { confirmDialog } from "../redux/ui/confirm-dialog";
import useVertices from "../../hooks/useVertices";
const PDFViewer = React.lazy(() => import('../others/pdf-viewer/PDFViewerWithSnap'));

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
  const [documentData, setDocumentData] = useState({});
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const defaultMapping = { field: '', activate: false, loading: false };
  const [mapping, setMapping] = useState(defaultMapping);
  const [openPopup, setOpenPopup] = useState(false);
  const [snackAlert, setSnackAlert] = useState(defaultSnackAlert);
  const [dialogComment, setDialogComment] = useState(defaultSnackAlert);
  const [loadingState, setLoadingState] = useState(defaultLoadingState);
  const [rejectState, setRejectState] = useState(defaultLoadingState);
  const [pdfUrl, setPdfUrl] = useState('');
  const [vertices, setVertices] = useState([]);
  const [verticesToDraw, setVerticesToDraw] = useState([]);
  // selected value from lookup
  const [selectedSupplier, setSelectedSupplier] = useState({});
  // Error on field
  const [lineItemErrors, setLineItemErrors] = useState([]);
  // customer
  const [customer, setCustomer] = useState(null);
  // template for ocr
  const [statusOCRTemplate, setStatusOCRTemplate] = useState({
    open: false,
    value: '',
    loading: false
  }); // contract | ar (accident report)
  
  const [viewerDetached, setViewerDetached] = useState(false);
  
  const formRef = useRef(null);

  // redux
  const dispatch = useDispatch();

  // get active user infos from localstorage
  const _User = JSON.parse(localStorage.getItem('user'));

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };


  const _vertices = useVertices(doc?.verticesLink, doc?.type);
  // update vertices 
  useEffect(() => {
      if (!doc) return;
      // fetch vertices json
      if (doc.vertices !== '{}') {
        setVertices(JSON.parse(doc.vertices))
      } else {
        
        setVertices(_vertices);
      }

  }, [_vertices, doc])

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
        setTimeout(async () => {
          await goToNextDocument();
        }, 5000);
        return;
      };

      // handle if is locked
      setTimeout(async () => {
        if (docData.isLocked && docData.lockedBy?._id !== _User._id) {
          // instead of going back, go to next document
          await goToNextDocument();
        }
      }, 5000);
      
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

      const jsonData = JSON.parse(String.raw`${docData.dataXml}`);
      const reorderBy = docData.type === 'FormParser' ? formParserOrder : invoiceOrder;
      const reorderedJSON = reorderKeys(jsonData[docData.type || "Invoice"], reorderBy);
      if (docData.type === 'OCR') {
        if ("OCRData" in jsonData) {
          setDocumentData(jsonData);
        } else {
          const arrs = Object.entries(reorderedJSON).map(([k, v]) => v).flat().map((i, index) => ({
            id: index,
            value: i
          }));
          setDocumentData({...jsonData, [docData.type|| "Invoice"]: arrs, ...(!jsonData.OCRData) && {OCRData: [] }});
        }
      } else {
        setDocumentData({...jsonData, [docData.type|| "Invoice"]: reorderedJSON});

      }
      setDoc(docData);
      setLoading(false);
      setPdfUrl(docData.pdfLink);

      // open modal for choosing template if not worked document yet
      if (docData.type === "OCR") {
        if (docData.versions.length === 0 && docData.templateName === '') {
          setStatusOCRTemplate(prev => ({...prev, open: true }))
        } else {
          setStatusOCRTemplate(prev => ({ ...prev, open: false, value: docData.templateName }));
        }
  
      }
      // open popup if document has been rejected temporarily
      if (docData.status === 'temporarily-rejected') {
        setOpenPopup(true);
      }
      
      // get customer
      getCustomerById().then(data => {
        setCustomer(data);
      })

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

  // when lookup selected
  // key is (Supplier, etc)
  function handleLookupSelect(lookupValue, prefix="Supplier") {
    const object = addPrefixToKeys(lookupValue, prefix);
    setSelectedSupplier(object)
    let newDocumentData = JSON.parse(JSON.stringify(documentData));
    for (let i = 0; i < Object.keys(object).length; i++) {
      const key = Object.keys(object)[i];
      // Check and update key and value
      if (key in newDocumentData[doc.type || "Invoice"]) {
        newDocumentData[doc.type || "Invoice"][key] = object[key];
      }
    }
    setDocumentData(newDocumentData);
  }

  // focus on line item cell
  const handleFocusOnLineItem = (key, id) => {
    const vertices = getVerticesOnItemsArray(id, "LineItemsDetails");
    setVerticesToDraw(vertices)
  }

  const getVerticesOnItemsArray = (id, key) => {
    if (!id) return;
    const details = vertices.find(v => v.key === key);
    if (details) {
      const { data } = details;
      const rows = data.map(d => d.properties).flat();
      const cell = rows.filter(r => Array.isArray(id) ? id.includes(r.id) : id === r.id);
      // set vertices to draw
      return cell;
    }
    return [];
  }

  function handleOnErrorLineItems(key, isError) {
    // update if exists
    if (lineItemErrors.find(l => l.key === key)) {
      setLineItemErrors(prev => prev.map(i => i.key === key ? ({key, isError}) : prev))
    } else {
      // remove it
      setLineItemErrors(prev => [...prev, { key, isError }])
    }
  }

  // handle focus on input field
  const handleFocusOnInputField = useCallback((key, fullKey) => {
    console.log('REGISTERED!: ', vertices)
    // console.log('AA!: ', _vertices)
    // condition for vat
    if (key.startsWith("Vat")) {
      // Invoice.Vat.1.VatTaxAmount
      const [, keyId] = fullKey.split('Vat.') // to get 1.VatTaxAmount
      // find vertices
      const inputVertices = vertices.filter(v => v.key === keyId.replace('.', '')); // to get 1VatTaxAmount
      setVerticesToDraw(inputVertices)

    } else {
      const inputVertices = vertices.filter(v => v.key.toLowerCase() === key.toLowerCase());
      setVerticesToDraw(inputVertices)
      console.log(inputVertices, key)
    }

  }, [vertices]);

  // method to update currency
  const handleUpdateCurrency = (key, value) => {
    // change redux currency store
    dispatch(setCurrency(value));
    handleUpdateJSON(key, value);
  }

  // method to update the json by a key
  const handleUpdateJSON = (key, value) => {
    console.log('updating json...')
    setDocumentData(prev => changeObjectValue(prev, key, value))
  };

  const renderLineItemTable = (key, fullKey, data) => (
    <LineItemTable
      key={fullKey}
      data={Array.isArray(data[key]) ? data[key] : [data[key]]}
      id={fullKey}
      onRowsUpdate={handleUpdateJSON}
      onFocus={(id) => handleFocusOnLineItem(key, id)}
      totalAmount={documentData?.[doc.type || "Invoice"]?.['TotalAmount'] || 0}
      netAmount={documentData?.[doc.type || "Invoice"]?.['NetAmount'] || 0}
      onError={handleOnErrorLineItems}
      type={doc?.type || "Invoice"}
    />
  );
  
  const renderBankStatementTable = (key, fullKey, data) => (
    <BankStatementTableItem key={fullKey} data={Array.isArray(data[key]) ? data[key] : [data[key]]} id={fullKey} />
  );
  
  const renderInputLookup = (key, fullKey, data) => (
    <InputLookup
      key={fullKey}
      label={key}
      value={data[key]}
      id={fullKey}
      onInput={handleUpdateJSON}
      onFocus={() => handleFocusOnInputField(key)}
      onBlur={() => setVerticesToDraw([])}
      onSelect={handleLookupSelect}
    />
  );
  
  const renderComboBox = (key, fullKey, data, options) => (
    <ComboBox
      key={fullKey}
      label={key}
      value={data[key]}
      id={fullKey}
      onInput={handleUpdateJSON}
      onFocus={() => handleFocusOnInputField(key)}
      onBlur={() => setVerticesToDraw([])}
      options={options}
    />
  );
  
  const renderDateInput = (key, fullKey, data) => (
    <DateInput
      key={fullKey}
      label={key}
      value={data[key]}
      id={fullKey}
      onInput={handleUpdateJSON}
      onFocus={() => handleFocusOnInputField(key)}
      onBlur={() => setVerticesToDraw([])}
    />
  );
  
  const renderGenericInput = (key, fullKey, data) => (
    <Input
      key={fullKey}
      label={key}
      value={data[key]}
      id={fullKey}
      showWarning={selectedSupplier[key] && data[key] !== selectedSupplier[key]}
      isInvalid={lineItemErrors.find((l) => l.key === key)?.isError}
      onInput={handleUpdateJSON}
      suggestions={selectedSupplier[key] ? [selectedSupplier[key]] : []}
      onFocus={() => handleFocusOnInputField(key, fullKey)}
      onBlur={() => setVerticesToDraw([])}
      type={key.endsWith('Amount') ? 'numeric' : 'text'}
      className={key.endsWith('Amount') ? '!col-span-1/2 !w-fit' : ''}
      onMapping={() => setMapping({ field: fullKey, activate: true })}
      isMapping={mapping.field.endsWith(key) && mapping.activate}
    />
  );
  

  // Utility function to render form fields for nested objects
  const renderFields = useCallback((parentKey = '', data) => {
    return Object.keys(data).map((key) => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
  
      if (typeof data[key] === 'object') {
        if (key === 'LineItem') return renderLineItemTable(key, fullKey, data);
        if (key === 'TableItem') return renderBankStatementTable(key, fullKey, data);
  
        return (
          <fieldset key={fullKey}>
            <legend>{key}</legend>
            {renderFields(fullKey, data[key])}
          </fieldset>
        );
      }
  
      if (key === 'SupplierName') return renderInputLookup(key, fullKey, data);
      if (/invoicetype/i.test(key)) return renderComboBox(key, fullKey, data, [{ label: t('invoice-val'), value: 'Invoice' }, { label: t('credit-note-val'), value: 'Credit Note' }]);
      if (/currency/i.test(key)) return renderComboBox(key, fullKey, data, CURRENCY_LIST);
      if (key.includes('Date')) return renderDateInput(key, fullKey, data);
      if (key.startsWith('Vat') && key.endsWith('Id')) return null;
  
      return renderGenericInput(key, fullKey, data);
    });
  }, [t, documentData, lineItemErrors, doc, mapping]);



  const renderSections = 
    useCallback((formData) => {
      return Object.keys(formData).map((sectionKey, index) => {
        return (
          <fieldset key={sectionKey}>
            <legend>{sectionKey}</legend>
            <>
              {renderFields(sectionKey, formData[sectionKey])}
            </>
          </fieldset>
      )});
  }, [renderFields])
    


  // Submit form (do validation)
  async function handleSave() {
    service.saveValidation(id, {
      json_data: documentData,
      versionNumber: validationStage,
      vertices: vertices,
      templateName: statusOCRTemplate.value,
      template: statusOCRTemplate.value
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
      json_data: documentData,
      versionNumber: validationStage,
      templateName: statusOCRTemplate.value,
      template: statusOCRTemplate.value
    }).then(async res => {

      const {  ok } = await res;

      if (ok) {
        if (validationStage === 'v2') {
          // download xml
          const response = await fileService.downloadXML(documentData, doc?.type || "Invoice");

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

  // handle reset form
  async function handleResetForm() {
    if (await confirmDialog(t('reset'))) {
      // const clonedOCRData = deepCloneArray(documentData.OCRData)
      // const resetted = deepReset(clonedOCRData);
      setDocumentData(prev => ({...prev, OCRData: [] }))
      dispatch(clearCapturedSketches());
    }
  }

  // method to close alert
  function closeSnackAlert() {
    setSnackAlert(defaultSnackAlert)
  }

  // handle capture
  async function handleCapture(data) {
    const { image, vertices: rectVertices } = data;

    // no text extraction (for sketch)
    if (mapping.noExtract) {

      // set redux state
      dispatch(setCapturedSketches({ key: mapping.field, url: image }))

    }  else {

      // extract text in the image
      const { text } = await convertImageToText(image);
  
      let fieldKey = mapping.field;
      
      // vertices to draw
      let toDraw = vertices.find(v => fieldKey.endsWith(v.key));
  
      // update vertice of the field
      setVertices(prev => prev.map(v => fieldKey.endsWith(v.key) ? ({...v, vertices: rectVertices}) : v ));
  
      // insert extracted text into the input field and anlso update JSONData
      handleUpdateJSON(fieldKey, text.replace(/\n/g, ' ').trim());
  
      if (toDraw) 
        setVerticesToDraw([{ ...toDraw, vertices: rectVertices }]);
      
    }

    setMapping(defaultMapping);

  }

  const handleShowOCRVertices = useCallback((item) => {
    setVerticesToDraw((prev) => {
      const verts = vertices.filter(i => i.key === item.id);
  
      // Prevent state update if the new value is the same as the previous state
      return verts || [];
    });
  }, [vertices]);

  function handleDocOCRUpdate(data) {
    // handleUpdateJSON("OCRData", data);
    const {OCRData, OCR} = data;
    if (OCR && OCRData) {
      setDocumentData(prev => ({...prev, OCRData, OCR}));
    } else {
      setDocumentData(prev => ({...prev, OCRData: data}));
    }
  } 


  const memoizedDocumentData = useMemo(() => documentData, [documentData]);
  

  function templatesRenderer({type = '', ocrParams=statusOCRTemplate}) {

    if (!doc) return null;

    const templates = {
      ocr: 
        <OCRForm
          loading={loading}
          data={memoizedDocumentData}
          onClick={handleShowOCRVertices}
          onUpdate={handleDocOCRUpdate}
          onStartCapture={(field) => setMapping({ field: field, activate: true, noExtract: true })}
          templateId={ocrParams.value}
        />,
      default:  <>
            {loading ? (
              <SkeletonLoading />
            ) : Object.entries(documentData).length > 0 ? (
              renderSections(documentData)
            ) : (
              <span className="mx-auto text-center text-gray-400">
                No data to display.
              </span>
            )}
          </>,
    }

    const T = templates[type?.toLowerCase()] || templates["default"];

    return T;
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
                    disabled={Object.entries(documentData).length === 0}
                  >
                    <span className="!text-yellow-600">{t('cancel-document')}</span>
                  </Button>
                </div>
                <div>
                  <Button type="button" size="small" startIcon={<RemoveCircle className="text-rose-600" />}
                    onClick={handleOpenRejectDocument}
                    disabled={Object.entries(documentData).length === 0}
                  >
                    <span className="!text-slate-600">{t('reject-document')}</span>
                  </Button>
                </div>
                {
                  doc?.validation.v1 &&
                  <div hidden>
                    <Button type="button" size="small" startIcon={<SwipeLeftAlt className="" />}
                      onClick={openDialogForReturningDocument}
                      disabled={Object.entries(documentData).length === 0}
                    >
                      <span className="!text-slate-800">{t('return-document')}</span>
                    </Button>
                  </div>
                }
                <div>
                  <Button type="button" size="small" startIcon={<Save className="text-sky-600" />}
                    onClick={handleSave}
                    disabled={Object.entries(documentData).length === 0}
                  >
                    <span className="!text-slate-600">{t('save-document')}</span>
                  </Button>
                </div>
                <div>
                  <Button type="button" size="small" startIcon={<PublishedWithChanges className="text-emerald-600" />}
                    onClick={handleValidateDocument}
                    disabled={Object.entries(documentData).length === 0}
                  >
                    <span className="!text-slate-600">{t('validate-document')}</span>
                  </Button>
                </div>
                <div hidden>
                  <Button type="button" size="small" startIcon={<PublishedWithChanges className="text-emerald-600" />}
                    onClick={() => console.log(getFormData(formRef))}
                    disabled={Object.entries(documentData).length === 0}
                  >
                    <span className="!text-slate-600">{t('Get Values')}</span>
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
                    disabled={Object.entries(documentData).length === 0}
                  >
                    <span className="!text-slate-600">SWITCH</span>
                  </Button>
                </div>
                {
                  doc && 
                  <div className="flex items-center gap-2 ml-auto text-sm">
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
            <div className="validation__title bg-white px-0">
              <ValidationSteps stage={validationStage} status={doc?.status} onOpenInfos={setOpenPopup} />
              <div className="flex flex-1 items-center gap-4 justify-end w-full">
                  <Button type="button" size="small" color="error" startIcon={<RestartAlt className="text-rose-800"  />}
                    onClick={handleResetForm}
                    disabled={Object.entries(documentData).length === 0}
                  >
                    <span>{t('reset')}</span>
                  </Button>
                {
                  (doc && doc.type === 'OCR') &&
                  <Button type="button" size="small" startIcon={<SettingsApplications className="text-slate-800" />}
                    onClick={() => setStatusOCRTemplate(prev => ({...prev, open: true }))}
                    disabled={Object.entries(documentData).length === 0}
                  >
                    <span className="!text-slate-600">{t('change-template')}</span>
                  </Button>
                }
              </div>
            </div>
            {/* Form */}
            <form ref={formRef} onSubmit={(e) => { e.preventDefault();  }}>
              <div className="inputs scrollable_content custom__scroll">
                <div className="content">
                    {
                      doc && templatesRenderer({ type: doc.type, ocrParams: statusOCRTemplate })
                    }
                    {/* Add some padding at bottom */}
                    {/* <div className="h-10 block"></div> */}
                </div>
              </div>
            </form>
            {/* End form */}
          </div>
        </Panel >

        {
          !viewerDetached && 
          (
            <>
              <PanelResizeHandle className='hover:bg-blue-200 border border-gray-200 hover:w-1' />
              <Panel className="right_pane" defaultSize={700}>
                <div className="document">
                  <Suspense fallback={<>...</>}>
                    <PDFViewer
                      fileUrl={pdfUrl}
                      searchText={searchText}
                      verticesGroups={verticesToDraw}
                      verticesArray={vertices}
                      drawingEnabled={mapping.activate}
                      onCancelDrawing={() => setMapping(defaultMapping)}
                      onCapture={handleCapture}
                      onDetach={() => setViewerDetached(true)}
                    />
                  </Suspense>
                </div>
              </Panel>
            </>
            )
        }
        {
          viewerDetached && (
          <NewWindow copyStyles center="screen"
            title={"PDF Viewer: " + doc?.pdfName}
            onUnload={() => setViewerDetached(false)}
            onBlock={() => {
              alert('Could not open new window. Please give access to your browser.');
              setViewerDetached(false);
            }}
            features={{
              height: 720,
              width: 1280
            }}
          >
            <Suspense fallback={<>...</>}>
              <PDFViewer
                fileUrl={pdfUrl}
                searchText={searchText}
                verticesGroups={verticesToDraw}
                verticesArray={vertices}
                drawingEnabled={mapping.activate}
                onCancelDrawing={() => setMapping(defaultMapping)}
                onCapture={handleCapture}
              />
            </Suspense>
          </NewWindow> )
        }

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

        <ChooseTemplate
          open={statusOCRTemplate.open}
          defaultValue={statusOCRTemplate.value}
          onClose={() => setStatusOCRTemplate(prev => ({...prev, open: false }))}
          onSubmit={(template) => setStatusOCRTemplate(prev => ({...prev, value: template, open: false }))}
        />

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
      
      <div className="h-10 bg-slate-200 border-t border-t-slate-300"></div>
    </main>
  )
};

export default Doc;