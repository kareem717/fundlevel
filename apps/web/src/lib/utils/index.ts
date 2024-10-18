import { env } from "../../env";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Register service.
 * @description Stores instances in `global` to prevent memory leaks in development.
 * @arg {string} name Service name.
 * @arg {function} initFn Function returning the service instance.
 * @return {*} Service instance.
 */
export const registerService = <T>(name: string, initFn: () => T) => {
	if (env.NODE_ENV === "development") {
		if (!(name in global)) {
			// @ts-expect-error global is not typed
			global[name] = initFn();
		}
		// @ts-expect-error global is not typed
		return global[name] as ReturnType<typeof initFn>;
	}
	return initFn();
};

/**
 * Format time.
 * @description Returns a string representing the time
 * given date down to the minute. Automatically pluralizes the time unit.
 * @arg {Date} then Date to compare.
 * @return {string} Time since the given date.
 */
export const formatTime = (then: Date) => {
	const HOUR_IN_MINUTES = 60;
	const DAY_IN_MINUTES = 24 * HOUR_IN_MINUTES;
	const MONTH_IN_MINUTES = 30 * DAY_IN_MINUTES;
	const YEAR_IN_MINUTES = 12 * MONTH_IN_MINUTES;

	const now = new Date();
	const diff = now.getTime() - then.getTime();
	const diffInMinutes = Math.floor(diff / (1000 * 60));

	const pluralize = (value: number, unit: string) => {
		return `${value} ${unit}${value === 1 ? "" : "s"}`;
	};

	const units = [
		{ label: "year", value: YEAR_IN_MINUTES },
		{ label: "month", value: MONTH_IN_MINUTES },
		{ label: "day", value: DAY_IN_MINUTES },
		{ label: "hour", value: HOUR_IN_MINUTES },
		{ label: "minute", value: 1 },
	];

	for (const unit of units) {
		if (diffInMinutes >= unit.value) {
			const count = Math.floor(diffInMinutes / unit.value);
			return `${pluralize(count, unit.label)}`;
		}
	}

	return "less than a minute";
}

/**
 * Truncate text.
 * @description Truncates text to the given max length. If the text is longer than the max
 * length, it will be truncated to the max length and an ellipsis will be added.
 * @arg {string} text Text to truncate.
 * @arg {number} maxLength Maximum length of the text.
 * @return {string} Truncated text.
 */
export const truncateText = (text: string, maxLength: number) => {
	if (text.length > maxLength) {
		return text.substring(0, maxLength) + "...";
	}
	return text;
};


/**
 * Format percentage.
 * @description Formats a number as a percentage string with up to specified decimal places.
 * @arg {number} rawPercentage Number to format.
 * @arg {number} toFixed Maximum number of decimal places to round to.
 * @return {string} Formatted percentage.
 */
export const toFixedRound = (rawPercentage: number, toFixed: number) => rawPercentage % 1 !== 0 && rawPercentage.toFixed(toFixed) !== rawPercentage.toString()
	? rawPercentage.toFixed(toFixed)
	: rawPercentage.toString();