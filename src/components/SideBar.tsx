import React from 'react';

const Sidebar = () => {
  const sidebarItems = [
    { icon: 'icon1', title: 'Item 1' },
    { icon: 'icon2', title: 'Item 2' },
    { icon: 'icon3', title: 'Item 3' },
    { icon: 'icon4', title: 'Item 4' },
    { icon: 'icon5', title: 'Item 5' },
    { icon: 'icon6', title: 'Item 6' },
  ];

  return (
    <div className='flex flex-col w-64 bg-gray-200'>
      {sidebarItems.map((item, index) => (
        <div key={index} className='flex items-center p-4'>
          <div className='mr-2'>{item.icon}</div>
          <div>{item.title}</div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
