/** Loads the Razorpay Checkout script on demand (once). */
let promise = null;

export function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(true);
  if (promise) return promise;
  promise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Could not load the payment gateway. Check your connection.'));
    document.body.appendChild(script);
  });
  return promise;
}
