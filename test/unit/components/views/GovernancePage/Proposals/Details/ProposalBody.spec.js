import { ProposalBody } from "views/ProposalDetailsPage/helpers";
import { render } from "enzyme";
import fullMarkdown from "data/FullProposalMarkdown";

test("ProposalBody renders simple markdown", () => {
  const body = render(
    <ProposalBody body={"this is a *test* proposal description"} />
  );

  expect(body.text()).toEqual("this is a test proposal description");
});

test("ProposalBody renders paragraphs", () => {
  const body = render(<ProposalBody body={"First Para\n\nSecond Para"} />);

  expect(body.find("p").first().text()).toEqual("First Para");
  expect(body.find("p").last().text()).toEqual("Second Para");
});

test("ProposalBody does not render reference images", () => {
  const body = render(
    <ProposalBody body={"![Alt text][ref0]\n\n[ref0] url/to/image.jpg"} />
  );

  expect(body.find("img").get()).toHaveLength(0);
});

test("ProposalBody does not render inline images", () => {
  const body = render(<ProposalBody body={"![Alt text](/path/to/img.jpg)"} />);

  expect(body.find("img").get()).toHaveLength(0);

  const body2 = render(
    <ProposalBody body={'![Alt text](/path/to/img.jpg "Optional title")'} />
  );

  expect(body2.find("img").get()).toHaveLength(0);
});

test("ProposalBody renders full markdown", () => {
  const body = render(<ProposalBody body={fullMarkdown} />);

  expect(body.find("img").get()).toHaveLength(0);
});

test("ProposalBody skips html", () => {
  const body = render(<ProposalBody body={"this <b>html</b> is blocked"} />);

  expect(body.html()).toEqual("<p>this html is blocked</p>");
});

test("ProposalBody protects links", () => {
  const body = render(<ProposalBody body={"[link](http://decred.org)"} />);

  expect(body.find("a").attr("href")).toEqual("#");
});
