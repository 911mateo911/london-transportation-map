import { useMemo, useState } from "react"
import { useAsyncAutocomplete } from "../hooks/useAsyncAutocomplete";
import { getTflApiBasePath } from "../utils/configuration";
import { TflStopPoint } from "../types/Tfl";
import { Autocomplete, AutocompleteProps, Box, Loader } from "@mantine/core";

interface TflStopPointAutocompleteProps extends AutocompleteProps {
  onSelectOption: (stopPoint: TflStopPoint) => void;
  className?: string;
}

interface StopPointSearchApiResponse {
  matches: TflStopPoint[];
}

interface InputState {
  term: string;
  shouldQuery: boolean;
}

const getIsEnabledEndpoint = (inputState: InputState) => {
  return inputState.term.length > 3 && inputState.shouldQuery;
};

export const TflStopPointAutocomplete = ({
  onSelectOption,
  className,
  ...autoCompleteProps
}: TflStopPointAutocompleteProps) => {
  const [inputState, setInputState] = useState<InputState>({
    term: '',
    shouldQuery: false
  });

  const { data, isLoading } = useAsyncAutocomplete<StopPointSearchApiResponse>(
    getTflApiBasePath(`/StopPoint/Search/${inputState.term}`),
    getIsEnabledEndpoint(inputState)
  );

  const handleInputChange = (inputValue: string) => {
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

  return (
    <Autocomplete
      value={inputState.term}
      onChange={handleInputChange}
      onOptionSubmit={handleSubmitOption}
      data={autoCompleteOptions}
      maxDropdownHeight={200}
      className={className}
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
