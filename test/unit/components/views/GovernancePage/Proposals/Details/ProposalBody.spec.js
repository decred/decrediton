import { ProposalBody } from "views/ProposalDetailsPage/helpers";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/react";
import fullMarkdown from "data/FullProposalMarkdown";

test("ProposalBody renders simple markdown", () => {
  const body = render(
    <ProposalBody body={"this is a *test* proposal description"} />
  );

  expect(body.container).toMatchSnapshot();
});

test("ProposalBody renders paragraphs", () => {
  render(<ProposalBody body={"First Para\n\nSecond Para"} />);
  expect(screen.getByText("First Para")).toBeInTheDocument();
  expect(screen.getByText("Second Para")).toBeInTheDocument();
});

test("ProposalBody does not render reference images", () => {
  const body = render(
    <ProposalBody body={"![Alt text][ref0]\n\n[ref0] url/to/image.jpg"} />
  );

  expect(body.container.querySelector("img")).toBeNull();
});

test("ProposalBody does not render inline images", () => {
  const body = render(<ProposalBody body={"![Alt text](/path/to/img.jpg)"} />);

  expect(body.container.querySelector("img")).toBeNull();

  const body2 = render(
    <ProposalBody body={'![Alt text](/path/to/img.jpg "Optional title")'} />
  );

  expect(body2.container.querySelector("img")).toBeNull();
});

test("ProposalBody renders full markdown", () => {
  const body = render(<ProposalBody body={fullMarkdown} />);

  expect(body.container).toMatchSnapshot();
});

test("ProposalBody skips html", () => {
  const body = render(<ProposalBody body={"this <b>html</b> is blocked"} />);

  expect(body.container).toMatchSnapshot();
});

test("ProposalBody protects links", () => {
  const body = render(<ProposalBody body={"[link](http://decred.org)"} />);

  expect(body.container.querySelector("a").getAttribute("href")).toEqual("#");
});
