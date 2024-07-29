import { useMemo, useState } from "react"
import { useAsyncAutocomplete } from "../hooks/useAsyncAutocomplete";
import { getTflApiBasePath } from "../utils/configuration";
import { TflStopPointSearchResult } from "../types/Tfl";
import { Autocomplete, AutocompleteProps, Box, Loader } from "@mantine/core";

interface TflStopPointAutocompleteProps extends AutocompleteProps {
  onSelectOption: (stopPoint: TflStopPointSearchResult) => void;
  onInputClear?: () => void;
  className?: string;
}

interface StopPointSearchApiResponse {
  matches: TflStopPointSearchResult[];
}

interface InputState {
  term: string;
  shouldQuery: boolean;
}

const getIsEndpointEnabled = (inputState: InputState) => {
  return inputState.term.length > 3 && inputState.shouldQuery;
};

export const TflStopPointAutocomplete = ({
  onSelectOption,
  className,
  onInputClear,
  ...autoCompleteProps
}: TflStopPointAutocompleteProps) => {
  const [inputState, setInputState] = useState<InputState>({
    term: '',
    shouldQuery: false
  });

  const isEndpointEnabled = getIsEndpointEnabled(inputState);

  const { data, isLoading } = useAsyncAutocomplete<StopPointSearchApiResponse>(
    getTflApiBasePath(`/StopPoint/Search/${inputState.term}`),
    isEndpointEnabled
  );

  const autoCompleteOptions = useMemo(() => {
    if (!data?.matches || !inputState.term) {
      return [];
    }

    const pushedElements = new Set<string>();

    return data.matches.reduce<string[]>((acc, currentElement) => {
      const name = currentElement.name;

      if (pushedElements.has(name)) {
        return acc;
      }

      pushedElements.add(name);
      acc.push(name);
      return acc;
    }, []);
  }, [data?.matches, inputState.term]);
  const hasAutocompleteError = !isLoading && !autoCompleteOptions.length && isEndpointEnabled;

  const handleInputChange = (inputValue: string) => {
    if (!inputValue && onInputClear) {
      onInputClear();
    }

    const foundStopPoint = data?.matches.find(({ name }) => name === inputValue);

    setInputState({
      term: inputValue,
      shouldQuery: !foundStopPoint
    })
  }

  const handleSubmitOption = (optionName: string) => {
    const foundStopPoint = data?.matches.find(({ name }) => name === optionName);

    if (foundStopPoint) {
      onSelectOption(foundStopPoint);
    }
  }

  return (
    <Autocomplete
      value={inputState.term}
      onChange={handleInputChange}
      onOptionSubmit={handleSubmitOption}
      data={autoCompleteOptions}
      maxDropdownHeight={200}
      className={className}
      error={hasAutocompleteError}
      rightSection={
        <Box
          w={16}
          h={16}
          className="flex items-center justify-center"
        >
          {isLoading && (
            <Loader
              size={16}
              color='gray'
            />
          )}
        </Box>
      }
      {...autoCompleteProps}
    />
  )
}
