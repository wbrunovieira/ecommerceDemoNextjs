import React from 'react';

const Loader = () => {
    return (
        <div className="flex items-center justify-center w-[200px] h-[60px] relative">
            <div
                className="circle bg-primary rounded-full absolute w-[20px] h-[20px] left-[15%] animate-circle"
                style={{ animationDelay: '0.2s' }}
            />
            <div
                className="circle bg-primary rounded-full absolute w-[20px] h-[20px] left-[45%] animate-circle animation-delay-200"
                style={{ animationDelay: '0.3s' }}
            />
            <div
                className="circle bg-primary rounded-full absolute w-[20px] h-[20px] right-[15%] animate-circle animation-delay-300"
                style={{ animationDelay: '0.2s' }}
            />
            <div
                className="shadow bg-primary2 opacity-40 rounded-full absolute w-[20px] h-[2px] top-[62px] left-[15%] filter blur-[3px] animate-shadow"
                style={{ animationDelay: '0.3s' }}
            />
            <div
                className="shadow bg-primary2 opacity-90 rounded-full absolute w-[20px] h-[2px] top-[62px] left-[45%] filter blur-[3px] animate-shadow animation-delay-200"
                style={{ animationDelay: '0.2s' }}
            />
            <div
                className="shadow bg-primary2  opacity-90 rounded-full absolute w-[20px] h-[2px] top-[62px] right-[15%] filter blur-[3px] animate-shadow animation-delay-300"
                style={{ animationDelay: '0.3s' }}
            />
        </div>
    );
};

export default Loader;
