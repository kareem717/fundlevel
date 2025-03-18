import { ComponentPropsWithoutRef } from "react";
import { Provider } from "react-wrap-balancer";

export type WrapBalancerProps = ComponentPropsWithoutRef<typeof Provider>;

export const WrapBalancer = ({ children, ...props }: WrapBalancerProps) => {
  return <Provider {...props}>{children}</Provider>;
};
