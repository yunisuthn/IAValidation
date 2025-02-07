import { useEffect, useMemo, useState } from "react";
import TemplateBuilder from "./template-builder";
import templateService from "../../../services/template-service";
import { Button, Checkbox, FormControlLabel, IconButton, Input, ListItemIcon, Menu, MenuItem, TextField } from "@mui/material";
import { GridCloseIcon, GridDeleteIcon, GridMoreVertIcon } from "@mui/x-data-grid";
import { Edit, Save } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export default function TemplateManager() {
  const [templates, setTemplates] = useState([]);
  const [input, setInput] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  const { t } = useTranslation();

  useEffect(() => {
    templateService.getAll().then(data => {
      setTemplates(data);
    });
  }, []);

  const addTemplate = async () => {
    if (input.trim() !== "") {
      const template = await templateService.create({
        name: input
      });
      setTemplates([...templates, template]);
      setSelectedTemplate(template);
      setInput("");
    }
  };

  const handleDelete = async (templateId) => {
    await templateService.delete(templateId)
    setTemplates(templates.filter((item) => item._id !== templateId));
    if (templateId === selectedTemplate?._id) {
      setSelectedTemplate(null);
    }

  };

  const handleSaveEdit = async (templateId, name) => {
    await templateService.update(templateId, { name: name });
    setTemplates(prev => prev.map(temp => temp._id === templateId ? ({ ...temp, name }) : temp));
  };

  async function handleSaveTemplateFields(templateId, fields) {
    const updated = await templateService.update(templateId, { data: fields });
    // update state
    setTemplates(prev => prev.map(temp => temp._id === templateId ? ({ ...temp, ...updated }) : temp));

  }

  return (
    <div className="h-full w-full flex items-">
      <div className="max-w-md px-3 bg-white flex-col flex h-full">
        <h2 className="text-base font-bold mb-4 text-slate-800" >{t('manage-templates')}</h2>
        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            size="small"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-1 border rounded text-sm outline-none"
            placeholder={t('enter-template-name')}
          />

          <Button
            onClick={addTemplate}
            variant="contained"
            color="primary"
          >
            {t('add')}
          </Button>
        </div>
        <div className="h-full border relative overflow-y-scroll">
          <div className="absolute inset-2">
            <ul className="space-y-2">
              {[...templates].map((template) => (
                <TemplateItem
                  key={template._id}
                  template={template}
                  onEdit={handleSaveEdit}
                  onDelete={() => handleDelete(template._id)}
                  onSelect={setSelectedTemplate}
                  isActive={selectedTemplate?._id === template._id}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
      <fieldset className="flex-grow flex flex-col" disabled={selectedTemplate === null}>
        {
          selectedTemplate === null ? (
            <></>
          ) : (
            <TemplateBuilder json={selectedTemplate} onSave={handleSaveTemplateFields} />
          )
        }
      </fieldset>
    </div>
  );
}


const TemplateItem = ({ template, onEdit, onDelete, onSelect, isActive }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(template.name);
  const [active, setActive] = useState(isActive);
  
  const { t } = useTranslation();

  const open = Boolean(anchorEl);

  useEffect(() => {
    setActive(isActive);
  }, [isActive])
  

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    handleMenuClose();
  };

  const handleSave = () => {
    onEdit(template._id, editValue);
    setIsEditing(false);
  };

  return (
    <li className={`flex justify-between items-center p-1 px-2 border rounded hover:bg-blue-100 ${active ? 'bg-blue-100 border-blue-200' : ' bg-white'}`}>
      {isEditing ? (
        <TextField
          value={editValue}
          autoFocus
          onChange={(e) => setEditValue(e.target.value)}
          size="small"
          variant="outlined"
          className="w-full mr-2 py-0"
        />
      ) : (
        <FormControlLabel control={
            <Checkbox checked={active} onChange={(e) => {
              let isChecked = e.target.checked;
              onSelect?.(isChecked ? template : null);
              setActive(isChecked)
            }}  />
          }
          label={template.name}
        />
      )}

      <div className="flex items-center">
        {isEditing ? (
          <>
            <IconButton onClick={handleSave} color="success">
              <Save />
            </IconButton>
            <IconButton onClick={() => setIsEditing(false)} color="default">
              <GridCloseIcon />
            </IconButton>
          </>
        ) : (
          <>
            {/* Three-dot menu button */}
            <IconButton onClick={handleMenuClick}>
              <GridMoreVertIcon />
            </IconButton>

            {/* Dropdown menu */}
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
              <MenuItem onClick={handleEditClick}>
                <ListItemIcon>
                  <Edit fontSize="small" />
                </ListItemIcon>
                {t('edit')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onDelete(template._id);
                  handleMenuClose();
                }}
                sx={{ color: "red" }}
              >
                <ListItemIcon>
                  <GridDeleteIcon fontSize="small" sx={{ color: "red" }} />
                </ListItemIcon>
                {t('delete')}
              </MenuItem>
            </Menu>
          </>
        )}
      </div>
    </li>
  );
};