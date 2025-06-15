// utils/htmlParserOptions.ts
import { DOMNode, Element } from "html-react-parser";
import { HTMLReactParserOptions } from "html-react-parser";

export const removeClassElementsParserOptions: HTMLReactParserOptions = {
  replace(domNode: DOMNode) {
    if (
      domNode instanceof Element &&
      domNode.attribs &&
      domNode.attribs.class === "remove"
    ) {
      return null; // Return null instead of <></> to indicate removal
    }
  },
};
