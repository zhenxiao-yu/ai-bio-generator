# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| Latest on `main` | Yes |
| Older tagged releases | Best effort |

## Reporting a Vulnerability

Please do **not** open a public GitHub issue for security vulnerabilities.

Report vulnerabilities privately by email to **markyu0615@gmail.com** with:
- a description of the issue and impact
- reproduction steps or proof of concept
- any suggested remediation if available

You should receive an acknowledgement within 72 hours for valid reports.

## Scope

This app handles public user input and third-party AI providers. The most relevant areas are:
- prompt or output injection that breaks expected behavior
- accidental secret exposure through logs, env handling, or client bundles
- unsafe handling of user-generated content, links, or shared bio pages
- dependency vulnerabilities in the Next.js and AI SDK stack

## Out of Scope

- issues in third-party provider infrastructure itself
- rate limits or outages entirely caused by external providers
- vulnerabilities that require access to your local machine or deployment account

## Disclosure Guidance

Please allow time for investigation and remediation before public disclosure. Confirmed fixes should be reflected in release notes and the changelog when appropriate.
