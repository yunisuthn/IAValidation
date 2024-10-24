import React, { useState } from 'react';
import { Box, Avatar, Typography, Paper, Dialog, DialogContent, Popover, Link } from '@mui/material';
import { styled } from '@mui/system';
import { AccountCircle, } from '@mui/icons-material';

const ProfileBox = styled(Paper)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    width: '200px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: theme.palette.action.hover, // Slight color change on hover
    },
}));

const UserProfileDialog = ({ name, email, avatarUrl, open, handleClose }) => {
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth sx={{ position: 'fixed' }}>
            <DialogContent>
                <Box display="flex" alignItems="center">
                    <Avatar src={avatarUrl} alt={name} sx={{ width: 100, height: 100 }} />
                    <Box ml={2}>
                        <Typography variant="h5">{name}</Typography>
                        <Typography variant="body1">{email}</Typography>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

const UserProfilePopover = ({ name, email, avatarUrl, mousePosition, open, handleClose }) => {
    const id = open ? 'user-profile-popover' : undefined;

    return (
        <Popover
            id={id}
            open={open}
            // anchorEl={anchorEl}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={
                mousePosition ? { top: mousePosition.mouseY, left: mousePosition.mouseX } : undefined
            }
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <Box display="flex" alignItems="center" p={2}>
                <Avatar src={avatarUrl} alt={name} sx={{ width: 70, height: 70 }} />
                <Box ml={2}>
                    <Typography variant="h6">{name}</Typography>
                    <Link variant="body2" href={`mailto:${email}`}>{email}</Link>
                </Box>
            </Box>
        </Popover>
    );
};


export const UserProfile = ({ name, email, avatarUrl }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            {/* Small profile box that triggers the dialog */}
            <ProfileBox elevation={3} onClick={handleOpen}>
                {/* <Avatar src={avatarUrl} alt={name} sx={{ width: 56, height: 56 }} /> */}
                <Box ml={2}>
                    <Typography variant="h6">{name}</Typography>
                </Box>
            </ProfileBox>

            {/* Dialog with expanded user profile */}
            <UserProfileDialog
                name={name}
                email={email}
                avatarUrl={avatarUrl}
                open={open}
                handleClose={handleClose}
            />
        </>
    );
};

export const UserCell = ({ name, email, avatarUrl }) => {

    const [mousePosition, setMousePosition] = useState(null);
    const [open, setOpen] = useState(false);

    const handleMouseEnter = (event) => {
        setMousePosition({
            mouseX: event.clientX,
            mouseY: event.clientY,
        });

        setOpen(true);
    };

    const handleMouseLeave = () => {
        setOpen(false);
    };

    return (
        <>
            {/* Username cell that triggers the dialog on hover */}
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                sx={{ cursor: 'pointer' }}
                className='underline flex items-center gap-2'
            >
                <AccountCircle />
                {name}

                {/* Dialog with user profile details */}
                <UserProfilePopover
                    name={name}
                    email={email}
                    avatarUrl={avatarUrl}
                    open={open}
                    handleClose={handleMouseLeave}
                    mousePosition={mousePosition}
                />
            </div>
        </>
    );
};

export default UserProfileDialog;
