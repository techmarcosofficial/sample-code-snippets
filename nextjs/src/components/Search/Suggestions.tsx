import React from 'react';
import { AutoCompleteVendorsProps } from "@/lib/types";

interface SuggestionsProps {
  items: AutoCompleteVendorsProps[],
  handleSuggestion: (e: any) => void,
}

const AutoCompleteSuggestions = ({
  items,
  handleSuggestion
}: SuggestionsProps) => (
  <>
    <ul className="suggestions header-search-box">
      {items.map((item) => {
        // let className;
        // // Flag the active suggestion with a class
        // if (index === activeIndex) {
        // className = "suggestion-active";
        // }
        return (
        <li key={item.id} onClick={() => handleSuggestion(item)}>
            {item.display_name}
        </li>
        );
      })}
    </ul>
  </>
)

export default AutoCompleteSuggestions;
