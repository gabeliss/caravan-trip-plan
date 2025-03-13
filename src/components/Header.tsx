"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          {/* <Image
            src="https://caravan-bucket.s3.us-east-2.amazonaws.com/images/header/CaravanTripPlan.png"
            alt="Caravan Trip Plan Logo"
            width={180}
            height={50}
            className="h-10 w-auto"
          /> */}
          Caravan Trip Plan
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link href="/" className="hover:text-secondary-color-light transition-colors">
            Home
          </Link>
          <Link href="/trips" className="hover:text-secondary-color-light transition-colors">
            Trips
          </Link>
          <Link href="/about" className="hover:text-secondary-color-light transition-colors">
            About
          </Link>
          <Button asChild variant="outline" className="bg-accent text-accent-foreground hover:bg-accent/80">
            <Link href="/trips">
              Explore Trips
            </Link>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-primary-foreground"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-primary-dark py-4 px-6 rounded-lg">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className="hover:text-secondary-color-light transition-colors"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              href="/trips"
              className="hover:text-secondary-color-light transition-colors"
              onClick={toggleMenu}
            >
              All Trips
            </Link>
            <div className="space-y-2 pl-4 border-l-2 border-primary-color-light">
              <Link
                href="/trips/northern-michigan"
                className="block hover:text-secondary-color-light transition-colors"
                onClick={toggleMenu}
              >
                Northern Michigan
              </Link>
              <Link
                href="/trips/washington"
                className="block hover:text-secondary-color-light transition-colors"
                onClick={toggleMenu}
              >
                Washington
              </Link>
              <Link
                href="/trips/arizona"
                className="block hover:text-secondary-color-light transition-colors"
                onClick={toggleMenu}
              >
                Arizona
              </Link>
              <Link
                href="/trips/smoky-mountains"
                className="block hover:text-secondary-color-light transition-colors"
                onClick={toggleMenu}
              >
                Smoky Mountains
              </Link>
              <Link
                href="/trips/southern-california"
                className="block hover:text-secondary-color-light transition-colors"
                onClick={toggleMenu}
              >
                Southern California
              </Link>
            </div>
            <Link
              href="/about"
              className="hover:text-secondary-color-light transition-colors"
              onClick={toggleMenu}
            >
              About
            </Link>
            <Button
              asChild
              variant="outline"
              className="bg-accent text-accent-foreground hover:bg-accent/80 w-full"
              onClick={toggleMenu}
            >
              <Link href="/trips">
                Explore Trips
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header; 