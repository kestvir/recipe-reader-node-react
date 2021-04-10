import React, { useRef, useState, useEffect } from "react";
import { EditorState } from "draft-js";
import { Editor } from "@nick4fake/react-draft-wysiwyg";
import ErorrMessage from "../../UI/ErrorMessage";

interface IngredientOrInstructionRichTextFieldProps {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
  label: string;
  errorMessage: string;
  displayErrors: boolean;
}

const IngredientOrInstructionRichTextField: React.FC<IngredientOrInstructionRichTextFieldProps> = ({
  editorState,
  setEditorState,
  label,
  displayErrors,
  errorMessage,
}) => {
  const [displayEditor, setDisplayEditor] = useState(
    label === "Instructions" ? false : true
  );
  const [hideErrorStyles, setHideErrorStyles] = useState(true);

  const editor = useRef<null | Editor>(null);

  let hidePlaceholderClassName;

  useEffect(() => {
    setHideErrorStyles(!displayErrors);
  }, [displayErrors]);

  const contentState = editorState.getCurrentContent();
  if (!contentState.hasText()) {
    if (contentState.getBlockMap().first().getType() !== "unstyled") {
      hidePlaceholderClassName = "RichEditor-hidePlaceholder";
    }
  }

  const handleEditorStateChange = (newEditorState: EditorState) => {
    setHideErrorStyles(true);
    setEditorState(newEditorState);
  };

  return (
    <div className="field text-editor-field">
      <div className="level">
        <div className="level-left">
          <label className="label">{label}</label>
        </div>
        <div className="level-right">
          <button
            type="button"
            className="button"
            onClick={() => setDisplayEditor((prevState) => !prevState)}
          >
            {displayEditor ? "hide" : "show"}
          </button>
        </div>
      </div>
      <div className="control">
        {displayEditor && (
          <div className={hidePlaceholderClassName}>
            <Editor
              toolbar={{
                options: [
                  "inline",
                  "blockType",
                  "fontSize",
                  "list",
                  "textAlign",
                  "colorPicker",
                  "link",
                  "emoji",
                  "history",
                ],
              }}
              ref={editor}
              editorState={editorState}
              onEditorStateChange={handleEditorStateChange}
              editorClassName={`editor ${
                !!errorMessage && !hideErrorStyles ? "is-danger" : ""
              }`}
              wrapperClassName="editor-wrapper"
              toolbarClassName={`editor-toolbar ${
                !!errorMessage && !hideErrorStyles ? "is-danger" : ""
              } `}
              placeholder="Write something!"
            />
          </div>
        )}
      </div>
      <ErorrMessage message={errorMessage} hideErrorMessage={hideErrorStyles} />
    </div>
  );
};

export default IngredientOrInstructionRichTextField;
