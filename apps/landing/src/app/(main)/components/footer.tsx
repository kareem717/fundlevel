import { LogoDiv } from "@/components/logo-div";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, createElement, FC } from "react";
import { Icons } from "@/components/icons";
import { contact } from "@/lib/config";

export const Footer: FC<ComponentPropsWithoutRef<"footer">> = ({ className, ...props }) => {
  return (
    <footer className={cn("container mt-12", className)} {...props}>
      <div className="flex flex-row justify-between items-center">
        <LogoDiv />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <p>For inquiries or support, reach out to our team.</p>
          <Link
            href="/contact"
            className="text-blue-400 hover:underline mt-2 inline-block"
          >
            Get in touch
          </Link>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Resources</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/blog" className="hover:underline">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/guides" className="hover:underline">
                Investment Guides
              </Link>
            </li>
            <li>
              <Link href="/learn" className="hover:underline">
                Learn about Blockchain & AI
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Legal</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/legal" className="hover:underline">
                Learn more
              </Link>
            </li>
            <li>
              <Link href="/legal" className="hover:underline">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/legal" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t flex flex-col sm:flex-row justify-between items-center py-6 w-full">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} FundLevel. All rights reserved.
        </div>
        <div className="flex space-x-4 mt-4 md:mt-0">
          {contact.socials.map((social, index) => (
            <Link
              key={index}
              href={social.link}
              className="text-muted-foreground hover:text-black"
            >
              {createElement(Icons[social.icon], { className: "h-5 w-5" })}
              <span className="sr-only">{social.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
