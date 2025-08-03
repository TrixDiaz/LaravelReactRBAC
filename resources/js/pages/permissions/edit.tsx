import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { SinglePermission } from '@/types/role_permission';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: 'Edit Permission',
		href: '/permissions',
	},
];

export default function EditPermission({ permission }: { permission: SinglePermission }) {
	const { data, setData, put, errors, processing } = useForm({
		name: permission.name,
	});

	function submit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		put(`/permissions/${permission.id}`);
	}

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Edit Permission" />
			<div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
				<Card>
					<CardHeader className="flex items-center justify-between">
						<CardTitle>Edit Permission</CardTitle>
						<CardAction>
							<Link href={'/permissions'}>
								<Button variant={'default'}>Go Back</Button>
							</Link>
						</CardAction>
					</CardHeader>
					<hr />
					<CardContent>
						<form onSubmit={submit}>
							<div className="mb-4">
								<Label htmlFor="name">Permission Name</Label>
								<Input
									id="name"
									type="text"
									value={data.name}
									onChange={(e) => setData('name', e.target.value)}
									aria-invalid={!!errors.name}
								/>
								<InputError message={errors.name} />
							</div>

							<div className="flex justify-end">
								<Button size={'lg'} type="submit" disabled={processing}>
									Update
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</AppLayout>
	);
} 