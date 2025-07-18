import { Badge } from "@fundlevel/ui/components/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@fundlevel/ui/components/card";
import { Separator } from "@fundlevel/ui/components/separator";
import { getSessionFn } from "@fundlevel/web/app/actions/auth";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import { createServerORPCClient } from "@fundlevel/web/lib/orpc/server";
import { formatBytes, formatDate } from "@fundlevel/web/lib/utils";
import { ORPCError } from "@orpc/client";
import { Calendar, Clock, FileText, FileType2, HardDrive } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { BankStatementDownload } from "./components/bank-statement-download";
import { TransactionTable } from "./components/transaction-table";

const getStatementFn = cache(async (id: string) => {
	const idNumber = Number(id);
	if (Number.isNaN(idNumber)) {
		throw notFound();
	}

	const orpc = await createServerORPCClient();
	try {
		const { statement } = await orpc.bankStatement.get.call({
			params: { id: idNumber },
		});
		return statement;
	} catch (e) {
		if (e instanceof ORPCError) {
			if (e.status === 404) {
				throw notFound();
			}
			throw new Error(e.message);
		}

		console.error(e);
		throw new Error("Failed to get bank statement", { cause: e });
	}
});

export const generateMetadata = async ({
	params,
}: {
	params: Promise<{ id: string }>;
}) => {
	const { id } = await params;
	const statement = await getStatementFn(id);

	return {
		title: statement.originalFileName,
	};
};

export default async function BankStatementPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const session = await getSessionFn();

	if (!session) {
		redirect(redirects.auth.signIn);
	}

	const statement = await getStatementFn(id);

	// Determine extraction status
	const hasExtractionJob = !!statement.extractionJobId;
	const extractionStatus = hasExtractionJob ? "Processed" : "Not processed";

	return (
		<div className="container mx-auto space-y-6 py-6">
			<Card className="border-border">
				<CardHeader className="pb-2">
					<div className="flex items-start justify-between">
						<div>
							<CardTitle className="font-bold text-2xl text-foreground">
								{statement.originalFileName}
							</CardTitle>
							<CardDescription className="mt-1 text-muted-foreground">
								Bank Statement #{statement.id}
							</CardDescription>
						</div>
						<BankStatementDownload bankStatementId={statement.id} />
					</div>
				</CardHeader>

				<CardContent className="pt-4">
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div className="space-y-4">
							<div>
								<h3 className="mb-2 font-medium text-muted-foreground text-sm">
									File Information
								</h3>
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<FileText className="h-4 w-4 text-muted-foreground" />
										<span className="text-foreground">
											{statement.originalFileName}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<FileType2 className="h-4 w-4 text-muted-foreground" />
										<span className="text-foreground">
											{statement.fileType.split("/")[1].toUpperCase() ||
												"Unknown type"}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<HardDrive className="h-4 w-4 text-muted-foreground" />
										<span className="text-foreground">
											{formatBytes(statement.fileSizeBytes)}
										</span>
									</div>
								</div>
							</div>
						</div>

						<div className="space-y-4">
							<div>
								<h3 className="mb-2 font-medium text-muted-foreground text-sm">
									Metadata
								</h3>
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<Calendar className="h-4 w-4 text-muted-foreground" />
										<span className="text-foreground">
											Uploaded on{" "}
											{formatDate(statement.createdAt, { includeTime: true })}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<Clock className="h-4 w-4 text-muted-foreground" />
										<span className="text-foreground">
											Last updated {formatDate(statement.updatedAt)}
										</span>
									</div>
									<div className="mt-1 flex items-center gap-2">
										<Badge variant={hasExtractionJob ? "default" : "secondary"}>
											Transactions: {extractionStatus}
										</Badge>
									</div>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
			<div className="space-y-4">
				<Separator className="my-2" />
				<TransactionTable bankStatementId={statement.id} />
			</div>
		</div>
	);
}
