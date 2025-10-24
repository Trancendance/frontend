export const LoginView = () => {
    const el = document.createElement('div');
    el.innerHTML = /*html*/ `
	<div class="w-full max-w-sm mx-auto h-full flex flex-col">
		<div class="w-1/2 mx-auto mb-4 bg-amber-300">
			<div class="w-full h-0 pb-full relative">
				.
			</div>
		</div>
		<div>
			<h1>Login</h1>
			<form id="login-form" class="flex flex-col gap-4">
				<label for="email">Email</label>
				<input type="email" id="email" name="email" required class="border p-2 rounded" />
				<button type="submit" class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Login</button>
			</form>
		</div>
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
