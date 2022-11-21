import { OptionProps, FeedbackProps } from "@/lib/types";

export const parseImage = (image: string) => {

  return `http://localhost:3000/subpop/public/${image}`;
  //return `${new URL(`${process.env.NEXT_PUBLIC_API_URL}`).origin}/${image}`;
}

export const parseFile = (file: string) => {
  return `${new URL(`${process.env.NEXT_PUBLIC_API_URL}`).origin}/${file}`;
}

export const noVendor = {
  id: 0,
  display_name: "Record Not Found",
  slug: "no_found",
  description: "",
  key: "",
  image: "",
  thumb: "",
  reviewed_by_pbgh: 0,
}

export const keyupAutoComplete = () => {
  const container = document.querySelector('ul.suggestions.header-search-box') as HTMLUListElement;
  if (container) {
    const activeElement = container.querySelector('li.suggestion-active');
    if (activeElement && activeElement.previousElementSibling) {
      // Previous element select on keyup.
      activeElement.previousElementSibling?.classList.add("suggestion-active");
      activeElement.classList.remove("suggestion-active");
    }
  }
}

export const keydownAutoComplete = () => {
  const container = document.querySelector('ul.suggestions.header-search-box') as HTMLUListElement;
  if (container) {
    const suggestions = container.querySelectorAll('li');
    const activeElement = container.querySelector('li.suggestion-active');
    if (!activeElement) {
      // Avoid not found element.
      const notFound = suggestions[0]?.firstChild?.nodeValue ?? "";
      if (notFound === "Record Not Found") {
        return;
      }
      // First element select on keydown.
      suggestions[0]?.classList.add("suggestion-active");
    } else if (activeElement.nextElementSibling) {
      // Next element select on keydown.
      activeElement.classList.remove("suggestion-active");
      activeElement.nextElementSibling?.classList.add("suggestion-active");
    }
  }
}

export const findVendorIds = (vids: number[]) => {
  return vids.reduce((e: any, t: number, i: number) => {
    if (!Object.keys(e).length) {
      e = {
        id1: t,
      };
      return e;
    }
    e[`id${i + 1}`] = t;
    return e;
  }, {});
}

export const parseFilters = (options: any) => {
  return Object.entries(options).map(([key, value]: any) => {
    return {
      name: key,
      items: value.map((t: OptionProps) => {
        return { ...t, selected: !1 };
      }),
    };
  });
}

export const showAddComment = (
  feedbacks: FeedbackProps[],
  selectedFeedbackId: number,
  show?: boolean
) => {
  return feedbacks.map((feedback) => {
    if (feedback.id === selectedFeedbackId) {
      feedback.openComment = show ? !0: !1;
      return feedback;
    }
    return feedback;
  })
}

export const toggleAccordion = (accordion: HTMLHeadElement) => {
  accordion.classList.toggle("active");
  let content = accordion.nextElementSibling as HTMLElement;
  if (content.style.maxHeight) {
    // this is if the accordion is open
    content.style.maxHeight = "";
  } else {
    // if the accordion is currently closed
    content.style.maxHeight = content.scrollHeight + "px";
  }
}

export const togglePlusSignAccordion = (accordion: HTMLHeadElement) => {
  accordion.classList.toggle("active");
  const icon = accordion.querySelector("i");
  if (icon) {
    if (icon.classList.contains("fa-plus")) {
      icon.classList.remove("fa-plus");
      icon.classList.add("fa-minus");
    } else {
      icon.classList.remove("fa-minus");
      icon.classList.add("fa-plus");
    }
  }

  let content = accordion.nextElementSibling as HTMLElement;
  if (content.style.maxHeight) {
    // this is if the accordion is open
    content.style.maxHeight = "";
  } else {
    // if the accordion is currently closed
    content.style.maxHeight = content.scrollHeight + "px";
  }
}

export const toggleSubAccordions = (id: number) => {
  const subAccordionHeaders =
    document.querySelectorAll<HTMLElement>(".sub-item-header");
  subAccordionHeaders.forEach((accordion) => {
    const headerId = accordion.getAttribute("id");
    if (`sub-${id}` === headerId) {
      accordion.classList.toggle("active");
      const icon = accordion.querySelector("i");
      if (icon) {
        if (icon.classList.contains("fa-plus")) {
          icon.classList.remove("fa-plus");
          icon.classList.add("fa-minus");
        } else if (icon.classList.contains("fa-minus")) {
          icon.classList.remove("fa-minus");
          icon.classList.add("fa-plus");
        }
      }

      let content = accordion.nextElementSibling as HTMLElement;
      if (content.style.maxHeight) {
        // this is if the accordion is open
        content.style.maxHeight = "";
      } else {
        // if the accordion is currently closed
        content.style.maxHeight = content.scrollHeight + "px";
      }
      const criteriaContent = document.querySelector("#criteria_content") as HTMLDivElement;
      criteriaContent.style.maxHeight = criteriaContent.scrollHeight + content.scrollHeight + "px";
    }
  });
};

export const parseExternalLinks = (text: string) => {
  // open link in new tab
  var document = new DOMParser().parseFromString(text, "text/html");
  document.querySelectorAll<HTMLAnchorElement>("a").forEach(
    (link) => link.setAttribute("target", "_blank"));
  return document?.documentElement?.querySelector("body")?.innerHTML ?? "";
}

export const parseExternalImages = (text: string) => {
  // open image in new tab
  var document = new DOMParser().parseFromString(text, "text/html");
  document.querySelectorAll<HTMLImageElement>("img").forEach(
    (image) => {
      var a = document.createElement("a");
      a.href = image.src;
      a.target = "_blank";
      image.parentNode?.appendChild(a);
      image.remove();
      a.appendChild(image);
    });
  return document?.documentElement?.querySelector("body")?.innerHTML ?? "";
}
