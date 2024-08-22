"use client";
import CadastroForm from "@/components/CadastroForm";
import Container from "@/components/Container";

const CadastroPage = () => {

  return (
    <>
    <div className="bg-linear-gradient w-full max-w-full">
      <Container>
        <div  className=" w-full max-w-full">
        <CadastroForm />
        </div>
      </Container>
    </div>
    </>
  ) 
  ;
};

export default CadastroPage;
