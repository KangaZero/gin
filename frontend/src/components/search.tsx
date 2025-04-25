"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { useEffect, useId, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { debounce } from "lodash";

export interface FilterOption {
  value: string;
  label: string;
}

export interface SearchParams {
  [key: string]: string | undefined;
}

export interface SuggestionItem {
  id?: string;
  value: string;
  label: string;
  category?: string;
  image?: string;
}

interface SearchBarProps {
  searchParams?: SearchParams;
  filters?: {
    name: string;
    placeholder: string;
    options: FilterOption[];
    defaultValue?: string;
  }[];
  searchFieldName?: string;
  searchPlaceholder?: string;
  className?: string;
  onSearchChange?: (params: SearchParams) => void;
  suggestions?: SuggestionItem[];
  getSuggestions?: (
    query: string
  ) => Promise<SuggestionItem[]> | SuggestionItem[];
  debounceTime?: number;
}

// Define a special value to represent "all" or empty selection
export const ALL_VALUES = "all";

export default function SearchBar({
  searchParams = {},
  filters = [],
  searchFieldName = "search",
  searchPlaceholder = "Search...",
  className,
  onSearchChange,
  suggestions = [],
  getSuggestions,
  debounceTime = 300,
}: SearchBarProps) {
  const filterId = useId();
  const router = useRouter();
  const searchParamsObj = useSearchParams();

  const [searchValue, setSearchValue] = useState(
    searchParams?.[searchFieldName] || ""
  );
  const [open, setOpen] = useState(false);
  const [availableSuggestions, setAvailableSuggestions] =
    useState<SuggestionItem[]>(suggestions);
  const [selectedSuggestions, setSelectedSuggestions] = useState<
    SuggestionItem[]
  >([]);

  // Handle search value changes
  const handleSearchValueChange = useCallback(
    debounce(async (value: string) => {
      // Fetch or filter suggestions
      if (value && value.length >= 1) {
        if (getSuggestions) {
          try {
            const results = await getSuggestions(value);
            setAvailableSuggestions(results);
          } catch (error) {
            console.error("Error fetching suggestions:", error);
          }
        } else if (suggestions.length > 0) {
          // Filter local suggestions
          const filtered = suggestions.filter(
            (item) =>
              item.label.toLowerCase().includes(value.toLowerCase()) ||
              item.value.toLowerCase().includes(value.toLowerCase())
          );
          setAvailableSuggestions(filtered);
        }
      } else {
        setAvailableSuggestions(suggestions);
      }

      // Update URL and trigger search
      if (value && value.length >= 2) {
        const params = new URLSearchParams(searchParamsObj.toString());
        params.set(searchFieldName, value);
        params.set("page", "1");
        const newUrl = `?${params.toString()}`;
        router.push(newUrl);

        if (onSearchChange) {
          const newParams: SearchParams = {};
          params.forEach((value, key) => {
            newParams[key] = value;
          });
          onSearchChange(newParams);
        }
      }
    }, debounceTime),
    [
      searchParamsObj,
      searchFieldName,
      router,
      onSearchChange,
      getSuggestions,
      suggestions,
      debounceTime,
    ]
  );

  // Initialize selected suggestions from URL params
  useEffect(() => {
    if (searchParams?.[searchFieldName]) {
      const currentValue = searchParams[searchFieldName];
      const found = suggestions.filter((item) =>
        currentValue?.split(",").includes(item.value)
      );

      if (found.length > 0) {
        setSelectedSuggestions(found);
      }
    }
  }, [searchParams, searchFieldName, suggestions]);

  // Real-time filtering function for dropdown filters
  const handleFilterChange = (name: string, value: string) => {
    const params = new URLSearchParams(searchParamsObj.toString());

    // Handle the special "all" value
    if (value === ALL_VALUES) {
      params.delete(name);
    } else {
      params.set(name, value);
    }

    // Always reset to page 1 when filters change
    params.set("page", "1");

    // Update URL
    const newUrl = `?${params.toString()}`;
    router.push(newUrl);

    // Call callback if provided
    if (onSearchChange) {
      const newParams: SearchParams = {};
      params.forEach((value, key) => {
        newParams[key] = value;
      });
      onSearchChange(newParams);
    }
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (selectedValue: string) => {
    const framework = availableSuggestions.find(
      (item) => item.value === selectedValue
    );
    if (!framework) return;

    setSelectedSuggestions(
      selectedSuggestions.some((f) => f.value === selectedValue)
        ? selectedSuggestions.filter((f) => f.value !== selectedValue)
        : [...selectedSuggestions, framework]
    );

    // Update URL with comma-separated values
    const params = new URLSearchParams(searchParamsObj.toString());
    const newSelectedValues = selectedSuggestions.some(
      (f) => f.value === selectedValue
    )
      ? selectedSuggestions
          .filter((f) => f.value !== selectedValue)
          .map((item) => item.value)
      : [...selectedSuggestions.map((item) => item.value), selectedValue];

    if (newSelectedValues.length > 0) {
      params.set(searchFieldName, newSelectedValues.join(","));
    } else {
      params.delete(searchFieldName);
    }

    params.set("page", "1");
    const newUrl = `?${params.toString()}`;
    router.push(newUrl);

    if (onSearchChange) {
      const newParams: SearchParams = {};
      params.forEach((value, key) => {
        newParams[key] = value;
      });
      onSearchChange(newParams);
    }
  };

  // Convert empty string values to the ALL_VALUES constant
  const getDefaultFilterValue = (
    name: string,
    defaultValue?: string
  ): string => {
    const paramValue = searchParams?.[name];
    if (paramValue) return paramValue;
    if (defaultValue === "") return ALL_VALUES;
    return defaultValue || ALL_VALUES;
  };

  return (
    <div className={`flex flex-col md:flex-row gap-4 mb-6 ${className}`}>
      {/* Multi-select Search with autocomplete */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="noShadow"
            role="combobox"
            aria-expanded={open}
            className="w-fit min-w-[280px] justify-between"
          >
            {selectedSuggestions.length > 0
              ? selectedSuggestions.map((item) => item.label).join(", ")
              : searchPlaceholder}
            <ChevronsUpDown className="text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0 border-0" align="start">
          <Command className="**:data-[slot=command-input-wrapper]:h-11">
            <CommandInput
              placeholder={`Search ${searchPlaceholder.toLowerCase()}...`}
              value={searchValue}
              onValueChange={(value) => {
                setSearchValue(value);
                handleSearchValueChange(value);
              }}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup className="p-2 [&_[cmdk-group-items]]:flex [&_[cmdk-group-items]]:flex-col [&_[cmdk-group-items]]:gap-1">
                {availableSuggestions.map((item) => (
                  <CommandItem
                    key={item.id || item.value}
                    value={item.value}
                    onSelect={handleSelectSuggestion}
                  >
                    <div
                      className="border-border pointer-events-none size-5 shrink-0 rounded-base border-2 transition-all select-none *:[svg]:opacity-0 data-[selected=true]:*:[svg]:opacity-100 mr-2"
                      data-selected={selectedSuggestions.some(
                        (f) => f.value === item.value
                      )}
                    >
                      <CheckIcon className="size-4 text-current" />
                    </div>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.label}
                        className="w-5 h-5 rounded-full object-cover mr-2"
                      />
                    )}
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Select
            key={filter.name}
            name={filter.name}
            defaultValue={getDefaultFilterValue(
              filter.name,
              filter.defaultValue
            )}
            onValueChange={(value) => handleFilterChange(filter.name, value)}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder={filter.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((option) => (
                <SelectItem
                  key={option.value || "all"}
                  value={option.value || ALL_VALUES}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>
    </div>
  );
}
