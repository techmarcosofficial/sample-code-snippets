import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useStore } from "@/reducers/auth";
import {
  getNavbarCategories,
  searchVendorsAPI
} from "@/lib/api";
import {
  AdminSearchProps,
  AutoCompleteVendorsProps,
  NavbarCategories,
} from "@/lib/types";
import {
  keyupAutoComplete,
  keydownAutoComplete
} from "@/utils/helpers";

export default function AdminSearch({ query, category }: AdminSearchProps) {
  const router = useRouter();
  const { logout } = useStore();
  const { token } = parseCookies();
  const [categories, setCategories] = useState<NavbarCategories[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<AutoCompleteVendorsProps[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<AutoCompleteVendorsProps | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(!1);
  useEffect(() => {
    getNavbarCategories(token ?? '')
    .then((res) => {
      if (res.code === 200) {
        setCategories(res?.data?.categories ?? []);
      }
      if (!res.ok && res.status === 401) {
        logout();
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    });
    setSearch(query);
    setSelectedCategory(category);
    if (query.length) {
      setShowSuggestions(!1);
    }
  }, []);

  useEffect(() => {
    if (search.trim().length && showSuggestions) {
      let cids: string[] = [];
      const categoryObj = categories.find((item) => item.slug === selectedCategory);
      if (categoryObj) {
        cids = [categoryObj.id];
      }
      searchVendorsAPI(token ?? '', { q: search, filters: cids }).then((res) => {
        if (res.code === 200) {
          // set default object in list if data missing as per user selection
          setSuggestions(res?.data?.vendors?.data ?? [{
            id: 0,
            display_name: "Record Not Found",
            slug: "no_found",
            image: "",
            thumb: "",
            reviewed_by_pbgh: 0,
            description: "",
          }]);
        }
      }).catch((err) => {
        console.log(err);
      });
    } else if (!search.trim().length) {
      setSuggestions([]);
      setSelectedSuggestion(null);
    }
  }, [search]);

  // method to clear search input field.
  const clearSearch = () => {
    setSearch("");
    setSuggestions([]);
    setShowSuggestions(!1);
    setSelectedSuggestion(null);
  }

  // method to select a specific vendor from listing.
  const handleSuggestion = (suggestion: any) => {
    setSelectedSuggestion(suggestion);
    setSearch(suggestion.display_name);
    setShowSuggestions(!1);
    setSuggestions([]);
  };

  return (
    <>
      <div className="header-search-outer w-full lg:ml-auto mr-3">
        <i className="fa-solid fa-magnifying-glass cross" onClick={() => {
          (document.querySelector(
            ".header-search-outer") as HTMLDivElement).classList.toggle("active");
        }}></i>
        <form
          className="flex flex-row flex-wrap items-center header-search-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="w-full md:w-4/12 px-2 select-col">
            <div className="relative w-full">
              <select
                className="border-0 px-3 py-3 w-full placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none md-input"
                name="selectedCategory"
                value={selectedCategory}
                onChange={(e: React.FormEvent<HTMLSelectElement>) => {
                  setSelectedCategory(e.currentTarget.value);
                  if (search.length && showSuggestions) clearSearch();
                }}
              >
                <option value="">Select Category</option>
                {categories.length && categories.map((category) => (
                  <option key={category.id} value={category.slug}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="w-full md:w-8/12 px-2 ip-call">
            <div className="relative w-full md-input">
              <input
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none w-full pr-10"
                type="text"
                value={search}
                autoComplete="off"
                placeholder="Search Vendors"
                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                  setSearch(e.currentTarget.value);
                  setShowSuggestions(!0);
                }}
                onKeyDown={(e) => {
                  setShowSuggestions(!1);
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
                        setSelectedSuggestion(suggestion ? suggestion : null);
                        setSuggestions([]);
                        setShowSuggestions(!1);
                        return;
                      }
                      if (selectedSuggestion) {
                        router.push(`/vendors/${selectedSuggestion.slug}`);
                      } else {
                        router.push(`/search/?q=${search}&category=${selectedCategory}`);
                      }
                      break;
                  }
                }}
              />
              <span
                className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 bg-transparent rounded text-base items-center justify-center w-8 py-3 search-icon"
                onClick={() => {
                  if (selectedSuggestion) {
                    router.push(`/vendors/${selectedSuggestion.slug}`);
                  } else {
                    router.push(`/search/?q=${search}&category=${selectedCategory}`);
                  }
                }}
              >
                <i className="fas fa-search"></i>
              </span>
                {
                  search.trim().length && suggestions.length ? (
                    <>
                      <button
                        onClick={() => clearSearch()}
                        style={{
                          position: 'absolute',
                          top: 10,
                          right: 35
                        }}>
                          <i className="fa-solid fa-xmark"></i>
                      </button>
                      <ul className="suggestions header-search-box">
                        {suggestions.map((suggestion) => {
                          if (suggestion.id === 0 && suggestion.slug === "no_found") {
                            return (
                              <li key={suggestion.id}>{suggestion.display_name}</li>
                            )
                          }
                          return (
                            <li key={suggestion.id} onClick={() => handleSuggestion(suggestion)}>
                              {suggestion.display_name}
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  ) : null
                }
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
