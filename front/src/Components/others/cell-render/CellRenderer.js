// CellRenderer.js
import { Comment, PictureAsPdf } from '@mui/icons-material';
import React from 'react';
import { UserCell } from '../user/UserProfile';

const CellRenderer = {
    RenderPDFName: ({ pdfName }) => {
        return (
            <div className="flex items-center gap-2 w-full h-full" title={pdfName}>
                <PictureAsPdf className="text-red-400" fontSize='medium' />
                {pdfName}
            </div>
        );
    },
    
    RenderComment: ({ comment }) => {
        return (
            <div className="flex items-center gap-2 w-full h-full" title={comment}>
                <Comment className="text-orange-300" fontSize='medium' />
                {comment}
            </div>
        );
    },

    RenderUser: ({ user }) => {
        return (
            <UserCell 
                name={user.name} 
                email={user.email}
                avatarUrl="https://via.placeholder.com/150" 
            />
        );
    },
};

export default CellRenderer;
