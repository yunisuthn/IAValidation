import { useEffect, useMemo, useState } from "react";
import TemplateBuilder from "./template-builder";
import templateService from "../../../services/template-service";
import { Button, IconButton, Input, ListItemIcon, Menu, MenuItem, TextField } from "@mui/material";
import { GridCloseIcon, GridDeleteIcon, GridMoreVertIcon } from "@mui/x-data-grid";
import { Edit, Save } from "@mui/icons-material";

export default function TemplateManager() {
  const [templates, setTemplates] = useState([]);
  const [input, setInput] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

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
      setInput("");
    }
  };

  const handleDelete = async (templateId) => {
    await templateService.delete(templateId)
    setTemplates(templates.filter((item) => item._id !== templateId));

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
      <div className="max-w-md px-3 bg-white shadow-md rounded-lg">
        <h2 className="text-base font-bold mb-4 text-slate-800" >Manage Templates</h2>
        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            size="small"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-1 border rounded text-sm outline-none"
            placeholder="Enter template name"
          />

          <Button
            onClick={addTemplate}
            variant="contained"
            color="primary"
          >
            Add
          </Button>
        </div>
        <ul className="space-y-2">
          {templates.map((template) => (
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
      <div className="flex-grow flex flex-col">
        <TemplateBuilder json={selectedTemplate} onSave={handleSaveTemplateFields} />
      </div>
    </div>
  );
}


const TemplateItem = ({ template, onEdit, onDelete, onSelect, isActive }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(template.name);

  const open = Boolean(anchorEl);

  console.log(isActive)

  const active = useMemo(() => isActive, [isActive]);

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
        <span className="cursor-pointer" onClick={() => onSelect?.(template)}>{template.name}</span>
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
                Edit
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
                Delete
              </MenuItem>
            </Menu>
          </>
        )}
      </div>
    </li>
  );
};