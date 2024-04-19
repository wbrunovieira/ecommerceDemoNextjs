// import React from 'react';
// import Flower from '/public/images/flower.svg';
// import { useRef } from 'react';
// import gsap from 'gsap';
// import { useGSAP } from '@gsap/react';

// if (typeof window !== 'undefined') {
//   gsap.registerPlugin(useGSAP);
// }

// const AnimatedFlower = () => {
//   const container = useRef<HTMLElement | any>();
//   const tl = useRef<GSAPTimeline | any>();

//   useGSAP(
//     () => {
//       if (container.current) {
//         gsap.to('#petalas', {
//           duration: 1,
//           x: 100,
//           y: 100,
//           scale: 0.5,
//           rotation: 180,
//           skewX: 45,
//         });
//         gsap.to(container.current.querySelectorAll('.cls-6'), { scale: 2.1 });
//         gsap.to(container.current.querySelectorAll('.Petala4'), { scale: 2.1 });
//       }
//     },
//     { scope: container }
//   );
//   return (
//     <div className='z-20' ref={container}>
//       <Flower />
//     </div>
//   );
// };

// export default AnimatedFlower;
'use client';
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Flower from '/public/images/flower.svg'; // Supondo que Flower seja um componente React

const AnimatedFlower = () => {
  const container = useRef<HTMLElement>(null);

  useEffect(() => {
    if (container.current) {
      // Assegure-se de que os seletores correspondam aos elementos no SVG
      gsap.to(container.current.querySelectorAll('#petalas'), {
        duration: 1,
        x: 100,
        y: 100,
        scale: 0.5,
        rotation: 180,
        skewX: 45,
      });
    }
  }, []);

  return (
    <div ref={container as React.RefObject<HTMLDivElement>}>
      <Flower />
    </div>
  );
};

export default AnimatedFlower;
