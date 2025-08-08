### Engineering principles for this workspace

- **Order of precedence**: Modular, reusable code MUST take precedence over the Minimal Change Principle. When these are in tension, choose modularity and reuse, even if it requires a larger edit.
- **Minimal change (secondary)**: After the modular/reusable design is satisfied, keep the implementation as small and simple as possible to meet the current requirement.

- **Incremental iteration**: Implement changes in small, testable steps.
- **Change validation**: Ensure each edit directly addresses the stated requirement; avoid refactors unless they are necessary to achieve modularity/reuse for the current goal.
- **Testing strategy**: Write tests for the specific functionality being added in this iteration; avoid testing future features.


