'use client';

  
import { Login } from '@shared/components/Login'; 

export default function Edit() {
	return (
		<div > 
				<Login
					redirectUrl="/home"
					onSuccess={() => (window.location.href = '/dashboard')}
				/> 
		</div>
	);
}
