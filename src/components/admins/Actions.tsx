import React, { useState } from "react";

import { Divider, IconButton, Menu, MenuItem } from "@mui/material";
import { CiMenuKebab } from "react-icons/ci";

import Remove_Admin from "../../modals/admins/Remove_Admin";
import Suspend_Admin from "../../modals/admins/Suspend_Admin";
import Edit_Admin from "../../modals/admins/Edit_Admin";

interface AdminsState {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  suspended: string;
  _id: string;
}

interface ActionsProps {
  adminDetails: AdminsState;
  refreshAdmins: () => void;
}

const Actions: React.FC<ActionsProps> = ({ adminDetails, refreshAdmins }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <CiMenuKebab />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { borderRadius: 2, width: "170px" } }}
        sx={{ paddingX: ".5rem" }}
      >
        <div className="flex flex-col px-[12px] ">
          <MenuItem>
            <Edit_Admin
              adminData={adminDetails}
              refreshAdmins={refreshAdmins}
            />
          </MenuItem>

          <Divider />

          <MenuItem>
            <Suspend_Admin
              adminData={adminDetails}
              refreshAdmins={refreshAdmins}
            />
          </MenuItem>

          <Divider />

          <MenuItem>
            <Remove_Admin
              adminData={adminDetails}
              refreshAdmins={refreshAdmins}
            />
          </MenuItem>
        </div>
      </Menu>
    </>
  );
};

export default Actions;
