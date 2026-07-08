# Component Standards

## Principles
- Keep components focused and small.
- Move business logic to hooks and services.
- Keep route pages declarative and orchestration-only.
- Use typed props and avoid `any`.

## Naming
- Components: PascalCase exports.
- Hooks: `useX` naming.
- Services: verb-driven (`getEmployees`, `softDeleteEmployees`).
- Schemas: `xSchema` with `z.infer` exported type.

## Styling
- Use shared design tokens and utility classes.
- Reuse UI primitives (`Button`, `Card`) before adding custom one-offs.
- Ensure responsive behavior from mobile to desktop.

## Accessibility
- Inputs, buttons, and controls must provide semantic labels.
- Ensure keyboard accessibility and visible focus behavior.
- Preserve contrast between background and text in both themes.
