// NOTE - Time Module [Utilities]
export function formatRelativeTime(dateString: string | Date): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.round((now.getTime() - date.getTime()) / 1000);

    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    if (diffInSeconds < 60) {
        return rtf.format(-diffInSeconds, 'second');
    } else if (diffInSeconds < 3600) {
        return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
    } else if (diffInSeconds < 86400) {
        return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
    } else if (diffInSeconds < 2592000) { // ~30 days
        return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
    } else if (diffInSeconds < 31536000) { // ~12 months
        return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
    } else {
        return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
    }
}