import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import PetsSkeleton from "./skeleton";
import { getPets } from "./api";
import ImageCard from "@/components/ui/image-card";
import SearchBar, {
  SearchParams,
  FilterOption,
  SuggestionItem,
} from "@/components/search";

// Make the component async and handle searchParams properly
async function PetsGrid({
  searchParams,
}: {
  searchParams: Promise<SearchParams> | SearchParams;
}) {
  // Await the searchParams
  const resolvedParams = await searchParams;

  // Get query parameters with defaults
  const currentPage = Number(resolvedParams?.page) || 1;
  const search = resolvedParams?.search || "";
  const petName = resolvedParams?.petName || "";
  const textSearch = resolvedParams?.textSearch || "";
  const speciesFilter = resolvedParams?.species || "all";
  const sortOption = resolvedParams?.sort || "newest";
  const availableFilter = resolvedParams?.available || "all";

  // Fetch all pets first
  const { data: allPets } = await getPets();

  // Apply filters
  let filteredPets = [...allPets];

  // Species search filter (multi-select)
  if (search) {
    // Handle comma-separated search values for multi-select
    const searchTerms = search.split(",");

    filteredPets = filteredPets.filter(({ pet }) => {
      // If we have multiple search terms (from multi-select), check if any match
      return searchTerms.some(
        (term) => pet.species.toLowerCase() === term.toLowerCase()
      );
    });
  }

  // Pet name search filter
  if (petName) {
    filteredPets = filteredPets.filter(
      ({ pet }) => pet.name.toLowerCase() === petName.toLowerCase()
    );
  }

  // General text search filter
  if (textSearch) {
    const searchLower = textSearch.toLowerCase();
    filteredPets = filteredPets.filter(
      ({ pet }) =>
        pet.name.toLowerCase().includes(searchLower) ||
        pet.species.toLowerCase().includes(searchLower) ||
        pet.breed.toLowerCase().includes(searchLower) ||
        pet.description.toLowerCase().includes(searchLower)
    );
  }

  // Species filter - only apply if not already filtered by search
  if (speciesFilter !== "all" && !search.includes(speciesFilter)) {
    filteredPets = filteredPets.filter(
      ({ pet }) => pet.species.toLowerCase() === speciesFilter.toLowerCase()
    );
  }

  // Available filter
  if (availableFilter !== "all") {
    const isAvailable = availableFilter === "true";
    filteredPets = filteredPets.filter(
      ({ pet }) => pet.available === isAvailable
    );
  }

  // Apply sorting
  switch (sortOption) {
    case "price-high":
      filteredPets.sort((a, b) => b.pet.price - a.pet.price);
      break;
    case "price-low":
      filteredPets.sort((a, b) => a.pet.price - b.pet.price);
      break;
    case "age-young":
      filteredPets.sort((a, b) => a.pet.age - b.pet.age);
      break;
    case "age-old":
      filteredPets.sort((a, b) => b.pet.age - a.pet.age);
      break;
    case "alphabetical":
      filteredPets.sort((a, b) => a.pet.name.localeCompare(b.pet.name));
      break;
    case "newest":
    default:
      // Assuming newer pets have higher IDs
      filteredPets.sort((a, b) => Number(b.pet.id) - Number(a.pet.id));
  }

  // Pagination
  const petsPerPage = 12;
  const totalPages = Math.ceil(filteredPets.length / petsPerPage);

  // Ensure current page is valid
  const validPage = Math.max(1, Math.min(currentPage, totalPages || 1));

  // Get current page of pets
  const startIndex = (validPage - 1) * petsPerPage;
  const petsToShow = filteredPets.slice(startIndex, startIndex + petsPerPage);

  return (
    <div className="space-y-6">
      {/* Stats summary */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div>
          Showing {petsToShow.length} of {filteredPets.length} pets
        </div>
        <div>
          Page {validPage} of {totalPages || 1}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {petsToShow.map(({ pet, owner }) => (
          <Card key={pet.id} className="p-4 flex flex-col">
            <ImageCard
              imageUrl={pet.picture}
              caption={pet.name}
              alt={`${pet.name} the ${pet.species}`}
              aspectRatio="square"
              className="mb-4"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{pet.name}</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Species:</span> {pet.species}
                </p>
                <p>
                  <span className="font-semibold">Breed:</span> {pet.breed}
                </p>
                <p>
                  <span className="font-semibold">Age:</span> {pet.age} years
                </p>
                <p>
                  <span className="font-semibold">Gender:</span> {pet.gender}
                </p>
                <p className="text-lg font-bold">${pet.price.toFixed(2)}</p>
              </div>
              <p className="mt-4 text-gray-600 line-clamp-2">
                {pet.description}
              </p>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <HoverCard>
                <HoverCardTrigger>
                  <Button variant="outline">
                    {pet.available ? "Available" : "Not Available"}
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">Birth Date:</span>{" "}
                      {new Date(pet.birthDate).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-semibold">Weight:</span>{" "}
                      {pet.weight}
                      kg
                    </p>
                    <p>
                      <span className="font-semibold">Vaccinated:</span>{" "}
                      {pet.vaccinated ? "Yes" : "No"}
                    </p>
                    {owner && (
                      <p>
                        <span className="font-semibold">Owner:</span>{" "}
                        {owner.firstName} {owner.lastName}
                      </p>
                    )}
                  </div>
                </HoverCardContent>
              </HoverCard>
              <Button>View Details</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination using the specified pagination component */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`?page=${validPage > 1 ? validPage - 1 : 1}${
                  search ? `&search=${search}` : ""
                }${petName ? `&petName=${petName}` : ""}${
                  textSearch ? `&textSearch=${textSearch}` : ""
                }${speciesFilter !== "all" ? `&species=${speciesFilter}` : ""}${
                  sortOption ? `&sort=${sortOption}` : ""
                }${
                  availableFilter !== "all"
                    ? `&available=${availableFilter}`
                    : ""
                }`}
                aria-disabled={validPage <= 1}
                className={
                  validPage <= 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, i) => {
              const pageNumber = i + 1;

              // Always show first page, current page, and last page
              // Also show pages adjacent to current page
              const shouldShowPage =
                pageNumber === 1 ||
                pageNumber === totalPages ||
                Math.abs(pageNumber - validPage) <= 1;

              // Should we show ellipsis before this page?
              const showEllipsisBefore =
                pageNumber > 2 && validPage - pageNumber > 1;

              // Should we show ellipsis after this page?
              const showEllipsisAfter =
                pageNumber < totalPages - 1 && pageNumber < validPage - 1;

              if (shouldShowPage) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href={`?page=${pageNumber}${
                        search ? `&search=${search}` : ""
                      }${petName ? `&petName=${petName}` : ""}${
                        textSearch ? `&textSearch=${textSearch}` : ""
                      }${
                        speciesFilter !== "all"
                          ? `&species=${speciesFilter}`
                          : ""
                      }${sortOption ? `&sort=${sortOption}` : ""}${
                        availableFilter !== "all"
                          ? `&available=${availableFilter}`
                          : ""
                      }`}
                      isActive={pageNumber === validPage}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else if (showEllipsisBefore && pageNumber === 2) {
                return (
                  <div
                    key="ellipsis-start"
                    className="items-center md:flex hidden"
                  >
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  </div>
                );
              } else if (showEllipsisAfter && pageNumber === totalPages - 1) {
                return (
                  <div
                    key="ellipsis-end"
                    className="items-center md:flex hidden"
                  >
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  </div>
                );
              }

              return null;
            })}

            <PaginationItem>
              <PaginationNext
                href={`?page=${
                  validPage < totalPages ? validPage + 1 : totalPages
                }${search ? `&search=${search}` : ""}${
                  petName ? `&petName=${petName}` : ""
                }${textSearch ? `&textSearch=${textSearch}` : ""}${
                  speciesFilter !== "all" ? `&species=${speciesFilter}` : ""
                }${sortOption ? `&sort=${sortOption}` : ""}${
                  availableFilter !== "all"
                    ? `&available=${availableFilter}`
                    : ""
                }`}
                aria-disabled={validPage >= totalPages}
                className={
                  validPage >= totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

// Define filter options for reuse
const speciesOptions: FilterOption[] = [
  { value: "all", label: "All Species" },
  { value: "dog", label: "Dogs" },
  { value: "cat", label: "Cats" },
  { value: "bird", label: "Birds" },
  { value: "fish", label: "Fish" },
  { value: "rabbit", label: "Rabbits" },
  { value: "hamster", label: "Hamsters" },
  { value: "guineapig", label: "Guinea Pigs" },
  { value: "turtle", label: "Turtles" },
  { value: "snake", label: "Snakes" },
  { value: "lizard", label: "Lizards" },
];

// Convert filter options to suggestions format for the combobox
const speciesSuggestions: SuggestionItem[] = speciesOptions
  .filter((option) => option.value !== "all")
  .map((option) => ({
    id: option.value,
    value: option.value,
    label: option.label,
    category: "Species",
    image:
      option.value !== "all" ? `/images/pets/${option.value}_1.jpg` : undefined,
  }));

// Generate sample pet names for autocomplete
// In a real app, these would come from an API call
const petNameSuggestions: SuggestionItem[] = [
  { value: "buddy", label: "Buddy", category: "Pet Names" },
  { value: "max", label: "Max", category: "Pet Names" },
  { value: "bella", label: "Bella", category: "Pet Names" },
  { value: "charlie", label: "Charlie", category: "Pet Names" },
  { value: "luna", label: "Luna", category: "Pet Names" },
  { value: "lucy", label: "Lucy", category: "Pet Names" },
  { value: "daisy", label: "Daisy", category: "Pet Names" },
  { value: "rocky", label: "Rocky", category: "Pet Names" },
  { value: "oliver", label: "Oliver", category: "Pet Names" },
  { value: "zoe", label: "Zoe", category: "Pet Names" },
];

const sortOptions: FilterOption[] = [
  { value: "newest", label: "Newest First" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "age-young", label: "Age: Youngest First" },
  { value: "age-old", label: "Age: Oldest First" },
  { value: "alphabetical", label: "Name: A-Z" },
];

const availabilityOptions: FilterOption[] = [
  { value: "all", label: "All Pets" },
  { value: "true", label: "Available Only" },
  { value: "false", label: "Not Available" },
];

// Function to get pet name suggestions (in a real app, this would be an API call)
const getPetNameSuggestions = async (
  query: string
): Promise<SuggestionItem[]> => {
  // Filter local suggestions - in a real app, this would be a fetch to an API endpoint
  return petNameSuggestions.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );
};

// Make the page component async
export default async function PetsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Our Pets</h1>

      {/* Search section */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Default search */}
        <div className="w-full">
          <form className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              name="textSearch"
              placeholder="Search by name, breed, species..."
              defaultValue={searchParams?.textSearch || ""}
            />
            <Button 
            type="submit"
            variant="reverse"
            >Search</Button>
          </form>
        </div>

        {/* SearchBars row */}
        <div className="flex flex-col lg:flex-row">
          {/* <div className="flex-1"> */}
            <SearchBar
              searchParams={searchParams}
              searchFieldName="petName"
              searchPlaceholder="Find pet by name..."
              suggestions={petNameSuggestions}
              // getSuggestions={getPetNameSuggestions}
            />
          {/* </div> */}

          <div className="flex-1">
            <SearchBar
              searchParams={searchParams}
              searchPlaceholder="Select species..."
              searchFieldName="search"
              suggestions={speciesSuggestions}
              filters={[
                {
                  name: "sort",
                  placeholder: "Sort by",
                  options: sortOptions,
                  defaultValue: "newest",
                },
                {
                  name: "available",
                  placeholder: "Availability",
                  options: availabilityOptions,
                  defaultValue: "all",
                },
              ]}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <Suspense fallback={<PetsSkeleton />}>
        <PetsGrid searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
