import React, { useState } from 'react';

const NewRevisionDialog = ({ 
    onclose, 
    onSubmit 
}: {
    onSubmit: (name: string) => void;
    onClose: () => void;
}