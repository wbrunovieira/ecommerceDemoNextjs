import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

import Container from "@/components/Container";
import Sidebar from "@/components/SideBar";
import ProductList from "@/components/ProductList";

import { ImagesSlider } from "@/components/ui/images-slider";
import { useEffect } from "react";
import { useSelectionStore } from "@/context/store";

interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
}

interface HomeProps {
  initialCategories: Category[];
}

const Home: NextPage<HomeProps> = ({ initialCategories }) => {
  return (
    <>
      <Container>
        <div>
          <ImagesSlider
            className="h-[20rem]"
            images={[
              "/images/foto1banner2.png",
              "/images/foto2-2.jpg",
              "/images/foto3-2.jpg",
              "/images/foto4-3.jpg",
            ]}
            autoplay={true}
            direction="up"
          >
            <div className="z-10  bg-primaryLight/[.7] p-4  rounded-lg">
              <h1 className="text-primaryDark text-4xl font-extrabold pb-2">
                Agora também <br /> estamos juntas na internet.
              </h1>
              <p className="text-secondary font-bold">
                Faça o seu pedido que entregamos na sua casa.
              </p>
            </div>
          </ImagesSlider>
        </div>
        <div className="max-w-7xl mx-auto  mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="flex rounded-md border border-light hover:border-slate-400 p-2">
              <div className="flex">
                <Image
                  src="/icons/lingeries.svg"
                  alt="icone de lingerie"
                  width={50}
                  height={50}
                />
              </div>

              <Link
                href={`/search?category=lingeries`}
                className="text-xs font-regular uppercase pl-2 self-center"
              >
                Lingeries{" "}
                <span className="text-[11px] text-fontColor font-light">
                  (53)
                </span>
                <p className="text-secondary text-[11px] capitalize font-normal">
                  Mostrar Todas
                </p>
              </Link>
            </div>{" "}
            <div className="flex rounded-md border border-light hover:border-slate-400 p-2">
              <div className="flex">
                <Image
                  src="/icons/pijamas.svg"
                  alt="icone de lingerie"
                  width={50}
                  height={50}
                />
              </div>

              <Link
                href={`/search?category=pijamas`}
                className="text-xs font-regular uppercase pl-2 self-center"
              >
                Pijamas{" "}
                <span className="text-[11px] text-fontColor font-light">
                  (39)
                </span>
                <p className="text-secondary text-[11px] capitalize font-normal">
                  Mostrar Todas
                </p>
              </Link>
            </div>{" "}
            <div className="flex rounded-md border border-light hover:border-slate-400 p-2">
              <div className="flex">
                <Image
                  src="/icons/boy.svg"
                  alt="icone de lingerie"
                  width={50}
                  height={50}
                />
              </div>

              <Link
                href={`/search?category=boy`}
                className="text-xs font-regular uppercase pl-2 self-center"
              >
                Para o seu Boy{" "}
                <span className="text-[11px] text-fontColor font-light">
                  (26)
                </span>
                <p className="text-secondary text-[11px] capitalize font-normal">
                  Mostrar Todas
                </p>
              </Link>
            </div>
            <div className="flex rounded-md border border-light hover:border-slate-400 p-2">
              <div className="flex">
                <Image
                  src="/icons/acessorios.svg"
                  alt="icone de lingerie"
                  width={50}
                  height={50}
                />
              </div>

              <Link
                href={`/search?category=acessorios`}
                className="text-xs font-regular uppercase pl-2 self-center"
              >
                Acessórios{" "}
                <span className="text-[11px] text-fontColor font-light">
                  (22)
                </span>
                <p className="text-secondary text-[11px] capitalize font-normal">
                  Mostrar Todas
                </p>
              </Link>
            </div>
          </div>
        </div>

        <section className="flex mt-2">
          <Sidebar initialCategories={[]} />
          <ProductList />
        </section>
      </Container>
    </>
  );
};

Home.getInitialProps = async () => {
  const res = await fetch(
    `${process.env.BASE_URL}/category/all?page=1&pageSize=10`
  );
  const data = await res.json();

  const initialCategories = data.categories.map((category: any) => ({
    id: category.id,
    name: category.name,
    slug: category.slug || "/default-image.png",
    imageUrl: category.imageUrl || "/default-image.png",
  }));

  return { initialCategories };
};
export default Home;
