declare module "@nick4fake/react-draft-wysiwyg" {
  import * as React from "react";
  import * as Draft from "draft-js";

  export type SyntheticKeyboardEvent = React.KeyboardEvent<{}>;
  export type SyntheticEvent = React.SyntheticEvent<{}>;
  export type RawDraftContentState = Draft.RawDraftContentState;

  export class EditorState extends Draft.EditorState {}
  export class ContentState extends Draft.ContentState {}
  export class ContentBlock extends Draft.ContentBlock {}
  export class SelectionState extends Draft.SelectionState {}

  export interface EditorProps {
    webDriverTestID?: string;
    onChange?(contentState: RawDraftContentState): void;
    onEditorStateChange?(editorState: EditorState): void;
    onContentStateChange?(contentState: RawDraftContentState): void;
    initialContentState?: RawDraftContentState;
    defaultContentState?: RawDraftContentState;
    contentState?: RawDraftContentState;
    editorState?: EditorState;
    defaultEditorState?: EditorState;
    toolbarOnFocus?: boolean;
    spellCheck?: boolean;
    stripPastedStyles?: boolean;
    toolbar?: object;
    toolbarCustomButtons?: Array<React.ReactElement<HTMLElement>>;
    toolbarClassName?: string;
    toolbarHidden?: boolean;
    locale?: string;
    localization?: object;
    editorClassName?: string;
    wrapperClassName?: string;
    toolbarStyle?: object;
    editorStyle?: React.CSSProperties;
    wrapperStyle?: React.CSSProperties;
    uploadCallback?(file: object): Promise<object>;
    onFocus?(event: SyntheticEvent): void;
    onBlur?(event: SyntheticEvent): void;
    onTab?(event: SyntheticKeyboardEvent): void;
    mention?: object;
    hashtag?: object;
    textAlignment?: string;
    readOnly?: boolean;
    tabIndex?: number;
    placeholder?: string;
    ariaLabel?: string;
    ariaOwneeID?: string;
    ariaActiveDescendantID?: string;
    ariaAutoComplete?: string;
    ariaDescribedBy?: string;
    ariaExpanded?: string;
    ariaHasPopup?: string;
    customBlockRenderFunc?(block: ContentBlock): any;
    wrapperId?: number;
    customDecorators?: object[];
    editorRef?(ref: object): void;
    handlePastedText?(
      text: string,
      html: string,
      editorState: EditorState,
      onChange: (editorState: EditorState) => void
    ): boolean;
    customStyleMap?: object;
  }

  export class Editor extends React.Component<EditorProps> {
    constructor(props: Readonly<EditorProps>);
    focusEditor(): void;
  }
}
