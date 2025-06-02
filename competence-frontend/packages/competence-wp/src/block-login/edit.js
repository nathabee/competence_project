'use client';


import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { Login } from '@shared/components/Login';
import { AuthProvider } from '@shared/context/AuthContext';

export default function Edit() {

	/*

			<AuthProvider>
				<Login
					redirectUrl="/competence_home"
					onSuccess={() => (window.location.href = '/competence_dashboard')}
				/>
			</AuthProvider>
			*/

	return (
		<div {...useBlockProps()}>
				<Login
					redirectUrl="/competence_home"
					onSuccess={() => (window.location.href = '/competence_dashboard')}
				/>
		</div>
	);
}
