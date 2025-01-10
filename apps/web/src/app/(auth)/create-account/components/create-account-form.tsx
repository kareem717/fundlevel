"use client";

import { Button } from "@repo/ui/components/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { toast } from "sonner"
import { ComponentPropsWithoutRef, FC } from "react";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { cn } from "@repo/ui/lib/utils";
import { createAccount } from "@/actions/auth";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { zCreateAccountParams } from "@repo/sdk/zod";

export interface CreateAccountFormProps extends ComponentPropsWithoutRef<"form"> {
}

export const CreateAccountForm: FC<CreateAccountFormProps> = ({ className, ...props }) => {
	const router = useRouter();

	const { form, action: { isExecuting }, handleSubmitWithAction, resetFormAndAction } =
		useHookFormAction(createAccount, zodResolver(zCreateAccountParams), {
			actionProps: {
				onSuccess: () => {
					toast.success("Account created successfully!");
					form.reset();
					router.refresh();
				},
				onError: ({ error }) => {
					console.log(error)
					toast.error("Something went wrong", {
						description: error.serverError?.message || "An unknown error occurred",
					})
				},
			},
			formProps: {
				defaultValues: {
					firstName: "",
					lastName: "",
				},
			},
		});

	return (

		<Form {...form}>
			<form onSubmit={handleSubmitWithAction} className={cn("space-y-4", className)} {...props}>
				<FormField
					control={form.control}
					name="firstName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>First Name</FormLabel>
							<FormControl>
								<Input placeholder="Jimmy" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="lastName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Last Name</FormLabel>
							<FormControl>
								<Input placeholder="Smith" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="w-full flex justify-center items-center">
					{isExecuting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}  Create
				</Button>
			</form>
		</Form>
	);
};
