"use client"

import React, { useState } from 'react';

const ExpandableText = ({ description }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const limit = 100; 

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div>
            <p className="border-r-4 border-secondary shadow-2xl p-1 md:p-4 rounded-md dark:bg-secondary dark:border-primaryLight text-base ">
                {isExpanded ? description : `${description.substring(0, limit)}...`}
            </p>
            {description.length > limit && (
                <button
                    className="text-primary mt-2"
                    onClick={toggleExpand}
                >
                    {isExpanded ? 'Mostrar menos' : 'Mostrar mais'}
                </button>
            )}
        </div>
    );
};

export default ExpandableText;
