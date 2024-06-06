import CloseIcon from "@/utils/icons/shared/CloseIcon";
import EnterIcon from "@/utils/icons/shared/EnterIcon";
import { IconButton } from "@mui/material";
import { useState, ChangeEvent, KeyboardEvent, useRef, useEffect } from "react";

type Props = {
  words: string[];
  setWords: (words: string[]) => void;
};

const CustomInputTag = ({ words, setWords }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");

  const removeTag = (i: number) => {
    const newTags = [...words];
    newTags.splice(i, 1);
    setWords(newTags);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const newVal = inputValue.trim();
    if (event.key === "Enter" && newVal) {
      setWords([...words.filter((txt) => txt !== newVal), newVal]);
      setInputValue("");
    }
  };

  return (
    <div className="w-full">
      <ul className="w-full inline-flex	flex-wrap gap-x-2.5 gap-y-4">
        {words.map((tag, index) => (
          <li
            key={index}
            className="py-1.5 pl-3.5 pr-2.5 bg-error-light border border-error-main rounded-lg flex items-center gap-2.5 hover:bg-error-main"
          >
            <p className="tracking-wide">{tag}</p>
            <IconButton
              className="scale-125 p-0 m-0 text-common-white"
              onClick={() => {
                removeTag(index);
              }}
            >
              <CloseIcon />
            </IconButton>
          </li>
        ))}
        <li className="flex items-center bg-grey-800 border border-grey-700 rounded-lg pr-3 overflow-hidden">
          <input
            type="text"
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder="Type Word Here"
            className="outline-none text-sm font-normal text-common-white  bg-grey-800 border border-none placeholder:text-grey-300 w-full px-3 py-2"
          />
          <div className="text-grey-300">
            <EnterIcon />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default CustomInputTag;
