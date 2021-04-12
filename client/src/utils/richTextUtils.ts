import { EditorState, convertFromRaw } from "draft-js";

export const convertRichTextDataFromStrToEditorState = (str: string) => {
  return EditorState.createWithContent(convertFromRaw(JSON.parse(str)));
};
