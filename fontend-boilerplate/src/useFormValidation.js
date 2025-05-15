import { useEffect } from 'react';

export default function useFormValidation(formSelector = '.needs-validation') {
  useEffect(() => {
    const forms = document.querySelectorAll(formSelector);
    const submitHandlers = [];

    forms.forEach(form => {
      const handler = event => {
        console.log(form)
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
          const firstInvalid = form.querySelector(':invalid');
          if (firstInvalid) firstInvalid.focus();
        }
        form.classList.add('validate');
      };

      form.addEventListener('submit', handler, false);
      submitHandlers.push({ form, handler });
    });

    // Cleanup
    return () => {
      submitHandlers.forEach(({ form, handler }) => {
        form.removeEventListener('submit', handler);
      });
    };
  }, [formSelector]);
}
