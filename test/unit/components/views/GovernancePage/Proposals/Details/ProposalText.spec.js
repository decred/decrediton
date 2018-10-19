import { ProposalText } from "views/GovernancePage/Proposals/Details/helpers";
import { render } from "enzyme";
import fullMarkdown from "data/FullProposalMarkdown";

test("ProposalText renders simple markdown", () => {
  const text = render(
    <ProposalText text={"this is a *test* proposal description"} />
  );

  expect(text.text()).toEqual("this is a test proposal description");
});

test("ProposalText renders paragraphs", () => {
  const text = render(
    <ProposalText text={"First Para\n\nSecond Para"} />
  );

  expect(text.find("p").first().text()).toEqual("First Para");
  expect(text.find("p").last().text()).toEqual("Second Para");
});

test("ProposalText does not render reference images", () => {
  const text = render(
    <ProposalText text={"![Alt text][ref0]\n\n[ref0] url/to/image.jpg"} />
  );

  expect(text.find("img").get()).toHaveLength(0);
});

test("ProposalText does not render inline images", () => {
  const text = render(
    <ProposalText text={"![Alt text](/path/to/img.jpg)"} />
  );

  expect(text.find("img").get()).toHaveLength(0);

  const text2 = render(
    <ProposalText text={"![Alt text](/path/to/img.jpg \"Optional title\")"} />
  );

  expect(text2.find("img").get()).toHaveLength(0);
});

test("ProposalTest renders full markdown", () => {
  const text = render(
    <ProposalText text={fullMarkdown} />
  );

  expect(text.find("img").get()).toHaveLength(0);
});

test("ProposalTest skips html", () => {
  const text = render(
    <ProposalText text={"this <b>html</b> is blocked"} />
  );

  expect(text.html()).toEqual("<p>this html is blocked</p>");
});

test("ProposalTest protects links", () => {
  const text = render(
    <ProposalText text={"[link](http://decred.org)"} />
  );

  expect(text.find("a").attr("href")).toEqual("#");
});
