import {
    FacebookShareButton,
    WhatsappShareButton,
    EmailShareButton,
    FacebookIcon,
    WhatsappIcon,
    EmailIcon,
  } from 'react-share';

  interface Product {
    
    slug: string;
    title: string;
    category: string[0];
  }
  
  const ShareButtons = ({ product }: { product: Product }) => {
    const shareUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/product/${product.slug}`;
  
    return (
      <>
        <h3 className='text-base pt-2 mb-1'>
          Compartilhe esse produto
        </h3>
        <div className='flex gap-3 pb-5'>

          
          <FacebookShareButton
            url={shareUrl}
            className='hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105'
            hashtag={`#${product.category.replace(/\s/g, '')}`}
            >
            <FacebookIcon size={24} round={true} />
          </FacebookShareButton>
           
  
         
  
          <WhatsappShareButton
            url={shareUrl}
            className='hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105'
            title={product.title}
            separator=':: '
          >
            <WhatsappIcon size={24} round={true} />
          </WhatsappShareButton>
  
          <EmailShareButton
            url={shareUrl}
            className='hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105'
            subject={product.title}
            body={`Adorei esse produto: ${shareUrl}`}
          >
            <EmailIcon size={24} round={true} />
          </EmailShareButton>
        </div>
      </>
    );
  };
  export default ShareButtons;