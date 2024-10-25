'use client'
import React, { Suspense } from 'react';

const SuspenseWrapper = ({ children }) => {
    return <Suspense fallback={<div>Carregando...</div>}>{children}</Suspense>;
};

export default SuspenseWrapper;
