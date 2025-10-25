export const LoginView = () => {
    const el = document.createElement('div');
    el.innerHTML = /*html*/ `
		
			<div class="mb-6 ">
			<h2 class="mt-10 text-2xl/9 font-bold tracking-tight mb-6">Sign in to your account</h2>
			<form id="login-form" class="flex flex-col gap-4">
				<label for="email" class="block text-sm/6 font-medium text-gray-900">Email</label>
				<input type="email" id="email" name="email" required class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"  />
				<button type="submit" class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Login</button>
			</form>
			 <p class="mt-10 text-center text-sm/6 text-gray-400">
				Don't have an account?
      			<a href="#" class="font-semibold text-indigo-400 hover:text-indigo-300">Sign up</a>
   			 </p>
			
		</div>
`;

    el.querySelector('#login-form')?.addEventListener('submit', (event) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const email = formData.get('email') as string;
        if (form.checkValidity()) {
            console.log('Logging in with email:', email);
        } else {
            alert('Please enter a valid email.');
        }
    });
    return el;
};
