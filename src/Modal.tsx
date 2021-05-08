import { Dialog } from '@headlessui/react';
import cn from 'classnames';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ open, onClose, children }: ModalProps) => (
  <Dialog
    as="div"
    className="fixed inset-0 z-10 overflow-y-auto"
    open={open}
    onClose={onClose}
  >
    <div className="min-h-screen px-4 text-center">
      <Dialog.Overlay className="fixed inset-0 bg-opacity-30 bg-black" />

      {/* This element is to trick the browser into centering the modal contents. */}
      <span className="inline-block h-screen align-middle" aria-hidden="true">
        &#8203;
      </span>

      <div
        className={cn([
          'inline-block',
          'w-full',
          'max-w-md',
          'p-6',
          'my-8',
          'overflow-hidden',
          'text-left',
          'transition-all',
          'transform',
          'bg-neutral-4',
          'shadow-xl',
          'rounded-2xl'
        ])}
      >
        <Dialog.Title className="font-medium">Settings</Dialog.Title>
        <div className="mt-2">{children}</div>

        <div className="mt-4">
          <button
            type="button"
            className={cn(['text-blue-1', 'float-right', 'font-medium'])}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </Dialog>
);
