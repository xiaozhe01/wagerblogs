import { Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

type SearchInputProps = {
  placeholder?: string;
};

export default function SearchInput({ placeholder = "Search..." }: SearchInputProps) {
  return (
    <search className="flex-1 min-w-0">
      <InputGroup className="w-full">
        <InputGroupInput aria-label="Search the site" placeholder={placeholder} />
        <InputGroupAddon>
          <Search className="shrink-0" aria-hidden="true" />
        </InputGroupAddon>
      </InputGroup>
    </search>
  );
}
