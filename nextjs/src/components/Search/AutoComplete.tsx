import React, { useEffect } from "react";
import { parseCookies } from "nookies";
import Suggestions from "./Suggestions";
import { searchVendorsAPI } from "@/lib/api";
import {
  AutoCompleteProps,
  AutoCompleteVendorsProps,
} from "@/lib/types";
import { keyupAutoComplete, keydownAutoComplete, noVendor } from "@/utils/helpers";

const AutoComplete = ({ name, vendorIds, categoryIds, handleSearch }: AutoCompleteProps) => {
  const { token } = parseCookies();
  const [search, setSearch] = React.useState("");
  const [showSuggestion, setShowSuggestion] = React.useState(!1);
  const [suggestions, setSuggestions] = React.useState<AutoCompleteVendorsProps[]>([]);
  useEffect(() => {
    if (search.trim().length && showSuggestion) {
      searchVendorsAPI(
        token ?? '',
        {
          q: search,
          filters: categoryIds.join(',')
        }
      ).then((res) => {
        if (res.code === 200) {
          if (Array.isArray(res?.data)) {
            setSuggestions([noVendor]);
            return;
          }
          const nVendors = res?.data?.vendors?.data.reduce(
            (e: AutoCompleteVendorsProps[] | [], t: AutoCompleteVendorsProps) => {
            if (!e.length) {
              if (!vendorIds.includes(t.id)) {
                e = [...e, t];
                return e;
              }
            }
            if (!vendorIds.includes(t.id)) {
              e = [...e, t];
              return e;
            }
            return e;
          }, []);
          setSuggestions(nVendors);
        }
      }).catch((err) => {
        console.log(err);
      });
    } else {
      setSuggestions([]);
    }
  }, [search]);

  // method to clear search input field.
  const clearSearch = () => {
    setSearch("");
    setSuggestions([]);
  }

  // method to select a specific vendor from listing.
  const handleSuggestion = (suggestion: any) => {
    setShowSuggestion(!1);
    setSearch(suggestion.display_name);
    setSuggestions([]);
    handleSearch(name, suggestion, null);
  };
  return (
    <>
      <form
        className="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="relative w-full border rounded">
          <span className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
            <i className="fas fa-search"></i>
          </span>
          <input
            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm outline-none focus:outline-none focus:ring w-full pl-10"
            type="text"
            name={name}
            value={search}
            autoComplete="off"
            placeholder="Search Vendor..."
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setSearch(e.currentTarget.value);
              setShowSuggestion(!0);
            }}
            onKeyDown={(e) => {
              switch(e.key) {
                case "ArrowUp":
                  keyupAutoComplete();
                  break;
                case "ArrowDown":
                  keydownAutoComplete();
                  break;
                case "Enter":
                  const activeElement = document.querySelector('li.suggestion-active');
                  if (search.trim().length && activeElement) {
                    setSearch(activeElement?.firstChild?.nodeValue ?? "");
                    const suggestion = suggestions.find(
                      (suggestion) => suggestion.display_name === activeElement?.firstChild?.nodeValue);
                    if (suggestion) {
                      setSuggestions([]);
                      handleSuggestion(suggestion);
                    }
                  }
                  break;
              }
            }}
          />
          {
            search.trim().length && suggestions?.length ? (
              <button
                onClick={() => clearSearch()}
                style={{position: 'absolute', top: 10, right: 15}}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            ) : null
          }
          {search.trim().length && suggestions?.length ? (
            <Suggestions
              items={suggestions}
              handleSuggestion={handleSuggestion}
            />
          ): null}
        </div>
      </form>
    </>
  )
}

export default AutoComplete;
