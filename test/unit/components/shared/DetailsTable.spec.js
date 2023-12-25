import { DetailsTable } from "shared";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen } from "@testing-library/react";

const mockData = [
  {
    label: "label-0",
    value: "value-0"
  },
  {
    label: "label-1",
    value: <div>value-1</div>
  },
  {
    label: "label-for-secondary-grid-0",
    value: [
      {
        label: "label-sec-0",
        value: "value-sec-0"
      },
      {
        label: "label-sec-1",
        value: "value-sec-1"
      }
    ]
  },
  {
    label: "label-for-secondary-grid-1",
    value: [
      {
        label: "label-sec-11",
        value: "value-sec-11"
      },
      {
        label: "label-for-secondary-grid-12",
        value: [
          {
            label: "label-sec-121",
            value: "value-sec-121"
          },
          {
            label: "label-sec-122",
            value: "value-sec-122"
          }
        ]
      }
    ]
  }
];
const mockTitle = "mock-title";
const mockClassName = "mock-classname";
const mockHeaderClassName = "mock-header-classname";

test("check non-expandable table", async () => {
  render(
    <DetailsTable
      data={mockData}
      title={mockTitle}
      className={mockClassName}
      headerClassName={mockHeaderClassName}
    />
  );
  const title = screen.getByText(mockTitle);
  expect(title.className).toMatch(mockHeaderClassName);
  expect(title.parentNode.className).toMatch(mockClassName);
  expect(screen.getByText(`${mockData[0].label}:`)).toBeInTheDocument();
  await user.click(title);
  expect(screen.getByText(`${mockData[0].label}:`)).toBeInTheDocument();
});

test("check expandable table", async () => {
  render(<DetailsTable data={mockData} title={mockTitle} expandable />);
  const title = screen.getByText(mockTitle);

  expect(screen.queryByText(`${mockData[0].label}:`)).not.toBeInTheDocument();

  //open details
  await user.click(title);
  expect(screen.getByText(`${mockData[0].label}:`)).toBeInTheDocument();
  expect(screen.getByText(`${mockData[1].label}:`)).toBeInTheDocument();
  expect(screen.getByText(mockData[0].value)).toBeInTheDocument();
  expect(screen.getByText("value-1")).toBeInTheDocument();

  // secondary grid

  expect(screen.getByText(`${mockData[2].label}:`)).toBeInTheDocument();
  expect(
    screen.getByText(`${mockData[2].value[0].label}:`)
  ).toBeInTheDocument();
  expect(
    screen.getByText(`${mockData[2].value[1].label}:`)
  ).toBeInTheDocument();
  expect(screen.getByText(mockData[2].value[0].value)).toBeInTheDocument();
  expect(screen.getByText(mockData[2].value[1].value)).toBeInTheDocument();

  // secondary grid in a secondary grid
  expect(screen.getByText(`${mockData[3].label}:`)).toBeInTheDocument();
  expect(
    screen.getByText(`${mockData[3].value[0].label}:`)
  ).toBeInTheDocument();
  expect(
    screen.getByText(`${mockData[3].value[1].label}:`)
  ).toBeInTheDocument();
  expect(
    screen.getByText(mockData[3].value[1].value[0].value)
  ).toBeInTheDocument();
  expect(
    screen.getByText(mockData[3].value[1].value[1].value)
  ).toBeInTheDocument();

  //close details
  await user.click(title);
  expect(screen.queryByText(`${mockData[0].label}:`)).not.toBeInTheDocument();
});
