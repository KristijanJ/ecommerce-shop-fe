import Link from "next/link";

interface HeroProps {
  shopName: string;
  shopDescription: string;
}

const Hero = ({ shopName, shopDescription }: HeroProps) => {
  return (
    <section className="h-200 bg-hero bg-no-repeat bg-cover bg-center py-20">
      <div className="container mx-auto flex justify-around h-full">
        <div className="flex flex-col justify-center">
          <div className="font-semibold flex items-center uppercase">
            <div className="w-10 h-0.5 mr-3 bg-cyan-700"></div>Hot Trend
          </div>
          <h1 className="uppercase text-[55px] md:text-[70px] leading-[1.1] font-semibold mb-4">
            {shopDescription}
            <br />
            <span className="font-light">{shopName}</span>
          </h1>
          <Link
            href={"/products"}
            className="self-start uppercase font-semibold border-b-2 border-primary"
          >
            Discover More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
