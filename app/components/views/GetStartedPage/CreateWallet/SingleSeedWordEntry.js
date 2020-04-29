import Select from "react-select";
import { SEED_WORDS } from "wallet/seed";
import { clipboard } from "electron";

const SEED_WORD_OPTIONS = SEED_WORDS.map((name) => ({ name }));

@autobind
class SingleSeedWordEntry extends React.Component {
  constructor(props) {
    super(props);
    this.getSeedWords = this.getSeedWords.bind(this);
    document.onmousedown = (e) => {
      if (e.which === 2) {
        e.preventDefault();

        const isPasted = this.props.onPasteFromClipboard(clipboard.readText());

        // missing with the select options from react-select
        if (isPasted) {
          const select = document.querySelector(".Select-menu-outer");
          if (select) {
            select.style.display = "none";
          }
        }
      }
    };
  }

  render() {
    const value = { name: this.props.value.name };
    return (
      <div
        className={this.props.className}
        onKeyDown={this.handleKeyDown}
        onPaste={this.props.onPaste}>
        <Select.Async
          autoFocus
          simpleValue
          disabled={this.props.disabled}
          clearable={false}
          multi={false}
          filterOptions={false}
          value={value}
          onChange={(value) => this.props.onChange(this.props.seedWord, value)}
          valueKey="name"
          labelKey="name"
          loadOptions={this.getSeedWords}
          onInputKeyDown={this.selectKeyDown}
        />
      </div>
    );
  }

  getSeedWords(input, callback) {
    input = input.toLowerCase();
    const options = SEED_WORD_OPTIONS.filter(
      (i) => i.name.toLowerCase().substr(0, input.length) === input
    );
    callback(null, {
      options: options.slice(0, 5)
    });
  }

  selectKeyDown(e) {
    switch (e.keyCode) {
      case 32:
        e.keyCode = 9;
        break;
    }
  }
}

export default SingleSeedWordEntry;
