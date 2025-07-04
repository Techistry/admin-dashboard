import React, { useEffect, useState } from "react";
import Toast from "../../utils/Toast";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { IoCloseOutline } from "react-icons/io5";

import edit from "../../icons/tool_actions/edit.png";
import api from "../../utils/axiosInstance";

interface ToastState {
  open: boolean;
  message: string;
  severity: "success" | "info" | "error" | "warning";
}

interface CategoryDetails {
  _id?: string;
  name: string;
  description: string;
}

interface CategoryData {
  categoryData: CategoryDetails;
  refreshCategory: () => void;
}

const Edit: React.FC<CategoryData> = ({ categoryData, refreshCategory }) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);

  const [originalData, setOriginalData] = useState<CategoryDetails>({
    name: "",
    description: "",
  });

  const [updatedData, setUpdatedData] = useState<CategoryDetails>({
    name: "",
    description: "",
  });

  const [focusedFields, setFocusedFields] = useState({
    name: false,
    description: false,
  });

  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    severity: "info",
  });

  const handleFocus = (field: string) => {
    setFocusedFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: string) => {
    setFocusedFields((prev) => ({ ...prev, [field]: false }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setUpdatedData({
      name: "",
      description: "",
    });
  };

  const showToast = (message: string, severity: ToastState["severity"]) => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
    setLoading(false);
  };

  const submit = async () => {
    setLoading(true);

    try {
      const response = await api.put(
        `/api/category/edit/${categoryData._id}`,
        updatedData
      );

      if (response.data.success) {
        showToast(response.data.message, "success");

        setTimeout(() => {
          handleClose();
          refreshCategory();
        }, 2000);
      }
    } catch (error: any) {
      if (error.response.data.error) {
        console.log(error);
        setLoading(false);
        showToast(error.response.data.error, "error");
        return;
      }
    }
  };

  useEffect(() => {
    setOriginalData(categoryData);
    setUpdatedData(categoryData);
  }, [categoryData]);

  const isDataChanged = () => {
    return (
      updatedData.name !== originalData.name ||
      updatedData.description !== originalData.description
    );
  };

  return (
    <div>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={handleCloseToast}
      />

      <Tooltip title="Edit">
        <div onClick={handleClickOpen} className="cursor-pointer ">
          <img src={edit} className="w-[17px] h-[17px] pt-[2.5px]" />
        </div>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          <div className="flex justify-between">
            <Typography
              fontWeight={500}
              sx={{ color: "#1D1F2C", fontFamily: "Open Sans, sans-serif" }}
              fontSize={24}
            >
              Edit Category
            </Typography>

            <Button sx={{ color: "black" }} onClick={handleClose}>
              <IoCloseOutline className="w-[1.5rem] h-[1.5rem] " />
            </Button>
          </div>

          <Typography
            fontWeight={400}
            sx={{ color: "#667085", fontFamily: "Open Sans, sans-serif" }}
            fontSize={16}
          >
            Make Changes by giving us basic details about the Category.
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ paddingY: "64px", paddingX: "25px" }}>
          <Box>
            <div className="flex flex-col gap-[15px]">
              <div>
                <Typography
                  fontWeight={500}
                  sx={{
                    color: focusedFields.name ? "#0167C4" : "#55555C",
                    fontFamily: "Open Sans, sans-serif",
                  }}
                  fontSize={14}
                >
                  Name of Category
                </Typography>
                <TextField
                  onFocus={() => handleFocus("name")}
                  onBlur={() => handleBlur("name")}
                  focused={focusedFields.name}
                  name="name"
                  value={updatedData.name}
                  onChange={handleChange}
                  type="text"
                  size="small"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </div>

              <div>
                <Typography
                  fontWeight={500}
                  sx={{
                    color: focusedFields.description ? "#0167C4" : "#55555C",
                    fontFamily: "Open Sans, sans-serif",
                  }}
                  fontSize={14}
                >
                  Decription
                </Typography>
                <TextField
                  onFocus={() => handleFocus("description")}
                  onBlur={() => handleBlur("description")}
                  focused={focusedFields.description}
                  name="description"
                  value={updatedData.description}
                  onChange={handleChange}
                  type="text"
                  size="small"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </div>

              <Button
                disabled={loading || !isDataChanged()}
                disableElevation
                variant="contained"
                sx={{
                  width: "165px",
                  padding: "10px",
                  borderRadius: "12px",
                  backgroundColor: "#0167C4",
                  textTransform: "capitalize",
                }}
                onClick={submit}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Edit;
