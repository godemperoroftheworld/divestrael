# Divestrael

This is a full-stack application that aims to be a BDS tool for boycotting companies complicit in the genocide in Palestine.

The list is based off of the BDS movement itself, the UN OHCHR report, Whoprofits.org, and the AFSC reports.

The deployed application can be accessed at https://divestrael.vercel.app

Currently it supports:
- [x] taking a picture of a product to see if the company that owns it is boycotted
- [x] searching through previously scanned products / brands / companies to see if they're boycotted
- [ ] detailed product information from the scan
- [ ] updating / fixing incorrect product information

 ## Tech Stack

 The backend is in Node.JS, TypeScript using Fastify and Prisma.
 The frontend is Next.JS, TypeScript with Tanstack Query

 The backend uses OpenRouter to get product/company information, CorpWatch's API for some more company information.
 The frontend uses logo.dev for the company logos
