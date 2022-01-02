import { Select as PiUiSelect } from "pi-ui";

const Select = ({ styles, selectWithBigFont, ariaLabelledBy, ...props }) => {
  const customStyles = {
    valueContainer: () => ({
      padding: `0 0 0 ${selectWithBigFont ? 0 : "0.5rem"}`
    }),
    placeholder: (provided) => ({
      margin: 0,
      color: "var(--grey-5)",
      fontSize: selectWithBigFont ? "1.6rem" : provided.fontSize,
      lineHeight: selectWithBigFont ? "2.1rem" : provided.lineHeight
    }),
    control: (_, state) => ({
      borderBottomColor: "var(--select-stroke-color)",
      borderRadius: "none",
      borderLeft: "none",
      borderRight: "none",
      borderTop: "none",
      minHeight: "initial",
      "&:hover": {
        borderBottomColor: "var(--accent-blue)"
      },
      backgroundColor: state.isDisabled
        ? "var(--disabled-background-color)"
        : "transparent"
    }),
    container: () => ({
      padding: 0
    }),
    singleValue: (provided) => ({
      margin: 0,
      fontSize: selectWithBigFont ? "1.6rem" : provided.fontSize,
      lineHeight: selectWithBigFont ? "2.1rem" : provided.lineHeight,
      color: "var(--main-dark-blue)"
    }),
    option: (_, state) => ({
      color: "var(--main-dark-blue)",
      backgroundColor: state.isFocused
        ? "var(--background-hovered)"
        : "var(--card-background)"
    }),
    menu: () => ({
      marginTop: 0
    }),
    dropdownIndicator: () => ({
      paddingRight: 0
    }),
    input: () => ({
      paddingTop: 0,
      paddingBottom: 0,
      marginTop: 0,
      marginBottom: 0
    }),
    ...styles
  };

  return (
    <PiUiSelect
      styles={customStyles}
      maxMenuHeight={200}
      aria-labelledby={ariaLabelledBy}
      {...props}
    />
  );
};

Select.propTypes = {
  styles: PropTypes.object,
  selectWithBigFont: PropTypes.bool,
  ariaLabelledBy: PropTypes.string
};

export default Select;
