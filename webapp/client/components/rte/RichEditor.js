import React from 'react';
import {Editor, EditorState, RichUtils, getDefaultKeyBinding} from 'draft-js';
import CodeUtils from 'draft-js-code';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Popover from 'material-ui/Popover';
import IconButton from 'material-ui/IconButton';
import StyleButton from './StyleButton';

export default class RichEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showURLInput: false,
      urlValue: ''
    };

    this.focus = () => this.refs.editor.focus();

    this.keyBindingFn = (e) => this._keyBindingFn(e);
    this.handleReturn = (e) => this._handleReturn(e);
    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.onTab = (e) => this._onTab(e);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);

    this.promptForLink = this._promptForLink.bind(this);
    this.confirmLink = this._confirmLink.bind(this);
    this.onLinkInputKeyDown = this._onLinkInputKeyDown.bind(this);
    this.removeLink = this._removeLink.bind(this);
  }

  get styles() {
    return {
      linkPopup: {
        fontSize: 14,
        display: 'table-cell',
        verticalAlign: 'middle'
      }
    }
  }

  _promptForLink(e) {
    e.preventDefault();
    const {editorState} = this.props;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent();
      const startKey = editorState.getSelection().getStartKey();
      const startOffset = editorState.getSelection().getStartOffset();
      const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
      const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

      let url = '';
      if (linkKey) {
        const linkInstance = contentState.getEntity(linkKey);
        url = linkInstance.getData().url;
      }

      this.setState({
        showURLInput: true,
        urlValue: url,
        anchorEl: e.currentTarget
      });
    } else {
      this.setState({
        ...this.state,
        showURLInput: false
      })
    }
  }

  _confirmLink(e) {
    e.preventDefault();
    const {editorState} = this.props;
    const {urlValue} = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      {url: urlValue}
    );

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {currentContent: contentStateWithEntity});
    this.props.onChange(RichUtils.toggleLink(
      newEditorState,
      newEditorState.getSelection(),
      entityKey
    ));

    this.setState({
      showURLInput: false,
      urlValue: '',
    });
  }

  _onLinkInputKeyDown(e) {
    if (e.which === 13) {
      this._confirmLink(e);
    }
  }

  _removeLink(e) {
    e.preventDefault();
    const {editorState} = this.props;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      this.props.onChange(RichUtils.toggleLink(editorState, selection, null));
    }
  }

  _keyBindingFn(e) {
    const {editorState} = this.props;
    let command;

    if (CodeUtils.hasSelectionInBlock(editorState)) {
      command = CodeUtils.getKeyBinding(e);
    }
    if (command) {
      return command;
    }

    return getDefaultKeyBinding(e);
  }

  _handleKeyCommand(command) {
    const {editorState} = this.props;
    let newState;
    if (CodeUtils.hasSelectionInBlock(editorState)) {
      newState = CodeUtils.handleKeyCommand(editorState, command)
    }

    if (!newState) {
      newState = RichUtils.handleKeyCommand(editorState, command);
    }

    if (newState) {
      this.props.onChange(newState);
      return true;
    }
    return false;
  }

  _handleReturn(e) {
    const {editorState} = this.props;

    if (!CodeUtils.hasSelectionInBlock(editorState)) {
      return;
    }

    this.props.onChange(
      CodeUtils.handleReturn(e, editorState)
    );

    return true;
  }

  _onTab(e) {
    const {editorState} = this.props;

    if (!CodeUtils.hasSelectionInBlock(editorState)) {
      return;
    }

    this.props.onChange(
      CodeUtils.handleTab(e, editorState)
    );
  }

  _toggleBlockType(blockType) {
    this.props.onChange(
      RichUtils.toggleBlockType(
        this.props.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.props.onChange(
      RichUtils.toggleInlineStyle(
        this.props.editorState,
        inlineStyle
      )
    );
  }

  render() {
    const {editorState} = this.props;

    let className = 'RichEditor-editor';
    let contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    const BLOCK_TYPES = [
      {label: 'format_quote', style: 'blockquote', icon: true},
      {label: 'format_list_bulleted', style: 'unordered-list-item', icon: true},
      {label: 'format_list_numbered', style: 'ordered-list-item', icon: true},
      {label: 'Code Block', style: 'code-block', icon: false},
    ];

    const BlockStyleControls = (props) => {
      const {editorState} = props;
      const selection = editorState.getSelection();
      const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

      return (
        <div className="RichEditor-controls RichEditor-divider" style={{marginLeft: 15}}>
          {BLOCK_TYPES.map((type) =>
            <StyleButton
              key={type.label}
              active={type.style === blockType}
              label={type.label}
              onToggle={props.onToggle}
              style={type.style}
              icon={type.icon}
            />
          )}
        </div>
      );
    };

    const INLINE_STYLES = [
      {label: 'format_bold', style: 'BOLD', icon: true},
      {label: 'format_italic', style: 'ITALIC', icon: true},
      {label: 'code', style: 'CODE', icon: true},
    ];

    const InlineStyleControls = (props) => {
      const currentStyle = props.editorState.getCurrentInlineStyle();
      return (
        <div className="RichEditor-controls RichEditor-divider">
          {INLINE_STYLES.map((type) =>
            <StyleButton
              key={type.label}
              active={currentStyle.has(type.style)}
              label={type.label}
              onToggle={props.onToggle}
              style={type.style}
              icon={type.icon}
            />
          )}
        </div>
      );
    };

    // Custom overrides for "code" style.
    const styleMap = {
      CODE: {
        backgroundColor: 'rgba(243, 243, 243, 1)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 14,
        padding: 2,
      },
    };

    function getBlockStyle(block) {
      switch (block.getType()) {
        case 'blockquote':
          return 'RichEditor-blockquote';
        default:
          return null;
      }
    }

    return (
      <div className="RichEditor-root">
        <div style={{display: 'table'}}>
          <div style={{display: 'table-row'}}>
            <InlineStyleControls
              editorState={editorState}
              onToggle={this.toggleInlineStyle}
            />
            <BlockStyleControls
              editorState={editorState}
              onToggle={this.toggleBlockType}
            />
            <div className="RichEditor-controls" style={{marginLeft: 15}}>
              <div className="RichEditor-styleButton" onTouchTap={this.promptForLink}>
                <IconButton
                  style={{padding: 0, width: 28, height: 28}}
                  iconStyle={this.state.showURLInput ? {color: '#5890ff'} : {color: '#707070'}}
                  tabIndex={-1}>
                  <i className="material-icons">insert_link</i>
                </IconButton>
                <Popover
                  open={this.state.showURLInput}
                  anchorEl={this.state.anchorEl}
                  anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                  targetOrigin={{horizontal: 'left', vertical: 'top'}}
                  onRequestClose={() => {
                    this.setState({showURLInput: false})
                  }}
                >
                  <div style={{padding: 12, display: 'table'}}>
                    <div style={{display: 'table-row'}}>
                      <TextField
                        onChange={(e) => this.setState({urlValue: e.target.value})}
                        value={this.state.urlValue}
                        style={this.styles.linkPopup}
                        onKeyDown={this.onLinkInputKeyDown}
                        hintText="http://www.example.com"
                        autoFocus/>
                      <FlatButton
                        onMouseDown={() => this.setState({urlValue: '', showURLInput: false})}
                        style={this.styles.linkPopup}
                        label="Close"
                        secondary={true}/>
                      <FlatButton
                        onMouseDown={this.confirmLink}
                        style={this.styles.linkPopup}
                        label="Confirm"
                        primary={true}/>
                    </div>
                  </div>
                </Popover>
              </div>
            </div>
          </div>
        </div>
        <div className={className} onClick={this.focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            keyBindingFn={this.keyBindingFn}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.props.onChange}
            handleReturn={this.handleReturn}
            onTab={this.onTab}
            ref="editor"
            spellCheck={true}
          />
        </div>
      </div>
    );
  }
}
