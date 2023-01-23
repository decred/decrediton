import { VerticalAccordion } from "shared";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";

const testHeader = "test-header";
const testContentText = "test-content-test";
const TestContent = () => <>{testContentText}</>;
const testClassName = "test-classname";
const testHeaderClassName = "test-header-classname";
const testArrowClassName = "test-arrow-classname";
const TestVerticalAccordionContainer = ({ disabled = false }) => {
  const [show, setShow] = React.useState(false);
  return (
    <VerticalAccordion
      disabled={disabled}
      header={testHeader}
      className={testClassName}
      headerClassName={testHeaderClassName}
      arrowClassName={testArrowClassName}
      show={show}
      onToggleAccordion={() => setShow((e) => !e)}>
      <TestContent />
    </VerticalAccordion>
  );
};

test("toggle vertical accordion", async () => {
  render(<TestVerticalAccordionContainer />);

  expect(screen.queryByText(testContentText)).not.toBeInTheDocument();
  const header = screen.getByText(testHeader);
  user.click(header);

  // check additional classNames from props
  expect(header.className).toMatch(testHeaderClassName);
  expect(header.firstElementChild.className).toMatch(testArrowClassName);
  expect(header.parentElement.className).toMatch(testClassName);

  await waitFor(() => screen.getByText(testContentText));
  user.click(screen.getByText(testHeader));
  await waitFor(() =>
    expect(screen.queryByText(testContentText)).not.toBeInTheDocument()
  );
});

test("try toggling disabled vertical accordion", async () => {
  render(<TestVerticalAccordionContainer disabled={true} />);

  expect(screen.queryByText(testContentText)).not.toBeInTheDocument();
  user.click(screen.getByText(testHeader));
  await waitFor(() =>
    expect(screen.queryByText(testContentText)).not.toBeInTheDocument()
  );
});
