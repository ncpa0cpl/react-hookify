import { renderHook } from "@testing-library/react-hooks";
import { act, render } from "@testing-library/react";
import { useComponent } from "../src/use-component";
import React from "react";

type TestComponentProps = {
  prop1: string;
  prop2: string;
  prop3: string;
};

const TestComponent: React.FC<TestComponentProps> = (props) => {
  return (
    <div>
      <p data-testid={"prop1"}>{props.prop1}</p>
      <p data-testid={"prop2"}>{props.prop2}</p>
      <p data-testid={"prop3"}>{props.prop3}</p>
    </div>
  );
};

describe("useComponent", () => {
  it("should correctly pass initial props", async () => {
    const {
      result: {
        current: { Component, setProps },
      },
    } = renderHook(() => useComponent(TestComponent, { prop1: "p1", prop2: "p2" }));

    const rendered = render(<Component prop3="p3" />);

    const prop1 = await rendered.findAllByTestId("prop1");
    const prop2 = await rendered.findAllByTestId("prop2");
    const prop3 = await rendered.findAllByTestId("prop3");

    expect(prop1[0].textContent).toEqual("p1");
    expect(prop2[0].textContent).toEqual("p2");
    expect(prop3[0].textContent).toEqual("p3");
  });

  it("should correctly update the component with the props via `setProps`", async () => {
    const {
      result: {
        current: { Component, setProps },
      },
    } = renderHook(() =>
      useComponent(TestComponent, { prop1: "p1", prop2: "p2", prop3: "p3" })
    );

    const rendered = render(<Component />);

    let prop1 = await rendered.findAllByTestId("prop1");

    expect(prop1[0].textContent).toEqual("p1");

    act(() => {
      setProps({ prop1: "Hello World!" });
    });

    prop1 = await rendered.findAllByTestId("prop1");

    expect(prop1[0].textContent).toEqual("Hello World!");
  });

  it("props passed to the JSX element should take priority over the props set by the hook", async () => {
    const {
      result: {
        current: { Component, setProps },
      },
    } = renderHook(() =>
      useComponent(TestComponent, { prop1: "p1", prop2: "p2", prop3: "p3" })
    );

    const rendered = render(<Component prop1="foo" prop2="bar" />);

    act(() => {
      setProps({ prop1: "Hello World!" });
    });

    const prop1 = await rendered.findAllByTestId("prop1");
    const prop2 = await rendered.findAllByTestId("prop2");

    expect(prop1[0].textContent).toEqual("foo");
    expect(prop2[0].textContent).toEqual("bar");
  });
});
