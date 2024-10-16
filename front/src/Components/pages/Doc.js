import { useEffect, useState } from "react";
import Input from "../others/Input";
import MyDocument from "../others/MyDocument"; 
import { useParams } from "react-router-dom";
import axios from 'axios';
import { SERVER_URL } from '../../utils/utils';

const Doc = () => {

    const initialData = { };

    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // if of the document
    const { id } = useParams();


    useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await axios.get(`${SERVER_URL}/document/${id}`);
              const { data } = response;
              console.log(data)
              setDocument(data);
              setLoading(false); // Set loading to false once data is fetched
          } catch (err) {
              setError(err.message); // Handle error
              setLoading(false);
          }
      };
      fetchData();
    }, [id]);

    // Utility function to render form fields for nested objects
    const renderFields = (section, data) => {
      return Object.keys(data).map((key) => {
        if (typeof data[key] === 'object') {
          // If the value is an object, render another fieldset for nested objects
          return (
            <fieldset key={key}>
              <legend>{key}</legend>
              {renderFields(key, data[key])}
            </fieldset>
          );
        } else {
          // Otherwise, render a regular input field
          return (
            <Input
              key={key}
              label={key}
              value={data[key]}
              id={key}
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
    

    return (
      <main className="document__page">
        <div className="nav">
          <h2 class="our__logo">SmartVerifica</h2>
        </div>
        <div className="doc__container splited">
          <div className="left_pane">
            <div className=""></div>
            <div className="validation__form">
              <div className="validation__title">
                <h3>Validation form</h3>
              </div>
              {/* Form */}
              <form action="#">
                <div className="inputs scrollable_content custom__scroll">
                  <div className="content">
                    {document && renderSections(document.xmlJSON)}
                    {/* Add some padding at bottom */}
                    <div className="h-10"></div> 
                  </div>
                </div>
                <div className="validation__buttons">
                  <button type="button" class="custom__primary_btn">Validate</button>
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