import { LogoDiv } from "@/components/logo-div";
import { Facebook, Twitter, Linkedin, Github } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="container mt-12">
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
          <Link href="#" className="text-muted-foreground hover:text-black">
            <Facebook className="h-5 w-5" />
            <span className="sr-only">Facebook</span>
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-black">
            <Twitter className="h-5 w-5" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-black">
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-black">
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
