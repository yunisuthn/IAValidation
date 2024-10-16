import { useEffect } from "react";
import Input from "../others/Input";
import MyDocument from "../others/MyDocument"; 

const Doc = () => {

    const initialData = {
      Invoice: {
        Supplier: "Profyto BV",
        IRNnumber: "NL72ABNA0453533337",
        VATnumber: "NL861952820B01",
        Client: "CV Homan-Monsma",
        InvoiceDetails: {
          InvoiceNumber: "978553",
          InvoiceDate: "2022-08-16",
        },
        AmountDetails: {
          NetAmount: "1.231,21",
          VatAmount: "258,55",
          DueDate: "Betaling binnen 30 dagen netto",
          TotalAmount: "1.489,76",
        }
      }
    };

    useEffect(() => {
      
    
      return () => {
        
      }
    }, []);

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
                    {renderSections(initialData)}
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
              <MyDocument />
            </div>
          </div>
        </div>
      </main>
    )
  };
  
  export default Doc;