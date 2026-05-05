# focus-trap-lite

> Lightweight zero-dependency focus trap library for accessible modals and dialogs

## Installation

```bash
npm install focus-trap-lite
```

## Usage

```typescript
import { createFocusTrap } from 'focus-trap-lite';

const modal = document.getElementById('my-modal');

const trap = createFocusTrap(modal, {
  onActivate: () => modal.classList.add('is-active'),
  onDeactivate: () => modal.classList.remove('is-active'),
});

// Activate the trap when the modal opens
trap.activate();

// Deactivate when the modal closes
trap.deactivate();
```

### Options

| Option         | Type       | Description                                      |
|----------------|------------|--------------------------------------------------|
| `onActivate`   | `function` | Called when the focus trap is activated          |
| `onDeactivate` | `function` | Called when the focus trap is deactivated        |
| `initialFocus` | `string`   | Selector for the element to focus on activation  |
| `returnFocus`  | `boolean`  | Return focus to the trigger element on deactivate (default: `true`) |

## Why focus-trap-lite?

- ✅ Zero dependencies
- ✅ Fully typed TypeScript API
- ✅ Tiny bundle size (~1kb gzipped)
- ✅ WAI-ARIA compliant
- ✅ Works with any framework or vanilla JS

## License

[MIT](./LICENSE)