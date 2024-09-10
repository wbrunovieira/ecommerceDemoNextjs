'use client';

import React, { useState } from 'react';

const ExpandableText = ({ description }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const limit = 100;

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const formatTextWithBreaks = (text) => {
        const sentences = text.split(/(?<=[.!?;])\s+/);

        return sentences.map((sentence, index) => (
            <span key={index}>
                {sentence}
                <br />
                <br />
            </span>
        ));
    };

    return (
        <div className="text-container">
            <p className="border-r-4 border-secondary shadow-2xl p-1 md:p-4 rounded-md dark:bg-secondary dark:border-primaryLight text-xs ">
                {isExpanded ? (
                    formatTextWithBreaks(description)
                ) : (
                    <>
                        {formatTextWithBreaks(description.substring(0, limit))}
                        {description.length > limit && '. . .'}
                    </>
                )}
            </p>
            {description.length > limit && (
                <button
                    className="text-primary font-bold mb-2 -mt-8"
                    onClick={toggleExpand}
                >
                    {isExpanded ? 'Mostrar menos ▲' : 'Mostrar mais ▼'}
                </button>
            )}
        </div>
    );
};

export default ExpandableText;
