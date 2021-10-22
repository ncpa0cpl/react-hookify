import React from "react";
import { shallowCompare } from "./shallow-compare";
import { Inverse } from "./ts-utils";

export type UseComponentInterface<P, InitP> = {
  setProps(props: Partial<Partial<P>>): void;
  Component: React.FC<Inverse<InitP & Inverse<P>>>;
};

export const useComponent = <
  P extends Record<string, unknown>,
  InitP extends Partial<P>
>(
  Component: React.ComponentType<P>,
  initialProps: InitP
): UseComponentInterface<P, InitP> => {
  const componentProps = React.useRef(initialProps);
  const rerenderComponent = React.useRef<Set<Function>>(new Set());

  const [ComponentWrapper] = React.useState(
    (): React.FC<Inverse<InitP & Inverse<P>>> =>
      ({ children, ...rest }) => {
        const [_, rerender] = React.useReducer(
          (v: number) => v + 1,
          Number.MIN_VALUE
        );

        const lastProps = { ...componentProps.current };

        React.useEffect(() => {
          rerenderComponent.current.add(rerender);

          if (!shallowCompare(lastProps, componentProps.current)) {
            rerender();
          }

          () => {
            rerenderComponent.current.delete(rerender);
          };
        }, []);

        // @ts-expect-error
        return <Component {...Object.assign(lastProps, rest)}>{children}</Component>;
      }
  );

  const setProps = React.useCallback((props: Partial<P>) => {
    Object.assign(componentProps.current, props);
    rerenderComponent.current.forEach((rerender) => rerender());
  }, []);

  return {
    Component: ComponentWrapper,
    setProps,
  };
};
