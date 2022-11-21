import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { HomeCarouselProps } from "@/lib/types";
import { parseImage } from "@/utils/helpers";

const HomeCarousel = ({
  items
} : HomeCarouselProps) => (
  <>
    <Carousel
      showThumbs={false}
      showArrows={true}
      showStatus={false}
      autoPlay={true}
      infiniteLoop={true}
      interval={5000}
    >
      {items?.map((item) => (
        <div key={item.id} style={{minHeight: 400, height: '75vh', width: '100%'}}>
          <Link
            href={`/categories/${item.slug}`}
            as={`/categories/${item.slug}`}
            passHref
          >
            <a>
              <Image
                src={parseImage(item.image)}
                alt={item.name}
                layout='fill'
                priority={true}
              />
              <div className="text-xl font-semibold caption">{item.name}</div>
            </a>
          </Link>
        </div>
      ))}
    </Carousel>
  </>
);

export default HomeCarousel;
