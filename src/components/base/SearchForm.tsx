import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useWatchEffect } from "@/hooks/use-watch-effect";
import {
  FormEvent,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type FC,
} from "react";
import { Icon } from "./Icon";
import { Input } from "./Input";

export interface SearchFormProps
  extends Omit<ComponentPropsWithoutRef<"form">, "onSubmit"> {
  placeholder?: string;
  onSearch: (value: string) => void;
  initialValue?: string;
  iconPosition?: "left" | "right";
}

const MIN_SEARCH_LENGTH = 3;

export const SearchForm: FC<SearchFormProps> = (props) => {
  const {
    iconPosition = "left",
    onSearch,
    placeholder,
    className,
    initialValue = "",
    ...rest
  } = props;
  const [value, setValue] = useState<string>(initialValue);
  const [debouncedValue] = useDebouncedValue(value, 500);

  const isSubmitted = useRef(false);
  const submitResetTimer = useRef<NodeJS.Timeout | null>(null);

  const submitHandler = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (isSubmitted.current) return;
    if (value.length < MIN_SEARCH_LENGTH) return onSearch("");
    if (value === debouncedValue) return;

    onSearch(value);
    isSubmitted.current = true;
  };

  useWatchEffect(() => {
    if (isSubmitted.current) return;
    if (value.length < MIN_SEARCH_LENGTH) return onSearch("");

    onSearch(debouncedValue);
    isSubmitted.current = true;
  }, [debouncedValue]);

  useWatchEffect(() => {
    if (submitResetTimer.current) clearTimeout(submitResetTimer.current);

    submitResetTimer.current = setTimeout(() => {
      isSubmitted.current = false;
    }, 500);
  }, [isSubmitted.current]);

  return (
    <form {...rest} className={className} onSubmit={submitHandler}>
      <Input
        placeholder={placeholder}
        endContent={<Icon name="Search" color="gray" />}
        value={value}
        onChange={(evt) => setValue(evt.currentTarget.value)}
      />
    </form>
  );
};
